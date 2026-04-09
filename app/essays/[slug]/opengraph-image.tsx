import { ImageResponse } from "next/og";

import { getPostBySlug, getPosts } from "@/lib/content";
import { loadGoogleFont } from "@/lib/og-fonts";
import { formatLongDate, siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Finn — essay";

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

type ImageProps = {
  params: { slug: string };
};

export default async function Image({ params }: ImageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return new ImageResponse(<div style={{ background: "#faf7f0" }} />, size);
  }

  // Build the exact glyph set we need so the subset stays tiny.
  const titleChars = post.title;
  const subtitleChars = post.thesis ?? post.summary ?? "";
  const allText =
    titleChars +
    subtitleChars +
    "FINN finns ink essay " +
    formatLongDate(post.published_at);

  const [serif, serifBold] = await Promise.all([
    loadGoogleFont({ family: "Noto Serif SC", weight: 400, text: allText }),
    loadGoogleFont({ family: "Noto Serif SC", weight: 600, text: titleChars }),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#faf7f0",
          padding: "80px 96px",
          fontFamily: "'Noto Serif SC'",
          color: "#2a2622",
          position: "relative",
        }}
      >
        {/* top wordmark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 22,
            letterSpacing: 6,
            color: "#8a8278",
            textTransform: "uppercase",
          }}
        >
          <span>FINN</span>
          <span style={{ fontStyle: "italic", letterSpacing: 1 }}>
            finns.ink
          </span>
        </div>

        {/* hairline */}
        <div
          style={{
            marginTop: 56,
            width: 60,
            height: 2,
            background: "#e6dfce",
          }}
        />

        {/* title */}
        <div
          style={{
            marginTop: 36,
            fontSize: 76,
            lineHeight: 1.18,
            fontWeight: 600,
            letterSpacing: -1,
            color: "#2a2622",
            display: "flex",
            // satori needs explicit width for text wrap to work nicely
            maxWidth: 1000,
          }}
        >
          {post.title}
        </div>

        {/* thesis / summary — italic, muted, smaller */}
        {subtitleChars ? (
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              lineHeight: 1.55,
              fontStyle: "italic",
              color: "#4a443c",
              maxWidth: 980,
              display: "flex",
            }}
          >
            {subtitleChars.length > 110
              ? `${subtitleChars.slice(0, 108)}…`
              : subtitleChars}
          </div>
        ) : null}

        {/* spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* footer line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 20,
            color: "#8a8278",
            letterSpacing: 1,
          }}
        >
          <span style={{ fontStyle: "italic" }}>
            {formatLongDate(post.published_at)}
          </span>
          <span style={{ fontStyle: "italic" }}>{siteConfig.name}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Serif SC",
          data: serif,
          style: "normal",
          weight: 400,
        },
        {
          name: "Noto Serif SC",
          data: serifBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
