import { getCollection, type CollectionEntry } from "astro:content";
import { siteConfig } from "@/config/site";
import { formatPrice as formatLocalePrice, isLocale, type Locale } from "@/i18n";

type ProductEntry = CollectionEntry<"products">;
export type Product = ProductEntry["data"] & { slug: string; lang: Locale; description: string };

/**
 * Products live in one folder per locale — src/content/products/fr/tabouret-oken.md
 * — so the entry id is "fr/tabouret-oken". The filename is the slug, shared by
 * every translation of the same piece, which keeps cart contents and
 * `siteConfig.featured` valid across languages.
 */
function localeAndSlug(entry: ProductEntry): { lang: Locale; slug: string } {
  const [lang, ...rest] = entry.id.replace(/\.(md|mdx)$/, "").split("/");
  if (!isLocale(lang) || rest.length === 0) {
    throw new Error(
      `Product "${entry.id}" must live in a locale folder, e.g. src/content/products/fr/${entry.id}.md.`,
    );
  }
  return { lang, slug: rest.join("/") };
}

function descriptionFromEntry(entry: ProductEntry): string {
  return (entry.body ?? "").trim().replace(/\s+/g, " ");
}

function byOrderThenName(a: Product, b: Product): number {
  return a.order - b.order || a.name.localeCompare(b.name);
}

export async function getProducts(lang: Locale): Promise<Product[]> {
  const entries = await getCollection("products");
  return entries
    .map((entry: ProductEntry) => ({
      ...localeAndSlug(entry),
      description: descriptionFromEntry(entry),
      ...entry.data,
    }))
    .filter((product) => product.lang === lang)
    .sort(byOrderThenName);
}

export function getRelated(products: Product[], slug: string, limit = 3): Product[] {
  const current = products.find((product) => product.slug === slug);
  if (!current) return products.slice(0, limit);

  return products
    .filter((product) => product.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? -1 : 1;
      const bScore = b.category === current.category ? -1 : 1;
      return aScore - bScore || byOrderThenName(a, b);
    })
    .slice(0, limit);
}

export function getProductFilters(products: Product[]): {
  categories: string[];
  materials: string[];
} {
  return {
    categories: [...new Set(products.map((product) => product.category))],
    materials: [...new Set(products.map((product) => product.material))],
  };
}

export function formatPrice(value: number, lang: Locale): string {
  return formatLocalePrice(value, lang, siteConfig.commerce.currency);
}

/** Resolves a configured slug, failing the build when it does not exist. */
export function requireProduct(products: Product[], slug: string): Product {
  const product = products.find((entry) => entry.slug === slug);
  if (!product) {
    const lang = products[0]?.lang ?? "?";
    throw new Error(
      `siteConfig.featured references "${slug}", but no such product exists in src/content/products/${lang}.`,
    );
  }
  return product;
}

export function productForJson(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    category: product.category,
    material: product.material,
    price: product.price,
    shortDescription: product.shortDescription,
    description: product.description,
    dimensions: product.dimensions,
    finish: product.finish,
    leadTime: product.leadTime,
  };
}
