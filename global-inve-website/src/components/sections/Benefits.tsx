import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { Card } from '../ui/Card'
import * as LucideIcons from 'lucide-react'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface BenefitItem {
  icon: string
  title: string
  description: string
}

interface BenefitsProps {
  title?: string
  items: BenefitItem[]
}

function getIcon(name: string): LucideIcon {
  return (LucideIcons as unknown as Record<string, LucideIcon>)[name] || LucideIcons.Star
}

export function Benefits({ title, items }: BenefitsProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-20 px-6 bg-white">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-12">
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon)
            return (
              <Card key={i} hover className="text-center p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-soft text-accent mb-4">
                  <Icon className="w-7 h-7" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
