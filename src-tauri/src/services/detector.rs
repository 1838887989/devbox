use std::process::Command;
use crate::models::{Category, EnvironmentInfo, Status};

/// 执行命令并获取输出
fn run_cmd(cmd: &str, args: &[&str]) -> Option<String> {
    Command::new(cmd)
        .args(args)
        .output()
        .ok()
        .and_then(|o| {
            // 优先读 stdout，为空则回退 stderr（java -version 等工具输出到 stderr）
            let stdout = String::from_utf8(o.stdout).ok().map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
            let stderr = String::from_utf8(o.stderr).ok().map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
            if o.status.success() {
                stdout.or(stderr)
            } else {
                stderr.or(stdout)
            }
        })
}

/// 获取可执行文件路径（Windows 用 where，其他用 which）
fn find_path(cmd: &str) -> Option<String> {
    let finder = if cfg!(windows) { "where" } else { "which" };
    run_cmd(finder, &[cmd])
        .map(|s| s.lines().next().unwrap_or("").to_string())
        .filter(|s| !s.is_empty())
}

/// 从版本输出中提取版本号
fn extract_version(output: &str) -> String {
    output
        .split_whitespace()
        .find(|s| {
            let s = s.trim_start_matches('v');
            s.chars().next().map_or(false, |c| c.is_ascii_digit())
                && s.contains('.')
        })
        .unwrap_or(output)
        .trim_start_matches('v')
        .to_string()
}

/// 检测单个环境
fn detect_one(
    name: &str,
    category: Category,
    icon: &str,
    cmd: &str,
    version_args: &[&str],
) -> EnvironmentInfo {
    let version_output = run_cmd(cmd, version_args);
    let path = find_path(cmd);

    let (status, version) = match &version_output {
        Some(output) => (Status::Installed, Some(extract_version(output))),
        None => (Status::NotInstalled, None),
    };

    EnvironmentInfo {
        name: name.to_string(),
        category,
        version,
        path,
        status,
        icon: icon.to_string(),
        detect_cmd: format!("{} {}", cmd, version_args.join(" ")),
    }
}

/// 检测所有已知环境
pub fn detect_all() -> Vec<EnvironmentInfo> {
    let mut results = Vec::new();

    // === 编程语言 ===
    results.push(detect_one(
        "Rust", Category::Language, "🦀", "rustc", &["--version"],
    ));
    results.push(detect_one(
        "Node.js", Category::Language, "🟢", "node", &["--version"],
    ));
    results.push(detect_one(
        "Python", Category::Language, "🐍", "python", &["--version"],
    ));
    results.push(detect_one(
        "Java", Category::Language, "☕", "java", &["-version"],
    ));
    results.push(detect_one(
        "Go", Category::Language, "🐹", "go", &["version"],
    ));
    results.push(detect_one(
        "PHP", Category::Language, "🐘", "php", &["--version"],
    ));

    // === 开发工具 ===
    results.push(detect_one(
        "Git", Category::Tool, "📦", "git", &["--version"],
    ));
    results.push(detect_one(
        "Docker", Category::Tool, "🐳", "docker", &["--version"],
    ));
    results.push(detect_one(
        "npm", Category::Tool, "📦", "npm", &["--version"],
    ));
    results.push(detect_one(
        "pnpm", Category::Tool, "📦", "pnpm", &["--version"],
    ));

    results
}
