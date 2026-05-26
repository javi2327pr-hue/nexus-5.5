import { SEOHead } from '../../components/seo/SEOHead'
import { Hero } from '../../components/sections/Hero'
import { Benefits } from '../../components/sections/Benefits'
import { SectorBar } from '../../components/sections/SectorBar'
import { CTASection } from '../../components/sections/CTASection'
import { Card } from '../../components/ui/Card'
import { colombiaContent } from '../../data/geo'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { cn } from '../../lib/utils'

export default function Colombia() {
  const { ref, isVisible } = useIntersectionObserver()
  const data = colombiaContent

  return (
    <>
      <SEOHead />
      <Hero
        headline={data.hero.headline}
        subtitle={data.hero.subtitle}
        primaryCTA={{ text: data.hero.primaryCTA, href: '/demo-gratis' }}
        secondaryCTA={data.hero.secondaryCTA ? { text: data.hero.secondaryCTA, href: '/planes-precios' } : undefined}
        badge="🇨🇴 Colombia"
      />
      <Benefits items={data.highlights} />
      <SectorBar title="Sectores que atendemos en Colombia" sectors={data.sectors} />
      {/* Payment methods section */}
      <section className="py-20 px-6 bg-white">
        <div ref={ref} className={cn('max-w-4xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
          <h2 className="text-3xl font-bold font-display text-center text-foreground mb-10">
            Métodos de pago aceptados
          </h2>
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
