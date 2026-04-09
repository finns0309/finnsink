import Link from "next/link";

import clsx from "clsx";

type TerminalTagProps = {
  label: string;
  href?: string;
  className?: string;
};

export function TerminalTag({ label, href, className }: TerminalTagProps) {
  const content = (
    <span className={clsx("terminal-tag", className)}>
      {label}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}
