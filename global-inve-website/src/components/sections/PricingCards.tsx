import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'
import { Link } from 'react-router-dom'

interface Plan {
  name: string
  description: string
  priceCOP: number
  priceEUR: number
  period: string
  features: string[]
  highlighted: boolean
  cta: string
  badge?: string
}

interface PricingCardsProps {
  plans: Plan[]
  country: 'CO' | 'ES'
  onToggleCountry: (country: 'CO' | 'ES') => void
}

export function PricingCards({ plans, country, onToggleCountry }: PricingCardsProps) {
  const { ref, isVisible } = useIntersectionObserver()
  const isColombia = country === 'CO'

  function formatPrice(plan: Plan) {
    if (isColombia) {
      return `$${plan.priceCOP.toLocaleString('es-CO')}`
    }
    return `${plan.priceEUR}€`
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full border border-border p-1">
            <button
              onClick={() => onToggleCountry('CO')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]',
                isColombia ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {'🇨🇴'} COP
            </button>
            <button
              onClick={() => onToggleCountry('ES')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]',
                !isColombia ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {'🇪🇸'} EUR
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={cn(
                'p-8 relative flex flex-col',
                plan.highlighted && 'border-2 border-accent shadow-glow scale-[1.02]'
              )}
            >
              {plan.badge && (
                <Badge variant="accent" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}
              <h3 className="text-2xl font-bold font-display text-foreground">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold font-display text-foreground">{formatPrice(plan)}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/demo-gratis">
                <Button
                  variant={plan.highlighted ? 'accent' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
