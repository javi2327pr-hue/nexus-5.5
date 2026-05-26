import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface Step {
  number: number
  title: string
  description: string
}

interface HowItWorksProps {
  title?: string
  steps: Step[]
}

export function HowItWorks({ title = 'Así de fácil funciona', steps }: HowItWorksProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-20 px-6 bg-accent-soft/50">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-16">
          {title}
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white text-2xl font-bold font-display mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
