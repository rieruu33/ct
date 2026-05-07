"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CircleDollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Tournament } from "@/lib/types"

interface FinanceFormProps {
  initialData?: any
  tournaments: Tournament[]
}

export function FinanceForm({ initialData, tournaments }: FinanceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!initialData

  const [formData, setFormData] = useState({
    type: initialData?.type || "expense",
    amount: initialData?.amount?.toString() || "",
    description: initialData?.description || "",
    transaction_date: initialData?.transaction_date || "",
    tournament_id: initialData?.tournament_id?.toString() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const payload = {
        type: formData.type,
        amount: parseFloat(formData.amount) || 0,
        description: formData.description,
        transaction_date: formData.transaction_date,
        tournament_id: formData.tournament_id ? parseInt(formData.tournament_id) : null,
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from("finances")
          .update(payload)
          .eq("id", initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("finances")
          .insert(payload)

        if (insertError) throw insertError
      }

      router.push("/admin/manage")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save finance record")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 max-w-2xl">
      <Link 
        href="/admin/manage" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Manage
      </Link>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5" />
            {isEdit ? "Edit Finance Record" : "Add Finance Record"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Type *</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="income">Income (Pemasukan)</option>
                  <option value="expense">Expense (Pengeluaran)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Amount (Rp) *</label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description *</label>
              <Input
                required
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Prize money MLBB Cup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Transaction Date *</label>
              <Input
                type="date"
                required
                value={formData.transaction_date}
                onChange={e => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Related Tournament (Optional)</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={formData.tournament_id}
                onChange={e => setFormData(prev => ({ ...prev, tournament_id: e.target.value }))}
              >
                <option value="">-- None --</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Record"
              ) : (
                "Add Record"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}