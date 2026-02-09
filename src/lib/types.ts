// 环境类别
export type Category = "language" | "tool";

// 安装状态
export type Status = "installed" | "not_installed" | "detecting" | "installing" | "uninstalling";

// 安装阶段
export type InstallStage = "preparing" | "downloading" | "installing" | "configuring" | "completed" | "failed";

// 安装进度事件（与 Rust 端 InstallProgress 对应）
export interface InstallProgress {
  name: string;
  stage: InstallStage;
  message: string;
  percent: number;
}

// 环境信息（与 Rust 端 EnvironmentInfo 对应）
export interface EnvironmentInfo {
  name: string;
  category: Category;
  version: string | null;
  path: string | null;
  status: Status;
  icon: string;
  detect_cmd: string;
}

// 可用版本列表（与 Rust 端 AvailableVersions 对应）
export interface AvailableVersions {
  name: string;
  versions: string[];
}
