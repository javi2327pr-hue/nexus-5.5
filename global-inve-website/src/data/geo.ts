export interface GeoPageContent {
  hero: {
    headline: string
    subtitle: string
    primaryCTA: string
    secondaryCTA: string
  }
  highlights: Array<{
    icon: string
    title: string
    description: string
  }>
  sectors: Array<{
    icon: string
    name: string
    link: string
  }>
  paymentMethods: Array<{
    name: string
    description: string
  }>
  ctaSection: {
    headline: string
    subtitle: string
    buttonText: string
  }
  verifactu?: {
    title: string
    description: string
    bullets: string[]
  }
}

export const colombiaContent: GeoPageContent = {
  hero: {
    headline:
      "Software punto de venta #1 para pequeños negocios en Colombia",
    subtitle:
      "Ideal si estás en régimen simple o no eres responsable de IVA. Controla tu inventario, factura y vende desde cualquier dispositivo. Sin contratos, sin sorpresas.",
    primaryCTA: "Prueba gratis",
    secondaryCTA: "Ver precios para Colombia",
  },
  highlights: [
    {
      icon: "Shield",
      title: "Ideal para régimen simple",
      description:
        "Configura tu negocio en minutos. Cumple con la normativa colombiana sin complicaciones, ya seas régimen simple o no responsable de IVA.",
    },
    {
      icon: "MapPin",
      title: "Precios en pesos colombianos",
      description:
        "Planes desde $29.900/mes. Pagas en tu moneda local, sin conversiones ni cargos ocultos. Tu negocio merece precios justos.",
    },
    {
      icon: "Headphones",
      title: "Soporte en tu horario",
      description:
        "Nuestro equipo te acompaña en horario colombiano. Resuelve tus dudas por chat o correo sin esperar a otra zona horaria.",
    },
    {
      icon: "Smartphone",
      title: "Funciona en cualquier dispositivo",
      description:
        "Usa tu celular, tablet o computador. No necesitas equipos especiales. Solo abre el navegador y empieza a vender.",
    },
  ],
  sectors: [
    {
      icon: "Wrench",
      name: "Ferreterías",
      link: "/software-pos-ferreteria",
    },
    {
      icon: "Store",
      name: "Tiendas de barrio",
      link: "/software-pos-tienda-de-barrio",
    },
    {
      icon: "UtensilsCrossed",
      name: "Restaurantes",
      link: "/software-pos-restaurante",
    },
    {
      icon: "Pill",
      name: "Farmacias y Droguerías",
      link: "/software-pos-farmacia",
    },
    {
      icon: "Scissors",
      name: "Peluquerías",
      link: "/software-pos-peluqueria",
    },
    {
      icon: "ShoppingBag",
      name: "Misceláneas",
      link: "/software-pos-miscelanea",
    },
  ],
  paymentMethods: [
    {
      name: "Nequi",
      description:
        "Recibe pagos con Nequi directamente. Tus clientes pagan desde su celular en segundos.",
    },
    {
      name: "Daviplata",
      description:
        "Acepta Daviplata y llega a millones de usuarios en Colombia que prefieren pagar desde su billetera digital.",
    },
    {
      name: "PSE",
      description:
        "Cobra por transferencia bancaria con PSE. Seguro, rápido y sin intermediarios.",
    },
    {
      name: "Tarjeta de crédito",
      description:
        "Acepta Visa, Mastercard y las principales tarjetas. Ofrece a tus clientes la flexibilidad que necesitan.",
    },
    {
      name: "Efectivo",
      description:
        "Registra ventas en efectivo sin problema. Lleva el control exacto de tu caja diaria.",
    },
  ],
  ctaSection: {
    headline: "Empieza hoy con tu negocio en Colombia",
    subtitle:
      "Crea tu cuenta gratis en menos de 2 minutos. Sin tarjeta de crédito, sin compromisos. Tu punto de venta listo para vender.",
    buttonText: "Crear cuenta gratis",
  },
}

