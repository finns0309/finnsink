import { marked, type Tokens, type TokenizerAndRendererExtension } from "marked";

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
  // Split on fenced code blocks; only transform the prose pieces.
  const parts = input.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => {
      if (part.startsWith("```")) return part;
      // Skip inline code spans within prose pieces too.
      const subparts = part.split(/(`[^`]*`)/g);
      return subparts
        .map((sub) => {
          if (sub.startsWith("`")) return sub;
          return sub
            .replace(/([\u4e00-\u9fff])([A-Za-z0-9])/g, "$1\u2009$2")
            .replace(/([A-Za-z0-9])([\u4e00-\u9fff])/g, "$1\u2009$2");
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

let configured = false;

function configureMarked() {
  if (configured) return;
  configured = true;

  marked.use({ extensions: [breathExtension] });

  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        // Strip any tags from the inner HTML to derive a clean id.
        const plain = inner.replace(/<[^>]+>/g, "");
        const id = encodeURIComponent(slugifyHeading(plain));
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

export function renderMarkdown(markdown: string): string {
  configureMarked();
  return marked.parse(pangu(markdown)) as string;
}
