import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lakambini XI Archives",
  description:
    "Official digital archives platform for Grade 11 Lakambini students. Document your academic journey, share meaningful experiences, and preserve memories from our Grade 11 year (2025-2026).",
  keywords: ["Lakambini", "Grade 11", "Archives", "Student Blog", "Academic Journey", "School Memories"],
  authors: [{ name: "Lakambini XI Students" }],
  creator: "Lakambini XI Class",
  publisher: "Lakambini XI Archives",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lakambini-xi-archives.vercel.app",
    title: "Lakambini XI Archives",
    description: "Official digital archives platform for Grade 11 Lakambini students",
    siteName: "Lakambini XI Archives",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakambini XI Archives",
    description: "Official digital archives platform for Grade 11 Lakambini students",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e91e63" },
    { media: "(prefers-color-scheme: dark)", color: "#e91e63" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#e91e63" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
