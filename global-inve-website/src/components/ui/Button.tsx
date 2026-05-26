import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            'bg-gradient-primary text-white shadow-elegant hover:opacity-90 focus:ring-primary': variant === 'primary',
            'bg-gradient-accent text-white shadow-glow hover:opacity-90 focus:ring-accent': variant === 'accent',
            'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary': variant === 'outline',
            'text-primary hover:bg-primary/5 focus:ring-primary': variant === 'ghost',
          },
          {
            'text-sm px-4 py-2 min-h-[36px]': size === 'sm',
            'text-base px-6 py-3 min-h-[44px]': size === 'md',
            'text-lg px-8 py-4 min-h-[52px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
