import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface PainItem {
  icon: string
  title: string
  description: string
}

interface PainPointsProps {
  title?: string
  items: PainItem[]
}

function getIcon(name: string): LucideIcon {
  return (LucideIcons as unknown as Record<string, LucideIcon>)[name] || LucideIcons.AlertTriangle
}

export function PainPoints({ title = '¿Te suena familiar?', items }: PainPointsProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-20 px-6 bg-white">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-12">{title}</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon)
            return (
              <Card key={i} hover className="flex items-start gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-bold font-display text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
