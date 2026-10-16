import { Fragment } from "react";

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });
const CJK = /[㐀-鿿豈-﫿]/;
const PUNCTUATION = /^[\p{P}\s]+$/u;
const OPENING = /^[（《「『“‘([{【〔]+$/u;

/**
 * Chinese has no spaces, so a heading can wrap mid-word (自/己). Segment it
 * into words at render time and offer line breaks only between them; pair
 * with `word-break: keep-all` (.keep-words). Opening brackets stick to the
 * word after them, all other punctuation to the word before.
 */
export function Phrase({ text }: { text: string }) {
  if (!CJK.test(text)) return text;

  const words: string[] = [];
  let carry = "";
  for (const { segment } of segmenter.segment(text)) {
    if (OPENING.test(segment)) {
      carry += segment;
    } else if (PUNCTUATION.test(segment) && words.length) {
      words[words.length - 1] += carry + segment;
      carry = "";
    } else {
      words.push(carry + segment);
      carry = "";
    }
  }
  if (carry) words.push(carry);

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 ? <wbr /> : null}
          {word}
        </Fragment>
      ))}
    </>
  );
}
