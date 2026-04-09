import { validateContent } from "@/lib/content";
import { jsonEnvelope } from "@/lib/api/response";

export function GET() {
  const report = validateContent();

  return jsonEnvelope(report, {
    resource: "content_validation",
    count: report.issues.length,
    ok: report.ok,
  });
}
