"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Users, 
  Swords, 
  Trophy, 
  History, 
  DollarSign, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/roster", label: "Roster", icon: Users },
  { href: "/heroes", label: "Heroes", icon: Swords },
  { href: "/history", label: "History", icon: History },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/stats", label: "Team Stats", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // STATE UNTUK EASTER EGG LOGO
  const [clickCount, setClickCount] = useState(0)
  const lastClickTime = useRef(0)

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault() // Mencegah reload berulang saat di-spam klik
    const now = Date.now()
    
    // Jika jeda antar klik lebih dari 2 detik (2000ms), hitungan di-reset dari awal
    if (now - lastClickTime.current > 2000) {
      setClickCount(1)
      if (pathname !== "/") router.push("/") // Tetap berfungsi normal sebagai tombol kembali ke Home
    } else {
      const newCount = clickCount + 1
      setClickCount(newCount)
      
      // Trigger easter egg jika mencapai klik ke-10
      if (newCount === 10) {
        router.push("/developer")
        setClickCount(0) // Reset hitungan
      }
    }
    lastClickTime.current = now
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        
        {/* Logo Section - Di kiri (Dengan trigger Easter Egg) */}
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-2 shrink-0 select-none group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm transition-transform active:scale-90 group-hover:scale-105">
            CT
          </div>
          <span className="font-semibold text-lg hidden lg:inline">Cukup Tau</span>
        </Link>

        {/* SPACER - Ini rahasianya agar menu terdorong ke kanan */}
        <div className="flex-1" />

        {/* Desktop Navigation - Di kanan, sebelum tombol dark mode */}
        <nav className="hidden lg:flex items-center gap-1 mr-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons (Dark Mode & Mobile Menu) - Paling ujung kanan */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Minimalist Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full w-9 h-9 hover:bg-muted"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/40 bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== "/" && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}