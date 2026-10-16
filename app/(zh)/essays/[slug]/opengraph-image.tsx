import { ImageResponse } from "next/og";

import { getPostBySlug, getPosts } from "@/lib/content";
import { loadGoogleFont } from "@/lib/og-fonts";
import { formatDate } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Finn — essay";

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

type ImageProps = {
  // A Promise since Next 15 — reading .slug synchronously yields undefined,
  // which silently rendered every share card blank in V1.
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(<div style={{ background: "#faf9f5" }} />, size);
  }

  // Build the exact glyph set we need so the subset stays tiny.
  const titleChars = post.title;
  const subtitleChars = post.thesis ?? post.summary ?? "";
  const allText =
    titleChars +
    subtitleChars +
    "finns.ink " +
    formatDate(post.published_at, "zh");

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
          background: "#faf9f5",
          padding: "80px 96px",
          fontFamily: "'Noto Serif SC'",
          color: "#1f1e1d",
          position: "relative",
        }}
      >
        {/* top wordmark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 24,
            color: "#73726c",
          }}
        >
          <span>finn</span>
        </div>

        {/* hairline */}
        <div
          style={{
            marginTop: 56,
            width: 56,
            height: 2,
            background: "#c96442",
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
            color: "#1f1e1d",
            display: "flex",
            // satori needs explicit width for text wrap to work nicely
            maxWidth: 1000,
          }}
        >
          {post.title}
        </div>

        {/* thesis / summary — muted, smaller */}
        {subtitleChars ? (
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              lineHeight: 1.55,
              color: "#3d3d3a",
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
            fontSize: 22,
            color: "#73726c",
          }}
        >
          <span>{formatDate(post.published_at, "zh")}</span>
          <span>finns.ink</span>
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
