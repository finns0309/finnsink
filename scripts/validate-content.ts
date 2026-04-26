import { validateContent } from "../lib/content";

const report = validateContent();

console.log(`Validated ${report.counts.posts} posts.`);

if (!report.issues.length) {
  console.log("No validation issues found.");
  process.exit(0);
}

for (const issue of report.issues) {
  console.log(`[${issue.severity.toUpperCase()}] ${issue.code} @ ${issue.location}`);
  console.log(`  ${issue.message}`);
}

if (!report.ok) {
  process.exit(1);
}
