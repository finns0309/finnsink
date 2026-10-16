# Roadmap

滚动更新的工作计划。已完成项保留一段时间后归档或删除。

---

## 进行中

### V2：从博客到个人站（2026-10，分支 `v2`）

**状态：** 已在 `v2` 分支实现，待预览后合并到 `main`。V1 保留在标签 `v1`。

- 首页从文章列表改成「名片」：一句话、自我介绍、✻ 近况、最近写的、从这几篇读起、做过的东西、找到我
- 新增 `/projects`（`content/projects.{lang}.json` + `/api/projects.json`）
- 文章页显示阅读时长、`stance`（✻ 还在想）与 `person_snapshot`（写下这篇时）
- `/essays` 改成按年分组的紧凑索引
- Claude 风格的视觉：象牙 + 陶土、内容衬线 / 界面无衬线、句首大写；中文界面文案、中文日期
- 修复：阅读时长对中文的估算、OG 分享图空白（Next 16 的 params 是 Promise）、`＊` 分节符、llms.txt 的双斜杠与失效的 Topics

**合并前待定：** 项目列表与文案（只链接了公开仓库）、`now.*.json` 内容已过期（2026-04-09）。

### i18n（中英）

**状态：** 中英两语已上线（2026-07）。日文暂缓。

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
