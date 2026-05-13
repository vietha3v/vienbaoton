import { getTags, getSettings } from "@/lib/ghost";
import { getAllAdminPosts, getAllAdminPages } from "@/lib/admin-ghost";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  const clean = text
    .replace(/[^\w\sÀ-ỹ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > 0 ? clean.split(" ").length : 0;
}

interface SeoHealthItem {
  id: string;
  title: string;
  slug: string;
  type: "post" | "page";
}

interface RecentPostItem {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  primaryTag: string | null;
  readingTime: number;
  status: string;
  metaTitle: boolean;
  metaDescription: boolean;
  featureImage: boolean;
  excerpt: boolean;
}

export interface AnalyticsData {
  overview: {
    totalPosts: number;
    totalPages: number;
    totalTags: number;
    totalAuthors: number;
    publishedPosts: number;
    draftPosts: number;
    publishedPages: number;
    draftPages: number;
    postsWithFeatureImage: number;
    postsWithoutFeatureImage: number;
    postsWithExcerpt: number;
    postsWithoutExcerpt: number;
    postsWithMetaTitle: number;
    postsWithoutMetaTitle: number;
    postsWithMetaDescription: number;
    postsWithoutMetaDescription: number;
    postsWithOgImage: number;
    postsWithoutOgImage: number;
    pagesWithMetaTitle: number;
    pagesWithoutMetaTitle: number;
    pagesWithMetaDescription: number;
    pagesWithoutMetaDescription: number;
    averageReadingTime: number;
    averageWordCount: number;
  };
  seoHealth: {
    metaTitleMissing: { count: number; items: SeoHealthItem[] };
    metaDescriptionMissing: { count: number; items: SeoHealthItem[] };
    featureImageMissing: { count: number; items: SeoHealthItem[] };
    excerptMissing: { count: number; items: SeoHealthItem[] };
    ogImageMissing: { count: number; items: SeoHealthItem[] };
    tagsMissing: { count: number; items: SeoHealthItem[] };
  };
  contentQuality: {
    averageWordCount: number;
    shortestPost: { id: string; title: string; slug: string; wordCount: number } | null;
    longestPost: { id: string; title: string; slug: string; wordCount: number } | null;
    postsOlderThan1Year: { count: number; items: SeoHealthItem[] };
    recentlyUpdated: { id: string; title: string; slug: string; updatedAt: string }[];
    mostTaggedPosts: { id: string; title: string; slug: string; tagCount: number }[];
    authorDistribution: { name: string; slug: string; count: number }[];
  };
  tagAnalytics: {
    topTags: { name: string; slug: string; count: number }[];
    tagsWithZeroPosts: { name: string; slug: string }[];
    totalTags: number;
  };
  recentPosts: RecentPostItem[];
  settings: { title: string; url: string } | null;
}

export async function computeAnalytics(): Promise<AnalyticsData> {
  const [postsData, pagesData, tags, settings] = await Promise.all([
    getAllAdminPosts().catch(() => ({ posts: [] })),
    getAllAdminPages().catch(() => ({ pages: [] })),
    getTags().catch(() => []),
    getSettings().catch(() => null),
  ]);

  const posts: any[] = postsData.posts || [];
  const pages: any[] = pagesData.pages || [];

  const publishedPosts = posts.filter((p) => p.status === "published");
  const draftPosts = posts.filter((p) => p.status !== "published");
  const publishedPages = pages.filter((p) => p.status === "published");
  const draftPages = pages.filter((p) => p.status !== "published");

  const metaTitleMissing: SeoHealthItem[] = [];
  const metaDescriptionMissing: SeoHealthItem[] = [];
  const featureImageMissing: SeoHealthItem[] = [];
  const excerptMissing: SeoHealthItem[] = [];
  const ogImageMissing: SeoHealthItem[] = [];
  const tagsMissing: SeoHealthItem[] = [];

  [...posts, ...pages].forEach((item) => {
    const actualType: "post" | "page" = posts.includes(item) ? "post" : "page";
    const seoItem: SeoHealthItem = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      type: actualType,
    };

    if (!item.meta_title) metaTitleMissing.push(seoItem);
    if (!item.meta_description) metaDescriptionMissing.push(seoItem);
    if (!item.feature_image) featureImageMissing.push(seoItem);
    if (!item.excerpt || item.excerpt.trim().length < 10) excerptMissing.push(seoItem);
    if (!item.og_image) ogImageMissing.push(seoItem);
    if (actualType === "post" && (!item.tags || item.tags.length === 0)) {
      tagsMissing.push(seoItem);
    }
  });

  let totalWords = 0;
  let shortestPost: AnalyticsData["contentQuality"]["shortestPost"] = null;
  let longestPost: AnalyticsData["contentQuality"]["longestPost"] = null;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const postsOlderThan1Year: SeoHealthItem[] = [];
  const mostTaggedPosts: { id: string; title: string; slug: string; tagCount: number }[] = [];
  const authorMap = new Map<string, { name: string; slug: string; count: number }>();

  posts.forEach((post) => {
    const text = stripHtml(post.html || "");
    const wordCount = countWords(text);
    totalWords += wordCount;

    if (!shortestPost || wordCount < shortestPost.wordCount) {
      shortestPost = { id: post.id, title: post.title, slug: post.slug, wordCount };
    }
    if (!longestPost || wordCount > longestPost.wordCount) {
      longestPost = { id: post.id, title: post.title, slug: post.slug, wordCount };
    }

    if (post.published_at && new Date(post.published_at) < oneYearAgo) {
      postsOlderThan1Year.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        type: "post",
      });
    }

    const tagCount = post.tags?.length || 0;
    if (tagCount > 0) {
      mostTaggedPosts.push({ id: post.id, title: post.title, slug: post.slug, tagCount });
    }

    const authors = post.authors || [];
    authors.forEach((author: any) => {
      const existing = authorMap.get(author.slug);
      if (existing) {
        existing.count += 1;
      } else {
        authorMap.set(author.slug, { name: author.name, slug: author.slug, count: 1 });
      }
    });
  });

  const averageWordCount = posts.length > 0 ? Math.round(totalWords / posts.length) : 0;
  const averageReadingTime =
    posts.length > 0
      ? Math.round(
          posts.reduce((sum, p) => sum + (p.reading_time || 0), 0) / posts.length
        )
      : 0;

  mostTaggedPosts.sort((a, b) => b.tagCount - a.tagCount);

  const recentlyUpdated = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    )
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      updatedAt: p.updated_at,
    }));

  const topTags = tags
    .map((t: any) => ({
      name: t.name,
      slug: t.slug,
      count: t.count?.posts || 0,
    }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  const tagsWithZeroPosts = tags
    .map((t: any) => ({ name: t.name, slug: t.slug, count: t.count?.posts || 0 }))
    .filter((t: any) => t.count === 0);

  const recentPosts: RecentPostItem[] = posts
    .sort(
      (a, b) =>
        new Date(b.published_at || 0).getTime() -
        new Date(a.published_at || 0).getTime()
    )
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      publishedAt: p.published_at,
      primaryTag: p.primary_tag?.name || null,
      readingTime: p.reading_time || 0,
      status: p.status,
      metaTitle: !!p.meta_title,
      metaDescription: !!p.meta_description,
      featureImage: !!p.feature_image,
      excerpt: !!p.excerpt && p.excerpt.trim().length >= 10,
    }));

  return {
    overview: {
      totalPosts: posts.length,
      totalPages: pages.length,
      totalTags: tags.length,
      totalAuthors: authorMap.size,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      publishedPages: publishedPages.length,
      draftPages: draftPages.length,
      postsWithFeatureImage: posts.filter((p) => !!p.feature_image).length,
      postsWithoutFeatureImage: posts.filter((p) => !p.feature_image).length,
      postsWithExcerpt: posts.filter((p) => !!p.excerpt && p.excerpt.trim().length >= 10).length,
      postsWithoutExcerpt: posts.filter((p) => !p.excerpt || p.excerpt.trim().length < 10).length,
      postsWithMetaTitle: posts.filter((p) => !!p.meta_title).length,
      postsWithoutMetaTitle: posts.filter((p) => !p.meta_title).length,
      postsWithMetaDescription: posts.filter((p) => !!p.meta_description).length,
      postsWithoutMetaDescription: posts.filter((p) => !p.meta_description).length,
      postsWithOgImage: posts.filter((p) => !!p.og_image).length,
      postsWithoutOgImage: posts.filter((p) => !p.og_image).length,
      pagesWithMetaTitle: pages.filter((p) => !!p.meta_title).length,
      pagesWithoutMetaTitle: pages.filter((p) => !p.meta_title).length,
      pagesWithMetaDescription: pages.filter((p) => !!p.meta_description).length,
      pagesWithoutMetaDescription: pages.filter((p) => !p.meta_description).length,
      averageReadingTime,
      averageWordCount,
    },
    seoHealth: {
      metaTitleMissing: { count: metaTitleMissing.length, items: metaTitleMissing.slice(0, 20) },
      metaDescriptionMissing: { count: metaDescriptionMissing.length, items: metaDescriptionMissing.slice(0, 20) },
      featureImageMissing: { count: featureImageMissing.length, items: featureImageMissing.slice(0, 20) },
      excerptMissing: { count: excerptMissing.length, items: excerptMissing.slice(0, 20) },
      ogImageMissing: { count: ogImageMissing.length, items: ogImageMissing.slice(0, 20) },
      tagsMissing: { count: tagsMissing.length, items: tagsMissing.slice(0, 20) },
    },
    contentQuality: {
      averageWordCount,
      shortestPost,
      longestPost,
      postsOlderThan1Year: { count: postsOlderThan1Year.length, items: postsOlderThan1Year.slice(0, 10) },
      recentlyUpdated,
      mostTaggedPosts: mostTaggedPosts.slice(0, 10),
      authorDistribution: Array.from(authorMap.values()).sort((a, b) => b.count - a.count),
    },
    tagAnalytics: {
      topTags,
      tagsWithZeroPosts,
      totalTags: tags.length,
    },
    recentPosts,
    settings: settings ? { title: settings.title, url: settings.url } : null,
  };
}
