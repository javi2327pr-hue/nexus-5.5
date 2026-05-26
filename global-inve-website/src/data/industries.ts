export interface IndustryPain {
  icon: string
  title: string
  description: string
}

export interface IndustrySolution {
  icon: string
  title: string
  description: string
}

export interface IndustryTestimonial {
  name: string
  business: string
  city: string
  quote: string
}

export interface ComparisonRow {
  aspect: string
  before: string
  after: string
}

export interface IndustryContent {
  slug: string
  hero: {
    headline: string
    subtitle: string
    primaryCTA: string
    secondaryCTA: string
  }
  pains: IndustryPain[]
  solutions: IndustrySolution[]
  testimonial: IndustryTestimonial
  comparison?: ComparisonRow[]
  ctaSection: {
    headline: string
    buttonText: string
  }
}

export const industries: Record<string, IndustryContent> = {
  ferreteria: {
    slug: "ferreteria",
    hero: {
      headline: "El punto de venta que entiende tu ferretería",
      subtitle:
        "Miles de referencias, precios que cambian cada semana y fiados en cuadernos. Sabemos lo difícil que es. Global Inve te da el control desde el primer día.",
      primaryCTA: "Probar gratis",
      secondaryCTA: "Ver cómo funciona",
    },
    pains: [
      {
        icon: "Package",
        title: "Miles de referencias difíciles de controlar",
        description:
          "Tornillos, tubos, pinturas, herramientas... Cada día llegan productos nuevos y no sabes cuántos te quedan. Buscar en el estante no es inventario.",
      },
      {
        icon: "DollarSign",
        title: "Precios que cambian cada semana",
        description:
          "El proveedor sube precios y tú sigues vendiendo al precio viejo. Pierdes margen sin darte cuenta. Actualizar uno por uno en el cuaderno es imposible.",
      },
      {
        icon: "BookOpen",
        title: "Fiados que se pierden en el cuaderno",
        description:
          "El cliente dice que ya pagó. Tú no encuentras la página. Al final, prefieres no cobrar para no pelear. Ese dinero no vuelve.",
      },
      {
        icon: "Calculator",
        title: "Caja que nunca cuadra al final del día",
        description:
          "Sumas, restas, vueltos mal dados. Llegas a la noche y faltan $50.000. No sabes si fue error o si alguien tomó de la caja.",
      },
    ],
    solutions: [
      {
        icon: "Package",
        title: "Inventario inteligente",
        description:
          "Registra productos con lector de código de barras, organiza por categorías y sube tu catálogo completo con importación masiva. Sabes qué tienes y qué se está agotando.",
      },
      {
        icon: "TrendingUp",
        title: "Actualización masiva de precios",
        description:
          "Cambia los precios de toda una categoría en segundos. El margen se protege automáticamente. No más sorpresas al final del mes.",
      },
      {
        icon: "Users",
        title: "Fiados digitales con control real",
        description:
          "Cada fiado queda registrado con nombre del cliente, monto y fecha. Recibes alertas de deudas vencidas. Cobras con confianza y sin discusiones.",
      },
      {
        icon: "Calculator",
        title: "Caja automatizada",
        description:
          "El cierre de caja se genera solo. Ves cada venta, cada pago, cada diferencia. Si algo no cuadra, sabes exactamente dónde buscar.",
      },
    ],
    testimonial: {
      name: "Don Carlos",
      business: "Ferretería El Maestro",
      city: "Cali",
      quote:
        "Antes cerraba caja en una hora y siempre faltaba plata. Ahora en 5 minutos sé exactamente cuánto vendí. Los fiados ya no se me pierden. Ojalá hubiera empezado antes.",
    },
    ctaSection: {
      headline:
        "Tu ferretería merece orden sin complicaciones. Empieza hoy, es gratis.",
      buttonText: "Probar gratis — ideal para ferreterías",
    },
  },

  tienda: {
    slug: "tienda",
    hero: {
      headline:
        "¿Cuánto te deben de fiado? Si no sabes exacto, necesitas esto.",
      subtitle:
        "Tu tienda de barrio es el corazón del vecindario. Pero si no controlas lo que vendes, lo que te deben y lo que ganas, trabajas para los demás. Global Inve te ayuda a cambiar eso.",
      primaryCTA: "Probar gratis",
      secondaryCTA: "Ver cómo funciona",
    },
    pains: [
      {
        icon: "BookOpen",
        title: "Fiados que se olvidan",
        description:
          "Apuntas en el cuaderno, pero la hoja se pierde. El cliente no recuerda. Tú tampoco. Al final del mes, miles de pesos se esfuman sin que nadie pague.",
      },
      {
        icon: "ShoppingCart",
        title: "No saber cuánto vendiste hoy",
        description:
          "Abres la caja y ves billetes, pero no sabes si fue buen día o malo. Sin números claros, cada decisión es un salto al vacío.",
      },
      {
        icon: "AlertTriangle",
        title: "Productos que se agotan sin aviso",
        description:
          "El cliente pide arroz y no hay. Perdiste la venta y tal vez al cliente. Te diste cuenta demasiado tarde porque nadie te avisó.",
      },
      {
        icon: "BarChart3",
        title: "No saber si el negocio da ganancia",
        description:
          "Vendes todos los días pero al final del mes no queda nada. ¿El negocio es rentable o solo te está consumiendo el tiempo?",
      },
    ],
    solutions: [
      {
        icon: "Users",
        title: "Fiados digitales con nombre y monto exacto",
        description:
          "Cada fiado queda registrado al instante. Nombre, monto, fecha y producto. Cuando el cliente llegue, le muestras su cuenta en el celular. Sin discusiones.",
      },
      {
        icon: "Calculator",
        title: "Caja diaria automática",
        description:
          "Al final del día, un toque y ves todo: ventas en efectivo, fiados nuevos, pagos recibidos. Sabes exactamente cuánto entró y cuánto salió.",
      },
      {
        icon: "Bell",
        title: "Alertas de inventario bajo",
        description:
          "Global Inve te avisa cuando un producto está por acabarse. Compras a tiempo. No pierdes ventas. Tu estante siempre está surtido.",
      },
      {
        icon: "TrendingUp",
        title: "Informe mensual de ganancias",
        description:
          "Sabes cuánto compraste, cuánto vendiste y cuánto ganaste. En un informe claro, sin necesidad de ser contador. Tomas decisiones con datos, no con intuición.",
      },
    ],
    comparison: [
      {
        aspect: "Fiados",
        before:
          "Apuntas en un cuaderno que se pierde. Peleas con el cliente. Al final, no cobras.",
        after:
          "Cada fiado queda registrado con nombre y monto. Cobras con pruebas. Sin discusiones.",
      },
      {
        aspect: "Inventario",
        before:
          "Te enteras que no hay producto cuando el cliente lo pide. Pierdes la venta.",
        after:
          "Recibes alertas antes de que se agote. Compras a tiempo. Nunca pierdes una venta.",
      },
      {
        aspect: "Ganancias",
        before:
          "Vendes todos los días pero no sabes si ganas o pierdes. Vives con la duda.",
        after:
          "Ves tu ganancia real cada mes. Sabes cuáles productos te dejan más. Decides con datos.",
      },
    ],
    testimonial: {
      name: "Doña Martha",
      business: "Tienda La Esquina",
      city: "Bogotá",
      quote:
        "Yo pensaba que la tecnología no era para mí. Pero aprendí a usar Global Inve en un día. Ahora sé exactamente cuánto me deben y cuánto gano. Mi tienda cambió por completo.",
    },
    ctaSection: {
      headline:
        "Tu tienda merece crecer. Empieza a controlar tu negocio hoy mismo.",
      buttonText: "Probar gratis — ideal para tiendas",
    },
  },

  restaurante: {
    slug: "restaurante",
    hero: {
      headline: "Tu restaurante merece una caja que no falle en hora pico",
      subtitle:
        "Pedidos que se pierden, insumos que se acaban y un cierre de caja eterno. Cocinar ya es suficiente trabajo. Global Inve se encarga del resto.",
      primaryCTA: "Probar gratis",
      secondaryCTA: "Ver cómo funciona",
    },
    pains: [
      {
        icon: "Flame",
        title: "Caos en hora pico",
        description:
          "El mesero grita el pedido, la cocina no escucha, el cliente espera. Un pedido se pierde, otro sale mal. En hora pico todo puede salir mal si no hay sistema.",
      },
      {
        icon: "DollarSign",
        title: "No saber el costo real por plato",
        description:
          "Vendes el almuerzo a $12.000, pero ¿cuánto te cuesta prepararlo? Si no lo sabes, puedes estar regalando tu trabajo sin darte cuenta.",
      },
      {
        icon: "AlertTriangle",
        title: "Insumos que se acaban sin aviso",
        description:
          "Se acabó el pollo a mitad del servicio. Toca improvisar o decirle al cliente que no hay. Pierdes ventas y reputación al mismo tiempo.",
      },
      {
        icon: "Clock",
        title: "Cierre de caja que toma una hora",
        description:
          "Sumar facturas, contar efectivo, cruzar con tarjetas. Después de un día agotador, todavía te queda una hora de contabilidad manual.",
      },
    ],
    solutions: [
      {
        icon: "Zap",
        title: "Venta rápida en 3 toques",
        description:
          "Selecciona el plato, elige la cantidad, cobra. En segundos. La comanda va directo a cocina. Sin gritos, sin confusiones, sin pedidos perdidos.",
      },
      {
        icon: "UtensilsCrossed",
        title: "Control de insumos por receta",
        description:
          "Registra la receta de cada plato con sus ingredientes. Cada venta descuenta automáticamente los insumos. Sabes el costo real y tu margen exacto.",
      },
      {
        icon: "Bell",
        title: "Alertas automáticas de stock",
        description:
          "Cuando un insumo llega al mínimo, recibes una alerta. Compras a tiempo. Nunca más te quedas sin ingredientes en pleno servicio.",
      },
      {
        icon: "Timer",
        title: "Cierre de caja en 2 minutos",
        description:
          "Un toque y el sistema genera el resumen del día. Efectivo, tarjetas, propinas, todo separado. Sin sumar nada a mano. Te vas a descansar.",
      },
    ],
    testimonial: {
      name: "Andrés",
      business: "Sazón Criollo",
      city: "Bucaramanga",
      quote:
        "En hora pico era un desastre. Se perdían pedidos y los clientes se quejaban. Desde que usamos Global Inve, la cocina recibe todo claro y el cierre de caja me toma 2 minutos. Fue un antes y un después.",
    },
    ctaSection: {
      headline:
        "Que la hora pico no te quite la calma. Organiza tu restaurante hoy.",
      buttonText: "Probar gratis — ideal para restaurantes",
    },
  },

  farmacia: {
    slug: "farmacia",
    hero: {
      headline: "Control total de tu droguería, desde el celular",
      subtitle:
        "Medicamentos vencidos, miles de referencias y fiados sin control. Administrar una droguería no debería ser tan difícil. Con Global Inve, no lo es.",
      primaryCTA: "Probar gratis",
      secondaryCTA: "Ver cómo funciona",
    },
    pains: [
      {
        icon: "Pill",
        title: "Medicamentos vencidos que generan pérdidas",
        description:
          "Descubres el vencimiento cuando ya pasó. Ese producto se convierte en pérdida pura. Revisar uno por uno en el estante no es viable.",
      },
      {
        icon: "Search",
        title: "Miles de referencias difíciles de encontrar",
        description:
          "El cliente pide un medicamento y buscas entre cientos de cajas. Pierdes tiempo, el cliente se desespera y a veces se va sin comprar.",
      },
      {
        icon: "BookOpen",
        title: "Fiados sin control",
        description:
          "Le fías al vecino, al conocido, al que promete pagar mañana. Pero mañana nunca llega. Y el cuaderno no te dice cuánto se ha acumulado.",
      },
      {
        icon: "BarChart3",
        title: "No saber qué se vende más",
        description:
          "Compras de todo un poco, pero no sabes qué productos rotan rápido y cuáles llevan meses en el estante. Tu capital se queda estancado.",
      },
    ],
    solutions: [
      {
        icon: "AlertTriangle",
        title: "Control de lotes y fechas de vencimiento",
        description:
          "Registra cada producto con su lote y fecha de vencimiento. El sistema te avisa semanas antes de que expire. Vendes a tiempo o devuelves al proveedor.",
      },
      {
        icon: "Search",
        title: "Búsqueda rápida por nombre o código",
        description:
          "Escribe las primeras letras o escanea el código de barras. En un segundo encuentras el producto, su precio y cuántas unidades quedan.",
      },
      {
        icon: "Users",
        title: "Fiados digitales por cliente",
        description:
          "Cada deuda queda registrada con nombre, monto y fecha. Consultas el historial de cualquier cliente en segundos. Cobras con datos, no con memoria.",
      },
      {
        icon: "TrendingUp",
        title: "Informes de productos más vendidos",
        description:
          "Sabes qué se vende más, qué deja mejor margen y qué no rota. Compras inteligente. Tu capital trabaja para ti, no se queda en el estante.",
      },
    ],
    testimonial: {
      name: "Alejandra",
      business: "Droguería Salud Total",
      city: "Medellín",
      quote:
        "Tenía medicamentos vencidos que no detecté a tiempo. Eso era plata perdida. Con Global Inve me llegan alertas semanas antes. Además, ahora sé exactamente qué comprar y qué no. Mi droguería es otro negocio.",
    },
    ctaSection: {
      headline:
        "Tu droguería necesita control, no más papeles. Empieza hoy, es gratis.",
      buttonText: "Probar gratis — ideal para droguerías",
    },
  },
}
