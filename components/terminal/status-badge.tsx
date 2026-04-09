import clsx from "clsx";

const toneByValue: Record<string, "green" | "amber" | "blue" | "gray"> = {
  stable: "green",
  in_progress: "green",
  working: "amber",
  seed: "amber",
  paused: "amber",
  changed: "blue",
  done: "gray",
  idea: "gray",
};

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const tone = toneByValue[value] ?? "gray";

  return (
    <span className={clsx("status-badge", `status-${tone}`)}>
      {value}
    </span>
  );
}
