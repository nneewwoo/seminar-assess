import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import Footer from '@/components/footer'

const inter = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Seminar Assess',
  description: 'Your Opinion, Your Seminar'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-black`}>
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  )
}
