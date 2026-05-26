import { SEOHead } from '../components/seo/SEOHead'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Clock, ArrowRight } from 'lucide-react'
import { blogPosts } from '../data/blog'
import { CTASection } from '../components/sections/CTASection'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { cn } from '../lib/utils'

export default function Blog() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <>
      <SEOHead />
      <section className="py-20 px-6 bg-hero">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground">
              Blog — Consejos para hacer crecer tu negocio
            </h1>
            <p className="text-muted-foreground text-lg mt-4">Tips prácticos sobre inventario, ventas, fiados y más.</p>
          </div>
          <div ref={ref} className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-8', isVisible ? 'animate-fade-up' : 'opacity-0')}>
            {blogPosts.map((post) => (
              <Card key={post.id} hover className="flex flex-col">
                <div className="h-48 bg-gradient-primary rounded-t-[14px] -mx-6 -mt-6 mb-6" />
                <Badge variant="outline" className="self-start mb-3">{post.category}</Badge>
                <h2 className="text-lg font-bold font-display text-foreground mb-2 flex-1">{post.title}</h2>
                <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                  <span className="text-xs text-accent font-medium flex items-center gap-1">
                    Leer más <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        headline="¿Listo para digitalizar tu negocio?"
        subtitle="Prueba Global Inve gratis por 7 días."
        buttonText="Empezar gratis"
      />
    </>
  )
}
