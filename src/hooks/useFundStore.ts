"use client";

import { useState, useCallback, useEffect } from "react";
import { FundConfig, Feeder, GPEntity } from "@/data/types";
import { defaultFundConfig } from "@/data/defaults";

const STORAGE_KEY = "fund-formation-os-config";

function loadFromStorage(): FundConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FundConfig;
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(config: FundConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useFundStore(initialConfig?: FundConfig) {
  const [config, setConfigState] = useState<FundConfig>(
    initialConfig ?? defaultFundConfig
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!initialConfig) {
      const stored = loadFromStorage();
      if (stored) setConfigState(stored);
    }
    setLoaded(true);
  }, [initialConfig]);

  const setConfig = useCallback(
    (updater: Partial<FundConfig> | ((prev: FundConfig) => Partial<FundConfig>)) => {
      setConfigState((prev) => {
        const patch = typeof updater === "function" ? updater(prev) : updater;
        const next = { ...prev, ...patch };
        if (!initialConfig) saveToStorage(next);
        return next;
      });
    },
    [initialConfig]
  );

  const addFeeder = useCallback(() => {
    setConfig((prev) => ({
      feeders: [
        ...prev.feeders,
        {
          id: `feeder-${Date.now()}`,
          jurisdiction: "Cayman" as const,
          investorFocus: "Non-US" as const,
          blockerEntity: false,
        },
      ],
    }));
  }, [setConfig]);

  const removeFeeder = useCallback(
    (id: string) => {
      setConfig((prev) => ({
        feeders: prev.feeders.filter((f: Feeder) => f.id !== id),
      }));
    },
    [setConfig]
  );

  const updateFeeder = useCallback(
    (id: string, patch: Partial<Feeder>) => {
      setConfig((prev) => ({
        feeders: prev.feeders.map((f: Feeder) =>
          f.id === id ? { ...f, ...patch } : f
        ),
      }));
    },
    [setConfig]
  );

  const addGP = useCallback(() => {
    setConfig((prev) => ({
      gps: [
        ...prev.gps,
        {
          id: `gp-${Date.now()}`,
          entityType: "LLC" as const,
          gpCommitPercent: 1,
          votingNotes: "",
        },
      ],
    }));
  }, [setConfig]);

  const removeGP = useCallback(
    (id: string) => {
      setConfig((prev) => ({
        gps: prev.gps.filter((g: GPEntity) => g.id !== id),
      }));
    },
    [setConfig]
  );

  const updateGP = useCallback(
    (id: string, patch: Partial<GPEntity>) => {
      setConfig((prev) => ({
        gps: prev.gps.map((g: GPEntity) =>
          g.id === id ? { ...g, ...patch } : g
        ),
      }));
    },
    [setConfig]
  );

  const reset = useCallback(
    (to?: FundConfig) => {
      const target = to ?? defaultFundConfig;
      setConfigState(target);
      if (!initialConfig) saveToStorage(target);
    },
    [initialConfig]
  );

  return {
    config,
    loaded,
    setConfig,
    addFeeder,
    removeFeeder,
    updateFeeder,
    addGP,
    removeGP,
    updateGP,
    reset,
  };
}
