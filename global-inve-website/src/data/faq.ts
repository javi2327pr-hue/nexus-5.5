export interface FAQItem {
  question: string
  answer: string
}

export const pricingFAQ: FAQItem[] = [
  {
    question: '¿Necesito tarjeta de crédito para empezar?',
    answer:
      'No. Puedes crear tu cuenta y probar Global Inve gratis durante 14 días sin ingresar ningún dato de pago. Solo te pedimos un correo electrónico para comenzar.',
  },
  {
    question: '¿Hay contratos o permanencia mínima?',
    answer:
      'No hay contratos ni cláusulas de permanencia. Puedes cancelar tu suscripción en cualquier momento desde tu panel de configuración y seguirás teniendo acceso hasta el final del periodo pagado.',
  },
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer:
      'Sí. Puedes subir o bajar de plan cuando quieras. Si subes de plan, solo pagas la diferencia proporcional del periodo restante. Si bajas, el cambio aplica en tu próxima facturación.',
  },
  {
    question: '¿Cómo funciona la facturación?',
    answer:
      'La facturación es mensual y se cobra de forma automática en la fecha en que activaste tu plan. Recibes un recibo por correo electrónico con cada cobro.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias en Colombia y pagos por PSE. Para planes empresariales también ofrecemos facturación directa.',
  },
  {
    question: '¿Puedo agregar usuarios extra?',
    answer:
      'Sí. Cada usuario adicional tiene un costo de $9.900 COP/mes en el plan Profesional y $14.900 COP/mes en el plan Empresarial. Puedes agregarlos o eliminarlos en cualquier momento desde la configuración de tu cuenta.',
  },
]

export const generalFAQ: FAQItem[] = [
  {
    question: '¿Qué es Global Inve?',
    answer:
      'Global Inve es un software de punto de venta en la nube diseñado para pequeños negocios. Te permite registrar ventas, controlar inventario y ver informes de tu negocio desde cualquier dispositivo con internet.',
  },
  {
    question: '¿Funciona sin internet?',
    answer:
      'Global Inve necesita conexión a internet para funcionar en tiempo real. Sin embargo, si pierdes conexión momentáneamente, el sistema guarda tus operaciones en el dispositivo y las sincroniza automáticamente cuando vuelvas a estar en línea.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer:
      'Tus datos están protegidos con cifrado de nivel bancario y respaldos automáticos diarios. Nuestros servidores cumplen con los estándares internacionales de seguridad, así que tu información siempre está a salvo.',
  },
  {
    question: '¿Puedo usar Global Inve en mi celular?',
    answer:
      'Sí. Global Inve funciona en cualquier navegador web, ya sea en tu celular, tableta o computador. No necesitas descargar ninguna aplicación para empezar a usarlo.',
  },
  {
    question: '¿Ofrecen capacitación?',
    answer:
      'Todos los planes incluyen acceso a tutoriales en video y guías paso a paso. Los planes Profesional y Empresarial incluyen sesiones de capacitación en vivo con nuestro equipo de soporte.',
  },
  {
    question: '¿Sirve para mi tipo de negocio?',
    answer:
      'Global Inve está pensado para tiendas, minimercados, ferreterías, papelerías, restaurantes, cafeterías y cualquier negocio que venda productos o servicios al público. Si tienes dudas, escríbenos y te ayudamos a evaluar si es la herramienta indicada.',
  },
]
