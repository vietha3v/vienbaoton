# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A **Ghost CMS 6.24.0** instance for the "Viện Bảo tồn Di tích" (Heritage Conservation Institute) website — a Vietnamese government institute responsible for conservation of architectural heritage. This is a standard Ghost deployment managed via Ghost CLI, with a custom theme and a separate **Next.js frontend** that consumes Ghost content via the Content API.

## Quick Start

### Ghost CMS (backend + theme)

```bash
# Start the Ghost development server (required for the frontend to work)
ghost start

# Stop the server
ghost stop

# Restart
ghost restart
```

The Ghost dev server runs at `http://localhost:2368` using SQLite (`content/data/ghost-local.db`).

### Next.js Frontend

```bash
cd vienbaoton-fe
npm run dev    # Starts at http://localhost:3000
npm run build  # Production build
```

The frontend proxies Ghost images via Next.js rewrites (`/content/images/**` → Ghost). It requires the Ghost CMS to be running.

### Admin Dashboard (CMS)

```bash
cd vienbaoton-cms
npm run dev    # Starts at http://localhost:3001
npm run build  # Production build
```

A read-only dashboard that consumes the same Ghost Content API. Useful for staff who need a quick content overview without logging into Ghost Admin.

## Project Structure

```
├── content/
│   ├── themes/vienbaoton/       # Custom Ghost theme (Handlebars)
│   │   ├── default.hbs           # Base layout
│   │   ├── index.hbs             # Homepage (legacy, frontend now owns the homepage)
│   │   ├── post.hbs              # Single post template
│   │   ├── page.hbs              # Static page template
│   │   ├── custom-timeline.hbs   # Heritage timeline page (legacy)
│   │   ├── partials/
│   │   │   └── custom-navigation.hbs  # Hardcoded multi-level dropdown nav
│   │   └── assets/css/style.css  # Full theme stylesheet (vintage/classical design)
│   ├── data/ghost-local.db       # SQLite database (dev)
│   ├── settings/routes.yaml      # Ghost routing config
│   ├── logs/                     # Server logs
│   └── public/                   # Compiled assets, admin-auth
├── versions/6.24.0/              # Ghost core + node_modules
├── config.development.json       # Dev config (SQLite, port 2368)
├── demo-content.json             # Demo content for seeding
│
├── vienbaoton-fe/                # Next.js 16 frontend (React 19, next-intl)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   ├── components/           # React components
│   │   ├── lib/ghost.ts          # Ghost Content API client + types
│   │   ├── lib/dates.ts          # Date formatting utilities
│   │   ├── i18n/                 # next-intl routing & request config
│   │   └── messages/             # Translation files (vi.json, en.json)
│   ├── public/                   # Static assets
│   ├── next.config.ts            # Rewrites, image remotePatterns
│   └── .env.local                # GHOST_API_URL, GHOST_CONTENT_API_KEY, REVALIDATE_SECRET
│
└── vienbaoton-cms/               # Next.js admin dashboard + AI writing CMS (full CRUD)
    ├── src/
    │   ├── app/                  # Dashboard routes
    │   │   ├── api/
    │   │   │   ├── ai-generate/  # Claude API proxy (15+ AI features)
    │   │   │   ├── posts/        # POST create post
    │   │   │   ├── posts/[id]/   # GET/PUT/DELETE post
    │   │   │   ├── pages/        # POST create page
    │   │   │   ├── pages/[id]/   # GET/PUT/DELETE page
    │   │   │   ├── tags/         # POST create tag
    │   │   │   ├── tags/[id]/    # PUT/DELETE tag
    │   │   │   ├── authors/      # POST create author
    │   │   │   └── authors/[id]/ # PUT/DELETE author
    │   │   ├── posts/
    │   │   │   ├── page.tsx      # List posts
    │   │   │   ├── new/page.tsx  # Create post with AI
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx  # View post detail
    │   │   │       └── edit/page.tsx # Edit post with AI
    │   │   ├── pages/
    │   │   │   ├── page.tsx      # List pages
    │   │   │   ├── new/page.tsx  # Create page with AI
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx  # View page detail
    │   │   │       └── edit/page.tsx # Edit page with AI
    │   │   ├── tags/
    │   │   │   ├── page.tsx      # List tags
    │   │   │   ├── new/page.tsx  # Create tag
    │   │   │   └── [id]/edit/page.tsx # Edit tag
    │   │   ├── authors/
    │   │   │   ├── page.tsx      # List authors
    │   │   │   ├── new/page.tsx  # Create author
    │   │   │   └── [id]/edit/page.tsx # Edit author
    │   │   └── page.tsx          # Dashboard overview
    │   ├── components/
    │   │   ├── layout/           # Sidebar, Header
    │   │   ├── editor/           # PostEditor, AiWritingPanel
    │   │   └── shared/           # ActionButtons (Xem/Sửa/Xóa)
    │   ├── lib/ghost.ts          # Content API client (read-only)
    │   ├── lib/admin-ghost.ts    # Admin API client (full CRUD + JWT)
    │   └── lib/dates.ts          # Date formatting
    ├── next.config.ts            # Image remotePatterns for Ghost
    └── .env.local                # GHOST_API_URL, GHOST_CONTENT_API_KEY, GHOST_ADMIN_API_KEY, ANTHROPIC_API_KEY
```

