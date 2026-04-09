import Link from "next/link";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="page not-found">
      <p className="not-found__eyebrow">404</p>
      <h1 className="not-found__title">这里没有页面。</h1>
      <p className="not-found__body">
        你找的东西要么从未存在，要么已经被搬走，要么只是一个手抖的链接。
      </p>
      <p className="not-found__actions">
        <Link href="/">← 回首页</Link>
        <span aria-hidden="true">·</span>
        <Link href="/essays">看 essays</Link>
      </p>
    </div>
  );
}
