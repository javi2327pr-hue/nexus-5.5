import { SEOHead } from '../../components/seo/SEOHead'
import { Hero } from '../../components/sections/Hero'
import { Benefits } from '../../components/sections/Benefits'
import { CTASection } from '../../components/sections/CTASection'
import { Card } from '../../components/ui/Card'
import { espanaContent } from '../../data/geo'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'
import { Shield, Check } from 'lucide-react'

export default function Espana() {
  const { ref: payRef, isVisible: payVisible } = useIntersectionObserver()
  const { ref: veriRef, isVisible: veriVisible } = useIntersectionObserver()
  const data = espanaContent

  return (
    <>
      <SEOHead />
      <Hero
        headline={data.hero.headline}
        subtitle={data.hero.subtitle}
        primaryCTA={{ text: data.hero.primaryCTA, href: '/demo-gratis' }}
        secondaryCTA={data.hero.secondaryCTA ? { text: data.hero.secondaryCTA, href: '/planes-precios' } : undefined}
        badge="🇪🇸 España"
      />
      <Benefits items={data.highlights} />
      {/* Verifactu section */}
      {data.verifactu && (
        <section className="py-20 px-6 bg-accent-soft/30">
          <div ref={veriRef} className={cn('max-w-3xl mx-auto', veriVisible ? 'animate-fade-up' : 'opacity-0')}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" strokeWidth={1.75} />
              <h2 className="text-3xl font-bold font-display text-foreground">{data.verifactu.title}</h2>
            </div>
            <p className="text-muted-foreground text-center mb-8 leading-relaxed">{data.verifactu.description}</p>
            <ul className="space-y-3 max-w-xl mx-auto">
              {data.verifactu.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-foreground text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {/* Payment methods */}
      <section className="py-20 px-6 bg-white">
        <div ref={payRef} className={cn('max-w-4xl mx-auto', payVisible ? 'animate-fade-up' : 'opacity-0')}>
          <h2 className="text-3xl font-bold font-display text-center text-foreground mb-10">Métodos de pago</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.paymentMethods.map((pm, i) => (
              <Card key={i} className="px-6 py-4 text-center">
                <p className="font-semibold text-foreground text-sm">{pm.name}</p>
                <p className="text-muted-foreground text-xs">{pm.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        headline={data.ctaSection.headline}
        subtitle={data.ctaSection.subtitle}
        buttonText={data.ctaSection.buttonText}
      />
    </>
  )
}
