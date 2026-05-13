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
  description?: string | null;
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
  tags?: GhostTag[];
}

// Interface cho Album ảnh
export interface GhostAlbum {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  updated_at: string;
  meta_description: string | null;
  tags?: GhostTag[];
}

export async function getSettings(): Promise<GhostSettings> {
  const settings = await api.settings.browse();
  return settings as unknown as GhostSettings;
}

export async function getHeroPosts(locale?: string): Promise<GhostPost[]> {
  const filter = buildLocaleFilter(locale);
  const posts = await api.posts.browse({
    limit: 3,
    include: ["tags", "authors"],
    ...(filter ? { filter } : {}),
  });
  return posts as unknown as GhostPost[];
}

export async function getNewsPosts(locale?: string): Promise<GhostPost[]> {
  const filter = buildLocaleFilter(locale);
  const posts = await api.posts.browse({
    limit: 5,
    include: ["tags"],
    ...(filter ? { filter } : {}),
  });
  return posts as unknown as GhostPost[];
}

export async function getResearchPosts(locale?: string): Promise<GhostPost[]> {
  const filter = buildLocaleFilter(locale);
  const posts = await api.posts.browse({
    limit: 4,
    include: ["tags"],
    ...(filter ? { filter } : {}),
  });
  return posts as unknown as GhostPost[];
}

export async function getPostBySlug(slug: string): Promise<GhostPost> {
  try {
    const post = await api.posts.read(
      { slug },
      { include: ["tags", "authors"] }
    );
    return post as unknown as GhostPost;
  } catch (e) {
    console.error(`[getPostBySlug] Failed for "${slug}":`, e);
    throw e;
  }
}

export async function getPageBySlug(slug: string): Promise<GhostPage> {
  try {
    const page = await api.pages.read(
      { slug },
      { include: ["tags", "authors"] }
    );
    return page as unknown as GhostPage;
  } catch (e) {
    console.error(`[getPageBySlug] Failed for "${slug}":`, e);
    throw e;
  }
}

export async function getRelatedPosts(
  tagSlug: string,
  excludeId: string,
  locale?: string
): Promise<GhostPost[]> {
  try {
    const localeFilter = buildLocaleFilter(locale);
    const tagFilter = `tag:${tagSlug}+id:-${excludeId}`;
    const filter = localeFilter
      ? `${tagFilter}+${localeFilter}`
      : tagFilter;
    const posts = await api.posts.browse({
      limit: 3,
      include: ["tags"],
      filter,
    });
    return posts as unknown as GhostPost[];
  } catch {
    return [];
  }
}

export async function getTags(): Promise<GhostTag[]> {
  const tags = await api.tags.browse({
    limit: "all",
    include: ["count.posts"],
    order: "count.posts DESC",
    filter: "visibility:public",
  });
  return tags as unknown as GhostTag[];
}

// Lấy tag theo slug
export async function getTagBySlug(slug: string): Promise<GhostTag | null> {
  try {
    const tag = await api.tags.read({ slug });
    return tag as unknown as GhostTag;
  } catch (e) {
    console.error(`[getTagBySlug] Failed for "${slug}":`, e);
    return null;
  }
}

// Lấy author theo slug
export async function getAuthorBySlug(slug: string): Promise<GhostAuthor | null> {
  try {
    const author = await api.authors.read({ slug }, { include: ["count.posts"] });
    return author as unknown as GhostAuthor;
  } catch (e) {
    console.error(`[getAuthorBySlug] Failed for "${slug}":`, e);
    return null;
  }
}

// Lấy posts theo author
export async function getAuthorPosts(slug: string, locale?: string): Promise<GhostPost[]> {
  try {
    const localeFilter = buildLocaleFilter(locale);
    const filter = localeFilter ? `author:${slug}+${localeFilter}` : `author:${slug}`;

    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      filter,
      order: "published_at DESC",
    });
    return posts as unknown as GhostPost[];
  } catch (e) {
    console.error(`[getAuthorPosts] Error for "${slug}":`, e);
    return [];
  }
}

