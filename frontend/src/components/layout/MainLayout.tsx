import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className={cn("flex-1 py-8", className)}>
        {children}
      </main>
      <Footer />
    </div>
  )
} 