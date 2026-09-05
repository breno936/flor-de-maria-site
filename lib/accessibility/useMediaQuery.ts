"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useIsDesktopFinePointer(): boolean {
  return useMediaQuery("(min-width: 1024px) and (pointer: fine)");
}

export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; addEventListener?: (e: string, cb: () => void) => void };
    }).connection;
    if (!connection) return;
    setSaveData(Boolean(connection.saveData));
  }, []);
  return saveData;
}
