import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { QueryProvider } from "../providers/query"
import { INTLProvider } from "../providers/intl"
import { getRequestLanguage } from "../providers/intl/server"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://augustowestphal.netlify.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Augusto Westphal | Desenvolvedor Web",
  description: "Portfólio de Augusto Westphal, desenvolvedor web full stack.",
  applicationName: "Augusto Westphal",
  authors: [{ name: "Augusto Westphal", url: "https://github.com/AugustoGitH" }],
  keywords: ["Augusto Westphal", "desenvolvedor web", "full stack", "React", "Next.js"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Augusto Westphal | Desenvolvedor Web",
    description: "Portfólio de Augusto Westphal, desenvolvedor web full stack.",
    siteName: "Augusto Westphal",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Augusto Westphal | Desenvolvedor Web",
    description: "Portfólio de Augusto Westphal, desenvolvedor web full stack.",
    images: ["/opengraph-image"],
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { language, hasLanguageCookie } = await getRequestLanguage()

  return (
    <html lang={language === "en" ? "en" : "pt-BR"} className={inter.variable}>
      <body>
        <INTLProvider initialLanguage={language} hasLanguageCookie={hasLanguageCookie}>
          <QueryProvider>{children}</QueryProvider>
        </INTLProvider>
      </body>
    </html>
  )
}
