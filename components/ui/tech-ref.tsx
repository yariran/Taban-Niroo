import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TechRefProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"span">, "children" | "className" | "dir">;

/**
 * Bidi-isolated Latin technical reference (DPL codes, IEC numbers, kV, mm).
 * Keeps Western digits and the site mono stack — never Persian-Indic digits.
 */
export function TechRef({ children, className, ...props }: TechRefProps) {
  return (
    <span
      dir="ltr"
      className={cn("font-mono [unicode-bidi:isolate]", className)}
      {...props}
    >
      {children}
    </span>
  );
}
