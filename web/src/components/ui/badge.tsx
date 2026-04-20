import * as React from 'react'

import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'

function badgeVariants(variant: BadgeVariant = 'default') {
  return cn(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
    variant === 'default' &&
      'border-transparent bg-primary text-primary-foreground',
    variant === 'secondary' &&
      'border-transparent bg-secondary text-secondary-foreground',
    variant === 'destructive' &&
      'border-transparent bg-destructive text-destructive-foreground',
    variant === 'outline' && 'border-border text-foreground',
    variant === 'success' &&
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
    variant === 'warning' &&
      'border-amber-500/30 bg-amber-500/10 text-amber-700',
  )
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <div className={cn(badgeVariants(variant), className)} {...props} />
}

export { Badge }
