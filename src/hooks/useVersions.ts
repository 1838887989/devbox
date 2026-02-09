import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { AvailableVersions } from "@/lib/types";

export function useVersions() {
  const [cache, setCache] = useState<Record<string, AvailableVersions>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const fetchVersions = useCallback(async (name: string) => {
    if (cache[name]) return cache[name];

    setLoading(name);
    try {
      const result = await invoke<AvailableVersions>("fetch_versions", { name });
      setCache((prev) => ({ ...prev, [name]: result }));
      return result;
    } catch (err) {
      console.error("查询版本失败:", err);
      return null;
    } finally {
      setLoading(null);
    }
  }, [cache]);

  const clearCache = useCallback((name?: string) => {
    if (name) {
      setCache((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    } else {
      setCache({});
    }
  }, []);

  return { cache, loading, fetchVersions, clearCache };
}
