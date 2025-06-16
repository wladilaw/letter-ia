import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthContext } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api/client'
import type { Tone } from '@/lib/api/types'

interface LetterGeneratorProps {
  jobTitle?: string
  companyName?: string
  jobDescription?: string
  onSuccess?: (letterId: string) => void
}

export const LetterGenerator = ({
  jobTitle: initialJobTitle = '',
  companyName: initialCompanyName = '',
  jobDescription: initialJobDescription = '',
  onSuccess
}: LetterGeneratorProps) => {
  const router = useRouter()
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [jobTitle, setJobTitle] = useState(initialJobTitle)
  const [companyName, setCompanyName] = useState(initialCompanyName)
  const [jobDescription, setJobDescription] = useState(initialJobDescription)
  const [tone, setTone] = useState<Tone>('PROFESSIONAL')
  const [personalNotes, setPersonalNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!user) {
        router.push('/auth/login?redirect=/letter/generate')
        return
      }

      const response = await apiClient.generateLetter({
        jobTitle,
        companyName,
        jobDescription,
        tone,
        personalNotes: personalNotes || undefined
      })

      if (response.success && response.data) {
        onSuccess?.(response.data.id)
        router.push(`/letter/${response.data.id}`)
      } else {
        throw new Error(response.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">Générer une lettre de motivation</h2>
          
          <div className="space-y-4">
            <Input
              label="Titre du poste"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              placeholder="Ex: Développeur Full Stack"
            />

            <Input
              label="Nom de l'entreprise"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="Ex: Tech Company"
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Description du poste
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Copiez-collez la description du poste ici..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ton de la lettre
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PROFESSIONAL">Professionnel</option>
                <option value="ENTHUSIASTIC">Enthousiaste</option>
                <option value="FORMAL">Formel</option>
                <option value="CREATIVE">Créatif</option>
                <option value="CASUAL">Décontracté</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Notes personnelles (optionnel)
              </label>
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ajoutez des informations supplémentaires qui pourraient être utiles..."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Génération en cours...
              </>
            ) : (
              'Générer la lettre'
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
} 