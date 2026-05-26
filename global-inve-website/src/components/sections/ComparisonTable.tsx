import { Check, X, Minus } from 'lucide-react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

interface ComparisonRow {
  feature: string
  globalInve: string
  expensive: string
  notebook: string
}

interface ComparisonTableProps {
  title?: string
  rows: ComparisonRow[]
}

export function ComparisonTable({ title = '¿Por qué Global Inve?', rows }: ComparisonTableProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="py-20 px-6 bg-white">
      <div ref={ref} className={cn('max-w-4xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-12">
          {title}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="pb-4 text-sm font-semibold text-muted-foreground"></th>
                <th className="pb-4 text-sm font-bold text-primary text-center">Global Inve</th>
                <th className="pb-4 text-sm font-semibold text-muted-foreground text-center">Software costoso</th>
                <th className="pb-4 text-sm font-semibold text-muted-foreground text-center">Cuaderno/Excel</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-4 text-sm font-medium text-foreground">{row.feature}</td>
                  <td className="py-4 text-sm text-center font-medium text-primary">{row.globalInve}</td>
                  <td className="py-4 text-sm text-center text-muted-foreground">{row.expensive}</td>
                  <td className="py-4 text-sm text-center text-muted-foreground">{row.notebook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
