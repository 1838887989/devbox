use crate::models::AvailableVersions;
use crate::services::installer;

/// 查询指定环境的可用版本列表（非 async，Tauri 自动在独立线程执行）
#[tauri::command]
pub fn fetch_versions(name: String) -> Result<AvailableVersions, String> {
    installer::fetch_versions(&name)
}
