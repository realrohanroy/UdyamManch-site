/**
 * Groups body blocks into chapters for the Dossier and Chapters layouts.
 * A `section` with a heading starts a chapter. Blocks before the first heading
 * form an unnamed opening, and every block after a heading belongs to it.
 * Pure function, so both layouts and the chapter list agree on the numbering.
 */
import type { JourneyBlock } from './types';

export interface Chapter {
  id: string; // anchor id, stable per block key
  title?: string;
  blocks: JourneyBlock[];
}

export function chaptersOf(blocks: JourneyBlock[]): Chapter[] {
  const out: Chapter[] = [];
  for (const b of blocks) {
    if (b._type === 'section' && b.heading) {
      out.push({ id: `ch-${b._key}`, title: b.heading, blocks: [b] });
    } else if (out.length === 0) {
      out.push({ id: `ch-${b._key}`, blocks: [b] });
    } else {
      out[out.length - 1].blocks.push(b);
    }
  }
  return out;
}

/** Chapters that have a title, for the "In this story" list. */
export const titled = (chapters: Chapter[]) => chapters.filter((c) => c.title);
