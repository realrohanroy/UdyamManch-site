/** Tiny event bridge so any share button can show the one page toast (rendered by JourneyFx). */
export const TOAST_EVENT = 'fj-toast';

export function showToast(message: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}
