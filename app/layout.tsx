import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Header from '../components/Header'
import { AuthProvider } from '@/hooks/AuthProvider'

import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Thrifty G marketplace ',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang="en">

        <Head>
          <meta charSet="utf-8" />

          <meta name="viewport" content="width=device-width, initial-scale=1" />

        </Head>

        <body className={inter.className}>
          <ToasterProvider/>
          <ModalProvider/>

          {children}
          

        </body>
      </html>
    </AuthProvider>
  )
}