// Lấy posts theo tag
export async function getTagPosts(slug: string, locale?: string): Promise<GhostPost[]> {
  try {
    const localeFilter = buildLocaleFilter(locale);
    const tagFilter = `tag:${slug}`;
    const filter = localeFilter ? `${tagFilter}+${localeFilter}` : tagFilter;

    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      filter,
      order: "published_at DESC",
    });
    return posts as unknown as GhostPost[];
  } catch (e) {
    console.error(`[getTagPosts] Error for "${slug}":`, e);
    return [];
  }
}

export async function getRecentPosts(locale?: string): Promise<GhostPost[]> {
  const filter = buildLocaleFilter(locale);
  const posts = await api.posts.browse({
    limit: 4,
    include: ["tags"],
    ...(filter ? { filter } : {}),
  });
  return posts as unknown as GhostPost[];
}

// Lấy danh sách album - dùng tag "album" để lọc
export async function getAlbums(locale?: string): Promise<GhostAlbum[]> {
  try {
    const filter = "tag:album";
    const pages = await api.pages.browse({
      limit: "all",
      include: ["tags"],
      filter,
      order: "published_at DESC",
    });
    return pages as unknown as GhostAlbum[];
  } catch (e) {
    console.error("[getAlbums] Error:", e);
    return [];
  }
}

// Lấy album theo slug
export async function getAlbumBySlug(slug: string): Promise<GhostAlbum | null> {
  try {
    const page = await api.pages.read({ slug }, { include: ["tags"] });
    return page as unknown as GhostAlbum;
  } catch (e) {
    console.error(`[getAlbumBySlug] Failed for "${slug}":`, e);
    return null;
  }
}

// Lấy tất cả posts thuộc album (dùng tag để lọc)
export async function getAlbumPosts(albumSlug: string, locale?: string): Promise<GhostPost[]> {
  try {
    const localeFilter = buildLocaleFilter(locale);
    const albumFilter = `tag:album-${albumSlug}`;
    const filter = localeFilter
      ? `${albumFilter}+${localeFilter}`
      : albumFilter;

    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      filter,
      order: "published_at DESC",
    });
    return posts as unknown as GhostPost[];
  } catch (e) {
    console.error(`[getAlbumPosts] Error for "${albumSlug}":`, e);
    return [];
  }
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

function buildLocaleFilter(locale?: string): string | null {
  if (!locale || locale === "vi") return null;
  return `tag:lang-${locale}`;
}

// Search results interface
export interface SearchResult {
  type: "post" | "page" | "album";
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  url: string;
}

// Search function - tìm kiếm trong posts, pages, albums
export async function search(query: string, locale?: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchQuery = query.trim().toLowerCase();
  const localeFilter = buildLocaleFilter(locale);

  try {
    // Tìm trong posts
    const postFilter = localeFilter
      ? `title:~*${searchQuery}+${localeFilter}`
      : `title:~*${searchQuery}`;

    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags"],
      filter: postFilter,
    });

    // Tìm trong pages (bao gồm albums)
    const pages = await api.pages.browse({
      limit: "all",
      include: ["tags"],
      filter: localeFilter ? `title:~*${searchQuery}+${localeFilter}` : `title:~*${searchQuery}`,
    });

    const results: SearchResult[] = [];

    // Add posts
    (posts as unknown as GhostPost[]).forEach((post) => {
      results.push({
        type: "post",
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        feature_image: post.feature_image,
        published_at: post.published_at,
        url: `/${post.slug}`,
      });
    });

    // Add pages (phân loại album và page thường)
    (pages as unknown as GhostAlbum[]).forEach((page) => {
      const isAlbum = page.tags?.some((tag) => tag.slug === "album");
      results.push({
        type: isAlbum ? "album" : "page",
        id: page.id,
        slug: page.slug,
        title: page.title,
        excerpt: page.excerpt || page.meta_description || "",
        feature_image: page.feature_image,
        published_at: page.published_at,
        url: isAlbum ? `/ngan-hang-hinh-anh/${page.slug}` : `/${page.slug}`,
      });
    });

    // Sort by published_at DESC
    results.sort((a, b) => {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    return results;
  } catch (e) {
    console.error("[search] Error:", e);
    return [];
  }
}
