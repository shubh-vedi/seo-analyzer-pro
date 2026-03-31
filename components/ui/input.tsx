import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-2 text-base text-slate-900 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus-visible:outline-none focus:border-blue-600/50 focus-visible:ring-4 focus-visible:ring-blue-600/10 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-blue-900/5",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
