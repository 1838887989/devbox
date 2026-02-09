import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Cpu, HardDrive, RefreshCw } from "lucide-react";
import { useEnvironments } from "@/contexts/EnvironmentContext";
import { useT } from "@/contexts/I18nContext";

export default function Dashboard() {
  const { environments, loading, refresh } = useEnvironments();
  const t = useT();

  const installed = environments.filter((e) => e.status === "installed").length;
  const total = environments.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("dashboard.title")}</h2>
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {t("common.refresh")}
        </Button>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Monitor className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm text-zinc-400">{t("dashboard.installed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {loading ? t("dashboard.detecting") : `${installed} / ${total}`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Cpu className="h-4 w-4 text-green-500" />
            <CardTitle className="text-sm text-zinc-400">{t("dashboard.languages")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {loading
                ? t("dashboard.detecting")
                : environments.filter(
                    (e) => e.category === "language" && e.status === "installed"
                  ).length + ` ${t("dashboard.items")}`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <HardDrive className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-sm text-zinc-400">{t("dashboard.tools")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {loading
                ? t("dashboard.detecting")
                : environments.filter(
                    (e) => e.category === "tool" && e.status === "installed"
                  ).length + ` ${t("dashboard.items")}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 环境概览 */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">{t("dashboard.overview")}</h3>
        <div className="grid grid-cols-4 gap-3">
          {environments.map((env) => (
            <Card key={env.name} className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <span>{env.icon}</span>
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-white">{env.name}</span>
                    {env.version && (
                      <p className="text-xs text-zinc-500">{env.version}</p>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    env.status === "installed"
                      ? "border-green-800 text-green-400"
                      : "text-zinc-500"
                  }
                >
                  {env.status === "installed" ? t("common.installed") : t("common.notInstalled")}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
