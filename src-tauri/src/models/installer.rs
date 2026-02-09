use serde::{Deserialize, Serialize};

/// 安装阶段
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InstallStage {
    #[serde(rename = "preparing")]
    Preparing,
    #[serde(rename = "downloading")]
    Downloading,
    #[serde(rename = "installing")]
    Installing,
    #[serde(rename = "configuring")]
    Configuring,
    #[serde(rename = "completed")]
    Completed,
    #[serde(rename = "failed")]
    Failed,
}

/// 安装进度事件（通过 Tauri Event 推送给前端）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallProgress {
    /// 环境名称
    pub name: String,
    /// 当前阶段
    pub stage: InstallStage,
    /// 进度消息
    pub message: String,
    /// 进度百分比（0-100），-1 表示不确定
    pub percent: i32,
}

/// winget 包配置
#[derive(Debug, Clone)]
pub struct PackageConfig {
    /// 环境名称
    pub name: &'static str,
    /// winget 包 ID
    pub winget_id: &'static str,
    /// 卸载用的 winget 包 ID
    pub uninstall_id: &'static str,
}

/// 可用版本列表（查询结果）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AvailableVersions {
    /// 环境名称
    pub name: String,
    /// 可用版本列表（从新到旧排序）
    pub versions: Vec<String>,
}
