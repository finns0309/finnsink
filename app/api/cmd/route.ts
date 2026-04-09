import { jsonBadRequest, jsonData } from "@/lib/api/response";
import { runTerminalCommand } from "@/lib/terminal";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { input?: string } | null;
  const input = body?.input?.trim();

  if (!input) {
    return jsonBadRequest("Missing command input", { resource: "terminal_command" });
  }

  return jsonData(runTerminalCommand(input), { resource: "terminal_command" });
}
