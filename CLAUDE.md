# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A **Ghost CMS 6.24.0** instance for the "Viện Bảo tồn Di tích" (Heritage Conservation Institute) website — a Vietnamese government institute responsible for conservation of architectural heritage. This is a standard Ghost deployment managed via Ghost CLI, with a custom theme.

## Quick Start

```bash
# Start the development server
ghost start

# Stop the server
ghost stop

# Restart
ghost restart
```

The dev server runs at `http://localhost:2368` using SQLite (`content/data/ghost-local.db`).

## Project Structure

```
├── content/
│   ├── themes/vienbaoton/       # Custom theme (Handlebars)
│   │   ├── default.hbs           # Base layout (header, footer, ghost_head/foot)
│   │   ├── index.hbs             # Homepage (hero carousel, news, research, events)
│   │   ├── post.hbs              # Single post template + related posts
│   │   ├── page.hbs              # Static page template
│   │   ├── custom-timeline.hbs   # Heritage timeline page
│   │   ├── partials/
│   │   │   └── custom-navigation.hbs  # Multi-level dropdown nav (hardcoded, not Ghost's {{navigation}})
│   │   └── assets/css/style.css  # Full theme stylesheet (vintage/classical design)
│   ├── data/ghost-local.db       # SQLite database (dev)
│   ├── settings/routes.yaml      # Ghost routing config
│   ├── logs/                     # Server logs
│   └── public/                   # Compiled assets, admin-auth
├── versions/6.24.0/              # Ghost core + node_modules
├── config.development.json       # Dev config (SQLite, port 2368)
├── demo-content.json             # Demo content for seeding
└── .ghost-cli                    # Ghost CLI config (active-version: 6.24.0)
```

## Custom Theme Details

The `vienbaoton` theme is **not using Ghost's built-in `{{navigation}}`** — it has a hardcoded multi-level navigation in `partials/custom-navigation.hbs`. Key differences from default Ghost themes:

- Navigation is hand-authored HTML with nested `.dropdown` and `.sub-dropdown` lists
- Menu items point to static pages (e.g., `/gioi-thieu`, `/co-cau-to-chuc`) — these pages must exist in Ghost Admin
- Hero carousel on homepage uses `{{#get "posts"}}` with inline JS
- The heritage timeline on `/lich-su-hinh-thanh` is hardcoded HTML in `custom-timeline.hbs`, not data-driven
- Color scheme uses warm wood-brown tones (`--bg-page: #FDF9F1`, `--accent-color: #723C21`) with Playfair Display + Inter fonts

## Common Tasks

- **Modify navigation**: Edit `content/themes/vienbaoton/partials/custom-navigation.hbs`
- **Update styles**: Edit `content/themes/vienbaoton/assets/css/style.css`
- **Add a new page template**: Create `.hbs` in the theme folder using `{{!< default}}` layout inheritance
- **Theme changes require a restart**: `ghost restart` to see changes
- **Routes config**: Edit `content/settings/routes.yaml` for custom collections/taxonomies

## Ghost Admin

Access the admin panel at `http://localhost:2368/ghost` to manage posts, pages, tags, and settings.

## Ghost Core (versioned)

The Ghost core lives in `versions/6.24.0/` and should not be directly modified. It follows standard Ghost conventions — the core has `core/server/`, `core/frontend/`, and `core/shared/` directories. Tests use mocha + supertest.