## Next.js Frontend Architecture

The frontend is a **headless Next.js app** that fetches all content from Ghost at build time and request time (ISR with `revalidate = 300`).

### Content API Integration (`src/lib/ghost.ts`)

- Uses `@tryghost/content-api` to fetch posts, pages, tags, and settings from Ghost.
- **Bilingual content strategy**: Vietnamese is the default; English posts/pages are tagged with `lang-en` in Ghost. The helper `buildLocaleFilter(locale)` appends `+tag:lang-en` to API filters when `locale === "en"`.
- **Image proxying**: `next.config.ts` rewrites `/content/images/**` to the Ghost instance so Next.js `Image` can serve them.
- **Dynamic slugs**: `[slug]/page.tsx` resolves slugs by trying `getPostBySlug` first, then falling back to `getPageBySlug`. It returns `notFound()` if neither exists.
- **Tag pages**: `/tags` lists all public tags; `/tag/[slug]` shows posts filtered by tag.
- **Author pages**: `/author/[slug]` displays author profile and their posts.
- **Webhook revalidation**: `/api/revalidate` receives POST webhooks from Ghost to invalidate ISR cache immediately when content changes. Requires `REVALIDATE_SECRET` in `.env.local`.
- **Special template pages**:
  - `/lich-su-hinh-thanh` — renders `HeritageTimeline` component after the page HTML.
  - `/ngan-hang-hinh-anh` — image bank using Ghost pages tagged `album`; child posts are tagged `album-{slug}`.
  - `/dao-tao-boi-duong` — training courses and registration form.
  - `/tim-kiem` — client-side search across posts and pages by title.

### i18n (`next-intl`)

- Configured in `src/i18n/routing.ts` with `locales: ["vi", "en"]` and `defaultLocale: "vi"`.
- `localePrefix: { mode: "as-needed" }` means Vietnamese URLs have no prefix; English URLs are prefixed with `/en/`.
- All UI text lives in `src/messages/vi.json` and `src/messages/en.json`.
- **Important**: Content-level translation is done via Ghost tags (`lang-en`), not separate post slugs.

### Key Frontend Conventions

