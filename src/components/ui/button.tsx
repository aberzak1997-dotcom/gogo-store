import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[0.8125rem] font-medium transition-all duration-240 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#5e6ad2] text-white shadow-[rgba(94,106,210,0.18)_0_1px_0_inset,rgba(0,0,0,0.04)_0_1px_1px] hover:brightness-[0.97]",
        secondary:
          "bg-white text-[#0e1116] border border-[rgba(14,17,22,0.08)] hover:bg-[rgba(14,17,22,0.04)]",
        outline:
          "bg-transparent text-[#0e1116] border border-[rgba(14,17,22,0.10)] hover:bg-[rgba(14,17,22,0.04)]",
        ghost:
          "bg-transparent text-[#5a6273] hover:bg-[rgba(14,17,22,0.04)] hover:text-[#0e1116]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[32px] px-[14px] py-[7px] rounded-[6px]",
        sm: "h-[28px] px-[12px] py-[6px] rounded-[5px] text-[0.75rem]",
        lg: "h-[40px] px-[20px] py-[10px] rounded-[8px] text-[0.875rem]",
        icon: "h-[32px] w-[32px] rounded-[6px]",
      },
    },
    defaultVariants: {
      variant: "primary",
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