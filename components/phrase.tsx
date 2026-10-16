import { Fragment } from "react";

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });
const CJK = /[㐀-鿿豈-﫿]/;
const PUNCTUATION = /^[\p{P}\s]+$/u;
const OPENING = /^[（《「『“‘([{【〔]+$/u;
const CLAUSE_END = /[，、；：。！？,;:!?]$/u;
// Single-character particles belong to the word before them (写着, 想明白的).
const PARTICLE = /^[着了过的地得们]$/u;

function segmentWords(text: string): string[] {
  const words: string[] = [];
  let carry = "";
  for (const { segment } of segmenter.segment(text)) {
    if (OPENING.test(segment)) {
      carry += segment;
    } else if ((PUNCTUATION.test(segment) || PARTICLE.test(segment)) && words.length && !carry) {
      words[words.length - 1] += segment;
    } else {
      words.push(carry + segment);
      carry = "";
    }
  }
  if (carry) words.push(carry);
  return words;
}

function withBreaks(words: string[]) {
  return words.map((word, i) => (
    <Fragment key={i}>
      {i > 0 ? <wbr /> : null}
      {word}
    </Fragment>
  ));
}

/**
 * Chinese has no spaces, so a heading can wrap mid-word (自/己). Segment it
 * into words at render time and offer line breaks only between them; pair
 * with `word-break: keep-all` (.keep-words). Opening brackets stick to the
 * word after them; other punctuation and particles to the word before.
 *
 * With `clauses`, each clause (up to a comma or stop) is also kept together
 * as an inline block, so a two-clause headline breaks at its comma and only
 * wraps inside a clause that is longer than the line. Not for underlined
 * text — decorations don't reach into inline blocks.
 */
export function Phrase({ text, clauses = false }: { text: string; clauses?: boolean }) {
  if (!CJK.test(text)) return text;

  const words = segmentWords(text);
  if (!clauses) return <>{withBreaks(words)}</>;

  const groups: string[][] = [[]];
  for (const word of words) {
    groups[groups.length - 1].push(word);
    if (CLAUSE_END.test(word)) groups.push([]);
  }

  return (
    <>
      {groups
        .filter((group) => group.length)
        .map((group, i) => (
          <span key={i} className="phrase">
            {withBreaks(group)}
          </span>
        ))}
    </>
  );
}
