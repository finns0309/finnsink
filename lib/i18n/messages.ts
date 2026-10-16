import type { Lang, ProjectStatus, Stance } from "@/lib/content/schemas";

type Messages = {
  siteDescription: string;
  nav: { writing: string; projects: string; now: string; about: string };
  skipToContent: string;
  home: {
    now: string;
    nowMore: string;
    recent: string;
    allWriting: (count: number) => string;
    startHere: string;
    projects: string;
    allProjects: string;
    elsewhere: string;
  };
  writing: {
    title: string;
    lede: (count: number, since: string) => string;
    thinking: string;
  };
  essay: {
    adjacent: string;
    newer: string;
    older: string;
    back: string;
    availableIn: string;
    contents: string;
    readingTime: (minutes: number) => string;
    revised: string;
    snapshot: string;
    stance: Record<Stance, string>;
  };
  projects: {
    title: string;
    lede: string;
    status: Record<ProjectStatus, string>;
    related: (title: string) => string;
  };
  now: {
    title: string;
    updated: string;
    focus: string;
    workingOn: string;
    openLoops: string;
    reading: string;
  };
  about: {
    currently: string;
    beliefs: string;
    links: string;
    colophon: string;
    colophonBody: string;
    source: string;
    forAgentsLink: string;
  };
  forAgents: { humanLink: string };
  notFound: { title: string; body: string; home: string; essays: string };
  footer: { tagline: string; source: string };
  switcher: { label: string; langs: { zh: string; en: string; ja: string } };
};

