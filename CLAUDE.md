# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FinnsInk — a personal Chinese-language writing site built with Next.js 16 (App Router, React 19, TypeScript). Content is file-based under `content/`; deploys to Vercel from `main` (other branches → Preview).

## Commands

```bash
npm run dev               # next dev --webpack (use: npm run dev -- --hostname 127.0.0.1 -p 3000)
npm run build             # next build --webpack
npm run lint              # eslint .
npm run typecheck         # next typegen + tsc --noEmit
npm run validate:content  # node scripts/validate-content.cjs — runs the content validator
```

There is no test runner configured. The "tests" for this repo are `lint`, `typecheck`, `validate:content`, and `build`. Run them before committing content or code changes.

`NEXT_PUBLIC_SITE_URL` is read for canonical URLs, `sitemap.xml`, and `robots.txt`.

## Architecture

### Content pipeline (`lib/content/`)

The site is a thin renderer over a single in-memory **content store** built once per process:

- `lib/content/schemas.ts` — Zod schemas for `Post`, `Profile`, `Now`, `Topic`, `Project`, `Edge`. These are the source of truth for content shape; changing a schema is a breaking content change.
- `lib/content/index.ts` — `getContentStore()` reads everything under `content/` synchronously on first call, validates with Zod, and caches in `cachedStore`. It also pre-builds derived indexes: `postsBySlug`, `postsByTopic`, `relatedPostsBySlug`, `representativePostsByTopicSlug`, etc. All read helpers (`getPosts`, `getPostBySlug`, `getRelatedPosts`, `searchContent`, `getPostBacklinks`, …) go through this store.
- `validateContent()` cross-checks that every referenced topic/post/project/route slug actually exists, and `start_here` routes resolve against `STATIC_ROUTES` plus generated `/essays|/topics|/projects/<slug>` paths. The CLI script `scripts/validate-content.cjs` is what `npm run validate:content` invokes.
- `lib/content/render.ts` handles markdown → HTML rendering (via `marked`) for post bodies.

When adding a new content type or field, update **both** the schema and the derived indexes in `buildContentStore`, plus `validateContent` if the field carries cross-references.

### Content directory

- `content/posts/*.md` — essays with frontmatter (see README for required fields). `slug` determines the URL `/essays/<slug>`. `published_at`/`updated_at` are normalized from YAML `Date` to `YYYY-MM-DD` strings before Zod parsing.
- `content/profile.json`, `content/now.json`, `content/edges.json` — singletons.
- `content/topics/` and `content/projects/` are supported by the schemas/loader but optional; `readDirectory` no-ops when a directory is missing. Posts may reference topic slugs that don't yet have a topic file — `validateContent` will flag this as an error.

### Routes (`app/`)

App Router. Page routes under `app/{about,now,essays,for-agents,…}` consume the content helpers directly (server components). JSON/HTTP endpoints live under `app/api/` and mirror the content store (`posts.json`, `topics.json`, `graph.json`, `backlinks/`, `search.json`, `cmd/`, …) — they are how the "for agents" surface is exposed. `lib/api/response.ts` is the shared JSON response helper.

### Terminal subsystem (`lib/terminal/`)

A small parse → execute → render pipeline (`runTerminalCommand` in `lib/terminal/index.ts`) powers the `/api/cmd` endpoint and the on-page terminal UI. Add new commands by extending `execute.ts` and the corresponding renderer in `render.ts`; types live in `types.ts`.

## Conventions

- Path alias `@/*` → repo root (see `tsconfig.json`).
- Content store is cached per process — if you add a script that mutates files and re-reads, call `clearContentStoreCache()`.
- Don't keep the repo inside iCloud-synced directories (`Documents/`, `Desktop/`); macOS dataless files break Next.js dev and Git. The canonical path is `/Users/finn/Code/FinnsBlogs`.
- The site is Chinese-language; keep copy, commit messages for content, and frontmatter values consistent with the existing essays' tone.
