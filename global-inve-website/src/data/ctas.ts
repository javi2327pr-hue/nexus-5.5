export interface CTADefinition {
  id: string
  text: string
  variant: 'primary' | 'secondary' | 'outline'
  href: string
  pages: string[]
}

// ─── CTAs principales de conversión ──────────────────────────────────────────
export const primaryCTAs: CTADefinition[] = [
  {
    id: 'probar-gratis',
    text: 'Probar gratis',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['home', 'funcionalidades', 'precios'],
  },
  {
    id: 'crear-cuenta',
    text: 'Crear mi cuenta gratis',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['home-hero'],
  },
  {
    id: 'empezar-gratis',
    text: 'Empezar gratis',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['precios'],
  },
]

// ─── CTAs secundarios / exploración ──────────────────────────────────────────
export const secondaryCTAs: CTADefinition[] = [
  {
    id: 'ver-como-funciona',
    text: 'Ver cómo funciona',
    variant: 'outline',
    href: '/funcionalidades',
    pages: ['home'],
  },
  {
    id: 'ver-planes',
    text: 'Ver planes',
    variant: 'outline',
    href: '/planes-precios',
    pages: ['funcionalidades', 'industrias'],
  },
  {
    id: 'hablar-asesor',
    text: 'Hablar con un asesor',
    variant: 'secondary',
    href: '/contacto',
    pages: ['precios', 'empresarial'],
  },
  {
    id: 'agendar-demo',
    text: 'Agendar una demostración',
    variant: 'secondary',
    href: '/contacto',
    pages: ['empresarial', 'funcionalidades'],
  },
  {
    id: 'comparar-planes',
    text: 'Comparar planes',
    variant: 'outline',
    href: '/planes-precios#comparar',
    pages: ['home', 'precios'],
  },
]

// ─── CTAs por industria ──────────────────────────────────────────────────────
export const industryCTAs: CTADefinition[] = [
  {
    id: 'ferreteria',
    text: 'Probar gratis — ideal para ferreterías',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['ferreteria'],
  },
  {
    id: 'tienda',
    text: 'Probar gratis — ideal para tiendas',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['tienda'],
  },
  {
    id: 'restaurante',
    text: 'Probar gratis — ideal para restaurantes',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['restaurante'],
  },
  {
    id: 'farmacia',
    text: 'Probar gratis — ideal para droguerías',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['farmacia'],
  },
  {
    id: 'peluqueria',
    text: 'Probar gratis — ideal para peluquerías',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['peluqueria'],
  },
  {
    id: 'minimercado',
    text: 'Probar gratis — ideal para minimercados',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['minimercado'],
  },
]

// ─── CTAs por país / región ──────────────────────────────────────────────────
export const geoCTAs: CTADefinition[] = [
  {
    id: 'colombia',
    text: 'Empezar gratis en Colombia',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['colombia'],
  },
  {
    id: 'espana',
    text: 'Prueba gratis el TPV',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['espana'],
  },
  {
    id: 'mexico',
    text: 'Empezar gratis en México',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['mexico'],
  },
  {
    id: 'peru',
    text: 'Empezar gratis en Perú',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['peru'],
  },
]

// ─── CTAs del navbar y footer ────────────────────────────────────────────────
export const navCTAs: CTADefinition[] = [
  {
    id: 'nav-probar-gratis',
    text: 'Probar gratis',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['navbar'],
  },
  {
    id: 'nav-iniciar-sesion',
    text: 'Iniciar sesión',
    variant: 'outline',
    href: '/login',
    pages: ['navbar'],
  },
]

export const footerCTAs: CTADefinition[] = [
  {
    id: 'footer-empezar',
    text: 'Empieza gratis hoy',
    variant: 'primary',
    href: '/demo-gratis',
    pages: ['footer'],
  },
  {
    id: 'footer-soporte',
    text: 'Contactar soporte',
    variant: 'outline',
    href: '/contacto',
    pages: ['footer'],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Devuelve todos los CTAs que aparecen en una página determinada. */
export function getCTAsForPage(page: string): CTADefinition[] {
  const all: CTADefinition[] = [
    ...primaryCTAs,
    ...secondaryCTAs,
    ...industryCTAs,
    ...geoCTAs,
    ...navCTAs,
    ...footerCTAs,
  ]
  return all.filter((cta) => cta.pages.includes(page))
}

/** Busca un CTA por su id. */
export function getCTAById(id: string): CTADefinition | undefined {
  const all: CTADefinition[] = [
    ...primaryCTAs,
    ...secondaryCTAs,
    ...industryCTAs,
    ...geoCTAs,
    ...navCTAs,
    ...footerCTAs,
  ]
  return all.find((cta) => cta.id === id)
}
