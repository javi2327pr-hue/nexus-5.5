import { SEOHead } from '../components/seo/SEOHead'
import { Hero } from '../components/sections/Hero'
import { SocialProof } from '../components/sections/SocialProof'
import { SectorBar } from '../components/sections/SectorBar'
import { Benefits } from '../components/sections/Benefits'
import { HowItWorks } from '../components/sections/HowItWorks'
import { ComparisonTable } from '../components/sections/ComparisonTable'
import { Testimonials } from '../components/sections/Testimonials'
import { CTASection } from '../components/sections/CTASection'
import { heroContent, benefits, steps, comparisonData, testimonials, ctaContent } from '../data/home'
import { socialProofStats } from '../data/testimonials'

const homeSectors = [
  { icon: 'Wrench', name: 'Ferreterías', link: '/software-pos-ferreteria' },
  { icon: 'Store', name: 'Tiendas', link: '/software-pos-tienda' },
  { icon: 'UtensilsCrossed', name: 'Restaurantes', link: '/software-pos-restaurante' },
  { icon: 'Pill', name: 'Farmacias', link: '/software-pos-farmacia' },
  { icon: 'Scissors', name: 'Peluquerías', link: '#' },
  { icon: 'ShoppingBag', name: 'Misceláneas', link: '#' },
]

export default function Home() {
  return (
    <>
      <SEOHead />
      <Hero
        headline={heroContent.headline}
        subtitle={heroContent.subtitle}
        primaryCTA={{ text: heroContent.primaryCTA, href: '/demo-gratis' }}
        secondaryCTA={{ text: heroContent.secondaryCTA, href: '/funcionalidades' }}
        badge="Software POS #1 para pymes"
      />
      <SocialProof stats={socialProofStats} />
      <SectorBar title="Soluciones para tu sector" sectors={homeSectors} />
      <Benefits title="¿Por qué elegir Global Inve?" items={benefits} />
      <HowItWorks title="Así de fácil funciona" steps={steps} />
      <ComparisonTable title="¿Por qué Global Inve?" rows={comparisonData} />
      <Testimonials title="Lo que dicen nuestros clientes" items={testimonials} />
      <CTASection
        headline={ctaContent.headline}
        subtitle={ctaContent.subtitle}
        buttonText={ctaContent.buttonText}
      />
    </>
  )
}
