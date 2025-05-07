import AppSidebar from '@/components/app-sidebar'
import ArtifactRoot from '@/components/artifact/artifact-root'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = 'Advanced Chatbot'
const description = 'AI-powered search engine.'

export const metadata: Metadata = {
  metadataBase: new URL('https://advancedchatbot.app'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Advanced Chatbot',
    images: [
      {
        url: '/images/opengraph-image.png',
        width: 1200,
        height: 627,
        alt: 'Advanced Chatbot Preview Image'
      }
    ],
    type: 'website'
  },
  twitter: {
    title,
    description,
    creator: '@justinrcose',
    images: ['/images/opengraph-image.png?v=2']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          property="og:image"
          content="https://advancedchatbot.app/images/opengraph-image.png?v=2"
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </head>
      <body
        className={cn(
          'min-h-screen flex flex-col font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen>
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <Header user={user} />
              <main className="flex flex-1 min-h-0">
                <ArtifactRoot>{children}</ArtifactRoot>
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
