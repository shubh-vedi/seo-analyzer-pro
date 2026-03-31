import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xl shadow-blue-600/20 hover:bg-primary/90 hover:scale-105 hover:shadow-blue-600/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-slate-200 bg-white/50 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
        ghost: "hover:bg-slate-100 text-slate-500 hover:text-slate-900",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-linear-to-br from-indigo-600 via-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95"
      },
      size: {
        default: "h-11 px-8 py-2 rounded-full",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-12 text-base font-extrabold tracking-tight",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
