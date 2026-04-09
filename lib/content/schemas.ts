import { z } from "zod";

export const relationTypeSchema = z.enum([
  "extends",
  "revises",
  "disagrees",
  "applies",
  "introduces",
  "summarizes",
]);

export const stanceSchema = z.enum(["seed", "working", "stable", "changed"]);

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  long_summary: z.string(),
  location: z.string(),
  roles: z.array(z.string()),
  themes: z.array(z.string()),
  beliefs: z.array(z.string()),
  current_work: z
    .object({
      company: z.string(),
      role: z.string(),
      focus: z.string(),
    })
    .optional(),
  start_here: z.array(z.string()),
  links: z.record(z.string(), z.string()),
});

export const nowSchema = z.object({
  focus: z.array(z.string()),
  narrative: z.string(),
  updated_at: z.string(),
  working_on: z.array(z.string()),
  open_loops: z.array(z.string()),
  reading: z.array(z.string()),
});

export const topicSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  core_questions: z.array(z.string()),
  current_position: z.string(),
  representative_posts: z.array(z.string()),
  related_topics: z.array(z.string()).default([]),
  updated_at: z.string(),
});

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  status: z.enum(["idea", "in_progress", "paused", "done"]),
  started_at: z.string(),
  themes: z.array(z.string()),
  goals: z.array(z.string()),
  related_posts: z.array(z.string()).default([]),
});

export const edgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: relationTypeSchema,
});

export const relatedPostSchema = z.object({
  slug: z.string(),
  relation: relationTypeSchema,
});

export const postFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  thesis: z.string(),
  published_at: z.string(),
  updated_at: z.string(),
  topics: z.array(z.string()),
  keywords: z.array(z.string()).default([]),
  audience: z.array(z.enum(["human", "agent"])).default(["human", "agent"]),
  stance: stanceSchema,
  featured: z.boolean().default(false),
  person_snapshot: z.array(z.string()),
  disagrees_with: z.array(z.string()).default([]),
  related_posts: z.array(relatedPostSchema).default([]),
});

export const postSchema = postFrontmatterSchema.extend({
  content: z.string(),
  reading_time_min: z.number().int().positive(),
});

export type Profile = z.infer<typeof profileSchema>;
export type Now = z.infer<typeof nowSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Edge = z.infer<typeof edgeSchema>;
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type Post = z.infer<typeof postSchema>;
