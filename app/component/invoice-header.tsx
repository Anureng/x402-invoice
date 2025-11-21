'use client'

// Imports removed

export function InvoiceHeader() {
  return (
    <header className="w-full py-6 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm" />
        </div>
        <span className="font-semibold text-lg tracking-tight">x402fi</span>
      </div>
      <nav>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Documentation
        </a>
      </nav>
    </header>
  )
}
