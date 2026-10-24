"use client";

import { useSyncExternalStore } from "react";
import type { CreationId } from "@/data/products";

/**
 * Which creation the visitor came from when they clicked a product scene's
 * CTA — so the atendimento form already knows the piece ("acesso ao
 * atendimento já identificando a peça escolhida"). A tiny module-level
 * store rather than a URL query: changing `?criacao=` on a plain anchor
 * would reload the page, and the CTAs are plain `#atendimento` anchors.
 */
let selected: CreationId | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function selectCreation(id: CreationId) {
  selected = id;
  emit();
}

export function clearCreation() {
  selected = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSelectedCreation(): CreationId | null {
  return useSyncExternalStore(
    subscribe,
    () => selected,
    () => null
  );
}
