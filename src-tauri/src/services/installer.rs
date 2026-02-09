use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter};

use crate::models::{AvailableVersions, InstallProgress, InstallStage, PackageConfig};

/// 全局安装状态（防止并发安装）
pub struct InstallerState {
    pub current_task: Mutex<Option<String>>,
}

/// 获取包注册表
pub fn get_package_registry() -> Vec<PackageConfig> {
    vec![
        PackageConfig { name: "Rust", winget_id: "Rustlang.Rustup", uninstall_id: "Rustlang.Rustup" },
        PackageConfig { name: "Node.js", winget_id: "OpenJS.NodeJS.LTS", uninstall_id: "OpenJS.NodeJS.LTS" },
        PackageConfig { name: "Python", winget_id: "Python.Python.3.12", uninstall_id: "Python.Python.3.12" },
        PackageConfig { name: "Java", winget_id: "Microsoft.OpenJDK.21", uninstall_id: "Microsoft.OpenJDK.21" },
        PackageConfig { name: "Go", winget_id: "GoLang.Go", uninstall_id: "GoLang.Go" },
        PackageConfig { name: "PHP", winget_id: "PHP.PHP", uninstall_id: "PHP.PHP" },
        PackageConfig { name: "Git", winget_id: "Git.Git", uninstall_id: "Git.Git" },
        PackageConfig { name: "Docker", winget_id: "Docker.DockerDesktop", uninstall_id: "Docker.DockerDesktop" },
        PackageConfig { name: "pnpm", winget_id: "pnpm.pnpm", uninstall_id: "pnpm.pnpm" },
    ]
}

/// 发送进度事件给前端
fn emit_progress(app: &AppHandle, name: &str, stage: InstallStage, message: &str, percent: i32) {
    let _ = app.emit("install-progress", InstallProgress {
        name: name.to_string(),
        stage,
        message: message.to_string(),
        percent,
    });
}

/// 从 winget 输出行解析安装阶段
fn parse_winget_line(line: &str) -> (InstallStage, i32) {
    let lower = line.to_lowercase();
    if lower.contains("downloading") {
        (InstallStage::Downloading, -1)
    } else if lower.contains("successfully installed") || lower.contains("成功") {
        (InstallStage::Completed, 100)
    } else if lower.contains("starting package install") || lower.contains("安装程序") {
        (InstallStage::Installing, -1)
    } else if lower.contains("found") || lower.contains("已找到") {
        (InstallStage::Preparing, 10)
    } else {
        (InstallStage::Installing, -1)
    }
}

/// 执行安装
pub fn install_package(app: &AppHandle, name: &str, version: Option<&str>, state: &InstallerState) -> Result<(), String> {
    // 检查是否有其他任务在执行
    {
        let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
        if let Some(ref task) = *current {
            return Err(format!("正在执行任务: {}，请等待完成", task));
        }
        *current = Some(name.to_string());
    }

    // 查找包配置
    let registry = get_package_registry();
    let config = registry.iter().find(|p| p.name == name);
    let config = match config {
        Some(c) => c.clone(),
        None => {
            let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
            *current = None;
            return Err(format!("未找到 {} 的安装配置", name));
        }
    };

    // 发送准备阶段
    emit_progress(app, name, InstallStage::Preparing, "正在检查 winget...", 0);

    // 构建 winget 命令
    let mut cmd = Command::new("winget");
    let mut args = vec![
        "install".to_string(),
        config.winget_id.to_string(),
        "--accept-source-agreements".to_string(),
        "--accept-package-agreements".to_string(),
        "--disable-interactivity".to_string(),
    ];
    if let Some(ver) = version {
        args.push("--version".to_string());
        args.push(ver.to_string());
    }
    cmd.args(&args);
    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());

    // 启动进程
    let child = cmd.spawn();
    let mut child = match child {
        Ok(c) => c,
        Err(e) => {
            let msg = format!("启动 winget 失败: {}", e);
            emit_progress(app, name, InstallStage::Failed, &msg, -1);
            let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
            *current = None;
            return Err(msg);
        }
    };

    emit_progress(app, name, InstallStage::Downloading, "正在下载...", 10);

    // 读取 stdout 输出
    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines().map_while(Result::ok) {
            let trimmed = line.trim().to_string();
            if trimmed.is_empty() {
                continue;
            }
            let (stage, percent) = parse_winget_line(&trimmed);
            emit_progress(app, name, stage, &trimmed, percent);
        }
    }

    // 等待进程结束
    let status = child.wait();
    let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
    *current = None;

    match status {
        Ok(s) if s.success() => {
            emit_progress(app, name, InstallStage::Completed, &format!("{} 安装完成", name), 100);
            Ok(())
        }
        Ok(s) => {
            let msg = format!("{} 安装失败，退出码: {}", name, s.code().unwrap_or(-1));
            emit_progress(app, name, InstallStage::Failed, &msg, -1);
            Err(msg)
        }
        Err(e) => {
            let msg = format!("等待进程失败: {}", e);
            emit_progress(app, name, InstallStage::Failed, &msg, -1);
            Err(msg)
        }
    }
}

