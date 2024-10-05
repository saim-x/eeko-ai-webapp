import { ClerkProvider } from '@clerk/nextjs'
import Header from './components/Header'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16 sm:pt-20"> {/* Increased padding-top */}
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
