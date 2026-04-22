import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TCF Practice — Parlez mieux chaque jour',
  description: 'Entraînez-vous à parler français pour le TCF Canada',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TCF Practice',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-surface-1">
        <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  )
}
