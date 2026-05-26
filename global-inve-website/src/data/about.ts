export interface AboutContent {
  hero: {
    headline: string
    subtitle: string
  }
  story: {
    title: string
    paragraphs: string[] // 2-3 short paragraphs about founding story
  }
  numbers: Array<{
    value: string
    label: string
  }>
  mission: {
    title: string
    text: string
  }
  vision: {
    title: string
    text: string
  }
  values: Array<{
    icon: string
    title: string
    description: string
  }>
}

export const aboutContent: AboutContent = {
  hero: {
    headline: 'Creamos software para que tu negocio crezca sin complicaciones',
    subtitle:
      'Somos un equipo latinoamericano que entiende los retos de manejar un negocio pequeño. Por eso construimos herramientas simples, accesibles y pensadas para ti.',
  },
  story: {
    title: 'Nuestra historia',
    paragraphs: [
      'Global Inve nació en 2014 en Bogotá, Colombia. Nuestro fundador visitaba tiendas de barrio, ferreterías y minimarkets para un proyecto universitario y encontró lo mismo en todas: cuadernos llenos de números tachados, bolsas con facturas desordenadas y dueños que no sabían con certeza cuánto habían vendido el mes anterior. Ese desorden no era por falta de ganas, sino porque las herramientas disponibles eran caras, complicadas o pensadas para empresas grandes.',
      'Así empezó todo. Con un prototipo básico que ayudaba a registrar ventas y llevar el inventario desde un celular. Lo probamos con Don Ricardo, que tenía una ferretería en el barrio Restrepo, y con Doña Marta, que manejaba una miscelánea en Soacha. Sus comentarios honestos moldearon cada función que existe hoy. Si ellos podían usarlo sin capacitación, servía. Si no, lo rehacíamos.',
      'Hoy Global Inve ayuda a más de 500 negocios en Colombia, México, Ecuador y España a vender más rápido, controlar su inventario y cobrar sus fiados sin estrés. Seguimos construyendo con la misma filosofía: escuchar primero, simplificar siempre y nunca olvidar que detrás de cada cuenta hay una persona que se levanta temprano a trabajar.',
    ],
  },
  numbers: [
    {
      value: '500+',
      label: 'Negocios confían en nosotros',
    },
    {
      value: '4',
      label: 'Países con usuarios activos',
    },
    {
      value: '10+',
      label: 'Años desarrollando el producto',
    },
    {
      value: '99.9%',
      label: 'Disponibilidad de la plataforma',
    },
  ],
  mission: {
    title: 'Nuestra misión',
    text: 'Darle a cada negocio pequeño las mismas herramientas tecnológicas que usan las grandes cadenas, pero a un precio justo y con una experiencia tan simple que no necesites un manual para empezar.',
  },
  vision: {
    title: 'Nuestra visión',
    text: 'Ser la plataforma de gestión preferida por los negocios pequeños de habla hispana. Queremos que administrar tu tienda sea tan fácil como enviar un mensaje de texto.',
  },
  values: [
    {
      icon: 'Sparkles',
      title: 'Simplicidad',
      description:
        'Si una función necesita un tutorial para entenderse, todavía no está lista. Diseñamos para personas reales, no para expertos en tecnología.',
    },
    {
      icon: 'Heart',
      title: 'Cercanía',
      description:
        'Conocemos a nuestros usuarios por su nombre. Respondemos mensajes de WhatsApp, escuchamos sus ideas y las convertimos en mejoras reales.',
    },
    {
      icon: 'Eye',
      title: 'Transparencia',
      description:
        'Sin letras pequeñas ni costos escondidos. Sabes exactamente qué pagas, qué incluye tu plan y qué viene en la próxima actualización.',
    },
    {
      icon: 'Lightbulb',
      title: 'Innovación',
      description:
        'Mejoramos cada semana. Escuchamos lo que pides, probamos ideas nuevas y lanzamos funciones que resuelven problemas reales de tu día a día.',
    },
  ],
}
