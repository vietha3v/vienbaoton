import GhostContentAPI from "@tryghost/content-api";

const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || "http://localhost:2368",
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
});

export interface GhostSettings {
  title: string;
  description: string;
  logo: string | null;
  icon: string | null;
  cover_image: string | null;
  url: string;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  website: string | null;
  bio: string | null;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  url: string;
  count?: { posts: number };
}

export interface GhostPost {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  feature_image_caption: string | null;
  featured: boolean;
  url: string;
  reading_time: number;
  published_at: string;
  updated_at: string;
  primary_tag: GhostTag | null;
  tags: GhostTag[];
  primary_author: GhostAuthor | null;
  authors: GhostAuthor[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
}

export interface GhostPage {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  feature_image_caption: string | null;
  url: string;
  published_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
}

export async function getSettings(): Promise<GhostSettings> {
  const settings = await api.settings.browse();
  return settings as unknown as GhostSettings;
}

export async function getHeroPosts(): Promise<GhostPost[]> {
  const posts = await api.posts.browse({
    limit: 3,
    include: ["tags", "authors"],
  });
  return posts as unknown as GhostPost[];
}

export async function getNewsPosts(): Promise<GhostPost[]> {
  const posts = await api.posts.browse({
    limit: 5,
    include: ["tags"],
  });
  return posts as unknown as GhostPost[];
}

export async function getResearchPosts(): Promise<GhostPost[]> {
  const posts = await api.posts.browse({
    limit: 4,
    include: ["tags"],
  });
  return posts as unknown as GhostPost[];
}

export async function getPostBySlug(slug: string): Promise<GhostPost> {
  const post = await api.posts.read(
    { slug },
    { include: ["tags", "authors"] }
  );
  return post as unknown as GhostPost;
}

export async function getPageBySlug(slug: string): Promise<GhostPage> {
  const page = await api.pages.read(
    { slug },
    { include: ["tags", "authors"] }
  );
  return page as unknown as GhostPage;
}

export async function getRelatedPosts(
  tagSlug: string,
  excludeId: string
): Promise<GhostPost[]> {
  try {
    const posts = await api.posts.browse({
      limit: 3,
      include: ["tags"],
      filter: `tag:${tagSlug}+id:-${excludeId}`,
    });
    return posts as unknown as GhostPost[];
  } catch {
    return [];
  }
}

export async function getTags(): Promise<GhostTag[]> {
  const tags = await api.tags.browse({
    limit: 6,
    include: ["count.posts"],
    order: "count.posts DESC",
    filter: "visibility:public",
  });
  return tags as unknown as GhostTag[];
}

export async function getRecentPosts(): Promise<GhostPost[]> {
  const posts = await api.posts.browse({
    limit: 4,
    include: ["tags"],
    filter: "visibility:public",
  });
  return posts as unknown as GhostPost[];
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const [posts, pages] = await Promise.all([
      api.posts.browse({ limit: "all", fields: "slug" }),
      api.pages.browse({ limit: "all", fields: "slug" }),
    ]);
    const postSlugs = (posts as unknown as GhostPost[]).map((p) => p.slug);
    const pageSlugs = (pages as unknown as GhostPage[]).map((p) => p.slug);
    return [...postSlugs, ...pageSlugs];
  } catch {
    return [];
  }
}
