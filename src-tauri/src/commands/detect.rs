use crate::models::EnvironmentInfo;
use crate::services::detector;

/// 检测所有已安装的开发环境
#[tauri::command]
pub async fn detect_all() -> Result<Vec<EnvironmentInfo>, String> {
    Ok(detector::detect_all())
}
