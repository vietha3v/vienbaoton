import { MetadataRoute } from "next";
import GhostContentAPI from "@tryghost/content-api";

const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || "http://localhost:2368",
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
});

const baseUrl = process.env.SITE_URL || "http://localhost:3000";

function hasLangEn(item: { tags?: { slug: string }[] }): boolean {
  return item.tags?.some((t) => t.slug === "lang-en") ?? false;
}

function safeDate(value: string | undefined | null): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/tags", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/tim-kiem", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/dao-tao-boi-duong", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/ngan-hang-hinh-anh", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, priority, changeFrequency }) => {
      const url = `${baseUrl}${path}`;
      return {
        url,
        lastModified: new Date(),
        priority,
        changeFrequency,
        alternates: {
          languages: {
            vi: url,
            en: `${baseUrl}/en${path}`,
          },
        },
      };
    }
  );

  const [posts, pages, tags, authors] = await Promise.all([
    api.posts.browse({ limit: "all", include: ["tags"], order: "updated_at DESC" }),
    api.pages.browse({ limit: "all", include: ["tags"], order: "updated_at DESC" }),
    api.tags.browse({ limit: "all", fields: "slug,updated_at", filter: "visibility:public" }),
    api.authors.browse({ limit: "all", fields: "slug,updated_at" }),
  ]);

  const seenSlugs = new Set<string>();
  const entries: MetadataRoute.Sitemap = [...staticEntries];

  // Posts
  for (const post of posts as unknown as Array<{
    id: string;
    slug: string;
    updated_at: string;
    tags?: { slug: string }[];
  }>) {
    if (seenSlugs.has(post.slug)) continue;
    seenSlugs.add(post.slug);

    const alternates: Record<string, string> = {
      vi: `${baseUrl}/${post.slug}`,
    };
    if (hasLangEn(post)) {
      alternates.en = `${baseUrl}/en/${post.slug}`;
    }

    entries.push({
      url: `${baseUrl}/${post.slug}`,
      lastModified: safeDate(post.updated_at),
      priority: 0.8,
      changeFrequency: "weekly",
      alternates: { languages: alternates },
    });
  }

  // Pages
  for (const page of pages as unknown as Array<{
    id: string;
    slug: string;
    updated_at: string;
    tags?: { slug: string }[];
  }>) {
    if (seenSlugs.has(page.slug)) continue;
    seenSlugs.add(page.slug);

    const isAlbum = page.tags?.some((t) => t.slug === "album");
    const alternates: Record<string, string> = {
      vi: `${baseUrl}/${page.slug}`,
    };
    if (hasLangEn(page)) {
      alternates.en = `${baseUrl}/en/${page.slug}`;
    }

    entries.push({
      url: isAlbum
        ? `${baseUrl}/ngan-hang-hinh-anh/${page.slug}`
        : `${baseUrl}/${page.slug}`,
      lastModified: safeDate(page.updated_at),
      priority: isAlbum ? 0.6 : 0.7,
      changeFrequency: "monthly",
      alternates: { languages: alternates },
    });
  }

  // Tags
  for (const tag of tags as unknown as Array<{
    slug: string;
    updated_at: string;
  }>) {
    entries.push({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: safeDate(tag.updated_at),
      priority: 0.6,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          vi: `${baseUrl}/tag/${tag.slug}`,
          en: `${baseUrl}/en/tag/${tag.slug}`,
        },
      },
    });
  }

  // Authors
  for (const author of authors as unknown as Array<{
    slug: string;
    updated_at?: string;
  }>) {
    entries.push({
      url: `${baseUrl}/author/${author.slug}`,
      lastModified: author.updated_at ? new Date(author.updated_at) : new Date(),
      priority: 0.5,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          vi: `${baseUrl}/author/${author.slug}`,
          en: `${baseUrl}/en/author/${author.slug}`,
        },
      },
    });
  }

  return entries;
}
