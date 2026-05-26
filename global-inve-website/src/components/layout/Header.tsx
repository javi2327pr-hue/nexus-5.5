import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useCountry } from '../../hooks/useCountry'
import { Button } from '../ui/Button'

const sectorLinks = [
  { label: 'Ferreterias', href: '/software-pos-ferreteria' },
  { label: 'Tiendas', href: '/software-pos-tienda' },
  { label: 'Restaurantes', href: '/software-pos-restaurante' },
  { label: 'Farmacias', href: '/software-pos-farmacia' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sectoresOpen, setSectoresOpen] = useState(false)
  const [mobileSectoresOpen, setMobileSectoresOpen] = useState(false)
  const { country, setCountry } = useCountry()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSectoresOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileSectoresOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-shadow duration-300',
        scrolled && 'shadow-soft'
      )}
    >
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-[14px] focus:shadow-soft focus:text-primary focus:font-semibold"
      >
        Saltar al contenido
      </a>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold font-display text-gradient-primary">
              Global Inve
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegacion principal">
            <Link
              to="/funcionalidades"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-[14px] min-h-[44px] inline-flex items-center"
            >
              Funcionalidades
            </Link>

            {/* Sectores dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setSectoresOpen(true)}
              onMouseLeave={() => setSectoresOpen(false)}
            >
              <button
                onClick={() => setSectoresOpen(!sectoresOpen)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-[14px] min-h-[44px] inline-flex items-center gap-1"
                aria-expanded={sectoresOpen}
                aria-haspopup="true"
              >
                Sectores
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    sectoresOpen && 'rotate-180'
                  )}
                />
              </button>

              <div
                className={cn(
                  'absolute top-full left-0 mt-1 w-56 rounded-[14px] bg-white border border-border shadow-soft py-2 transition-all duration-200',
                  sectoresOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                )}
              >
                {sectorLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-3 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/planes-precios"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-[14px] min-h-[44px] inline-flex items-center"
            >
              Precios
            </Link>

            <Link
              to="/blog"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-[14px] min-h-[44px] inline-flex items-center"
            >
              Blog
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Country selector */}
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              <button
                onClick={() => setCountry('CO')}
                className={cn(
                  'w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors min-w-[36px] min-h-[36px]',
                  country === 'CO'
                    ? 'bg-primary/10 ring-1 ring-primary'
                    : 'hover:bg-muted'
                )}
                aria-label="Colombia"
                title="Colombia"
              >
                🇨🇴
              </button>
              <button
                onClick={() => setCountry('ES')}
                className={cn(
                  'w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors min-w-[36px] min-h-[36px]',
                  country === 'ES'
                    ? 'bg-primary/10 ring-1 ring-primary'
                    : 'hover:bg-muted'
                )}
                aria-label="Espana"
                title="Espana"
              >
                🇪🇸
              </button>
            </div>

            {/* CTA */}
            <Link to="/planes-precios" className="hidden sm:block">
              <Button variant="accent" size="sm">
                Probar gratis
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[14px] text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px]"
              aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 top-16 z-40 bg-black/20 transition-opacity duration-300 md:hidden',
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile slide-in menu */}
      <div
        className={cn(
          'fixed top-16 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-soft transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col p-4 gap-1" aria-label="Menu movil">
          <Link
            to="/funcionalidades"
            onClick={closeMobile}
            className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-[14px] min-h-[44px] flex items-center"
          >
            Funcionalidades
          </Link>

          {/* Mobile Sectores */}
          <div>
            <button
              onClick={() => setMobileSectoresOpen(!mobileSectoresOpen)}
              className="w-full px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-[14px] min-h-[44px] flex items-center justify-between"
              aria-expanded={mobileSectoresOpen}
            >
              Sectores
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform duration-200',
                  mobileSectoresOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                mobileSectoresOpen ? 'max-h-96' : 'max-h-0'
              )}
            >
              <div className="pl-4">
                {sectorLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={closeMobile}
                    className="block px-4 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-[14px] min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/planes-precios"
            onClick={closeMobile}
            className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-[14px] min-h-[44px] flex items-center"
          >
            Precios
          </Link>

          <Link
            to="/blog"
            onClick={closeMobile}
            className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-[14px] min-h-[44px] flex items-center"
          >
            Blog
          </Link>

          <div className="mt-4 px-4">
            <Link to="/planes-precios" onClick={closeMobile} className="block">
              <Button variant="accent" size="md" className="w-full">
                Probar gratis
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
