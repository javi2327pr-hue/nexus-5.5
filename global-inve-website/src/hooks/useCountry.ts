import { useState, useEffect } from 'react'

type Country = 'CO' | 'ES'

export function useCountry() {
  const [country, setCountry] = useState<Country>('CO')

  useEffect(() => {
    const saved = localStorage.getItem('globalinve-country') as Country
    if (saved === 'CO' || saved === 'ES') {
      setCountry(saved)
      return
    }
    const lang = navigator.language || ''
    if (lang.includes('ES') || lang.includes('es-ES')) {
      setCountry('ES')
    }
  }, [])

  const toggleCountry = (c: Country) => {
    setCountry(c)
    localStorage.setItem('globalinve-country', c)
  }

  return { country, setCountry: toggleCountry, isColombia: country === 'CO', isSpain: country === 'ES' }
}
