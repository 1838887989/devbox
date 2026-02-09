import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Wrench,
  Settings,
  Box,
} from "lucide-react";
import { useT } from "@/contexts/I18nContext";
import type { TranslationKey } from "@/i18n";

const navItems = [
  { to: "/", icon: LayoutDashboard, labelKey: "nav.dashboard" as TranslationKey },
  { to: "/languages", icon: Code2, labelKey: "nav.languages" as TranslationKey },
  { to: "/tools", icon: Wrench, labelKey: "nav.tools" as TranslationKey },
  { to: "/settings", icon: Settings, labelKey: "nav.settings" as TranslationKey },
];

export default function Sidebar() {
  const t = useT();
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Box className="h-7 w-7 text-blue-500" />
        <div>
          <h1 className="text-base font-bold text-zinc-900 dark:text-white">DevBox</h1>
          <p className="text-xs text-zinc-500">安了么</p>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      {/* 底部版本信息 */}
      <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <p className="text-xs text-zinc-600">v0.1.0</p>
      </div>
    </aside>
  );
}