/// 执行卸载
pub fn uninstall_package(app: &AppHandle, name: &str, state: &InstallerState) -> Result<(), String> {
    // 检查是否有其他任务在执行
    {
        let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
        if let Some(ref task) = *current {
            return Err(format!("正在执行任务: {}，请等待完成", task));
        }
        *current = Some(name.to_string());
    }

    // 查找包配置
    let registry = get_package_registry();
    let config = registry.iter().find(|p| p.name == name);
    let config = match config {
        Some(c) => c.clone(),
        None => {
            let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
            *current = None;
            return Err(format!("未找到 {} 的卸载配置", name));
        }
    };

    emit_progress(app, name, InstallStage::Preparing, "正在准备卸载...", 0);

    // 构建 winget 卸载命令
    let mut cmd = Command::new("winget");
    cmd.args(["uninstall", config.uninstall_id]);
    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());

    let child = cmd.spawn();
    let mut child = match child {
        Ok(c) => c,
        Err(e) => {
            let msg = format!("启动 winget 失败: {}", e);
            emit_progress(app, name, InstallStage::Failed, &msg, -1);
            let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
            *current = None;
            return Err(msg);
        }
    };

    emit_progress(app, name, InstallStage::Installing, "正在卸载...", 30);

    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines().map_while(Result::ok) {
            let trimmed = line.trim().to_string();
            if !trimmed.is_empty() {
                emit_progress(app, name, InstallStage::Installing, &trimmed, -1);
            }
        }
    }

    let status = child.wait();
    let mut current = state.current_task.lock().map_err(|e| e.to_string())?;
    *current = None;

    match status {
        Ok(s) if s.success() => {
            emit_progress(app, name, InstallStage::Completed, &format!("{} 卸载完成", name), 100);
            Ok(())
        }
        Ok(s) => {
            let msg = format!("{} 卸载失败，退出码: {}", name, s.code().unwrap_or(-1));
            emit_progress(app, name, InstallStage::Failed, &msg, -1);
            Err(msg)
        }
        Err(e) => {
            let msg = format!("等待进程失败: {}", e);
            emit_progress(app, name, InstallStage::Failed, &msg, -1);
            Err(msg)
        }
    }
}

/// 解析 winget show --versions 的输出，提取版本号列表
fn parse_version_list(output: &str) -> Vec<String> {
    let mut versions = Vec::new();
    let mut found_separator = false;

    for line in output.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        if trimmed.starts_with("---") {
            found_separator = true;
            continue;
        }
        if found_separator && trimmed.chars().next().map_or(false, |c| c.is_ascii_digit()) {
            versions.push(trimmed.to_string());
        }
    }
    versions
}

/// 查询指定包的所有可用版本
pub fn fetch_versions(name: &str) -> Result<AvailableVersions, String> {
    let registry = get_package_registry();
    let config = registry.iter().find(|p| p.name == name)
        .ok_or_else(|| format!("未找到 {} 的包配置", name))?;

    let output = Command::new("winget")
        .args(["show", "--versions", config.winget_id, "--accept-source-agreements"])
        .output()
        .map_err(|e| format!("执行 winget 失败: {}", e))?;

    let stdout = String::from_utf8(output.stdout)
        .map_err(|e| format!("解析输出失败: {}", e))?;

    let versions = parse_version_list(&stdout);

    Ok(AvailableVersions {
        name: name.to_string(),
        versions,
    })
}
