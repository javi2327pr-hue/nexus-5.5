import { SEOHead } from '../../components/seo/SEOHead'
import { Hero } from '../../components/sections/Hero'
import { PainPoints } from '../../components/sections/PainPoints'
import { Solutions } from '../../components/sections/Solutions'
import { Testimonials } from '../../components/sections/Testimonials'
import { CTASection } from '../../components/sections/CTASection'
import { industries } from '../../data/industries'

const data = industries.tienda

export default function Tienda() {
  return (
    <>
      <SEOHead />
      <Hero
        headline={data.hero.headline}
        subtitle={data.hero.subtitle}
        primaryCTA={{ text: data.hero.primaryCTA, href: '/demo-gratis' }}
        secondaryCTA={{ text: data.hero.secondaryCTA, href: '/funcionalidades' }}
      />
      <PainPoints items={data.pains} />
      <Solutions items={data.solutions} />

      {/* Before/After comparison table */}
      {data.comparison && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-foreground mb-12">
              El cambio que necesitas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="pb-4 text-sm font-semibold text-muted-foreground"></th>
                    <th className="pb-4 text-sm font-semibold text-red-500 text-center">Con cuaderno</th>
                    <th className="pb-4 text-sm font-bold text-accent text-center">Con Global Inve</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-4 text-sm font-medium text-foreground">{row.aspect}</td>
                      <td className="py-4 text-sm text-center text-muted-foreground">{row.before}</td>
                      <td className="py-4 text-sm text-center font-medium text-accent">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <Testimonials items={[data.testimonial]} />
      <CTASection headline={data.ctaSection.headline} buttonText={data.ctaSection.buttonText} />
    </>
  )
}
