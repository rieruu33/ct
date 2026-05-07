"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const roles = ["Gold Laner", "EXP Laner", "Mid Laner", "Roamer", "Jungler"]

export function PlayerForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!initialData

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    nickname: initialData?.nickname || "",
    team_id: initialData?.team_id || "",
    ingame_id: initialData?.ingame_id || "",
    role: initialData?.role || "Gold Laner",
    instagram_url: initialData?.instagram_url || "",
    photo_filename: initialData?.photo_filename || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const payload = {
        full_name: formData.full_name,
        nickname: formData.nickname,
        team_id: formData.team_id || null,
        ingame_id: formData.ingame_id || null,
        role: formData.role,
        instagram_url: formData.instagram_url || null,
        photo_filename: formData.photo_filename || null,
      }

      if (isEdit) {
        // --- MODE EDIT (UPDATE) ---
        const { error: updateError } = await supabase
          .from("players")
          .update(payload)
          .eq("id", initialData.id)

        if (updateError) throw updateError
      } else {
        // --- MODE ADD (INSERT) ---
        const { error: insertError } = await supabase
          .from("players")
          .insert(payload)

        if (insertError) throw insertError
      }

      router.push("/admin/manage")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save player")
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
            <Users className="h-5 w-5" />
            {isEdit ? "Edit Player" : "Add New Player"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name *</label>
              <Input
                required
                value={formData.full_name}
                onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Nickname / IGN *</label>
              <Input
                required
                value={formData.nickname}
                onChange={e => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="e.g., JDX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Team ID</label>
                <Input
                  value={formData.team_id}
                  onChange={e => setFormData(prev => ({ ...prev, team_id: e.target.value }))}
                  placeholder="e.g., TEAM001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">In-Game ID</label>
                <Input
                  value={formData.ingame_id}
                  onChange={e => setFormData(prev => ({ ...prev, ingame_id: e.target.value }))}
                  placeholder="e.g., 12345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Role *</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Instagram URL</label>
              <Input
                type="url"
                value={formData.instagram_url}
                onChange={e => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Photo Filename</label>
              <Input
                value={formData.photo_filename}
                onChange={e => setFormData(prev => ({ ...prev, photo_filename: e.target.value }))}
                placeholder="e.g., player1.jpg (place in public/players/)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Put the player photo in public/players/ folder and enter the filename here
              </p>
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
                "Update Player"
              ) : (
                "Add Player"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}