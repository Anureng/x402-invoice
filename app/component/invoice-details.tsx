'use client'

import { Card } from '@/components/ui/card'
import { InfoIcon as Invoice, CheckCircle2, Clock } from 'lucide-react'

export function InvoiceDetails() {
  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-primary/30 transition-all">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20 border border-primary/40">
              <Invoice className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Invoice ID</p>
              <p className="text-2xl font-bold">#INV-2024-001</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Amount Due</p>
            <p className="text-3xl font-bold text-primary">$5,000</p>
          </div>
        </div>

        {/* Invoice details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">From</p>
            <div className="space-y-1">
              <p className="font-semibold">Acme Corporation</p>
              <p className="text-sm text-muted-foreground">123 Business Street</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Bill To</p>
            <div className="space-y-1">
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-muted-foreground">456 Customer Ave</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Description</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Qty</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { desc: 'Professional Services', qty: 10, price: 150 },
                  { desc: 'Consulting Hours', qty: 20, price: 125 },
                  { desc: 'Software License', qty: 1, price: 1250 },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-sm">{item.desc}</td>
                    <td className="text-right py-3 px-4 text-sm">{item.qty}</td>
                    <td className="text-right py-3 px-4 text-sm text-muted-foreground">${item.price}</td>
                    <td className="text-right py-3 px-4 text-sm font-semibold text-primary">
                      ${item.qty * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-3 pt-6 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">$4,750</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span className="font-semibold">$250</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-border/50">
            <span>Total Due</span>
            <span className="text-primary">$5,000</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold">Pending Payment</p>
            </div>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="font-semibold">Dec 31, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
