// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'timetable-management',
  description: 'Created to manage the data of the timetable',
  generator: 'Adem Benabdi',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Protect /admin routes
  const pathname = typeof window === 'undefined' ? '' : window.location.pathname
  const isAdminRoute = pathname.startsWith('/admin')

  // On the server, use cookies and headers
  if (isAdminRoute) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('authtoken')
    if (!authToken) {
      redirect('/login') // Redirect to login if not authenticated
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
