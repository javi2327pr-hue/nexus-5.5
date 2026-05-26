import { Quote } from 'lucide-react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface TestimonialItem {
  name: string
  business: string
  city: string
  quote: string
}

interface TestimonialsProps {
  title?: string
  items: TestimonialItem[]
}

export function Testimonials({ title = 'Lo que dicen nuestros clientes', items }: TestimonialsProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-20 px-6 bg-accent-soft/30">
      <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-12">
          {title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <Card key={i} className="p-8 relative">
              <Quote className="w-8 h-8 text-accent/20 absolute top-6 right-6" strokeWidth={1.5} />
              <p className="text-foreground text-sm leading-relaxed mb-6 italic">"{item.quote}"</p>
              <div>
                <p className="font-bold font-display text-foreground text-sm">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.business} · {item.city}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
