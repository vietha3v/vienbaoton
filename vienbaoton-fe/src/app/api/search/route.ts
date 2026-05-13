import { NextRequest, NextResponse } from "next/server";
import GhostContentAPI from "@tryghost/content-api";

const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || "http://localhost:2368",
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
});

interface GhostTag {
  id: string;
  name: string;
  slug: string;
}

interface GhostPost {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  tags?: GhostTag[];
}

interface GhostPage {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  tags?: GhostTag[];
}

interface SearchResult {
  type: "post" | "page" | "album";
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  url: string;
  score: number;
}

function escapeFilterValue(value: string): string {
  return value.replace(/'/g, "\\'");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function calculateScore(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

  let score = 0;

  // Exact match gets highest score
  if (lowerContent.includes(lowerQuery)) {
    score += 100;
  }

  // Word-by-word matching
  words.forEach((word) => {
    const regex = new RegExp(word, "gi");
    const matches = lowerContent.match(regex);
    if (matches) {
      score += matches.length * 10;
    }
    if (lowerContent.includes(word)) {
      score += 5;
    }
  });

  // Title match gets extra boost
  const titleBoost = lowerContent.indexOf(lowerQuery);
  if (titleBoost >= 0 && titleBoost < 50) {
    score += 50;
  }

  return score;
}

function buildResult(
  item: GhostPost | GhostPage,
  type: "post" | "page",
  query: string,
  fromTitle: boolean
): SearchResult | null {
  const isAlbum = type === "page" && item.tags?.some((t) => t.slug === "album");
  const actualType = isAlbum ? "album" : type;

  const searchableContent = `${item.title} ${item.excerpt || ""} ${stripHtml(
    item.html || ""
  )}`;
  let score = calculateScore(searchableContent, query);
  if (fromTitle) score += 30;
  if (score <= 0) return null;

  return {
    type: actualType,
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || stripHtml(item.html || "").substring(0, 200),
    feature_image: item.feature_image,
    published_at: item.published_at,
    url:
      actualType === "album"
        ? `/ngan-hang-hinh-anh/${item.slug}`
        : `/${item.slug}`,
    score,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const searchQuery = query.trim();
  const safeQuery = escapeFilterValue(searchQuery);
  const titleFilter = `title:~*'${safeQuery}'`;

  try {
    // Phase 1: Title search via Ghost filter (fast, server-side, max 50 each)
    const titlePostsPromise = api.posts.browse({
      limit: 50,
      include: ["tags"],
      filter: titleFilter,
      order: "published_at DESC",
    });
    const titlePagesPromise = api.pages.browse({
      limit: 50,
      include: ["tags"],
      filter: titleFilter,
      order: "published_at DESC",
    });

    // Phase 2: Content search (recent 50 items, client-side filter)
    const contentPostsPromise = api.posts.browse({
      limit: 50,
      include: ["tags"],
      order: "published_at DESC",
    });
    const contentPagesPromise = api.pages.browse({
      limit: 50,
      include: ["tags"],
      order: "published_at DESC",
    });

    const [titlePosts, titlePages, contentPosts, contentPages] =
      await Promise.all([
        titlePostsPromise,
        titlePagesPromise,
        contentPostsPromise,
        contentPagesPromise,
      ]);

    const seenIds = new Set<string>();
    const results: SearchResult[] = [];

    // Helper to add unique results
    const add = (item: SearchResult | null) => {
      if (!item || seenIds.has(item.id)) return;
      seenIds.add(item.id);
      results.push(item);
    };

    // Title matches first (boosted score)
    (titlePosts as unknown as GhostPost[]).forEach((post) =>
      add(buildResult(post, "post", searchQuery, true))
    );
    (titlePages as unknown as GhostPage[]).forEach((page) =>
      add(buildResult(page, "page", searchQuery, true))
    );

    // Content matches (only if not already added)
    (contentPosts as unknown as GhostPost[]).forEach((post) =>
      add(buildResult(post, "post", searchQuery, false))
    );
    (contentPages as unknown as GhostPage[]).forEach((page) =>
      add(buildResult(page, "page", searchQuery, false))
    );

    // Sort by score (relevance) then by date
    results.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(b.published_at).getTime() -
        new Date(a.published_at).getTime()
      );
    });

    return NextResponse.json({
      results,
      total: results.length,
      query: searchQuery,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { results: [], total: 0, error: "Search failed" },
      { status: 500 }
    );
  }
}
