"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { TerminalEntryView } from "@/components/terminal/entry-view";
import type { RenderedCommandEntry } from "@/lib/terminal/types";

type TerminalShellProps = {
  initialEntries: RenderedCommandEntry[];
  initialInput?: string;
};

export function TerminalShell({ initialEntries, initialInput = "" }: TerminalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [entries, setEntries] = useState(initialEntries);
  const [input, setInput] = useState(initialInput);
  const [history, setHistory] = useState(initialEntries.map((entry) => entry.input));
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries, isPending]);

  function moveHistory(direction: "up" | "down") {
    if (!history.length) {
      return;
    }

    if (direction === "up") {
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
      return;
    }

    if (historyIndex === null) {
      return;
    }

    const nextIndex = historyIndex + 1;
    if (nextIndex >= history.length) {
      setHistoryIndex(null);
      setInput("");
      return;
    }

    setHistoryIndex(nextIndex);
    setInput(history[nextIndex] ?? "");
  }

  async function submit(rawInput: string) {
    const value = rawInput.trim();
    if (!value) {
      return;
    }

    setInput("");
    setHistory((current) => (current[current.length - 1] === value ? current : [...current, value]));
    setHistoryIndex(null);

    const response = await fetch("/api/cmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });

    const entry = (await response.json()) as RenderedCommandEntry;

    const canonicalUrl = entry.canonicalUrl;

    if (canonicalUrl && canonicalUrl !== pathname) {
      startTransition(() => {
        router.push(canonicalUrl, { scroll: false });
      });
      return;
    }

    setEntries((current) => [...current, entry]);
  }

  return (
    <div className="terminal-shell">
      <div className="space-y-6">
        {entries.map((entry) => (
          <TerminalEntryView key={entry.id} entry={entry} />
        ))}
      </div>

      <form
        className="terminal-prompt-form"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(input);
        }}
      >
        <label className="terminal-input-row">
          <span className="terminal-prompt">$</span>
          <input
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="terminal-input"
            name="command"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp") {
                event.preventDefault();
                moveHistory("up");
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                moveHistory("down");
              }
            }}
            placeholder="help"
            spellCheck={false}
            value={input}
          />
        </label>
        {isPending ? <p className="terminal-subtle">loading route…</p> : null}
      </form>
      <div ref={endRef} />
    </div>
  );
}
