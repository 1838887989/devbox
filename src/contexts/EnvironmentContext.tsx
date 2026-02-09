import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { EnvironmentInfo } from "@/lib/types";

interface EnvironmentContextValue {
  environments: EnvironmentInfo[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const EnvironmentContext = createContext<EnvironmentContextValue>({
  environments: [],
  loading: true,
  refresh: async () => {},
});

export function useEnvironments() {
  return useContext(EnvironmentContext);
}

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
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

  // 仅在应用启动时检测一次
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <EnvironmentContext.Provider value={{ environments, loading, refresh }}>
      {children}
    </EnvironmentContext.Provider>
  );
}
