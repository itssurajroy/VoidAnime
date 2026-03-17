import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        role="group"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{
              className?: string
            }>, {
              className: cn(
                orientation === "horizontal" && "[&:not(:first-child)]:rounded-l-none [&:not(:last-child)]:rounded-r-none [&:not(:last-child)]:border-r-0",
                orientation === "vertical" && "[&:not(:first-child)]:rounded-t-none [&:not(:last-child)]:rounded-b-none [&:not(:last-child)]:border-b-0",
                (child.props as { className?: string }).className
              ),
            })
          }
          return child
        })}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
