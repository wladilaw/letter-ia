import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-accent">
              LetterIA
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              Votre assistant intelligent pour créer des lettres de motivation parfaites. 
              Optimisez vos chances de décrocher votre prochain emploi.
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Liens Rapides
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-accent">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-600 hover:text-accent">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-600 hover:text-accent">
                  Offres d'emploi
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-accent">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Ressources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-accent">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-accent">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Réseaux Sociaux et Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              <a
                href="https://github.com/letteria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/letteria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/company/letteria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <p className="mt-4 md:mt-0 text-gray-500 text-sm">
              © {new Date().getFullYear()} LetterIA. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 