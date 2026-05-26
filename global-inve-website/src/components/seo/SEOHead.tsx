import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { seoData } from '../../data/seo'
import { getOrganizationSchema, getSoftwareApplicationSchema, getBreadcrumbSchema } from '../../data/schemas'

interface SEOHeadProps {
  customTitle?: string
  customDescription?: string
  jsonLd?: object | object[]
}

export function SEOHead({ customTitle, customDescription, jsonLd }: SEOHeadProps) {
  const { pathname } = useLocation()
  const seo = seoData[pathname]

  useEffect(() => {
    const title = customTitle || seo?.title || 'Global Inve — Software POS en la nube'
    const description = customDescription || seo?.description || ''

    document.title = title

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // OG tags
    const ogTags: Record<string, string> = {
      'og:title': seo?.ogTitle || title,
      'og:description': seo?.ogDescription || description,
      'og:type': 'website',
      'og:url': `https://globalinve.com${pathname}`,
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://globalinve.com${seo?.canonical || pathname}`)

    // JSON-LD
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]')
    existingScripts.forEach((s) => s.remove())

    const schemas: object[] = []

    if (pathname === '/') {
      schemas.push(getOrganizationSchema())
      schemas.push(getSoftwareApplicationSchema())
    }

    if (pathname !== '/') {
      const breadcrumbItems = [{ name: 'Inicio', url: '/' }]
      const pageName = seo?.h1 || ''
      if (pageName) {
        breadcrumbItems.push({ name: pageName, url: pathname })
      }
      schemas.push(getBreadcrumbSchema(breadcrumbItems))
    }

    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemas.push(...jsonLd)
      } else {
        schemas.push(jsonLd)
      }
    }

    schemas.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', 'true')
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove())
    }
  }, [pathname, customTitle, customDescription, jsonLd, seo])

  return null
}
