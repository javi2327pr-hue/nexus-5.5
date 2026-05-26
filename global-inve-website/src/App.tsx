function App() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gradient-primary font-display">
          Global Inve
        </h1>
        <nav className="hidden md:flex gap-6 text-sm text-muted-foreground font-medium">
          <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Precios</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contacto</a>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold font-display text-foreground leading-tight">
          Software POS en la nube
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Gestiona tu negocio desde cualquier lugar con Global Inve.
          Facturaci&oacute;n electr&oacute;nica, inventario y punto de venta en una sola plataforma.
        </p>
        <div className="mt-10 flex gap-4">
          <button className="bg-gradient-primary text-white px-8 py-3 rounded-base font-semibold shadow-elegant hover:opacity-90 transition-opacity">
            Empezar gratis
          </button>
          <button className="border border-border px-8 py-3 rounded-base font-semibold text-foreground hover:bg-accent-soft transition-colors">
            Ver demo
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