export const messages: Record<Lang, Messages> = {
  zh: {
    siteDescription: "Finn 的个人站：中文长文、几件小工具，和最近在想的事。",
    nav: { writing: "写作", projects: "项目", now: "近况", about: "关于" },
    skipToContent: "跳到正文",
    home: {
      now: "近况",
      nowMore: "更多近况",
      recent: "最近写的",
      allWriting: (count) => `全部 ${count} 篇`,
      startHere: "第一次来，可以从这几篇读起",
      projects: "做过的东西",
      allProjects: "全部项目",
      elsewhere: "找到我",
    },
    writing: {
      title: "写作",
      lede: (count, since) => `长文，慢慢写。目前 ${count} 篇，最早一篇写于 ${since}。`,
      thinking: "标着 ✻ 的几篇，我还在想，之后可能会改。",
    },
    essay: {
      adjacent: "相邻文章",
      newer: "← 较新",
      older: "较早 →",
      back: "← 所有文章",
      availableIn: "另有",
      contents: "目录",
      readingTime: (minutes) => `约 ${minutes} 分钟`,
      revised: "修订于",
      snapshot: "写下这篇时",
      stance: { seed: "刚起头", working: "还在想", stable: "定稿", changed: "想法变了" },
    },
    projects: {
      title: "项目",
      lede: "写东西之外，我也做一些小工具。大多先是给自己用的，用顺手了才放出来。",
      status: { active: "在做", stable: "可用", prototype: "原型", archived: "归档" },
      related: (title) => `相关文章《${title}》`,
    },
    now: {
      title: "近况",
      updated: "更新于",
      focus: "在想",
      workingOn: "在做",
      openLoops: "悬而未决",
      reading: "在读",
    },
    about: {
      currently: "现在",
      beliefs: "我相信的几件事",
      links: "找到我",
      colophon: "关于这个站",
      colophonBody:
        "内容就是仓库里的 Markdown 和 JSON 文件，用 Next.js 渲染，部署在 Vercel。排版只用你设备上已有的字体，不额外下载 webfont。每一页都有一份给 agent 读的 JSON。2026 年 4 月上线时它是个博客，V2 改成了现在这样的个人站。",
      source: "源码",
      forAgentsLink: "如果你不是人类 →",
    },
    forAgents: { humanLink: "← back to the human side" },
    notFound: {
      title: "这里没有页面。",
      body: "你找的东西要么从未存在，要么已经被搬走，要么只是一个手抖的链接。",
      home: "← 回首页",
      essays: "看看写作",
    },
    footer: { tagline: "Finn · 慢慢写", source: "源码" },
    switcher: { label: "语言", langs: { zh: "中", en: "EN", ja: "日" } },
  },
  en: {
    siteDescription: "Finn's personal site: long-form essays, small tools, and what's happening now.",
    nav: { writing: "Writing", projects: "Projects", now: "Now", about: "About" },
    skipToContent: "Skip to content",
    home: {
      now: "Now",
      nowMore: "More",
      recent: "Recent writing",
      allWriting: (count) => `All ${count}`,
      startHere: "New here? Start with these",
      projects: "Things I've made",
      allProjects: "All projects",
      elsewhere: "Elsewhere",
    },
    writing: {
      title: "Writing",
      lede: (count, since) =>
        `Long essays, written slowly. ${count} in English so far, the first from ${since}. More are in Chinese.`,
      thinking: "Pieces marked ✻ are still being thought through and may change.",
    },
    essay: {
      adjacent: "Adjacent essays",
      newer: "← Newer",
      older: "Older →",
      back: "← All writing",
      availableIn: "Also in",
      contents: "Contents",
      readingTime: (minutes) => `${minutes} min read`,
      revised: "Revised",
      snapshot: "When I wrote this",
      stance: { seed: "Seedling", working: "Still thinking", stable: "Settled", changed: "Changed my mind" },
    },
    projects: {
      title: "Projects",
      lede: "Besides writing, I build small tools — most of them for myself first, released once they feel right.",
      status: { active: "Active", stable: "Stable", prototype: "Prototype", archived: "Archived" },
      related: (title) => `Related: ${title}`,
    },
    now: {
      title: "Now",
      updated: "Updated",
      focus: "Thinking about",
      workingOn: "Working on",
      openLoops: "Open loops",
      reading: "Reading",
    },
    about: {
      currently: "Currently",
      beliefs: "Working beliefs",
      links: "Elsewhere",
      colophon: "About this site",
      colophonBody:
        "The content is plain Markdown and JSON in the repository, rendered with Next.js and deployed on Vercel. Type is set in whatever fonts your device already has — no webfonts. Every page has a JSON twin for agents. It launched as a blog in April 2026; V2 turned it into this personal site.",
      source: "Source",
      forAgentsLink: "If you are not human →",
    },
    forAgents: { humanLink: "← back to the human side" },
    notFound: {
      title: "Nothing lives here.",
      body: "What you're looking for either never existed, has been moved, or is just a slightly off link.",
      home: "← Home",
      essays: "See the writing",
    },
    footer: { tagline: "Finn · written slowly", source: "Source" },
    switcher: { label: "Language", langs: { zh: "中", en: "EN", ja: "日" } },
  },
  ja: {
    siteDescription: "Finn の個人サイト：長文エッセイ、小さな道具、そして近況。",
    nav: { writing: "文章", projects: "プロジェクト", now: "近況", about: "About" },
    skipToContent: "本文へスキップ",
    home: {
      now: "近況",
      nowMore: "もっと見る",
      recent: "最近の文章",
      allWriting: (count) => `全 ${count} 本`,
      startHere: "はじめての方はこちらから",
      projects: "作ったもの",
      allProjects: "すべてのプロジェクト",
      elsewhere: "連絡先",
    },
    writing: {
      title: "文章",
      lede: (count, since) => `ゆっくり書く長文。${count} 本、最初の一本は ${since}。`,
      thinking: "✻ の付いたものは、まだ考え中です。",
    },
    essay: {
      adjacent: "前後のエッセイ",
      newer: "← 新しい",
      older: "古い →",
      back: "← 文章一覧へ",
      availableIn: "他言語版",
      contents: "目次",
      readingTime: (minutes) => `約 ${minutes} 分`,
      revised: "改訂",
      snapshot: "これを書いたとき",
      stance: { seed: "書きはじめ", working: "考え中", stable: "完成", changed: "考えが変わった" },
    },
    projects: {
      title: "プロジェクト",
      lede: "書くこと以外に、小さな道具も作っています。",
      status: { active: "進行中", stable: "安定", prototype: "試作", archived: "アーカイブ" },
      related: (title) => `関連：${title}`,
    },
    now: {
      title: "近況",
      updated: "更新",
      focus: "考えていること",
      workingOn: "取り組み中",
      openLoops: "未決のループ",
      reading: "読書",
    },
    about: {
      currently: "現在",
      beliefs: "信じていること",
      links: "連絡先",
      colophon: "このサイトについて",
      colophonBody: "コンテンツはリポジトリ内の Markdown と JSON です。Next.js で描画し、Vercel にデプロイしています。",
      source: "ソース",
      forAgentsLink: "人間ではない場合 →",
    },
    forAgents: { humanLink: "← 人間向けに戻る" },
    notFound: {
      title: "ここにはページがありません。",
      body: "探しているものは存在しないか、移動されたか、リンクの誤りです。",
      home: "← ホームへ",
      essays: "文章を見る",
    },
    footer: { tagline: "Finn · ゆっくり書く", source: "ソース" },
    switcher: { label: "言語", langs: { zh: "中", en: "EN", ja: "日" } },
  },
};

export function getMessages(lang: Lang): Messages {
  return messages[lang];
}

export const LOCALE_TAG: Record<Lang, string> = {
  zh: "zh-CN",
  en: "en",
  ja: "ja",
};

export const OG_LOCALE: Record<Lang, string> = {
  zh: "zh_CN",
  en: "en_US",
  ja: "ja_JP",
};
