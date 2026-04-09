import { executeCommand } from "@/lib/terminal/execute";
import { parseCommand } from "@/lib/terminal/parse";
import { renderExecutedCommand } from "@/lib/terminal/render";
import type { RenderedCommandEntry } from "@/lib/terminal/types";

export function runTerminalCommand(input: string): RenderedCommandEntry {
  return renderExecutedCommand(executeCommand(parseCommand(input)));
}

export function buildTerminalEntries(commands: string[]) {
  return commands.map((command) => runTerminalCommand(command));
}
