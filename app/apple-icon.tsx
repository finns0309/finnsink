import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadGoogleFont({
    family: "Source Serif 4",
    weight: 500,
    italic: true,
    text: "f",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf7f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Source Serif 4'",
          fontSize: 140,
          fontStyle: "italic",
          fontWeight: 500,
          color: "#2a2622",
          /* italic f sits a touch low — nudge it up so it reads centered */
          paddingBottom: 14,
        }}
      >
        f
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Source Serif 4",
          data: font,
          style: "italic",
          weight: 500,
        },
      ],
    },
  );
}
