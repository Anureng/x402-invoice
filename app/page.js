import { InvoiceHeader } from './component/invoice-header'
import { WalletSection } from './component/wallet-section'
import { PaymentMethods } from './component/payment-methods'
import { Footer } from './component/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20 selection:text-white flex flex-col">
      <InvoiceHeader />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Complete Payment</h1>
            <p className="text-sm text-muted-foreground">Connect wallet and confirm transaction</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <WalletSection />
            <PaymentMethods />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground opacity-50">Powered by x402fi Protocol</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
