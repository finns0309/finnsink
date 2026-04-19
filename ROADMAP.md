# Roadmap

滚动更新的工作计划。已完成项保留一段时间后归档或删除。

---

## 进行中

### i18n（中英日三语）

**状态：** 方案已敲定 2026-04-19，未开工。

**核心决策：**
- URL：中文无前缀 (`/essays/foo`)；其他语言加前缀 (`/en/essays/foo`, `/ja/essays/foo`)
- 内容：`content/posts/{zh,en,ja}/<slug>.md`，slug 跨语言共享；同一 slug 出现在哪几个目录 = 该文在哪几种语言存在
- 翻译：完全本地 AI 翻译，commit 静态 .md；站点运行时不含任何 AI 调用
- 语言切换器：文章页只显示该文实际存在的语言；首页等列表页显示全部
- 自动跟随 `Accept-Language` 重定向（受众多为非中文母语），用 `preferred_lang` cookie 记录手动选择避免循环

**首轮只做中英**，挑 2 篇测试：
- `every-naming-a-funeral`
- `when-language-boundary-moves`

**PR 切分：**

- [x] **PR 1 — 基础架构 + 内容迁移**
  - `Post` schema 加 `lang` 必填字段
  - `postsByLang` / `postsBySlugAndLang` 索引；旧 `postsBySlug` 保留为 zh alias
  - `content/posts/*.md` → `content/posts/zh/*.md`
  - 路由：`app/[lang]/...` + middleware 把 `/essays/*` 重写到 `/zh/essays/*`
  - 验证：现有中文 URL 不变、功能不变。**不引入任何英文内容**。

- [x] **PR 2 — 英文支持 + 切换器**
  - `content/posts/en/` 放 2 篇翻译
  - `profile.en.json` / `now.en.json`
  - `lib/i18n/messages/{zh,en}.ts` UI 文案
  - Header 语言切换器（按页面类型决定显示几种）
  - 文章页底部 "Available in" 指示器
  - Middleware 的 Accept-Language 重定向 + cookie

- [x] **PR 3 — SEO + agents API**
  - `<html lang>` 每页动态，essay 页 `<link rel="alternate" hreflang>` 列出所有语言版本
  - `sitemap.xml` 含 `xhtml:link` 语言 alternates
  - RSS 分 feed：`/rss.xml`（zh）、`/en/rss.xml`
  - `llms.txt` 分 feed：`/llms.txt`（zh）、`/en/llms.txt`
  - 所有 `/api/*` 端点接受 `?lang=zh|en`；essay 响应带 `available_langs` 数组
  - `for-agents` 页面描述 `?lang=` 用法

---

## 待办（未排期）

- **移动端左右留白不均**：Chinese glyph side-bearing + 全角标点导致的视觉不对称。不影响阅读，仅截图时观感问题。可能方案：`hanging-punctuation: force-end` 或 `text-spacing-trim`（Safari/Chrome 支持度需确认）。
- **日文支持**：英文版上线观察 1-2 周后，视数据决定是否开做；流程复用中英版。切换器里的 "日" 已隐藏；重启时把 `components/site-header.tsx` 的 `langs` 数组加回 `"ja"` 即可。
- **英文 OG 分享图**：`/en/essays/*` 目前 fallback 到站点默认图；需要拉丁衬线版 OG renderer。
- **两篇英文占位文案替换**：`every-naming-a-funeral` / `when-language-boundary-moves` 的英文版目前是 `[EN draft]` 开头的占位文，等本地 AI 翻译结果 commit 覆盖。
- **`profile.en.json` / `now.en.json`**：`[EN draft]` 开头的占位内容，同上。

---

## 已完成

- **2026-04-19** 暗色模式（跟随 OS，保留暖调）
- **2026-04-19** 文章段间距修复（CSS 特异性 bug：`.article-body p { margin: 0 }` 压过 `.article-body > * + *`）
