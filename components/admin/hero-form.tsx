"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Swords, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const heroRoles = ["Marksman", "Fighter", "Assassin", "Mage", "Tank", "Support"]

export function HeroForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "Marksman",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase
        .from("heroes")
        .insert({
          id: formData.id.toLowerCase().replace(/\s+/g, "_"),
          name: formData.name,
          role: formData.role,
        })

      if (insertError) throw insertError

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to add hero")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 max-w-2xl">
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5" />
            Add New Hero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Hero ID *</label>
              <Input
                required
                value={formData.id}
                onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="e.g., miya (lowercase, no spaces)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This should match the image filename in public/heroes/ (e.g., miya.png)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Hero Name *</label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Miya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Role *</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                {heroRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
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
                  Adding Hero...
                </>
              ) : (
                "Add Hero"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
