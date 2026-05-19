import type { Metadata } from 'next'
import './globals.css'
import { FilterProvider } from '@/context/FilterContext'

export const metadata: Metadata = {
  title: 'לקוחות · ניהול',
  description: 'מערכת ניהול לקוחות',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen">
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  )
}
