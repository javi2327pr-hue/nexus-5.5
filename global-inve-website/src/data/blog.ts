export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  slug: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Cómo llevar el inventario de tu ferretería sin perder la cabeza',
    excerpt:
      'Tornillos, tuercas, arandelas... manejar miles de productos pequeños es un caos si lo haces en papel. Te mostramos un sistema paso a paso para organizar tu ferretería y saber exactamente qué tienes en cada estante.',
    category: 'Inventario',
    readTime: '5 min',
    date: '2025-01-15',
    slug: 'inventario-ferreteria',
  },
  {
    id: '2',
    title: '5 errores que todo tendero comete con los fiados',
    excerpt:
      'Fiar es parte del negocio, pero hacerlo sin control te puede costar más de lo que imaginas. Descubre los errores más comunes y cómo evitarlos para que los fiados no se coman tu ganancia.',
    category: 'Fiados',
    readTime: '4 min',
    date: '2025-01-08',
    slug: 'errores-fiados-tendero',
  },
  {
    id: '3',
    title: 'TPV para autónomos en España: qué necesitas antes de Verifactu 2026',
    excerpt:
      'La normativa Verifactu cambia las reglas del juego para los autónomos españoles. Te explicamos qué exige la ley, qué debe tener tu software de facturación y cómo prepararte sin estrés antes de la fecha límite.',
    category: 'España',
    readTime: '6 min',
    date: '2025-01-02',
    slug: 'tpv-autonomos-espana-verifactu',
  },
  {
    id: '4',
    title: 'Guía rápida: cómo fijar precios de venta sin regalar tu ganancia',
    excerpt:
      'Muchos negocios pequeños ponen precios "a ojo" y terminan vendiendo sin margen. Aprende una fórmula sencilla para calcular tu precio ideal considerando costos, competencia y el valor que ofreces.',
    category: 'Gestión',
    readTime: '5 min',
    date: '2024-12-20',
    slug: 'fijar-precios-venta-ganancia',
  },
  {
    id: '5',
    title: 'Cómo pasar de la libreta al software sin morir en el intento',
    excerpt:
      'El cambio da miedo, pero no tiene que ser difícil. Te contamos la experiencia real de tres tenderos que dejaron el cuaderno y hoy manejan su negocio desde el celular con más control y menos estrés.',
    category: 'Tecnología',
    readTime: '4 min',
    date: '2024-12-12',
    slug: 'libreta-software-tendero',
  },
  {
    id: '6',
    title: '¿Tu negocio necesita un punto de venta digital? 7 señales claras',
    excerpt:
      'No todos los negocios están listos para dar el salto digital al mismo tiempo. Estas siete señales te ayudan a saber si ya es momento de dejar la caja registradora tradicional y modernizar tu forma de vender.',
    category: 'Punto de venta',
    readTime: '5 min',
    date: '2024-12-01',
    slug: 'senales-punto-venta-digital',
  },
]
