import { SEOHead } from '../../components/seo/SEOHead'
import { Hero } from '../../components/sections/Hero'
import { PainPoints } from '../../components/sections/PainPoints'
import { Solutions } from '../../components/sections/Solutions'
import { Testimonials } from '../../components/sections/Testimonials'
import { CTASection } from '../../components/sections/CTASection'
import { industries } from '../../data/industries'

const data = industries.ferreteria

export default function Ferreteria() {
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
      <Testimonials items={[data.testimonial]} />
      <CTASection headline={data.ctaSection.headline} buttonText={data.ctaSection.buttonText} />
    </>
  )
}
