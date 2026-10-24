import type { MediaClipId } from "@/data/media-manifest";

/**
 * Clips whose real files have been dropped into /public/media/<id>/.
 * Empty today — the studio shoot happened, but only its photographs were
 * delivered (see data/campaign-photos.ts), not the footage. Add an id here
 * the moment its files exist;
 * ManagedVideo will start rendering it automatically, no other change needed.
 */
export const AVAILABLE_CLIPS: ReadonlySet<MediaClipId> = new Set([]);
