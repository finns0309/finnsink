import type { MetadataRoute } from "next";

import { getPosts, getProjects, getTopics } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = ["", "/about", "/now", "/essays", "/topics", "/projects", "/for-agents"];

  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const postRoutes = getPosts().map((post) => ({
    url: `${siteUrl}/essays/${post.slug}`,
    lastModified: new Date(post.updated_at),
  }));

  const topicRoutes = getTopics().map((topic) => ({
    url: `${siteUrl}/topics/${topic.slug}`,
    lastModified: new Date(topic.updated_at),
  }));

  const projectRoutes = getProjects().map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(project.started_at),
  }));

  return [...staticRoutes, ...postRoutes, ...topicRoutes, ...projectRoutes];
}
