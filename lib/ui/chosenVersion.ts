"use client";

import { useSyncExternalStore } from "react";
import type { CreationId } from "@/data/products";

export type ChosenVersion = { creation: CreationId; option: string };

/**
 * The last version the visitor picked on a card ("Lê Bouquet, 50 rosas"),
 * shared with the WhatsApp buttons that don't belong to one card — the
 * phone's bottom bar, the header and the closing — so whichever one they
 * tap, the message names what they chose. Lives for the page view only.
 */
let chosen: ChosenVersion | null = null;
const listeners = new Set<() => void>();

export function setChosenVersion(next: ChosenVersion) {
  chosen = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useChosenVersion() {
  return useSyncExternalStore(
    subscribe,
    () => chosen,
    () => null
  );
}
