use tauri::{AppHandle, Manager, State};
use crate::services::installer::{self, InstallerState};

/// 安装指定环境
#[tauri::command]
pub async fn install_package(
    app: AppHandle,
    state: State<'_, InstallerState>,
    name: String,
    version: Option<String>,
) -> Result<(), String> {
    // 先检查是否有任务在执行
    {
        let current = state.current_task.lock().map_err(|e| e.to_string())?;
        if let Some(ref task) = *current {
            return Err(format!("正在执行: {}，请等待完成", task));
        }
    }

    // 在新线程中执行安装
    std::thread::spawn(move || {
        let st = app.state::<InstallerState>();
        let ver = version.as_deref();
        let _ = installer::install_package(&app, &name, ver, &st);
    });

    Ok(())
}

/// 卸载指定环境
#[tauri::command]
pub async fn uninstall_package(
    app: AppHandle,
    state: State<'_, InstallerState>,
    name: String,
) -> Result<(), String> {
    {
        let current = state.current_task.lock().map_err(|e| e.to_string())?;
        if let Some(ref task) = *current {
            return Err(format!("正在执行: {}，请等待完成", task));
        }
    }

    std::thread::spawn(move || {
        let st = app.state::<InstallerState>();
        let _ = installer::uninstall_package(&app, &name, &st);
    });

    Ok(())
}
