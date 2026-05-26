import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface CTASectionProps {
  headline: string
  subtitle?: string
  buttonText: string
  buttonHref?: string
  variant?: 'primary' | 'accent'
}

export function CTASection({ headline, subtitle, buttonText, buttonHref = '/demo-gratis', variant = 'primary' }: CTASectionProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className={cn('py-20 px-6', variant === 'primary' ? 'bg-gradient-primary' : 'bg-gradient-accent')}>
      <div ref={ref} className={cn('max-w-3xl mx-auto text-center', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
          {headline}
        </h2>
        {subtitle && (
          <p className="text-white/80 text-lg mb-8">{subtitle}</p>
        )}
        <Link to={buttonHref}>
          <Button variant={variant === 'primary' ? 'accent' : 'primary'} size="lg">
            {buttonText}
          </Button>
        </Link>
      </div>
    </section>
  )
}
