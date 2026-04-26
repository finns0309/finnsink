import { validateContent } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  const report = validateContent();

  return jsonData(report, {
    resource: "content_validation",
    count: report.issues.length,
    ok: report.ok,
  });
}
