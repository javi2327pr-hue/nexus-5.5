import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface Stat {
  value: string
  label: string
}

interface SocialProofProps {
  stats: Stat[]
}

export function SocialProof({ stats }: SocialProofProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-12 px-6 bg-primary">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl font-bold font-display text-white">{stat.value}</p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
