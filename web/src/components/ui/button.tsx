import * as React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const buttonVariants = ({
  variant = 'default',
  size = 'default',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
}) =>
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    variant === 'default' &&
      'bg-primary text-primary-foreground hover:bg-primary/90',
    variant === 'secondary' &&
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    variant === 'outline' &&
      'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
    variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
    variant === 'destructive' &&
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    size === 'default' && 'h-10 px-4 py-2',
    size === 'sm' && 'h-9 rounded-md px-3',
    size === 'lg' && 'h-11 rounded-md px-8',
    size === 'icon' && 'h-10 w-10',
  )

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
