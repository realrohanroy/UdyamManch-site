/**
 * Feature flags: sections that are built but switched off for now.
 * Flip a flag to true and redeploy to bring the section back. Keep the code it guards;
 * a flag that has been on (or off) for good should be removed along with its dead branch.
 */
export const FLAGS = {
  /**
   * "Building something in India?" call to action at the bottom of /founders, linking to the
   * Google Form. Off until founder submissions open (NEXT_PUBLIC_FEATURE_FORM_URL is still empty).
   */
  foundersSubmitCta: false,
  /**
   * TEMPORARY (branch temp/founders-only): only the founder story pages are reachable. Every
   * other address, including / and /founders, is a 404. Enforced by src/middleware.ts (Node.js
   * or Vercel) and by the .htaccess that scripts/build-static.mjs writes (Hostinger).
   * Set to false, or go back to main, to open the whole site again.
   */
  foundersOnly: true,
} as const;
