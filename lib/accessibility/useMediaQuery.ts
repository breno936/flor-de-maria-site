"use client";

import { useSyncExternalStore } from "react";

function subscribeToQuery(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeToQuery(query),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useIsDesktopFinePointer(): boolean {
  return useMediaQuery("(min-width: 1024px) and (pointer: fine)");
}

type NavigatorConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    addEventListener?: (type: string, cb: () => void) => void;
    removeEventListener?: (type: string, cb: () => void) => void;
  };
};

function subscribeToSaveData(callback: () => void) {
  const connection = (navigator as NavigatorConnection).connection;
  if (!connection?.addEventListener) return () => {};
  connection.addEventListener("change", callback);
  return () => connection.removeEventListener?.("change", callback);
}

export function useSaveData(): boolean {
  return useSyncExternalStore(
    subscribeToSaveData,
    () => Boolean((navigator as NavigatorConnection).connection?.saveData),
    () => false
  );
}
