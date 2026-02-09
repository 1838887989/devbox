import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n } from "@/contexts/I18nContext";
import { useT } from "@/contexts/I18nContext";
import { Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useI18n();
  const t = useT();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("settings.title")}</h2>

      {/* 外观设置 */}
      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm text-zinc-400">
            {t("settings.appearance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 主题切换 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-900 dark:text-white">
              {t("settings.theme")}
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={theme === "light" ? "default" : "outline"}
                className="gap-1"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-3 w-3" />
                {t("settings.theme.light")}
              </Button>
              <Button
                size="sm"
                variant={theme === "dark" ? "default" : "outline"}
                className="gap-1"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-3 w-3" />
                {t("settings.theme.dark")}
              </Button>
              <Button
                size="sm"
                variant={theme === "system" ? "default" : "outline"}
                className="gap-1"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-3 w-3" />
                {t("settings.theme.system")}
              </Button>
            </div>
          </div>

          {/* 语言切换 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-900 dark:text-white">
              {t("settings.language")}
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={locale === "zh" ? "default" : "outline"}
                onClick={() => setLocale("zh")}
              >
                中文
              </Button>
              <Button
                size="sm"
                variant={locale === "en" ? "default" : "outline"}
                onClick={() => setLocale("en")}
              >
                English
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关于 */}
      <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm text-zinc-400">
            {t("settings.about")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-900 dark:text-white">
              {t("settings.version")}
            </span>
            <span className="text-sm text-zinc-500">0.1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-900 dark:text-white">
              {t("settings.project")}
            </span>
            <span className="text-sm text-zinc-500">DevBox</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
