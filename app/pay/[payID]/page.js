'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { InvoiceHeader } from '../../component/invoice-header'
import { WalletSection } from '../../component/wallet-section'
import { PaymentMethods } from '../../component/payment-methods'
import { Footer } from '../../component/footer'
import { useWallet } from '@/contexts/wallet-context'
import { Loader2 } from 'lucide-react'

export default function PayPage() {
    const params = useParams()
    const { setPayDetails, setSelectedNetwork } = useWallet()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await fetch(`/api/payload?pay_id=${params.payID}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch payment details')
                }
                const data = await response.json()
                setPayDetails(data)
                setSelectedNetwork(data.network)
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (params.payID) {
            fetchPaymentDetails()
        }
    }, [params.payID, setPayDetails, setSelectedNetwork])

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading payment details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-500">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

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
                        <PaymentMethods payID={params?.payID} />
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground opacity-50">Powered by PayAI</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
