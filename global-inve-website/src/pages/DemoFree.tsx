import { useState } from 'react'
import { SEOHead } from '../components/seo/SEOHead'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'
import { Check, CreditCard } from 'lucide-react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { cn } from '../lib/utils'

const benefitsList = [
  'Acceso completo por 7 días',
  'Sin tarjeta de crédito',
  'Soporte por WhatsApp incluido',
  'Tus datos se mantienen al activar un plan',
  'Cancela cuando quieras',
]

export default function DemoFree() {
  const { ref, isVisible } = useIntersectionObserver()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SEOHead />
      <section className="py-20 px-6 bg-hero">
        <div ref={ref} className={cn('max-w-5xl mx-auto', isVisible ? 'animate-fade-up' : 'opacity-0')}>
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">Sin tarjeta de crédito</Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground">
              Empieza gratis en 2 minutos
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Crea tu cuenta y empieza a usar Global Inve hoy. Sin compromiso, sin complicaciones.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card className="p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground mb-2">¡Cuenta creada!</h2>
                  <p className="text-muted-foreground">Revisa tu email para activar tu cuenta.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
                    <Input placeholder="Tu nombre completo" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <Input type="email" placeholder="tu@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">WhatsApp</label>
                    <Input type="tel" placeholder="+57 300 123 4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Tipo de negocio</label>
                    <Select required>
                      <option value="">Selecciona...</option>
                      <option value="ferreteria">Ferretería</option>
                      <option value="tienda">Tienda de barrio</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="farmacia">Farmacia / Droguería</option>
                      <option value="peluqueria">Peluquería</option>
                      <option value="otro">Otro</option>
                    </Select>
                  </div>
                  <Button type="submit" variant="accent" size="lg" className="w-full">
                    Crear mi cuenta gratis
                  </Button>
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <CreditCard className="w-3 h-3" /> Sin tarjeta de crédito requerida
                  </p>
                </form>
              )}
            </Card>
            <div>
              <h2 className="text-2xl font-bold font-display text-foreground mb-6">¿Qué incluye tu prueba gratis?</h2>
              <ul className="space-y-4">
                {benefitsList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
