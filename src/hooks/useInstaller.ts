import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { InstallProgress } from "@/lib/types";

export function useInstaller(onComplete?: () => void) {
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [progress, setProgress] = useState<InstallProgress | null>(null);
  const [busy, setBusy] = useState(false);

  // 监听安装进度事件
  useEffect(() => {
    const unlisten = listen<InstallProgress>("install-progress", (event) => {
      const p = event.payload;
      setProgress(p);
      setCurrentTask(p.name);

      if (p.stage === "completed" || p.stage === "failed") {
        setTimeout(() => {
          setCurrentTask(null);
          setProgress(null);
          setBusy(false);
          if (p.stage === "completed") {
            onComplete?.();
          }
        }, 1500);
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [onComplete]);

  const install = useCallback(async (name: string, version?: string) => {
    setBusy(true);
    setCurrentTask(name);
    try {
      await invoke("install_package", { name, version });
    } catch (err) {
      console.error("安装失败:", err);
      setBusy(false);
      setCurrentTask(null);
    }
  }, []);

  const uninstall = useCallback(async (name: string) => {
    setBusy(true);
    setCurrentTask(name);
    try {
      await invoke("uninstall_package", { name });
    } catch (err) {
      console.error("卸载失败:", err);
      setBusy(false);
      setCurrentTask(null);
    }
  }, []);

  return { currentTask, progress, busy, install, uninstall };
}
