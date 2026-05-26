export interface FeatureModule {
  id: string
  icon: string // Lucide icon name
  title: string
  description: string
  bullets: string[] // 3 bullet points each
}

export const featureModules: FeatureModule[] = [
  {
    id: 'pos',
    icon: 'Monitor',
    title: 'Punto de venta',
    description:
      'Cobra en segundos, no en minutos. Tu caja registradora inteligente que funciona con o sin internet.',
    bullets: [
      'Escanea productos con código de barras o búscalos por nombre al instante.',
      'Genera recibos digitales o impresos con tu logo y datos fiscales.',
      'Acepta efectivo, tarjeta, transferencia o pagos mixtos en una sola venta.',
    ],
  },
  {
    id: 'inventario',
    icon: 'Package',
    title: 'Inventario',
    description:
      'Sabes exactamente qué tienes, qué se agota y qué no se mueve. Sin contar a mano nunca más.',
    bullets: [
      'Recibe alertas automáticas cuando un producto llega al stock mínimo.',
      'Organiza tu catálogo por categorías, marcas o proveedores como prefieras.',
      'Registra entradas, salidas y ajustes con un historial completo de movimientos.',
    ],
  },
  {
    id: 'clientes',
    icon: 'Users',
    title: 'Clientes',
    description:
      'Conoce a quien te compra. Guarda su información, sus compras y lo que te deben en un solo lugar.',
    bullets: [
      'Crea una base de datos de clientes con nombre, teléfono y dirección.',
      'Consulta el historial de compras de cada cliente para ofrecerle un mejor servicio.',
      'Lleva el control de fiados y créditos pendientes sin confusiones ni libretas perdidas.',
    ],
  },
  {
    id: 'cuentas',
    icon: 'Receipt',
    title: 'Cuentas por cobrar y pagar',
    description:
      'Los fiados dejan de ser un dolor de cabeza. Tú controlas lo que te deben y lo que debes.',
    bullets: [
      'Registra fiados con fecha, monto y cliente para que nada se te olvide.',
      'Controla tus gastos y pagos a proveedores con fechas de vencimiento claras.',
      'Visualiza tu balance general en tiempo real y toma decisiones con números reales.',
    ],
  },
  {
    id: 'informes',
    icon: 'BarChart3',
    title: 'Informes',
    description:
      'Deja de adivinar cuánto vendiste. Ve tus números reales con gráficos simples que cualquiera entiende.',
    bullets: [
      'Consulta tu resumen de ventas diarias, semanales o mensuales en un solo clic.',
      'Descubre cuáles son tus productos estrella y cuáles ocupan espacio sin rotar.',
      'Conoce tus márgenes de ganancia reales para saber si tu negocio es rentable.',
    ],
  },
  {
    id: 'multi-dispositivo',
    icon: 'Smartphone',
    title: 'Multi-dispositivo',
    description:
      'Tu negocio te acompaña a donde vayas. Usa Global Inve desde el celular, la tablet o la computadora.',
    bullets: [
      'Funciona en cualquier navegador sin instalar nada. Abre y empieza a vender.',
      'Sincroniza todo en la nube automáticamente entre todos tus dispositivos.',
      'Revisa tus ventas desde casa, el bus o donde estés. Solo necesitas internet.',
    ],
  },
]
