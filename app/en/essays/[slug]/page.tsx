import type { Metadata } from "next";

import { EssayView, essayMetadata } from "@/components/views/essay";
import { getPosts } from "@/lib/content";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts("en").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  return essayMetadata("en", slug);
}

export default async function EnEssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  return <EssayView lang="en" slug={slug} />;
}
