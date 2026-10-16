import type { Metadata } from "next";

import { EssayView, essayMetadata } from "@/components/views/essay";
import { getPosts } from "@/lib/content";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts("zh").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  return essayMetadata("zh", slug);
}

export default async function ZhEssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  return <EssayView lang="zh" slug={slug} />;
}
