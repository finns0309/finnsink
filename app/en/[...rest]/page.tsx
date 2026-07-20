import { notFound } from "next/navigation";

/**
 * With two root layouts there is no global not-found boundary, so each
 * language tree catches its own unmatched paths and renders its localized 404.
 */
export default function CatchAll() {
  notFound();
}
