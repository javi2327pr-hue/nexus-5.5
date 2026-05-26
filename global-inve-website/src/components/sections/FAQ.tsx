import { Accordion, AccordionItem } from '../ui/Accordion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title?: string
  items: FAQItem[]
}

export function FAQ({ title = 'Preguntas frecuentes', items }: FAQProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-20 px-6 bg-white">
      <div ref={ref} className={cn('max-w-3xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-12">
          {title}
        </h2>
        <Accordion>
          {items.map((item, i) => (
            <AccordionItem key={i} title={item.question}>
              {item.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
