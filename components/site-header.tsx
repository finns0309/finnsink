import Link from "next/link";

const navigation = [
  { href: "/essays", label: "essays" },
  { href: "/now", label: "now" },
  { href: "/about", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <Link href="/" className="site-header__brand">
          finn
        </Link>
        <nav className="site-nav">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
