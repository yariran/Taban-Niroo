"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ThemeToggleProps = {
  className?: string;
  /** Smaller hit target for dense headers */
  compact?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "variant">;

function subscribe() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function ThemeToggle({
  className,
  compact,
  variant = "outline",
}: ThemeToggleProps) {
  const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const { resolvedTheme, setTheme } = useTheme();

  if (!isClient) {
    return (
      <span
        className={compact ? "inline-flex size-8 shrink-0" : "inline-flex size-9 shrink-0"}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Button
      type="button"
      variant={variant}
      size={compact ? "icon-sm" : "icon"}
      className={[
        "shrink-0 rounded-full border-border/80 bg-background/60 backdrop-blur-sm",
        className ?? "",
      ].join(" ")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </Button>
  );
}
