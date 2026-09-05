import type { MediaClipId } from "@/data/media-manifest";

/**
 * Clips whose real files have been dropped into /public/media/<id>/.
 * Empty today — the studio shoot with Patrícia Marchi had not happened yet
 * as of the partnership deck. Add an id here the moment its files exist;
 * ManagedVideo will start rendering it automatically, no other change needed.
 */
export const AVAILABLE_CLIPS: ReadonlySet<MediaClipId> = new Set([]);
