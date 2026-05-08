import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navigation } from '@/components/navigation'
import { ThemeProvider } from '@/components/theme-provider' // Import provider kamu
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Cukup Tau - MLBB Team Manager', // Nama tim kamu biar makin keren
  description: 'Manage your MLBB esports team data, tournaments, and statistics',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 1. Tambahkan suppressHydrationWarning agar tidak error saat switch tema
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        {/* 2. Bungkus semua konten dengan ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // Akan mengikuti settingan Windows/HP user secara default
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}