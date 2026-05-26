export interface Testimonial {
  id: string
  name: string
  business: string
  city: string
  country: 'CO' | 'ES'
  industry: string
  quote: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'carlos-mendoza',
    name: 'Carlos Mendoza',
    business: 'Ferretería El Maestro',
    city: 'Cali',
    country: 'CO',
    industry: 'ferreteria',
    quote:
      'Antes perdía mercancía sin darme cuenta. Con Global Inve detecté $1.800.000 en faltantes el primer mes y ahora mis inventarios cuadran al 98%.',
    avatar: '/testimonials/carlos-mendoza.webp',
  },
  {
    id: 'jorge-hernandez',
    name: 'Jorge Hernández',
    business: 'Ferretería San José',
    city: 'Ibagué',
    country: 'CO',
    industry: 'ferreteria',
    quote:
      'Actualizar precios de 3.000 productos me tomaba un día entero. Ahora cargo la lista del proveedor y en 10 minutos está todo actualizado.',
    avatar: '/testimonials/jorge-hernandez.webp',
  },
  {
    id: 'martha-rios',
    name: 'Martha Lucía Ríos',
    business: 'Tienda La Esquina',
    city: 'Bogotá',
    country: 'CO',
    industry: 'tienda',
    quote:
      'Recuperé $200.000 en fiados el primer mes porque el sistema me avisa cuándo cobrar. Antes se me olvidaba y la plata se perdía.',
    avatar: '/testimonials/martha-rios.webp',
  },
  {
    id: 'yolanda-castillo',
    name: 'Yolanda Castillo',
    business: 'Minimercado Don Pepe',
    city: 'Medellín',
    country: 'CO',
    industry: 'tienda',
    quote:
      'Por fin sé exactamente cuánto vendo cada día. El mes pasado descubrí que los sábados vendo el doble y ajusté mi surtido. Las ganancias subieron un 15%.',
    avatar: '/testimonials/yolanda-castillo.webp',
  },
  {
    id: 'alejandra-munoz',
    name: 'Alejandra Muñoz',
    business: 'Droguería Salud Vital',
    city: 'Medellín',
    country: 'CO',
    industry: 'farmacia',
    quote:
      'El control de vencimientos me salvó de perder un lote de medicamentos por $3.500.000. El sistema me avisó con 90 días de anticipación y alcancé a devolverlo al laboratorio.',
    avatar: '/testimonials/alejandra-munoz.webp',
  },
  {
    id: 'andres-patino',
    name: 'Andrés Patiño',
    business: 'Sazón Criollo',
    city: 'Bucaramanga',
    country: 'CO',
    industry: 'restaurante',
    quote:
      'Reduje el tiempo de cierre de caja de 1 hora a 5 minutos. Mi cajero ya no se queda hasta tarde y los cuadres salen exactos todos los días.',
    avatar: '/testimonials/andres-patino.webp',
  },
  {
    id: 'lucia-ramirez',
    name: 'Lucía Ramírez',
    business: 'Peluquería Bella Style',
    city: 'Barranquilla',
    country: 'CO',
    industry: 'peluqueria',
    quote:
      'Antes llevaba las citas en un cuaderno y se me cruzaban. Ahora manejo agenda y ventas de productos desde el celular, y las cancelaciones bajaron un 40%.',
    avatar: '/testimonials/lucia-ramirez.webp',
  },
  {
    id: 'miguel-torres',
    name: 'Miguel Ángel Torres',
    business: 'Bazar El Olivo',
    city: 'Madrid',
    country: 'ES',
    industry: 'tienda',
    quote:
      'Como autónomo necesitaba un TPV sencillo y barato. En 20 minutos ya estaba facturando. Llevo 8 meses y no he necesitado llamar a soporte ni una vez.',
    avatar: '/testimonials/miguel-torres.webp',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Filtra testimonios por industria. */
export function getTestimonialsByIndustry(industry: string): Testimonial[] {
  return testimonials.filter((t) => t.industry === industry)
}

/** Filtra testimonios por país. */
export function getTestimonialsByCountry(country: 'CO' | 'ES'): Testimonial[] {
  return testimonials.filter((t) => t.country === country)
}

// ─── Prueba social (métricas destacadas) ─────────────────────────────────────

export interface SocialProof {
  value: string
  label: string
}

export const socialProofStats: SocialProof[] = [
  { value: '500+', label: 'Negocios confían en Global Inve' },
  { value: '4', label: 'Países en Latinoamérica y Europa' },
  { value: '10+', label: 'Años de experiencia' },
  { value: '99.9%', label: 'Disponibilidad del servicio' },
]
