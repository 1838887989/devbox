import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { EnvironmentInfo } from "@/lib/types";

export function useEnvironments() {
  const [environments, setEnvironments] = useState<EnvironmentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await invoke<EnvironmentInfo[]>("detect_all");
      setEnvironments(result);
    } catch (err) {
      console.error("检测环境失败:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { environments, loading, refresh };
}
