import { InvoiceHeader } from './component/invoice-header'
import { WalletSection } from './component/wallet-section'
import { InvoiceDetails } from './component/invoice-details'
import { PaymentMethods } from './component/payment-methods'
import { Footer } from './component/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Gradient background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10">
        <InvoiceHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Invoice and Details */}
            <div className="lg:col-span-2 space-y-6">
              <InvoiceDetails />
            </div>

            {/* Right side - Wallet and Payment */}
            <div className="space-y-6">
              <WalletSection />
              <PaymentMethods />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
