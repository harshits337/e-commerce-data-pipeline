import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-commerce Analytics Dashboard',
  description: 'Real-time analytics dashboard for e-commerce data powered by Kafka & ClickHouse',
  keywords: ['analytics', 'dashboard', 'e-commerce', 'kafka', 'clickhouse', 'real-time'],
  authors: [{ name: 'E-commerce Analytics Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
