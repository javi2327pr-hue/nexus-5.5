import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/layout/Layout'

const Home = lazy(() => import('./pages/Home'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Features = lazy(() => import('./pages/Features'))
const DemoFree = lazy(() => import('./pages/DemoFree'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const Ferreteria = lazy(() => import('./pages/industry/Ferreteria'))
const Tienda = lazy(() => import('./pages/industry/Tienda'))
const Restaurante = lazy(() => import('./pages/industry/Restaurante'))
const Farmacia = lazy(() => import('./pages/industry/Farmacia'))
const Colombia = lazy(() => import('./pages/geo/Colombia'))
const Espana = lazy(() => import('./pages/geo/Espana'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/planes-precios" element={<Pricing />} />
            <Route path="/funcionalidades" element={<Features />} />
            <Route path="/demo-gratis" element={<DemoFree />} />
            <Route path="/quienes-somos" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/software-pos-ferreteria" element={<Ferreteria />} />
            <Route path="/software-pos-tienda" element={<Tienda />} />
            <Route path="/software-pos-restaurante" element={<Restaurante />} />
            <Route path="/software-pos-farmacia" element={<Farmacia />} />
            <Route path="/software-punto-venta-colombia" element={<Colombia />} />
            <Route path="/software-tpv-espana" element={<Espana />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
