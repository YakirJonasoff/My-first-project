import type { Metadata } from 'next'
import './globals.css'
import { FilterProvider } from '@/context/FilterContext'
import TopNav from '@/components/layout/TopNav'

export const metadata: Metadata = {
  title: 'Marketing Intelligence Dashboard',
  description: 'Internal marketing analytics & reporting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0f1117]">
        <FilterProvider>
          <TopNav />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </FilterProvider>
      </body>
    </html>
  )
}
