/**
 * Local founder journeys. Used when Sanity is not configured, and as the seed
 * set to import into Sanity. To add a founder: create a file next to this one,
 * then add it to the list. See docs/FOUNDER_JOURNEYS.md.
 */
import type { FounderJourney } from '@/lib/journey/types';
import ayushShaw from './ayush-shaw';
import kishanPanchal from './kishan-panchal';
import karthikR from './karthik-r';
import rohitGour from './rohit-gour';
import shraddhanjaliSonune from './shraddhanjali-sonune';
import hinaSoni from './hina-soni';
import praveenChaudhary from './praveen-chaudhary';
import kartikBaladia from './kartik-baladia';
import navjotKaur from './navjot-kaur';
import punamShail from './punam-shail';

export const LOCAL_JOURNEYS: FounderJourney[] = [punamShail, navjotKaur, kartikBaladia, praveenChaudhary, hinaSoni, shraddhanjaliSonune, rohitGour, karthikR, ayushShaw, kishanPanchal];
