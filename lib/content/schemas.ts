import { z } from "zod";

export const langSchema = z.enum(["zh", "en", "ja"]);

export const DEFAULT_LANG = "zh" as const;

export const stanceSchema = z.enum(["seed", "working", "stable", "changed"]);

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  // First-person, one or two sentences — the home page introduction.
  intro: z.string().optional(),
  long_summary: z.string(),
  location: z.string(),
  roles: z.array(z.string()),
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

export const postFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  lang: langSchema,
  summary: z.string(),
  thesis: z.string(),
  published_at: z.string(),
  updated_at: z.string(),
  keywords: z.array(z.string()).default([]),
  stance: stanceSchema,
  person_snapshot: z.array(z.string()),
});

export const postSchema = postFrontmatterSchema.extend({
  content: z.string(),
  reading_time_min: z.number().int().positive(),
});

// active: still being worked on · stable: done and usable · prototype: an
// experiment that runs · archived: no longer maintained.
export const projectStatusSchema = z.enum(["active", "stable", "prototype", "archived"]);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  year: z.number().int(),
  status: projectStatusSchema,
  kind: z.string(),
  links: z.record(z.string(), z.string()).default({}),
  related_essays: z.array(z.string()).default([]),
});

export const projectsFileSchema = z.array(projectSchema);

export type Lang = z.infer<typeof langSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Now = z.infer<typeof nowSchema>;
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type Post = z.infer<typeof postSchema>;
export type Stance = z.infer<typeof stanceSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
