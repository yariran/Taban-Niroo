import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TechRefProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"span">, "children" | "className" | "dir">;

/**
 * Bidi-isolated Latin technical reference (DPL codes, IEC numbers, kV, mm).
 * Keeps Western digits and Inter (not Vazirmatn Latin) so catalogue IDs
 * match the English build on FA pages.
 */
export function TechRef({ children, className, ...props }: TechRefProps) {
  return (
    <span
      dir="ltr"
      className={cn(
        "tech-ref font-mono [unicode-bidi:isolate]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
