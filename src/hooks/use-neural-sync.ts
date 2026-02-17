"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

/**
 * TITAN NEURAL SYNC HOOK v31.0
 * Purpose: Centralized data fetching for D3 & ECharts
 */
export function useNeuralSync(id_upload?: string) {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const establishLink = useCallback(async () => {
    setLoading(true);
    try {
      const url = id_upload
        ? `/api/shared/neural-sync?id_upload=${id_upload}`
        : `/api/shared/neural-sync`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("LINK_CORRUPTED");

      const data = await response.json();
      setIntel(data);
    } catch (error) {
      toast.error("NEURAL_SYNC_FAILED // CHECK_UPLINK");
    } finally {
      setLoading(false);
    }
  }, [id_upload]);

  useEffect(() => {
    establishLink();
  }, [establishLink]);

  return { intel, loading, refresh: establishLink };
}
