import { Link } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

interface Sector {
  icon: string
  name: string
  link: string
}

interface SectorBarProps {
  title?: string
  sectors: Sector[]
}

function getIcon(name: string): LucideIcon {
  return (LucideIcons as Record<string, LucideIcon>)[name] || LucideIcons.Store
}

export function SectorBar({ title, sectors }: SectorBarProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-16 px-6 bg-white border-y border-border">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-foreground mb-10">{title}</h2>
        )}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {sectors.map((sector, i) => {
            const Icon = getIcon(sector.icon)
            return (
              <Link
                key={i}
                to={sector.link}
                className="flex flex-col items-center gap-2 group min-w-[80px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors text-accent">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {sector.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
