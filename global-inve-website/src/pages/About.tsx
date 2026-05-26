import { SEOHead } from '../components/seo/SEOHead'
import { Hero } from '../components/sections/Hero'
import { Card } from '../components/ui/Card'
import { aboutContent } from '../data/about'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { cn } from '../lib/utils'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as unknown as Record<string, LucideIcon>)[name] ?? LucideIcons.HelpCircle
}

export default function About() {
  const { ref: storyRef, isVisible: storyVisible } = useIntersectionObserver()
  const { ref: numbersRef, isVisible: numbersVisible } = useIntersectionObserver()
  const { ref: missionRef, isVisible: missionVisible } = useIntersectionObserver()
  const { ref: valuesRef, isVisible: valuesVisible } = useIntersectionObserver()
  const data = aboutContent

  return (
    <>
      <SEOHead />
      <Hero
        headline={data.hero.headline}
        subtitle={data.hero.subtitle}
        primaryCTA={{ text: 'Prueba gratis', href: '/demo-gratis' }}
      />

      {/* Story section */}
      <section className="py-20 px-6 bg-white">
        <div ref={storyRef} className={cn('max-w-3xl mx-auto', storyVisible ? 'animate-fade-up' : 'opacity-0')}>
          <h2 className="text-3xl font-bold font-display text-foreground mb-8">{data.story.title}</h2>
          <div className="space-y-6">
            {data.story.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers section */}
      <section className="py-20 px-6 bg-hero">
        <div ref={numbersRef} className={cn('max-w-4xl mx-auto', numbersVisible ? 'animate-fade-up' : 'opacity-0')}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.numbers.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 px-6 bg-white">
        <div ref={missionRef} className={cn('max-w-4xl mx-auto', missionVisible ? 'animate-fade-up' : 'opacity-0')}>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold font-display text-foreground mb-4">{data.mission.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{data.mission.text}</p>
            </Card>
            <Card className="p-8">
              <h2 className="text-2xl font-bold font-display text-foreground mb-4">{data.vision.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{data.vision.text}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-hero">
        <div ref={valuesRef} className={cn('max-w-5xl mx-auto', valuesVisible ? 'animate-fade-up' : 'opacity-0')}>
          <h2 className="text-3xl font-bold font-display text-center text-foreground mb-12">Nuestros valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.values.map((value, i) => {
              const Icon = getIcon(value.icon)
              return (
                <Card key={i} className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-accent-soft text-accent flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold font-display text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
