/**
 * Local founder journeys. Used when Sanity is not configured, and as the seed
 * set to import into Sanity. To add a founder: create a file next to this one,
 * then add it to the list. See docs/FOUNDER_JOURNEYS.md.
 */
import type { FounderJourney } from '@/lib/journey/types';
import ayushShaw from './ayush-shaw';
import kishanPanchal from './kishan-panchal';
import { sunitaMeena, arjunSomani } from './samples';

export const LOCAL_JOURNEYS: FounderJourney[] = [ayushShaw, kishanPanchal, sunitaMeena, arjunSomani];
