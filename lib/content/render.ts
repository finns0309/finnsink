import { marked, type Tokens, type TokenizerAndRendererExtension } from "marked";

export type Heading = { depth: number; text: string; id: string };

export type RenderResult = {
  html: string;
  headings: Heading[];
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 盘古之白 — insert a thin space (U+2009) between CJK and Latin/digit
 * boundaries. Applied to the markdown source before parsing, so HTML
 * tags and code blocks are never touched.
 *
 * Skipped inside fenced code blocks and inline code spans.
 */
function pangu(input: string): string {
  const parts = input.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => {
      if (part.startsWith("```")) return part;
      const subparts = part.split(/(`[^`]*`)/g);
      return subparts
        .map((sub) => {
          if (sub.startsWith("`")) return sub;
          return sub
            .replace(/([一-鿿])([A-Za-z0-9])/g, "$1 $2")
            .replace(/([A-Za-z0-9])([一-鿿])/g, "$1 $2");
        })
        .join("");
    })
    .join("");
}

function slugifyHeading(plainText: string): string {
  return plainText
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[#?&/\\]+/g, "");
}

/**
 * Markdown normally collapses any number of blank lines into one paragraph
 * break. This extension detects runs of 2+ blank lines between paragraphs
 * and emits a <div class="breath"></div> spacer so the author can control
 * visual rhythm by adding blank lines in the source.
 */
const breathExtension: TokenizerAndRendererExtension = {
  name: "breath",
  level: "block",
  start(src: string) {
    return src.match(/\n{3,}/)?.index;
  },
  tokenizer(src: string) {
    const match = src.match(/^(\n{3,})/);
    if (match) {
      return {
        type: "breath",
        raw: match[0],
      };
    }
  },
  renderer() {
    return '<div class="breath"></div>\n';
  },
};

/**
 * Block-level figure. Matches a line that contains only a markdown image,
 * optionally with a title — `![alt](src "caption")`. The title becomes the
 * figcaption; without a title we still emit a <figure> for consistent styling.
 *
 * Inline images (within a paragraph) are not affected; they keep marked's
 * default <img> rendering.
 */
type FigureToken = {
  type: "figure";
  raw: string;
  alt: string;
  src: string;
  caption: string;
};

const figureExtension: TokenizerAndRendererExtension = {
  name: "figure",
  level: "block",
  start(src: string) {
    return src.match(/^!\[/)?.index;
  },
  tokenizer(src: string) {
    const match = src.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)[ \t]*(?:\n|$)/);
    if (match) {
      return {
        type: "figure",
        raw: match[0],
        alt: match[1] ?? "",
        src: match[2] ?? "",
        caption: match[3] ?? "",
      } satisfies FigureToken;
    }
  },
  renderer(token) {
    const t = token as unknown as FigureToken;
    const alt = escapeHtml(t.alt);
    const src = escapeHtml(t.src);
    const caption = t.caption
      ? `<figcaption>${escapeHtml(t.caption)}</figcaption>`
      : "";
    return `<figure><img src="${src}" alt="${alt}" loading="lazy" />${caption}</figure>\n`;
  },
};

let configured = false;
let collectedHeadings: Heading[] = [];

function configureMarked() {
  if (configured) return;
  configured = true;

  marked.use({ extensions: [breathExtension, figureExtension] });

  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        const plain = inner.replace(/<[^>]+>/g, "");
        const id = encodeURIComponent(slugifyHeading(plain));
        collectedHeadings.push({ depth: token.depth, text: plain, id });
        return (
          `<h${token.depth} id="${id}">` +
          `<a class="heading-anchor" href="#${id}" aria-label="link to section">#</a>` +
          inner +
          `</h${token.depth}>`
        );
      },
      // Disallow raw HTML pass-through. Anything that looks like an HTML
      // tag in the markdown source is rendered as escaped text instead of
      // injected into the DOM. Removes the entire <script>/onerror surface
      // even if a future content source is less trusted than the author.
      html(token: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(token.raw);
      },
    },
  });
}

export function renderMarkdown(markdown: string): RenderResult {
  configureMarked();
  // Reset per-call so concurrent SSR doesn't cross-pollute. marked.parse is
  // synchronous — Node's event loop guarantees no interleaving inside a call.
  collectedHeadings = [];
  const html = marked.parse(pangu(markdown)) as string;
  return { html, headings: [...collectedHeadings] };
}
