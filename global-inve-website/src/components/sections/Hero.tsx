import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface HeroProps {
  headline: string
  subtitle: string
  primaryCTA: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
  badge?: string
  variant?: 'light' | 'dark'
}

export function Hero({ headline, subtitle, primaryCTA, secondaryCTA, badge, variant = 'light' }: HeroProps) {
  const { ref, isVisible } = useIntersectionObserver()
  const isDark = variant === 'dark'

  return (
    <section className={cn('py-20 md:py-28 px-6', isDark ? 'bg-gradient-primary' : 'bg-hero')}>
      <div
        ref={ref}
        className={cn('max-w-4xl mx-auto text-center', isVisible ? 'animate-fade-up' : 'opacity-0')}
      >
        {badge && <Badge variant={isDark ? 'accent' : 'default'} className="mb-6">{badge}</Badge>}
        <h1 className={cn(
          'text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight',
          isDark ? 'text-white' : 'text-foreground'
        )}>
          {headline}
        </h1>
        <p className={cn(
          'mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed',
          isDark ? 'text-white/80' : 'text-muted-foreground'
        )}>
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={primaryCTA.href}>
            <Button variant="accent" size="lg">{primaryCTA.text}</Button>
          </Link>
          {secondaryCTA && (
            <Link to={secondaryCTA.href}>
              <Button variant={isDark ? 'ghost' : 'outline'} size="lg" className={isDark ? 'text-white border-white/30 hover:bg-white/10' : ''}>
                {secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
