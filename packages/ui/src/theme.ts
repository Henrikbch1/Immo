/** Themen laut 03 §4.1: hell, dunkel, kontrast; „system“ folgt prefers-color-scheme. */
export type Thema = 'system' | 'hell' | 'dunkel' | 'kontrast';

const SCHLUESSEL = 'immo.thema';

export function gespeichertesThema(): Thema {
  const wert = globalThis.localStorage?.getItem(SCHLUESSEL);
  return wert === 'hell' || wert === 'dunkel' || wert === 'kontrast' ? wert : 'system';
}

export function wendeThemaAn(thema: Thema): void {
  const dunkelBevorzugt = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  const effektiv = thema === 'system' ? (dunkelBevorzugt ? 'dunkel' : 'hell') : thema;
  document.documentElement.dataset.theme = effektiv;
  document.documentElement.style.colorScheme = effektiv === 'dunkel' ? 'dark' : 'light';
  if (thema === 'system') globalThis.localStorage?.removeItem(SCHLUESSEL);
  else globalThis.localStorage?.setItem(SCHLUESSEL, thema);
}
