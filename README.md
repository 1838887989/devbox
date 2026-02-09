<div align="center">

# DevBox - 安了么

**跨平台开发环境管理工具**

一键检测、安装、卸载、切换开发环境，告别繁琐的环境配置。

[![License](https://img.shields.io/github/license/1838887989/devbox)](LICENSE)
[![Release](https://img.shields.io/github/v/release/1838887989/devbox)](https://github.com/1838887989/devbox/releases)
[![Stars](https://img.shields.io/github/stars/1838887989/devbox)](https://github.com/1838887989/devbox/stargazers)

**简体中文** | [English](#english)

</div>

---

## 功能特性

- **环境检测** — 自动检测本机已安装的编程语言和开发工具
- **一键安装/卸载** — 通过系统包管理器（winget / brew / apt）管理环境
- **版本管理** — 查看可用版本列表，安装指定版本
- **深色/浅色主题** — 支持深色、浅色、跟随系统三种模式
- **中英文切换** — 内置中文和英文界面
- **系统托盘** — 关闭窗口最小化到托盘，不打扰工作

## 支持的环境

| 编程语言 | 开发工具 |
|---------|---------|
| Rust | Git |
| Node.js | Docker |
| Python | npm |
| Java (OpenJDK) | pnpm |
| Go | |
| PHP | |

## 下载安装

前往 [Releases](https://github.com/1838887989/devbox/releases) 页面下载最新版本：

| 平台 | 下载 |
|------|------|
| Windows (安装包) | `DevBox_x.x.x_x64-setup.exe` |
| Windows (MSI) | `DevBox_x.x.x_x64.msi` |
| macOS (DMG) | `DevBox_x.x.x_aarch64.dmg` |
| macOS (Intel) | `DevBox_x.x.x_x64.dmg` |
| Linux (AppImage) | `DevBox_x.x.x_amd64.AppImage` |
| Linux (deb) | `DevBox_x.x.x_amd64.deb` |

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | Tauri 2 |
| 前端 | React 19 + TypeScript |
| 构建工具 | Vite 7 |
| 样式 | TailwindCSS 4 |
| UI 组件 | shadcn/ui |
| 后端 | Rust |
| 包管理器 | winget (Win) / brew (macOS) / apt (Linux) |

## 从源码构建

### 前置要求

- [Rust](https://rustup.rs/) (1.70+)
- [Node.js](https://nodejs.org/) (18+)
- [Tauri 2 CLI](https://v2.tauri.app/start/prerequisites/)

### 构建步骤

```bash
# 克隆仓库
git clone https://github.com/1838887989/devbox.git
cd devbox

# 安装前端依赖
npm install

# 开发模式
npx tauri dev

# 构建发布包
npx tauri build
```

## 项目结构

```
devbox/
├── src/                    # React 前端
│   ├── components/         # 通用组件
│   ├── contexts/           # 全局上下文 (主题/国际化/环境)
│   ├── hooks/              # 自定义 Hooks
│   ├── i18n/               # 国际化翻译
│   ├── pages/              # 页面组件
│   └── lib/                # 工具函数和类型
├── src-tauri/              # Rust 后端
│   ├── src/
│   │   ├── commands/       # Tauri IPC 命令
│   │   ├── models/         # 数据模型
│   │   └── services/       # 业务逻辑
│   └── tauri.conf.json     # Tauri 配置
└── package.json
```

## 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

<a id="english"></a>

<div align="center">

## DevBox

**Cross-platform Development Environment Manager**

Detect, install, uninstall, and switch dev environments with one click.

</div>

### Features

- **Environment Detection** — Auto-detect installed languages and tools
- **One-click Install/Uninstall** — Manage via system package managers (winget / brew / apt)
- **Version Management** — Browse available versions and install specific ones
- **Dark/Light Theme** — Dark, light, and system-follow modes
- **i18n** — Chinese and English UI
- **System Tray** — Minimize to tray on close

### Build from Source

```bash
git clone https://github.com/1838887989/devbox.git
cd devbox
npm install
npx tauri dev      # dev mode
npx tauri build    # production build
```

### License

[MIT License](LICENSE)
