import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        /* Uses the semantic pair, not `--brand-navy`: that token is the
           heading colour and inverts by theme (near-black in light,
           near-white in dark), so `text-white` on it is unreadable in dark. */
        default:
          "bg-primary text-primary-foreground hover:bg-brand-orange hover:text-brand-navy-deep",
        /* Gold fills always take near-black text — white on this gold is
           ~1.9:1. `--brand-orange` is the bright gold in both themes. */
        burgundy:
          "bg-brand-orange text-brand-navy-deep hover:bg-brand-burgundy-strong",
        orange:
          "bg-brand-orange text-brand-navy-deep hover:bg-brand-orange/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-brand-navy/20 bg-background shadow-xs hover:border-brand-navy/35 hover:bg-brand-navy-soft hover:text-brand-navy dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-brand-navy-soft text-brand-navy hover:bg-brand-navy-soft/80",
        ghost:
          "hover:bg-brand-navy-soft hover:text-brand-navy dark:hover:bg-accent/50",
        link: "text-brand-navy underline-offset-4 hover:text-brand-burgundy hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
