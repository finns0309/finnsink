import { marked, type Tokens } from "marked";

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

let configured = false;

function configureMarked() {
  if (configured) return;
  configured = true;

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
    },
  });
}

export function renderMarkdown(markdown: string): string {
  configureMarked();
  return marked.parse(pangu(markdown)) as string;
}