- App Router with async Server Components; client interactivity is extracted into `*Client.tsx` components (e.g. `HeroCarouselClient.tsx`).
- `dangerouslySetInnerHTML` is used to render Ghost HTML in post/page bodies.
- The navigation in `src/components/layout/CustomNavigation.tsx` is hardcoded React JSX (mirrors the Ghost theme's hardcoded nav).
- Global styles in `src/app/globals.css` replicate the Ghost theme's warm wood-brown palette (`--bg-page: #FDF9F1`, `--accent-color: #723C21`) and use Playfair Display + Inter fonts.

## Custom Theme Details (Ghost)

The `vienbaoton` theme is **not using Ghost's built-in `{{navigation}}`** — it has a hardcoded multi-level navigation in `partials/custom-navigation.hbs`. Key differences from default Ghost themes:

- Navigation is hand-authored HTML with nested `.dropdown` and `.sub-dropdown` lists
- Menu items point to static pages (e.g., `/gioi-thieu`, `/co-cau-to-chuc`) — these pages must exist in Ghost Admin
- Hero carousel on homepage uses `{{#get "posts"}}` with inline JS
- The heritage timeline on `/lich-su-hinh-thanh` is hardcoded HTML in `custom-timeline.hbs`, not data-driven
- Color scheme uses warm wood-brown tones (`--bg-page: #FDF9F1`, `--accent-color: #723C21`) with Playfair Display + Inter fonts

## Common Tasks

- **Modify Ghost navigation**: Edit `content/themes/vienbaoton/partials/custom-navigation.hbs`
- **Modify frontend navigation**: Edit `vienbaoton-fe/src/components/layout/CustomNavigation.tsx`
- **Update styles (Ghost theme)**: Edit `content/themes/vienbaoton/assets/css/style.css`, then `ghost restart`
- **Update styles (frontend)**: Edit `vienbaoton-fe/src/app/globals.css` (hot-reloaded by Next.js)
- **Add a new Ghost page template**: Create `.hbs` in the theme folder using `{{!< default}}` layout inheritance
- **Add a new frontend route**: Create a folder under `vienbaoton-fe/src/app/`
- **Add a translated string**: Update both `vienbaoton-fe/src/messages/vi.json` and `en.json`
- **Ghost changes require a restart**: `ghost restart` to see theme changes
- **Routes config**: Edit `content/settings/routes.yaml` for custom collections/taxonomies

## Admin Dashboard (`vienbaoton-cms`)

A separate Next.js app running on port **3001** — a CMS dashboard with **AI-powered writing assistant** and **bilingual post creation**. It reuses `lib/ghost.ts` and `lib/dates.ts` from the frontend codebase.

```bash
cd vienbaoton-cms
npm install   # cài @anthropic-ai/sdk + jsonwebtoken
npm run dev   # Starts at http://localhost:3001
```

### CMS Routes

- `/` — Dashboard overview (stats + recent posts)
- `/posts` — List all posts with author, tags, publish date
- `/posts/new` — **AI Post Editor** (viết bài, dịch song ngữ)
- `/pages` — List all pages (including albums)
- `/tags` — List all public tags with post counts
- `/authors` — List all authors with avatar and bio

### AI Writing Assistant (`/posts/new`)

The post editor has a sticky AI panel on the right side with these capabilities:

| Chức năng | Mô tả |
|-----------|-------|
| **Viết bài từ từ khóa** | Nhập chủ đề/từ khóa → AI viết full bài HTML. Hỗ trợ 5 phong cách: Học thuật, Hiện đại, Kể chuyện, Báo chí, Mạng xã hội. |
| **Dịch sang Anh** | Dịch toàn bộ nội dung Việt → Anh, tự động lưu bản dịch để tạo song ngữ. |
| **Viết lại (rephrase)** | Viết lại nội dung theo phong cách khác. |
| **Trích từ khóa SEO** | Trích 5-10 từ khóa từ nội dung. |
| **Gợi ý tiêu đề** | Đề xuất 3-5 tiêu đề hấp dẫn. |

**Workflow đa ngôn ngữ:**
1. Viết bài bằng tiếng Việt (hoặc nhờ AI generate)
2. Dùng AI panel → "Dịch sang Anh" để tạo bản dịch
3. Tick "Tạo song ngữ (EN)" → khi lưu sẽ tạo 2 bài: bài gốc (VI) + bài dịch (có tag `lang-en`)

### Ghost Admin API (`lib/admin-ghost.ts`)

CMS sử dụng Ghost **Admin API** để tạo bài viết (Content API chỉ đọc). Cần cấu hình:

- `GHOST_ADMIN_API_KEY` — lấy từ Ghost Admin → Settings → Integrations → Add custom integration (format: `{id}:{secret}`)
- `ANTHROPIC_API_KEY` — API key từ Anthropic Console

Admin API client tự động tạo JWT token với `HS256` và gửi kèm header `Authorization: Ghost {jwt}`. Hàm `createGhostPost` và `updateGhostPost` được expose từ `lib/admin-ghost.ts`.

All tables link directly to the public frontend (`localhost:3000`) for preview. A topbar link opens the native Ghost Admin at `localhost:2368/ghost` for editing.

## Ghost Admin

Access the admin panel at `http://localhost:2368/ghost` to manage posts, pages, tags, and settings.

## Ghost Core (versioned)

The Ghost core lives in `versions/6.24.0/` and should not be directly modified. It follows standard Ghost conventions — the core has `core/server/`, `core/frontend/`, and `core/shared/` directories. Tests use mocha + supertest.
