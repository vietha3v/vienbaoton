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
  score?: number;
}

// Elastic-style scoring function
function calculateScore(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);

  let score = 0;

  // Exact match gets highest score
  if (lowerContent.includes(lowerQuery)) {
    score += 100;
  }

  // Word-by-word matching
  words.forEach(word => {
    const regex = new RegExp(word, "gi");
    const matches = lowerContent.match(regex);
    if (matches) {
      score += matches.length * 10;
    }

    // Partial match bonus
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const searchQuery = query.trim();

  try {
    // Search in posts - search title and html content
    const postsPromise = api.posts.browse({
      limit: "all",
      include: ["tags"],
      order: "published_at DESC",
    });

    // Search in pages
    const pagesPromise = api.pages.browse({
      limit: "all",
      include: ["tags"],
      order: "published_at DESC",
    });

    const [posts, pages] = await Promise.all([postsPromise, pagesPromise]);

    const results: SearchResult[] = [];

    // Filter and score posts
    (posts as unknown as GhostPost[]).forEach((post) => {
      const searchableContent = `${post.title} ${post.excerpt} ${stripHtml(post.html || "")}`;

      // Check if query matches
      const lowerContent = searchableContent.toLowerCase();
      const lowerQuery = searchQuery.toLowerCase();
      const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);

      const matches = words.some(word => lowerContent.includes(word));

      if (matches) {
        const score = calculateScore(searchableContent, searchQuery);
        if (score > 0) {
          results.push({
            type: "post",
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || stripHtml(post.html || "").substring(0, 200),
            feature_image: post.feature_image,
            published_at: post.published_at,
            url: `/${post.slug}`,
            score,
          });
        }
      }
    });

    // Filter and score pages
    (pages as unknown as GhostPage[]).forEach((page) => {
      const searchableContent = `${page.title} ${page.excerpt || ""} ${stripHtml(page.html || "")}`;
      const lowerContent = searchableContent.toLowerCase();
      const lowerQuery = searchQuery.toLowerCase();
      const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);

      const matches = words.some(word => lowerContent.includes(word));
      const isAlbum = page.tags?.some((tag) => tag.slug === "album");

      if (matches) {
        const score = calculateScore(searchableContent, searchQuery);
        if (score > 0) {
          results.push({
            type: isAlbum ? "album" : "page",
            id: page.id,
            slug: page.slug,
            title: page.title,
            excerpt: page.excerpt || stripHtml(page.html || "").substring(0, 200),
            feature_image: page.feature_image,
            published_at: page.published_at,
            url: isAlbum ? `/ngan-hang-hinh-anh/${page.slug}` : `/${page.slug}`,
            score,
          });
        }
      }
    });

    // Sort by score (relevance) then by date
    results.sort((a, b) => {
      if (b.score !== a.score) {
        return (b.score || 0) - (a.score || 0);
      }
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
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
