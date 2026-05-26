import { SEOHead } from '../components/seo/SEOHead'
import { Hero } from '../components/sections/Hero'
import { CTASection } from '../components/sections/CTASection'
import { featureModules } from '../data/features'
import { Card } from '../components/ui/Card'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { cn } from '../lib/utils'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as unknown as Record<string, LucideIcon>)[name] || LucideIcons.Star
}

export default function Features() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <>
      <SEOHead />
      <Hero
        headline="Todo lo que necesitas para manejar tu negocio"
        subtitle="Punto de venta, inventario, clientes, cuentas, informes y más. Todo desde cualquier dispositivo, sin instalar nada."
        primaryCTA={{ text: 'Probar gratis', href: '/demo-gratis' }}
        secondaryCTA={{ text: 'Ver planes', href: '/planes-precios' }}
      />
      <section className="py-20 px-6 bg-white">
        <div ref={ref} className={cn('max-w-6xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureModules.map((mod) => {
              const Icon = getIcon(mod.icon)
              return (
                <Card key={mod.id} hover className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-foreground mb-2">{mod.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{mod.description}</p>
                  <ul className="space-y-2">
                    {mod.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      <CTASection
        headline="¿Listo para probar Global Inve?"
        subtitle="Empieza gratis hoy. Sin tarjeta, sin complicaciones."
        buttonText="Crear mi cuenta gratis"
      />
    </>
  )
}
