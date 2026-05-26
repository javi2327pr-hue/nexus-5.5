// ---------------------------------------------------------------------------
// Global Inve – Home page copy
// Language: Spanish LATAM (neutral)
// Tone: close, direct, empathetic – second person present tense
// ---------------------------------------------------------------------------

export interface HeroContent {
  headline: string
  subtitle: string
  primaryCTA: string
  secondaryCTA: string
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface Step {
  number: number
  title: string
  description: string
}

export interface ComparisonRow {
  feature: string
  globalInve: string
  expensive: string
  notebook: string
}

export interface Testimonial {
  name: string
  business: string
  city: string
  quote: string
}

export interface CTAContent {
  headline: string
  subtitle: string
  buttonText: string
}

// ── Hero ────────────────────────────────────────────────────────────────────

export const heroContent: HeroContent = {
  headline: 'Tu negocio merece un punto de venta que funcione de verdad',
  subtitle:
    'Controla ventas, inventario y reportes desde cualquier lugar. Sin instalaciones, sin contratos largos y desde $29.900 COP al mes.',
  primaryCTA: 'Prueba gratis 7 dias',
  secondaryCTA: 'Ver como funciona',
}

// ── Benefits ────────────────────────────────────────────────────────────────

export const benefits: Benefit[] = [
  {
    icon: 'Zap',
    title: 'Vende mas rapido, sin complicaciones',
    description:
      'Registra ventas en segundos con una interfaz clara y sencilla. No necesitas capacitacion ni manuales. Abres la app y empiezas a vender.',
  },
  {
    icon: 'Shield',
    title: 'Tu inventario siempre bajo control',
    description:
      'Sabes que tienes, que se esta agotando y que necesitas pedir. El sistema actualiza las existencias en tiempo real con cada venta.',
  },
  {
    icon: 'BarChart3',
    title: 'Reportes que si entiendes',
    description:
      'Mira cuanto vendiste hoy, cual es tu producto estrella y como va el mes. Graficas simples, datos claros, decisiones mejores.',
  },
]

// ── How it works ────────────────────────────────────────────────────────────

export const steps: Step[] = [
  {
    number: 1,
    title: 'Crea tu cuenta gratis',
    description:
      'Solo necesitas un correo y un nombre para tu negocio. En menos de dos minutos ya tienes todo listo.',
  },
  {
    number: 2,
    title: 'Agrega tus productos',
    description:
      'Sube tu catalogo manualmente o importa una lista desde Excel. Ponles precio, foto y categoria.',
  },
  {
    number: 3,
    title: 'Empieza a vender',
    description:
      'Registra ventas, genera tickets y lleva el control de tu negocio desde el celular, tablet o computador.',
  },
]

// ── Comparison table ────────────────────────────────────────────────────────

export const comparisonData: ComparisonRow[] = [
  {
    feature: 'Precio',
    globalInve: 'Desde $29.900 COP/mes',
    expensive: 'Desde $150.000 COP/mes',
    notebook: 'Gratis, pero te cuesta errores',
  },
  {
    feature: 'Facilidad',
    globalInve: 'Lista en 5 minutos',
    expensive: 'Dias de instalacion y capacitacion',
    notebook: 'Facil, pero lento y propenso a fallos',
  },
  {
    feature: 'Inventario',
    globalInve: 'Automatico y en tiempo real',
    expensive: 'Automatico, pero dificil de configurar',
    notebook: 'Manual, con errores frecuentes',
  },
  {
    feature: 'Reportes',
    globalInve: 'Graficas claras al instante',
    expensive: 'Reportes complejos, dificiles de leer',
    notebook: 'No hay reportes, solo numeros sueltos',
  },
  {
    feature: 'Acceso',
    globalInve: 'Desde cualquier dispositivo con internet',
    expensive: 'Solo en el computador donde se instalo',
    notebook: 'Solo donde este el cuaderno o archivo',
  },
  {
    feature: 'Soporte',
    globalInve: 'Chat y WhatsApp en tu horario',
    expensive: 'Tickets con respuesta en 48 horas',
    notebook: 'Nadie te ayuda si pierdes los datos',
  },
]

// ── Testimonials ────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    name: 'Carolina Mendez',
    business: 'Tienda Naturista Vida Verde',
    city: 'Bogota, Colombia',
    quote:
      'Antes cerraba la caja y nunca me cuadraba. Con Global Inve reduje las perdidas de inventario un 40% en el primer mes.',
  },
  {
    name: 'Miguel Torres',
    business: 'Papeleria El Lapiz Rojo',
    city: 'Medellin, Colombia',
    quote:
      'Lo configure un domingo en la noche y el lunes ya estaba facturando. Mis empleados lo aprendieron solos, sin capacitacion.',
  },
  {
    name: 'Lucia Ramirez',
    business: 'Minimarket Don Pepe',
    city: 'Valencia, Espana',
    quote:
      'Ahora se exactamente cuales productos me dejan ganancia y cuales no. Deje de comprar lo que no se vende y ahorro cada mes.',
  },
]

// ── Final CTA ───────────────────────────────────────────────────────────────

export const ctaContent: CTAContent = {
  headline: 'Empieza hoy, sin riesgo',
  subtitle:
    'Prueba Global Inve gratis durante 7 dias. No necesitas tarjeta de credito y puedes cancelar cuando quieras.',
  buttonText: 'Crear mi cuenta gratis',
}
