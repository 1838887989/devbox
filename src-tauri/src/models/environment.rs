use serde::{Deserialize, Serialize};

/// 环境类别
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Category {
    #[serde(rename = "language")]
    Language,
    #[serde(rename = "tool")]
    Tool,
}

/// 环境安装状态
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Status {
    #[serde(rename = "installed")]
    Installed,
    #[serde(rename = "not_installed")]
    NotInstalled,
    #[serde(rename = "detecting")]
    Detecting,
    #[serde(rename = "installing")]
    Installing,
    #[serde(rename = "uninstalling")]
    Uninstalling,
}

/// 环境信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentInfo {
    /// 名称，如 "Rust", "Node.js"
    pub name: String,
    /// 类别：language 或 tool
    pub category: Category,
    /// 当前版本号
    pub version: Option<String>,
    /// 安装路径
    pub path: Option<String>,
    /// 安装状态
    pub status: Status,
    /// 图标标识
    pub icon: String,
    /// 用于检测的命令
    pub detect_cmd: String,
}