export const espanaContent: GeoPageContent = {
  hero: {
    headline:
      "El TPV en la nube más sencillo para autónomos en España",
    subtitle:
      "Si eres autónomo o tienes una micropyme, necesitas un sistema de cobro simple que cumpla con Verifactu. Sin instalaciones, sin hardware, sin complicaciones.",
    primaryCTA: "Prueba gratis",
    secondaryCTA: "Ver precios para España",
  },
  highlights: [
    {
      icon: "Shield",
      title: "Listo para Verifactu 2026",
      description:
        "Cumple con la normativa de facturación electrónica desde el primer día. Tu software ya está preparado para los requisitos de la Agencia Tributaria.",
    },
    {
      icon: "Euro",
      title: "Precios en euros",
      description:
        "Planes desde 3 €/mes. Sin sorpresas en la factura. Pagas exactamente lo que ves, en tu moneda y con IVA incluido.",
    },
    {
      icon: "Headphones",
      title: "Soporte en español",
      description:
        "Hablas con personas reales que entienden tu negocio. Te ayudamos por chat o correo en tu idioma y tu horario.",
    },
    {
      icon: "Smartphone",
      title: "Sin instalación",
      description:
        "Abre el navegador y empieza a cobrar. Funciona en tu móvil, tablet u ordenador. Cero configuración técnica.",
    },
  ],
  sectors: [
    {
      icon: "Wrench",
      name: "Ferreterías",
      link: "/software-pos-ferreteria",
    },
    {
      icon: "Store",
      name: "Comercios minoristas",
      link: "/software-pos-tienda",
    },
    {
      icon: "UtensilsCrossed",
      name: "Restaurantes",
      link: "/software-pos-restaurante",
    },
    {
      icon: "Pill",
      name: "Farmacias",
      link: "/software-pos-farmacia",
    },
    {
      icon: "Scissors",
      name: "Peluquerías",
      link: "/software-pos-peluqueria",
    },
    {
      icon: "ShoppingBag",
      name: "Bazares",
      link: "/software-pos-bazar",
    },
  ],
  paymentMethods: [
    {
      name: "Bizum",
      description:
        "Cobra al instante con Bizum. Tus clientes pagan desde su móvil sin necesidad de efectivo ni datáfono.",
    },
    {
      name: "Tarjeta",
      description:
        "Acepta Visa, Mastercard y las principales tarjetas de débito y crédito. Rápido y seguro.",
    },
    {
      name: "Domiciliación bancaria",
      description:
        "Configura cobros recurrentes por domiciliación SEPA. Perfecto para suscripciones y clientes habituales.",
    },
    {
      name: "Efectivo",
      description:
        "Registra cada venta en efectivo. Controla tu caja diaria con precisión y sin errores.",
    },
  ],
  ctaSection: {
    headline: "Prueba gratis el TPV más fácil de España",
    subtitle:
      "Alta en menos de 2 minutos. Sin tarjeta de crédito, sin permanencia. Tu TPV listo para facturar conforme a Verifactu.",
    buttonText: "Empezar gratis",
  },
  verifactu: {
    title: "Preparado para Verifactu: la nueva obligación de facturación electrónica",
    description:
      "A partir de julio de 2026, todos los autónomos y empresas en España deberán usar software de facturación certificado bajo el reglamento Verifactu (Real Decreto 1007/2023). Esta normativa exige que cada factura se registre de forma inalterable y se comunique a la Agencia Tributaria. Global Inve ya cumple con estos requisitos para que tú no tengas que preocuparte.",
    bullets: [
      "Registro inalterable de cada factura con huella digital y código QR verificable, tal como exige la normativa.",
      "Envío automático de los registros de facturación a la Agencia Tributaria. Tú facturas y el sistema se encarga del resto.",
      "Actualizaciones continuas incluidas en tu plan. Cuando la normativa cambie, tu software se adapta sin coste extra.",
    ],
  },
}
