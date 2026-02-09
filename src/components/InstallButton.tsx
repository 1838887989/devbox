import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Loader2 } from "lucide-react";
import type { EnvironmentInfo, InstallProgress } from "@/lib/types";
import { useT } from "@/contexts/I18nContext";
import type { TranslationKey } from "@/i18n";

interface InstallButtonProps {
  env: EnvironmentInfo;
  progress: InstallProgress | null;
  busy: boolean;
  currentTask: string | null;
  onInstall: (name: string) => void;
  onUninstall: (name: string) => void;
}

const stageKeys: Record<string, TranslationKey> = {
  preparing: "stage.preparing",
  downloading: "stage.downloading",
  installing: "stage.installing",
  configuring: "stage.configuring",
  completed: "stage.completed",
  failed: "stage.failed",
};

export default function InstallButton({
  env,
  progress,
  busy,
  currentTask,
  onInstall,
  onUninstall,
}: InstallButtonProps) {
  const isThisTask = currentTask === env.name;
  const isOtherBusy = busy && !isThisTask;
  const t = useT();

  // 正在操作中 — 显示进度
  if (isThisTask && progress) {
    const label = stageKeys[progress.stage] ? t(stageKeys[progress.stage]) : t("stage.processing");
    const isFailed = progress.stage === "failed";
    const isDone = progress.stage === "completed";

    return (
      <div className="flex items-center gap-2">
        {!isDone && !isFailed && (
          <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
        )}
        <Badge
          variant="outline"
          className={
            isFailed
              ? "border-red-800 text-red-400"
              : isDone
                ? "border-green-800 text-green-400"
                : "border-blue-800 text-blue-400"
          }
        >
          {label}
        </Badge>
      </div>
    );
  }

  // 已安装 — 显示卸载按钮
  if (env.status === "installed") {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="gap-1 text-zinc-500 hover:text-red-400"
        onClick={() => onUninstall(env.name)}
        disabled={isOtherBusy}
      >
        <Trash2 className="h-3 w-3" />
        {t("common.uninstall")}
      </Button>
    );
  }

  // 未安装 — 显示安装按钮
  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1"
      onClick={() => onInstall(env.name)}
      disabled={isOtherBusy}
    >
      <Download className="h-3 w-3" />
      {t("common.install")}
    </Button>
  );
}
