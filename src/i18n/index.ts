/**
 * Locale plumbing.
 *
 * French is the default locale and is served from the site root ("/catalogue"),
 * English lives under its prefix ("/en/catalogue"). Keep `locales` and
 * `defaultLocale` in step with the `i18n` block in astro.config.mjs.
 *
 * Pages live in src/pages/[...lang]/ and call `localeStaticPaths()` so one
 * file renders every locale. Components never receive the locale as a prop:
 * they read it from the URL with `getLocale(Astro.url)`.
 */

import { ui, type Dictionary } from "./ui";

export { fill, type Dictionary } from "./ui";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/**
 * Page paths, unprefixed. Every internal link goes through here, so renaming a
 * page means renaming its file in src/pages/[...lang]/ and editing this map —
 * nothing else. Pass the result to `localizePath()` for the current locale.
 */
export const routes = {
  home: "/",
  catalog: "/catalogue",
  studio: "/atelier",
  cart: "/panier",
  product: (slug: string) => `/produits/${slug}`,
} as const;

/** Per-locale formatting and metadata. */
export const localeMeta: Record<
  Locale,
  { label: string; short: string; intl: string; ogLocale: string }
> = {
  fr: { label: "Français", short: "FR", intl: "fr-FR", ogLocale: "fr_FR" },
  en: { label: "English", short: "EN", intl: "en-US", ogLocale: "en_US" },
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Reads the locale from the first path segment, falling back to the default. */
export function getLocale(url: URL): Locale {
  const segment = url.pathname.split("/")[1];
  return isLocale(segment) ? segment : defaultLocale;
}

/** Removes the locale prefix: "/en/catalogue" → "/catalogue", "/en" → "/". */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1]) && segments[1] !== defaultLocale) {
    segments.splice(1, 1);
  }
  return segments.join("/") || "/";
}

/**
 * Prefixes an internal path for a locale: ("/catalogue", "en") → "/en/catalogue".
 * External URLs, mailto: links and bare anchors are returned untouched.
 */
export function localizePath(path: string, lang: Locale): string {
  if (!path.startsWith("/") || lang === defaultLocale) return path;
  return path === "/" ? `/${lang}/` : `/${lang}${path}`;
}

/** Static paths for a page that renders once per locale under [...lang]. */
export function localeStaticPaths() {
  return locales.map((lang) => ({
    params: { lang: lang === defaultLocale ? undefined : lang },
    props: { lang },
  }));
}

export function useTranslations(lang: Locale): Dictionary {
  return ui[lang];
}

/** Formats a price in the locale's conventions. */
export function formatPrice(value: number, lang: Locale, currency: string): string {
  return new Intl.NumberFormat(localeMeta[lang].intl, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
