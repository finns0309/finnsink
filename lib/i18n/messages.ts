import type { Lang } from "@/lib/content/schemas";

type Messages = {
  siteDescription: string;
  nav: { essays: string; now: string; about: string };
  skipToContent: string;
  home: { lede: string };
  essays: { sectionLabel: string; allEssays: string };
  essay: {
    eyebrow: string;
    adjacent: string;
    newer: string;
    older: string;
    back: string;
    availableIn: string;
  };
  now: { title: string; updated: string; focus: string; workingOn: string; openLoops: string; reading: string };
  about: { currently: string; workingBeliefs: string; forAgentsLink: string };
  forAgents: { humanLink: string };
  notFound: { title: string; body: string; home: string; essays: string };
  footer: { tagline: string };
  switcher: { label: string; langs: { zh: string; en: string; ja: string } };
};

export const messages: Record<Lang, Messages> = {
  zh: {
    siteDescription: "注意力、知识与工具。慢写，中文长文。",
    nav: { essays: "essays", now: "now", about: "about" },
    skipToContent: "跳到正文",
    home: {
      lede: "Notes on attention, knowledge, and tools — written slowly, in Chinese. Long-form essays, published when they are ready.",
    },
    essays: { sectionLabel: "all essays", allEssays: "所有文章" },
    essay: {
      eyebrow: "essay",
      adjacent: "相邻文章",
      newer: "← newer",
      older: "older →",
      back: "← back to essays",
      availableIn: "Also in",
    },
    now: { title: "Now", updated: "updated", focus: "thinking about", workingOn: "working on", openLoops: "open loops", reading: "reading" },
    about: { currently: "currently", workingBeliefs: "working beliefs", forAgentsLink: "if you are not human →" },
    forAgents: { humanLink: "← back to the human side" },
    notFound: {
      title: "这里没有页面。",
      body: "你找的东西要么从未存在，要么已经被搬走，要么只是一个手抖的链接。",
      home: "← 回首页",
      essays: "看 essays",
    },
    footer: { tagline: "finn · written slowly" },
    switcher: { label: "Language", langs: { zh: "中", en: "EN", ja: "日" } },
  },
  en: {
    siteDescription: "Notes on attention, knowledge, and tools — written slowly.",
    nav: { essays: "essays", now: "now", about: "about" },
    skipToContent: "Skip to content",
    home: {
      lede: "Notes on attention, knowledge, and tools — written slowly. Long-form essays, published when they are ready.",
    },
    essays: { sectionLabel: "all essays", allEssays: "All essays" },
    essay: {
      eyebrow: "essay",
      adjacent: "Adjacent essays",
      newer: "← newer",
      older: "older →",
      back: "← back to essays",
      availableIn: "Also in",
    },
    now: { title: "Now", updated: "updated", focus: "thinking about", workingOn: "working on", openLoops: "open loops", reading: "reading" },
    about: { currently: "currently", workingBeliefs: "working beliefs", forAgentsLink: "if you are not human →" },
    forAgents: { humanLink: "← back to the human side" },
    notFound: {
      title: "Nothing lives here.",
      body: "What you're looking for either never existed, has been moved, or is just a slightly off link.",
      home: "← home",
      essays: "see essays",
    },
    footer: { tagline: "finn · written slowly" },
    switcher: { label: "Language", langs: { zh: "中", en: "EN", ja: "日" } },
  },
  ja: {
    siteDescription: "注意・知識・道具についての覚書。ゆっくり書く長文エッセイ。",
    nav: { essays: "essays", now: "now", about: "about" },
    skipToContent: "本文へスキップ",
    home: {
      lede: "注意・知識・道具についての覚書。ゆっくり書かれた長文エッセイ、準備ができ次第公開。",
    },
    essays: { sectionLabel: "all essays", allEssays: "すべてのエッセイ" },
    essay: {
      eyebrow: "essay",
      adjacent: "前後のエッセイ",
      newer: "← 新しい",
      older: "古い →",
      back: "← エッセイ一覧へ",
      availableIn: "他言語版",
    },
    now: { title: "Now", updated: "更新", focus: "考えていること", workingOn: "取り組み中", openLoops: "未決のループ", reading: "読書" },
    about: { currently: "現在", workingBeliefs: "working beliefs", forAgentsLink: "人間ではない場合 →" },
    forAgents: { humanLink: "← 人間向けに戻る" },
    notFound: {
      title: "ここにはページがありません。",
      body: "探しているものは存在しないか、移動されたか、リンクの誤りです。",
      home: "← ホームへ",
      essays: "エッセイを見る",
    },
    footer: { tagline: "finn · written slowly" },
    switcher: { label: "Language", langs: { zh: "中", en: "EN", ja: "日" } },
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
