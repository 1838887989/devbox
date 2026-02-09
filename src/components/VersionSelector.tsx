import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { EnvironmentInfo, AvailableVersions } from "@/lib/types";
import { useT } from "@/contexts/I18nContext";

interface VersionSelectorProps {
  env: EnvironmentInfo;
  versions: AvailableVersions | undefined;
  loading: boolean;
  busy: boolean;
  onFetchVersions: (name: string) => void;
  onInstallVersion: (name: string, version: string) => void;
}

export default function VersionSelector({
  env,
  versions,
  loading,
  busy,
  onFetchVersions,
  onInstallVersion,
}: VersionSelectorProps) {
  const [open, setOpen] = useState(false);
  const t = useT();

  // 非正常状态不显示版本选择器
  if (env.status !== "installed" && env.status !== "not_installed") {
    return <span className="text-sm text-zinc-400">{env.version}</span>;
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !versions) {
      onFetchVersions(env.name);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm text-zinc-400 hover:text-white"
          disabled={busy}
        >
          {env.version ?? t("version.select")}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-60 overflow-y-auto" align="end">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2 text-sm">{t("version.loading")}</span>
          </div>
        ) : versions && versions.versions.length > 0 ? (
          versions.versions.map((ver) => (
            <DropdownMenuItem
              key={ver}
              onClick={() => onInstallVersion(env.name, ver)}
              className={ver === env.version ? "font-bold text-green-400" : ""}
            >
              {ver}
              {ver === env.version && ` (${t("version.current")})`}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-sm text-zinc-500">{t("version.noVersions")}</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
