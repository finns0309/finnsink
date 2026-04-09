import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { getPostBySlug, getPosts } from "@/lib/content";
import { formatLongDate } from "@/lib/site";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="page">
      <header className="article-header">
        <h1 className="article-title">{post.title}</h1>
        {post.thesis ? <p className="article-subtitle">{post.thesis}</p> : null}
        <p className="article-meta">
          <span>{formatLongDate(post.published_at)}</span>
        </p>
      </header>

      <hr className="article-rule" />

      <MarkdownContent content={post.content} />

      <footer className="article-footer">
        <Link href="/essays">← Back to essays</Link>
      </footer>
    </article>
  );
}
