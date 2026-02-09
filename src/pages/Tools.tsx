import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEnvironments } from "@/contexts/EnvironmentContext";
import { useInstaller } from "@/hooks/useInstaller";
import { useVersions } from "@/hooks/useVersions";
import InstallButton from "@/components/InstallButton";
import VersionSelector from "@/components/VersionSelector";
import { useT } from "@/contexts/I18nContext";

export default function Tools() {
  const { environments, loading, refresh } = useEnvironments();
  const { install, uninstall, progress, busy, currentTask } = useInstaller(refresh);
  const { cache, loading: versionLoading, fetchVersions } = useVersions();
  const t = useT();
  const tools = environments.filter((e) => e.category === "tool");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("nav.tools")}</h2>
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

      <div className="space-y-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{tool.name}</p>
                  <p className="text-xs text-zinc-500">
                    {tool.status === "installed"
                      ? tool.path ?? tool.detect_cmd
                      : tool.detect_cmd}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <VersionSelector
                  env={tool}
                  versions={cache[tool.name]}
                  loading={versionLoading === tool.name}
                  busy={busy}
                  onFetchVersions={fetchVersions}
                  onInstallVersion={install}
                />
                <Badge
                  variant="outline"
                  className={
                    tool.status === "installed"
                      ? "border-green-800 text-green-400"
                      : "text-zinc-500"
                  }
                >
                  {loading
                    ? t("common.detecting")
                    : tool.status === "installed"
                      ? t("common.installed")
                      : t("common.notInstalled")}
                </Badge>
                <InstallButton
                  env={tool}
                  progress={currentTask === tool.name ? progress : null}
                  busy={busy}
                  currentTask={currentTask}
                  onInstall={install}
                  onUninstall={uninstall}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
