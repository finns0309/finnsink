import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p>
          finn · written slowly ·{" "}
          <Link href="/rss.xml">rss</Link> ·{" "}
          <Link href="/for-agents">for agents</Link>
        </p>
      </div>
    </footer>
  );
}
