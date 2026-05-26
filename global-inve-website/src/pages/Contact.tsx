import { useState } from 'react'
import { SEOHead } from '../components/seo/SEOHead'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'
import { Mail, MessageCircle, MapPin, Check } from 'lucide-react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { cn } from '../lib/utils'

const contactMethods = [
  { icon: MessageCircle, title: 'WhatsApp', detail: '+57 300 123 4567', href: 'https://wa.me/573001234567' },
  { icon: Mail, title: 'Email', detail: 'hola@globalinve.com', href: 'mailto:hola@globalinve.com' },
  { icon: MapPin, title: 'Ubicación', detail: 'Bogotá, Colombia', href: '#' },
]

export default function Contact() {
  const { ref, isVisible } = useIntersectionObserver()
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <SEOHead />
      <section className="py-20 px-6 bg-hero">
        <div ref={ref} className={cn('max-w-5xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground">
              ¿Tienes preguntas? Estamos aquí para ayudarte
            </h1>
            <p className="text-muted-foreground text-lg mt-4">Respondemos en menos de 2 horas en horario laboral.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground mb-2">¡Mensaje enviado!</h2>
                  <p className="text-muted-foreground">Te responderemos pronto.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
                  <Input placeholder="Tu nombre" required />
                  <Input type="email" placeholder="Tu email" required />
                  <Select>
                    <option value="">¿En qué te ayudamos?</option>
                    <option value="demo">Quiero una demo</option>
                    <option value="soporte">Soporte técnico</option>
                    <option value="ventas">Información de precios</option>
                    <option value="otro">Otro</option>
                  </Select>
                  <Textarea placeholder="Tu mensaje..." rows={4} required />
                  <Button type="submit" variant="accent" size="lg" className="w-full">Enviar mensaje</Button>
                </form>
              )}
            </Card>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display text-foreground">También puedes contactarnos por</h2>
              {contactMethods.map((method, i) => (
                <a key={i} href={method.href} className="flex items-center gap-4 p-4 rounded-[14px] border border-border hover:shadow-soft transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                    <method.icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{method.title}</p>
                    <p className="text-muted-foreground text-sm">{method.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
