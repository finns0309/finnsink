# FinnsInk

一个基于 Next.js 的个人写作站点。内容源主要放在 `content/` 目录，部署目标是 Vercel。

## 内容结构

- `content/posts/*.md`: 文章正文与 frontmatter
- `content/profile.json`: About 页内容
- `content/now.json`: Now 页内容
- `content/edges.json`: 内容关系图，当前可为空数组

## 文章格式

每篇文章放在 `content/posts/` 下，文件名可以自定，但 `slug` 决定最终链接。

必填 frontmatter 字段：

```md
---
title: 文章标题
slug: unique-slug
summary: 一句话摘要
thesis: 核心论点
published_at: 2026-04-09
updated_at: 2026-04-09
topics: []
stance: stable
person_snapshot:
  - 一句话自我快照
---
```

最终页面链接会是 `/essays/<slug>`。

## 本地开发

建议把仓库放在非 iCloud 同步目录，例如 `/Users/finn/Code/FinnsBlogs`。如果继续直接在 `Documents/` 里开发，macOS 的按需下载可能会把源码文件标记成 `dataless`，进而导致 Git、Next.js、甚至普通文件读取都变慢或卡住。

安装依赖：

```bash
npm ci
```

启动开发环境：

```bash
npm run dev -- --hostname 127.0.0.1 -p 3000
```

如果你本机开了代理，依赖安装明显卡住时，可以临时关掉当前命令的代理：

```bash
env -u HTTP_PROXY -u HTTPS_PROXY npm ci
```

常用检查：

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run build
```

## 更新网站

如果你已经把项目连到 Vercel，并且 Vercel 跟踪的是 `main` 分支，那么更新流程就是：

1. 修改内容文件
2. 本地检查
3. 提交并 push 到 GitHub
4. 等 Vercel 自动部署

最常用的内容更新场景：

### 1. 发布新文章

1. 在 `content/posts/` 新建一个 `.md` 文件
2. 填好 frontmatter 和正文
3. 运行：

```bash
npm run validate:content
npm run build
```

4. 提交并推送：

```bash
git add .
git commit -m "Publish new essay"
git push
```

### 2. 更新 About / Now

- 改 About：编辑 `content/profile.json`
- 改 Now：编辑 `content/now.json`

然后同样执行：

```bash
git add .
git commit -m "Update profile and now"
git push
```

### 3. 小改文章内容

直接编辑对应的 `content/posts/*.md`，建议至少同步更新 `updated_at`。

## Vercel 设置

建议在 Vercel 项目里设置：

```bash
NEXT_PUBLIC_SITE_URL=https://你的域名
```

这个变量会用于：

- canonical / metadata
- `sitemap.xml`
- `robots.txt`

如果改了这个环境变量，记得重新触发一次生产部署。

## 部署规则

- 推到 `main`: 生产部署
- 推到其他分支: Preview 部署

如果你只想改内容，不想碰代码，最安全的原则就是：只改 `content/`。
