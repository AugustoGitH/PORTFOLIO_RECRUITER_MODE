import type { Metadata } from "next"

import "./globals.css"

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
