import { SEOHead } from '../components/seo/SEOHead'
import { Hero } from '../components/sections/Hero'
import { PricingCards } from '../components/sections/PricingCards'
import { FAQ } from '../components/sections/FAQ'
import { CTASection } from '../components/sections/CTASection'
import { plans } from '../data/pricing'
import { pricingFAQ } from '../data/faq'
import { getFAQSchema } from '../data/schemas'
import { useCountry } from '../hooks/useCountry'

export default function Pricing() {
  const { country, setCountry } = useCountry()

  return (
    <>
      <SEOHead jsonLd={getFAQSchema(pricingFAQ)} />
      <Hero
        headline="Planes simples, precios justos"
        subtitle="Sin contratos, sin letra pequeña. Elige el plan que mejor se adapta a tu negocio y empieza gratis."
        primaryCTA={{ text: 'Empezar gratis', href: '/demo-gratis' }}
        badge="7 días gratis · Sin tarjeta"
      />
      <PricingCards plans={plans} country={country} onToggleCountry={setCountry} />
      <FAQ title="Preguntas frecuentes sobre precios" items={pricingFAQ} />
      <CTASection
        headline="¿Listo para simplificar tu negocio?"
        subtitle="Prueba Global Inve gratis por 7 días. Sin tarjeta, sin compromiso."
        buttonText="Crear mi cuenta gratis"
      />
    </>
  )
}
