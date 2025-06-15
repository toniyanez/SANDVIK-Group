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
            {/* Main Content */}
            <main className="bg-white text-slate-900">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
