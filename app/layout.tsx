import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Strategic Cockpit - Sandvik Supply Chain",
  description: "AI-powered supply chain intelligence and strategic decision support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
              <div className="container flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                      <span className="text-slate-900 font-bold text-sm">S</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">SUPPLY CHAIN</div>
                      <div className="text-xs text-slate-400">COMPANIONS</div>
                    </div>
                  </div>
                </div>

                <h1 className="text-xl font-semibold">Strategic Cockpit</h1>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-300">Admin User</div>
                  <div className="h-8 w-8 rounded-full bg-slate-700"></div>
                </div>
              </div>
            </header>

            {/* Navigation */}
            <nav className="border-b border-slate-800 bg-slate-900">
              <div className="container px-6 py-2">
                <div className="text-sm text-slate-400">Simulations View - Sandvik Group Supply Chain Data</div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="bg-white text-slate-900">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
