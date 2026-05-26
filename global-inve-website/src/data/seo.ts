export interface PageSEO {
  title: string
  description: string
  h1: string
  canonical: string
  ogTitle: string
  ogDescription: string
}

export const seoData: Record<string, PageSEO> = {
  '/': {
    title: 'Global Inve — Software POS en la nube para pymes',
    description: 'Gestiona tu punto de venta, inventario y fiados desde cualquier dispositivo. Desde $29,900/mes. Prueba gratis 7 días.',
    h1: 'Tu negocio merece un punto de venta que funcione de verdad',
    canonical: '/',
    ogTitle: 'Global Inve — Software POS en la nube',
    ogDescription: 'Punto de venta, inventario y fiados en la nube. Simple, accesible y sin contratos.',
  },
  '/planes-precios': {
    title: 'Precios Global Inve — Planes desde $29,900 COP/mes',
    description: 'Compara los planes Básico, Profesional y Empresarial. Sin contratos, sin tarjeta para empezar. Prueba gratis.',
    h1: 'Planes simples, precios justos',
    canonical: '/planes-precios',
    ogTitle: 'Planes y precios — Global Inve',
    ogDescription: 'Elige el plan perfecto para tu negocio. Desde $29,900 COP/mes.',
  },
  '/funcionalidades': {
    title: 'Funcionalidades — POS, inventario e informes | Global Inve',
    description: 'Punto de venta rápido, control de inventario, fiados digitales, informes claros. Todo desde tu celular o computador.',
    h1: 'Todo lo que necesitas para manejar tu negocio',
    canonical: '/funcionalidades',
    ogTitle: 'Funcionalidades — Global Inve',
    ogDescription: 'POS, inventario, fiados, informes y más. Gestiona tu negocio desde cualquier dispositivo.',
  },
  '/demo-gratis': {
    title: 'Prueba gratis Global Inve — 7 días sin tarjeta',
    description: 'Crea tu cuenta gratis en 2 minutos. Sin tarjeta de crédito, sin contratos. Empieza a vender hoy.',
    h1: 'Empieza gratis en 2 minutos',
    canonical: '/demo-gratis',
    ogTitle: 'Prueba gratis — Global Inve',
    ogDescription: 'Prueba Global Inve 7 días gratis. Sin tarjeta, sin compromiso.',
  },
  '/quienes-somos': {
    title: 'Quiénes somos — La historia de Global Inve',
    description: 'Más de 10 años ayudando a pymes en Colombia y España a digitalizar su negocio. Conoce nuestra historia.',
    h1: 'La historia detrás de Global Inve',
    canonical: '/quienes-somos',
    ogTitle: 'Quiénes somos — Global Inve',
    ogDescription: '10+ años digitalizando pymes en Latinoamérica y España.',
  },
  '/contacto': {
    title: 'Contacto — Habla con Global Inve',
    description: 'Escríbenos por WhatsApp, email o formulario. Respondemos en menos de 2 horas en horario laboral.',
    h1: '¿Tienes preguntas? Estamos aquí para ayudarte',
    canonical: '/contacto',
    ogTitle: 'Contacto — Global Inve',
    ogDescription: 'Contacta con nuestro equipo. WhatsApp, email o formulario.',
  },
  '/blog': {
    title: 'Blog Global Inve — Consejos para tu negocio',
    description: 'Artículos sobre inventario, fiados, punto de venta y gestión de negocios. Tips prácticos para pymes.',
    h1: 'Blog — Consejos para hacer crecer tu negocio',
    canonical: '/blog',
    ogTitle: 'Blog — Global Inve',
    ogDescription: 'Tips y consejos prácticos para pymes.',
  },
  '/software-pos-ferreteria': {
    title: 'Software POS para ferreterías — Global Inve',
    description: 'Controla miles de referencias, actualiza precios masivamente y lleva fiados digitales. Ideal para ferreterías.',
    h1: 'El punto de venta que entiende tu ferretería',
    canonical: '/software-pos-ferreteria',
    ogTitle: 'POS para ferreterías — Global Inve',
    ogDescription: 'Software punto de venta diseñado para ferreterías. Inventario, precios y fiados.',
  },
  '/software-pos-farmacia': {
    title: 'Software POS para farmacias y droguerías — Global Inve',
    description: 'Control de lotes, vencimientos y búsqueda rápida por nombre. Software POS ideal para droguerías.',
    h1: 'Control total de tu droguería, desde el celular',
    canonical: '/software-pos-farmacia',
    ogTitle: 'POS para farmacias — Global Inve',
    ogDescription: 'Software punto de venta para droguerías. Control de lotes y vencimientos.',
  },
  '/software-pos-restaurante': {
    title: 'Software POS para restaurantes — Global Inve',
    description: 'Vende en 3 toques, controla insumos por receta y cierra caja en minutos. POS para restaurantes.',
    h1: 'Tu restaurante merece una caja que no falle en hora pico',
    canonical: '/software-pos-restaurante',
    ogTitle: 'POS para restaurantes — Global Inve',
    ogDescription: 'Punto de venta rápido para restaurantes. Ventas, insumos y cierre automático.',
  },
  '/software-pos-tienda': {
    title: 'Software POS para tiendas de barrio — Global Inve',
    description: 'Controla fiados con nombre y monto exacto, lleva inventario simple y conoce tu ganancia real.',
    h1: '¿Cuánto te deben de fiado? Si no sabes exacto, necesitas esto',
    canonical: '/software-pos-tienda',
    ogTitle: 'POS para tiendas — Global Inve',
    ogDescription: 'Software punto de venta para tiendas. Fiados digitales e inventario simple.',
  },
  '/software-punto-venta-colombia': {
    title: 'Software punto de venta en Colombia — Global Inve',
    description: 'El POS #1 para pequeños negocios en Colombia. Régimen simple, precios en pesos. Desde $29,900/mes.',
    h1: 'Software punto de venta #1 para pequeños negocios en Colombia',
    canonical: '/software-punto-venta-colombia',
    ogTitle: 'POS Colombia — Global Inve',
    ogDescription: 'Software punto de venta para pymes colombianas. Desde $29,900/mes.',
  },
  '/software-tpv-espana': {
    title: 'Software TPV en la nube para autónomos — Global Inve',
    description: 'El TPV más sencillo para autónomos en España. Preparado para Verifactu 2026. Desde 3€/mes.',
    h1: 'El TPV en la nube más sencillo para autónomos en España',
    canonical: '/software-tpv-espana',
    ogTitle: 'TPV España — Global Inve',
    ogDescription: 'TPV en la nube para autónomos. Listo para Verifactu. Desde 3€/mes.',
  },
}
