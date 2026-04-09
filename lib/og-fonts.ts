/**
 * Fetch a TTF subset of a Google Font containing exactly the characters
 * we need. Sends an empty User-Agent — empirically the only way to make
 * the Google Fonts CSS API consistently serve TTF (instead of WOFF2 for
 * modern browsers, or EOT for IE6 UAs). satori, the renderer behind
 * next/og, only handles TTF/OTF.
 *
 * Used by both /essays/[slug]/opengraph-image and /apple-icon.
 */
export async function loadGoogleFont({
  family,
  weight,
  italic = false,
  text,
}: {
  family: string;
  weight: number;
  italic?: boolean;
  text: string;
}): Promise<ArrayBuffer> {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:${axis}&text=${encodeURIComponent(text)}`;

  const css = await fetch(url, {
    headers: {
      // Empty UA is the only one that reliably returns truetype across
      // every family/weight/style combo.
      "User-Agent": "",
    },
  }).then((res) => res.text());

  const match = css.match(
    /src:\s*url\(([^)]+)\)\s*format\(['"](truetype|opentype)['"]\)/,
  );
  if (!match) {
    throw new Error(
      `Could not extract TTF URL from Google Fonts CSS for ${family} (weight ${weight}${italic ? " italic" : ""})`,
    );
  }

  const fontResponse = await fetch(match[1]);
  if (!fontResponse.ok) {
    throw new Error(`Failed to download font ${family}: ${fontResponse.status}`);
  }

  return await fontResponse.arrayBuffer();
}
