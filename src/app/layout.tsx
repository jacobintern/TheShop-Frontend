'use client'

import './../css/globals.css'
import localFont from 'next/font/local'
import Nav from '@/components/navbar'
import { Provider } from 'react-redux';
import store from '@/app/store';

const myFont = localFont({ src: '../fonts/jf-openhuninn-2.0.ttf' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={myFont.className}>
        <Provider store={store}>
          <Nav />{children}
        </Provider>
      </body>
    </html>
  )
}
