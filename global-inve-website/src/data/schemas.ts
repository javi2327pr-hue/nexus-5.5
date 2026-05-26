export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Global Inve',
    url: 'https://globalinve.com',
    logo: 'https://globalinve.com/logo.png',
    description: 'Software POS en la nube para pymes',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+57-300-123-4567',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [
      'https://www.facebook.com/globalinve',
      'https://www.instagram.com/globalinve',
    ],
  }
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Global Inve',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Software POS en la nube para pymes. Punto de venta, inventario y fiados.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Básico',
        price: '29900',
        priceCurrency: 'COP',
        description: 'Plan básico para 1 punto de venta',
      },
      {
        '@type': 'Offer',
        name: 'Profesional',
        price: '59900',
        priceCurrency: 'COP',
        description: 'Plan profesional hasta 3 puntos de venta',
      },
      {
        '@type': 'Offer',
        name: 'Empresarial',
        price: '99900',
        priceCurrency: 'COP',
        description: 'Plan empresarial multi-sucursal',
      },
    ],
  }
}

export function getFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://globalinve.com${item.url}`,
    })),
  }
}
