const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const STATIC_ROUTES = new Set(["/", "/about", "/now", "/essays", "/topics", "/projects", "/for-agents"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readDirectory(directoryPath, extension) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(extension))
    .map((fileName) => path.join(directoryPath, fileName));
}

function normalizeFrontmatterDates(data) {
  const nextData = { ...data };

  for (const key of ["published_at", "updated_at"]) {
    const value = nextData[key];

    if (value instanceof Date) {
      nextData[key] = value.toISOString().slice(0, 10);
    }
  }

  return nextData;
}

function parseScalar(value) {
  if (value === "[]") {
    return [];
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    return inner
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}

function parseFrontmatter(raw, filePath) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }

  const lines = match[1].split(/\r?\n/);
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    const rootMatch = line.match(/^([a-zA-Z0-9_]+):(?:\s*(.*))?$/);

    if (!rootMatch) {
      continue;
    }

    const [, key, inlineValue = ""] = rootMatch;

    if (inlineValue) {
      data[key] = parseScalar(inlineValue);
      continue;
    }

    const items = [];
    const objects = [];
    let mode = null;

    while (index + 1 < lines.length && /^  /.test(lines[index + 1])) {
      index += 1;
      const childLine = lines[index];
      const arrayItemMatch = childLine.match(/^  - (.*)$/);

      if (!arrayItemMatch) {
        continue;
      }

      const arrayValue = arrayItemMatch[1];
      const objectMatch = arrayValue.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);

      if (!objectMatch) {
        mode = mode ?? "scalar";
        items.push(parseScalar(arrayValue));
        continue;
      }

      mode = mode ?? "object";
      const objectValue = {
        [objectMatch[1]]: parseScalar(objectMatch[2]),
      };

      while (index + 1 < lines.length && /^    /.test(lines[index + 1])) {
        index += 1;
        const nestedLine = lines[index];
        const nestedMatch = nestedLine.match(/^    ([a-zA-Z0-9_]+):\s*(.*)$/);

        if (nestedMatch) {
          objectValue[nestedMatch[1]] = parseScalar(nestedMatch[2]);
        }
      }

      objects.push(objectValue);
    }

    data[key] = mode === "object" ? objects : items;
  }

  return normalizeFrontmatterDates(data);
}

function readPosts() {
  return readDirectory(path.join(CONTENT_ROOT, "posts"), ".md").map((filePath) => {
    return parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath);
  });
}

const profile = readJson(path.join(CONTENT_ROOT, "profile.json"));
const topics = readDirectory(path.join(CONTENT_ROOT, "topics"), ".json").map(readJson);
const projects = readDirectory(path.join(CONTENT_ROOT, "projects"), ".json").map(readJson);
const posts = readPosts();
const edges = readJson(path.join(CONTENT_ROOT, "edges.json"));

const knownTopicSlugs = new Set(topics.map((topic) => topic.slug));
const knownPostSlugs = new Set(posts.map((post) => post.slug));
const knownProjectSlugs = new Set(projects.map((project) => project.slug));
const knownRoutes = new Set([
  ...STATIC_ROUTES,
  ...posts.map((post) => `/essays/${post.slug}`),
  ...topics.map((topic) => `/topics/${topic.slug}`),
  ...projects.map((project) => `/projects/${project.slug}`),
]);

const issues = [];

for (const theme of profile.themes ?? []) {
  if (!knownTopicSlugs.has(theme)) {
    issues.push({
      severity: "warning",
      code: "profile.theme_missing_topic",
      message: `Profile theme "${theme}" does not resolve to a topic page.`,
      location: "content/profile.json",
    });
  }
}

for (const route of profile.start_here ?? []) {
  if (!knownRoutes.has(route)) {
    issues.push({
      severity: "error",
      code: "profile.start_here_missing_route",
      message: `Start route "${route}" does not resolve to a known page.`,
      location: "content/profile.json",
    });
  }
}

for (const post of posts) {
  for (const topicSlug of post.topics ?? []) {
    if (!knownTopicSlugs.has(topicSlug)) {
      issues.push({
        severity: "error",
        code: "post.topic_missing",
        message: `Post "${post.slug}" references missing topic "${topicSlug}".`,
        location: `content/posts/${post.slug}.md`,
      });
    }
  }

  for (const related of post.related_posts ?? []) {
    if (!knownPostSlugs.has(related.slug)) {
      issues.push({
        severity: "error",
        code: "post.related_missing",
        message: `Post "${post.slug}" references missing related post "${related.slug}".`,
        location: `content/posts/${post.slug}.md`,
      });
    }
  }
}

for (const topic of topics) {
  for (const relatedTopic of topic.related_topics ?? []) {
    if (!knownTopicSlugs.has(relatedTopic)) {
      issues.push({
        severity: "warning",
        code: "topic.related_topic_missing",
        message: `Topic "${topic.slug}" references missing related topic "${relatedTopic}".`,
        location: `content/topics/${topic.slug}.json`,
      });
    }
  }

  for (const representativePost of topic.representative_posts ?? []) {
    if (!knownPostSlugs.has(representativePost)) {
      issues.push({
        severity: "error",
        code: "topic.representative_post_missing",
        message: `Topic "${topic.slug}" references missing representative post "${representativePost}".`,
        location: `content/topics/${topic.slug}.json`,
      });
    }
  }
}

for (const project of projects) {
  for (const theme of project.themes ?? []) {
    if (!knownTopicSlugs.has(theme)) {
      issues.push({
        severity: "error",
        code: "project.theme_missing",
        message: `Project "${project.slug}" references missing theme "${theme}".`,
        location: `content/projects/${project.slug}.json`,
      });
    }
  }

  for (const relatedPost of project.related_posts ?? []) {
    if (!knownPostSlugs.has(relatedPost)) {
      issues.push({
        severity: "error",
        code: "project.related_post_missing",
        message: `Project "${project.slug}" references missing post "${relatedPost}".`,
        location: `content/projects/${project.slug}.json`,
      });
    }
  }
}

for (const edge of edges) {
  const fromKnown = knownPostSlugs.has(edge.from) || knownTopicSlugs.has(edge.from) || knownProjectSlugs.has(edge.from);
  const toKnown = knownPostSlugs.has(edge.to) || knownTopicSlugs.has(edge.to) || knownProjectSlugs.has(edge.to);

  if (!fromKnown || !toKnown) {
    issues.push({
      severity: "warning",
      code: "graph.edge_unknown_node",
      message: `Edge "${edge.from}" -> "${edge.to}" references an unknown node.`,
      location: "content/edges.json",
    });
  }
}

console.log(
  `Validated content graph: ${posts.length} posts, ${topics.length} topics, ${projects.length} projects, ${edges.length} edges.`,
);

if (!issues.length) {
  console.log("No validation issues found.");
  process.exit(0);
}

for (const issue of issues) {
  const label = issue.severity.toUpperCase();
  console.log(`[${label}] ${issue.code} @ ${issue.location}`);
  console.log(`  ${issue.message}`);
}

if (issues.some((issue) => issue.severity === "error")) {
  process.exit(1);
}
