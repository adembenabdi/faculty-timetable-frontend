import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'timetable-management',
  description: 'created to mange the data of the timetable',
  generator: 'adem benabdi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
