import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { apiClient } from '@/lib/api/client'
import type { Letter } from '@/lib/api/types'

interface LetterEditorProps {
  letter: Letter
  onUpdate?: (updatedLetter: Letter) => void
}

export const LetterEditor = ({ letter, onUpdate }: LetterEditorProps) => {
  const [content, setContent] = useState(letter.content)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.updateLetter(letter.id, { content })

      if (response.success && response.data) {
        onUpdate?.(response.data)
      } else {
        throw new Error(response.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImprove = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.improveLetter(letter.id)

      if (response.success && response.data) {
        setContent(response.data.content)
        onUpdate?.(response.data)
      } else {
        throw new Error(response.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.analyzeLetter(letter.id)

      if (response.success && response.data) {
        // Afficher l'analyse dans une modal ou un panneau latéral
        console.log('Analyse:', response.data)
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
    <Card className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Lettre de motivation</h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              Analyser
            </Button>
            <Button
              variant="outline"
              onClick={handleImprove}
              disabled={isLoading}
            >
              Améliorer
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Contenu de la lettre
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <div>
              Poste: {letter.jobTitle}
            </div>
            <div>
              Entreprise: {letter.companyName}
            </div>
            <div>
              Ton: {letter.tone}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 