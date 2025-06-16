import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface NavLinkProps {
  href: string
  label: string
  isActive?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive }) => {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-accent",
        isActive ? "text-accent" : "text-gray-600"
      )}
    >
      {label}
    </Link>
  )
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()

  const isActive = (path: string) => router.pathname === path

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-accent">LetterIA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/dashboard" label="Tableau de bord" isActive={isActive('/dashboard')} />
            <NavLink href="/letters" label="Mes lettres" isActive={isActive('/letters')} />
            <NavLink href="/templates" label="Templates" isActive={isActive('/templates')} />
            <NavLink href="/jobs" label="Offres" isActive={isActive('/jobs')} />
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" href="/login">
                  Connexion
                </Button>
                <Button href="/register">
                  S'inscrire
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <NavLink href="/dashboard" label="Tableau de bord" isActive={isActive('/dashboard')} />
            <NavLink href="/letters" label="Mes lettres" isActive={isActive('/letters')} />
            <NavLink href="/templates" label="Templates" isActive={isActive('/templates')} />
            <NavLink href="/jobs" label="Offres" isActive={isActive('/jobs')} />
            
            {user ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={logout}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Button variant="ghost" href="/login" className="w-full justify-start">
                  Connexion
                </Button>
                <Button href="/register" className="w-full justify-start">
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
} 