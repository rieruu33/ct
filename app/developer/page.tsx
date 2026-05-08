"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Instagram, Mail, Phone, ArrowLeft, Terminal, Cpu, Code2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DeveloperPage() {
  return (
    <PageWrapper className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Home
        </Link>

        <Card className="shadow-2xl border-border bg-card overflow-hidden relative">
          {/* Aksesoris Background Biar Keren */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
          <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
            <Cpu className="w-64 h-64" />
          </div>

          <CardContent className="p-8 sm:p-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Terminal className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Meet The Dev</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Code2 className="h-4 w-4" /> System Architect & Analyst
                </p>
              </div>
            </div>

            {/* Sesi Yapping */}
            <div className="space-y-4 text-foreground/80 leading-relaxed mb-10 text-sm sm:text-base">
              <p>
                Kenapa platform ini dibuat? Simpel. Mobile Legends esports itu bukan cuma soal adu mekanik atau siapa yang fast hand. Di level kompetitif, ini soal makro, soal kedalaman draft, dan yang paling penting: <strong>Data</strong>.
              </p>
              <p>
                Gw ngebangun web ini khusus buat <strong>Cukup Tau</strong> biar kita main pakai otak, bukan cuma pakai insting. Apalagi kalo udah liat xibogeng bogeng itu kalah lane kadang bikin pusing dan bikin gw terinspirasi bikin web ini (karena ada saran juga sih dari teman gw, cedric), kadang sampai harus begadang ngatur database, tujuannya cuma satu: ngasih tim ini <em>unfair advantage</em>. 
              </p>
              <p>
                Data nggak pernah bohong. Kalau ada hero yang ternyata selama ini nyusahin boge.. kita maksudnya, kita ban. Kalau hero pegangan kita winratenya jelek, kita evaluasi. Kalau ternyata selama ini ada hero yang ternyata winrate nya bagus di kita, kita manfaatkan. <em>This is how we adapt, and this is how we win.</em>
              </p>
              <p>
                Harapannya sih, kita semua melalui web ini bisa berkembang, dapat cuan kalo emang beruntung dan menang, jadi portofolio kalo suatu hari nanti mana tau xibogeng jadi pro player dan mau ngasih data turnamen selama ini, atau ya buat evaluasi tim. Tapi point nya bukan itu aja sih, berharap kedepannya web ini jadi memori indah kalo tim ini, kita, pernah iseng nyoba 'kompe' setiap malamnya, bakal jadi cerita yang lucu sih buat di masa depan awowkwoak.
              </p>
              <p>
                Saya Ryan, kalo ada yang ternyata bisa buka halaman ini, senang bisa satu tim sama lu pada, tim kocak ini. :v
              </p>
                            <p>
                Bogor, 7 mei 2026
              </p>
            </div>

            <div className="border-t border-border pt-8 mt-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Contact & Connect</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                  <div className="bg-background p-2 rounded-lg shadow-sm"><Terminal className="h-4 w-4 text-slate-700 dark:text-slate-300" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Creator</p>
                    <p className="text-sm font-medium truncate text-foreground">Muhammad Falleryan</p>
                  </div>
                </div>

                <a href="https://wa.me/6281271388599" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                  <div className="bg-background p-2 rounded-lg shadow-sm"><Phone className="h-4 w-4 text-green-500" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Phone / WA</p>
                    <p className="text-sm font-medium truncate text-foreground">0812-7138-8599</p>
                  </div>
                </a>

                <a href="mailto:falleryan46@gmail.com" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                  <div className="bg-background p-2 rounded-lg shadow-sm"><Mail className="h-4 w-4 text-red-500" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Email</p>
                    <p className="text-sm font-medium truncate text-foreground">falleryan46@gmail.com</p>
                  </div>
                </a>

                <a href="https://github.com/falle46" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                  <div className="bg-background p-2 rounded-lg shadow-sm"><Github className="h-4 w-4 text-slate-900 dark:text-white" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">GitHub</p>
                    <p className="text-sm font-medium truncate text-foreground">falle46</p>
                  </div>
                </a>

                <a href="https://instagram.com/fllryan_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors sm:col-span-2">
                  <div className="bg-background p-2 rounded-lg shadow-sm"><Instagram className="h-4 w-4 text-pink-500" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Instagram</p>
                    <p className="text-sm font-medium truncate text-foreground">@fllryan_</p>
                  </div>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageWrapper>
  )
}