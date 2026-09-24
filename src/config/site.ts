/**
 * Central theme configuration.
 *
 * Everything a new site normally needs to change lives here: the studio name,
 * navigation, footer, contact details, commerce defaults, and which products
 * are promoted on the homepage and in the mobile menu. Components read from
 * this file rather than hardcoding copy, so renaming or re-scoping the theme
 * does not mean editing markup.
 *
 * The canonical domain is NOT here — it is `site` in astro.config.mjs, so
 * there is only ever one source of truth for it.
 */

import { routes, type Locale } from "@/i18n";

/** A string given once per locale. */
export type Localized = Record<Locale, string>;

export interface NavItem {
  label: Localized;
  /** Unprefixed path (see `routes`); components add the locale prefix. */
  href: string;
}

export interface FooterColumn {
  heading: Localized;
  links: NavItem[];
}

export const siteConfig = {
  /** Studio name. Used in the wordmark, metadata, JSON-LD and the footer. */
  name: "Atelier Neela",

  /** One-line positioning statement. Emitted as the Organization slogan. */
  tagline: { fr: "Créateur de souvenirs et émotions uniques", en: "Crafting unique memories and emotions" } satisfies Localized,

  /** Default meta description for pages that do not set their own. */
  description: {
    fr: "Un petit atelier suédois qui fabrique à la main du mobilier en chêne, frêne et noyer massifs. Fait sur commande dans le Småland.",
    en: "A small Swedish atelier crafting solid oak, ash and walnut furniture by hand. Made to order in Småland.",
  } satisfies Localized,

  /** Default <title> for pages that do not set their own. */
  defaultTitle: {
    fr: "Atelier Neela — Créateur de souvenirs et émotions uniques",
    en: "Atelier Neela — Crafting unique memories and emotions",
  } satisfies Localized,

  /** Contact address, linked in the footer and on the studio page. */
  email: "email@example.com",

  /** Used for Organization JSON-LD. */
  location: {
    region: "Gironde",
    country: "FR",
  },

  /** Browser theme colour. Keep in step with `--canvas` in src/styles.css. */
  themeColor: "#f4f4f2",

  /**
   * Fallback social share card, served from public/. Used by any page that
   * does not pass its own `image` — product pages pass their photography, so
   * this covers the homepage, catalogue, studio, cart and 404.
   */
  socialImage: {
    src: "/og-image.png",
    width: 1200,
    height: 630,
    alt: {
      fr: "Atelier Neela — Créateur de souvenirs et émotions uniques",
      en: "Atelier Neela — Crafting unique memories and emotions",
    } satisfies Localized,
  },

  /** Primary navigation, in order. Also drives the mobile menu. */
  navigation: [
    { label: { fr: "Accueil", en: "Home" }, href: routes.home },
    { label: { fr: "Catalogue", en: "Catalogue" }, href: routes.catalog },
    { label: { fr: "Atelier", en: "Atelier" }, href: routes.studio },
  ] satisfies NavItem[],

  /** Short paragraph in the first footer column. */
  footerBlurb: {
    fr: "Un atelier de deux personnes au nord de Bordeaux. Des créations fait main et personnalisables pour tous vos événements.",
    en: "A two-person studio at the north of Bordeaux. Handmade, customizable creations for all your events.",
  } satisfies Localized,

  /** Footer link columns. Add or remove columns freely. */
  footerColumns: [
    {
      heading: { fr: "Catalogue", en: "Catalogue" },
      links: [
        { label: { fr: "Toutes les pièces", en: "All pieces" }, href: routes.catalog },
        { label: { fr: "L'atelier", en: "The atelier" }, href: routes.studio },
        { label: { fr: "Votre panier", en: "Your cart" }, href: routes.cart },
      ],
    },
    {
      heading: { fr: "Demandes", en: "Enquiries" },
      links: [
        { label: { fr: "Commandes sur mesure", en: "Custom orders" }, href: `${routes.studio}#studio` },
        { label: { fr: "Espace professionnels", en: "Trade portal" }, href: `${routes.studio}#studio` },
        { label: { fr: "Visites de l'atelier", en: "Studio visits" }, href: `${routes.studio}#studio` },
      ],
    },
    {
      heading: { fr: "Ailleurs", en: "Elsewhere" },
      links: [{ label: { fr: "Instagram", en: "Instagram" }, href: "https://www.instagram.com/" }],
    },
  ] satisfies FooterColumn[],

  /** Commerce defaults. Prices are formatted in each locale's conventions. */
  commerce: {
    /** ISO 4217 currency code. */
    currency: "EUR",
    /** Flat delivery charge added once when the cart is not empty. */
    shippingFlatRate: 50,
  },

  /**
   * Which products the theme promotes. Each value is a filename in
   * src/content/products/<locale>/ without the .md extension. A slug that does not
   * resolve fails the build rather than rendering an empty section.
   */
  featured: {
    /** Three cards in the homepage "in the workshop" grid. */
    homepageGrid: ["chaise-arvid", "table-basse-plinth", "bureau-tora"],
    /** The single large piece given its own homepage section. */
    homepageSolo: "banc-monolith",
    /** The piece shown at the foot of the mobile menu. */
    mobileMenu: "tabouret-oken",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Builds a page <title> in the theme's house format: "Page — Studio Name".
 * Change the separator here to restyle every title at once.
 */
export function pageTitle(page: string): string {
  return `${page} — ${siteConfig.name}`;
}
