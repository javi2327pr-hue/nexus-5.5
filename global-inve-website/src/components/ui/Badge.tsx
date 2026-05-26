import { cn } from '../../lib/utils'

interface BadgeProps {
  variant?: 'default' | 'accent' | 'outline'
  children: React.ReactNode
  className?: string
}

function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        {
          'bg-primary text-white': variant === 'default',
          'bg-accent text-white': variant === 'accent',
          'border border-border text-muted-foreground': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
