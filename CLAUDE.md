# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FinnsInk — Finn's personal site (V2): long-form Chinese essays, projects, a /now page, and a JSON mirror for agents. Built with Next.js 16 (App Router, React 19, TypeScript). Content is file-based under `content/`; deploys to Vercel from `main` (other branches → Preview).

V1 (a plain blog) is preserved at git tag `v1`. To roll back: redeploy that tag in Vercel, or `git revert` the V2 merge on `main`.

## Commands

```bash
npm run dev               # next dev --webpack (use: npm run dev -- --hostname 127.0.0.1 -p 3000)
npm run build             # next build --webpack
npm run lint              # eslint .
npm run typecheck         # next typegen + tsc --noEmit
npm run validate:content  # tsx scripts/validate-content.ts — runs the content validator
```

There is no test runner configured. The "tests" for this repo are `lint`, `typecheck`, `validate:content`, and `build`. Run them before committing content or code changes.

`NEXT_PUBLIC_SITE_URL` is read for canonical URLs, `sitemap.xml`, and `robots.txt`.

## Architecture

### Content pipeline (`lib/content/`)

The site is a thin renderer over a single in-memory **content store** built once per process:

- `lib/content/schemas.ts` — Zod schemas for `Post`, `Profile`, `Now`, `Project`. These are the source of truth for content shape; changing a schema is a breaking content change.
- `lib/content/index.ts` — `getContentStore()` reads everything under `content/` synchronously on first call, validates with Zod, and caches it. Read helpers (`getPosts`, `getPostBySlug`, `getProjects`, `getAdjacentPosts`, `searchContent`, …) all go through this store. `reading_time_min` counts CJK characters (~400/min) plus Latin words (~220/min).
- `validateContent()` cross-checks references: `profile.start_here` routes and each project's `related_essays`. `npm run validate:content` runs it.
- `lib/content/render.ts` — markdown → HTML via `marked`, with extensions: `breath` (2+ blank lines → spacer), `sectionBreak` (a line of only `＊`/`✻`/`⁂` → `<hr>`), `figure`, heading anchors, raw HTML escaped.

When adding a content type or field, update the schema, the store in `buildContentStore`, `validateContent` if it carries cross-references, the `/api/*` mirror, `/for-agents`, `llms.txt` (`lib/feeds.ts`), and the sitemap.

### Content directory

- `content/posts/{zh,en}/*.md` — essays. The same `slug` across language directories = translations of one essay. `/essays/<slug>` (zh) and `/en/essays/<slug>`. Frontmatter carries `stance` (seed/working/stable/changed — shown as ✻ "还在想" when not settled) and `person_snapshot` (shown at the end as 写下这篇时).
- `content/profile.{lang}.json` — identity; `summary` is the home hero line, `intro` the first-person home intro, `start_here` the curated "从这几篇读起".
- `content/now.{lang}.json` — the /now page and the home ✻ 近况 note.
- `content/projects.{lang}.json` — the /projects page; only link public repos.

### Routes and views (`app/`, `components/views/`)

Two root layouts: Chinese pages in the `app/(zh)/` route group, English under `app/en/`. Each root layout hardcodes `<html lang>` and renders `components/site-shell.tsx`. This keeps every page statically prerendered — **never read `headers()`/`cookies()` in layouts or pages** (`middleware.ts` handles the root-path language redirect and preference cookie). Each tree has its own `not-found.tsx` and a `[...rest]` catch-all.

Page bodies live once in `components/views/*` and take a `lang` prop; route files are thin wrappers that only declare metadata (`pageAlternates()` for canonical + hreflang). Use `localePath(lang, path)` and `formatDate(value, lang, style)` from `lib/site.ts` — never hardcode `/en` or an English date. UI copy lives in `lib/i18n/messages.ts` (zh pages use Chinese UI; `/for-agents` stays English on both trees).

JSON endpoints live under `app/api/` and mirror the store (`essays.json`, `essays/[slug].json`, `projects.json`, `search.json`, `start.json`, …). `lib/api/response.ts` sets the shared headers and `s-maxage`. The agent-facing endpoint list is hardcoded in `components/views/for-agents.tsx`; keep it in sync.

### Design system (`app/globals.css`)

Claude-inspired and deliberately restrained: ivory `#faf9f5` / warm grey `#262624` (dark, follows the OS), one clay accent (`#c96442` / `#d97757`). Serif (Charter → Songti) for content, system sans for interface; labels in sentence case, never tracked caps. One row anatomy for every list (`.row__*`). The ✻ spark marks only what is alive — the now note, essays still being thought through, active projects, section breaks. No cards, shadows, webfonts, or animation; hairlines are alpha so they work in both themes. Chinese headings go through `<Phrase>` (word segmentation + `<wbr>` with `.keep-words`) so they never break mid-word.

## Conventions

- Path alias `@/*` → repo root (see `tsconfig.json`).
- Content store is cached per process — if you add a script that mutates files and re-reads, call `clearContentStoreCache()`.
- Don't keep the repo inside iCloud-synced directories (`Documents/`, `Desktop/`); macOS dataless files break Next.js dev and Git. The canonical path is `/Users/finn/Code/FinnsBlogs`.
- The site is Chinese-first; keep copy, commit messages for content, and frontmatter values consistent with the existing essays' tone.
- Visual check without new deps: headless system Chrome (+ CDP for dark mode) against `npm run dev`.
