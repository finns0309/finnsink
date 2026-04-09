import type { ParsedCommand } from "@/lib/terminal/types";

function splitTokens(input: string) {
  return input.match(/"[^"]*"|'[^']*'|\S+/g)?.map((token) => token.replace(/^['"]|['"]$/g, "")) ?? [];
}

export function normalizePath(input: string) {
  const withoutQuery = input.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  return withoutQuery
    .replace(/\.(md|json)$/i, "")
    .replace(/^essays\//i, "posts/")
    .replace(/^essay\//i, "posts/")
    .replace(/^post\//i, "posts/")
    .replace(/^topic\//i, "topics/")
    .replace(/^project\//i, "projects/");
}

export function parseCommand(rawInput: string): ParsedCommand {
  const raw = rawInput.trim();

  if (!raw) {
    return { raw: "", cmd: "help" };
  }

  const [commandToken, ...rest] = splitTokens(raw);
  const command = commandToken.toLowerCase();

  if (command === "help") {
    return { raw, cmd: "help" };
  }

  if (command === "now") {
    return { raw, cmd: "now" };
  }

  if (command === "ls") {
    const joined = normalizePath(rest.join(" "));
    return { raw, cmd: "ls", path: joined || "/" };
  }

  if (command === "cat") {
    const joined = normalizePath(rest.join(" "));
    return { raw, cmd: "cat", path: joined || "profile" };
  }

  if (command === "find") {
    return { raw, cmd: "find", query: rest.join(" ").trim() };
  }

  if (command === "graph") {
    const joined = normalizePath(rest.join(" "));
    return { raw, cmd: "graph", target: joined || undefined };
  }

  return { raw, cmd: "help" };
}
