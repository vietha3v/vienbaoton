import jwt from "jsonwebtoken";

const GHOST_URL = process.env.GHOST_API_URL || "http://localhost:2368";
const ADMIN_KEY = process.env.GHOST_ADMIN_API_KEY || "";

function getAdminToken(): string {
  if (!ADMIN_KEY.includes(":")) {
    throw new Error(
      "GHOST_ADMIN_API_KEY must be in format {id}:{secret}. Get it from Ghost Admin → Settings → Integrations."
    );
  }
  const [id, secret] = ADMIN_KEY.split(":");
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300,
    aud: "/admin/",
  };
  return jwt.sign(payload, secret, { algorithm: "HS256", keyid: id });
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const url = `${GHOST_URL}/ghost/api/admin${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Ghost ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ghost Admin API ${res.status}: ${text}`);
  }

  return res.json();
}

// ===================== POSTS =====================

export interface CreatePostInput {
  title: string;
  html: string;
  excerpt?: string;
  status?: "published" | "draft";
  tags?: string[];
  feature_image?: string | null;
  authors?: string[];
}

export async function createGhostPost(input: CreatePostInput) {
  const body = {
    posts: [
      {
        title: input.title,
        html: input.html,
        excerpt: input.excerpt || undefined,
        status: input.status || "draft",
        tags: input.tags?.map((name) => ({ name })) || [],
        feature_image: input.feature_image || undefined,
        authors: input.authors?.length ? input.authors.map((slug) => ({ slug })) : undefined,
      },
    ],
  };

  return adminFetch("/posts/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateGhostPost(id: string, input: Partial<CreatePostInput>) {
  const body = {
    posts: [
      {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.html !== undefined && { html: input.html }),
        ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.tags !== undefined && { tags: input.tags.map((name) => ({ name })) }),
        ...(input.feature_image !== undefined && {
          feature_image: input.feature_image || undefined,
        }),
      },
    ],
  };

  return adminFetch(`/posts/${id}/`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteGhostPost(id: string) {
  return adminFetch(`/posts/${id}/`, { method: "DELETE" });
}

export async function getGhostPostById(id: string) {
  return adminFetch(`/posts/${id}/?include=tags,authors`);
}

export async function getAllAdminPosts() {
  return adminFetch("/posts/?limit=all&include=tags,authors");
}

export async function getAllAdminPages() {
  return adminFetch("/pages/?limit=all&include=tags");
}

// ===================== PAGES =====================

export interface CreatePageInput {
  title: string;
  html: string;
  excerpt?: string;
  status?: "published" | "draft";
  tags?: string[];
  feature_image?: string | null;
}

export async function createGhostPage(input: CreatePageInput) {
  const body = {
    pages: [
      {
        title: input.title,
        html: input.html,
        excerpt: input.excerpt || undefined,
        status: input.status || "draft",
        tags: input.tags?.map((name) => ({ name })) || [],
        feature_image: input.feature_image || undefined,
      },
    ],
  };

  return adminFetch("/pages/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateGhostPage(id: string, input: Partial<CreatePageInput>) {
  const body = {
    pages: [
      {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.html !== undefined && { html: input.html }),
        ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.tags !== undefined && { tags: input.tags.map((name) => ({ name })) }),
        ...(input.feature_image !== undefined && {
          feature_image: input.feature_image || undefined,
        }),
      },
    ],
  };

  return adminFetch(`/pages/${id}/`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteGhostPage(id: string) {
  return adminFetch(`/pages/${id}/`, { method: "DELETE" });
}

export async function getGhostPageById(id: string) {
  return adminFetch(`/pages/${id}/?include=tags`);
}

// ===================== TAGS =====================

export interface CreateTagInput {
  name: string;
  slug?: string;
  description?: string;
  visibility?: "public" | "internal";
}

export async function createGhostTag(input: CreateTagInput) {
  const body = {
    tags: [
      {
        name: input.name,
        slug: input.slug || undefined,
        description: input.description || undefined,
        visibility: input.visibility || "public",
      },
    ],
  };

  return adminFetch("/tags/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateGhostTag(id: string, input: Partial<CreateTagInput>) {
  const body = {
    tags: [
      {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.visibility !== undefined && { visibility: input.visibility }),
      },
    ],
  };

  return adminFetch(`/tags/${id}/`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteGhostTag(id: string) {
  return adminFetch(`/tags/${id}/`, { method: "DELETE" });
}

// ===================== AUTHORS =====================

export interface CreateAuthorInput {
  name: string;
  slug?: string;
  email?: string;
  bio?: string;
  website?: string;
  location?: string;
  meta_title?: string;
  meta_description?: string;
}

export async function createGhostAuthor(input: CreateAuthorInput) {
  const body = {
    users: [
      {
        name: input.name,
        slug: input.slug || undefined,
        email: input.email || undefined,
        bio: input.bio || undefined,
        website: input.website || undefined,
        location: input.location || undefined,
        meta_title: input.meta_title || undefined,
        meta_description: input.meta_description || undefined,
        role: "Author",
      },
    ],
  };

  return adminFetch("/users/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateGhostAuthor(id: string, input: Partial<CreateAuthorInput>) {
  const body = {
    users: [
      {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.website !== undefined && { website: input.website }),
        ...(input.location !== undefined && { location: input.location }),
        ...(input.meta_title !== undefined && { meta_title: input.meta_title }),
        ...(input.meta_description !== undefined && { meta_description: input.meta_description }),
      },
    ],
  };

  return adminFetch(`/users/${id}/`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteGhostAuthor(id: string) {
  return adminFetch(`/users/${id}/`, { method: "DELETE" });
}
