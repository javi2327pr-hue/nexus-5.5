export interface PricingPlan {
  name: string
  description: string
  priceCOP: number
  priceEUR: number
  period: string
  features: string[]
  highlighted: boolean
  cta: string
  badge?: string
}

export const plans: PricingPlan[] = [
  {
    name: 'Básico',
    description: 'Ideal para empezar a digitalizar tu negocio',
    priceCOP: 29900,
    priceEUR: 3,
    period: '/mes',
    features: [
      '1 punto de venta',
      '1 usuario',
      'Hasta 500 productos',
      'Informes básicos de venta',
      'Soporte por WhatsApp',
      'Acceso desde cualquier dispositivo',
    ],
    highlighted: false,
    cta: 'Empezar gratis',
  },
  {
    name: 'Profesional',
    description: 'Para negocios que quieren crecer con control total',
    priceCOP: 59900,
    priceEUR: 6,
    period: '/mes',
    features: [
      'Hasta 3 puntos de venta',
      '3 usuarios',
      'Productos ilimitados',
      'Control de fiados y cuentas por cobrar',
      'Informes completos',
      'Soporte prioritario',
      'Gestión de gastos',
    ],
    highlighted: true,
    cta: 'Probar gratis',
    badge: 'Más popular',
  },
  {
    name: 'Empresarial',
    description: 'Para negocios con varias sucursales',
    priceCOP: 99900,
    priceEUR: 10,
    period: '/mes',
    features: [
      'Puntos de venta ilimitados',
      'Hasta 10 usuarios',
      'Multi-sucursal',
      'Facturación electrónica',
      'Onboarding personalizado',
      'Soporte prioritario 24/7',
      'Informes avanzados por sucursal',
      'API de integración',
    ],
    highlighted: false,
    cta: 'Contactar ventas',
  },
]

export interface PricingFeatureComparison {
  feature: string
  basico: string | boolean
  profesional: string | boolean
  empresarial: string | boolean
}

export const featureComparison: PricingFeatureComparison[] = [
  {
    feature: 'Puntos de venta',
    basico: '1',
    profesional: 'Hasta 3',
    empresarial: 'Ilimitados',
  },
  {
    feature: 'Usuarios incluidos',
    basico: '1',
    profesional: '3',
    empresarial: '10',
  },
  {
    feature: 'Productos',
    basico: 'Hasta 500',
    profesional: 'Ilimitados',
    empresarial: 'Ilimitados',
  },
  {
    feature: 'Informes de venta',
    basico: 'Básicos',
    profesional: 'Completos',
    empresarial: 'Avanzados por sucursal',
  },
  {
    feature: 'Control de fiados',
    basico: false,
    profesional: true,
    empresarial: true,
  },
  {
    feature: 'Gestión de gastos',
    basico: false,
    profesional: true,
    empresarial: true,
  },
  {
    feature: 'Multi-sucursal',
    basico: false,
    profesional: false,
    empresarial: true,
  },
  {
    feature: 'Facturación electrónica',
    basico: false,
    profesional: false,
    empresarial: true,
  },
  {
    feature: 'Soporte',
    basico: 'WhatsApp',
    profesional: 'Prioritario',
    empresarial: 'Prioritario 24/7',
  },
  {
    feature: 'Onboarding personalizado',
    basico: false,
    profesional: false,
    empresarial: true,
  },
  {
    feature: 'API de integración',
    basico: false,
    profesional: false,
    empresarial: true,
  },
  {
    feature: 'Acceso desde cualquier dispositivo',
    basico: true,
    profesional: true,
    empresarial: true,
  },
]
