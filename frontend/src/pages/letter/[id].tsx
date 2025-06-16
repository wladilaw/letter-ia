import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MainLayout } from '@/components/layout/MainLayout'
import { LetterEditor } from '@/components/letter/LetterEditor'
import { LetterAnalysis } from '@/components/letter/LetterAnalysis'
import { Spinner } from '@/components/ui/Spinner'
import { apiClient } from '@/lib/api/client'
import type { Letter, LetterAnalysis as LetterAnalysisType } from '@/lib/api/types'

export default function LetterPage() {
  const router = useRouter()
  const { id } = router.query

  const [letter, setLetter] = useState<Letter | null>(null)
  const [analysis, setAnalysis] = useState<LetterAnalysisType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchLetter = async () => {
      try {
        const response = await apiClient.getLetter(id as string)

        if (response.success && response.data) {
          setLetter(response.data)
        } else {
          throw new Error(response.error || 'Une erreur est survenue')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLetter()
  }, [id])

  const handleUpdate = (updatedLetter: Letter) => {
    setLetter(updatedLetter)
  }

  const handleAnalyze = async () => {
    if (!id) return

    try {
      const response = await apiClient.analyzeLetter(id as string)

      if (response.success && response.data) {
        setAnalysis(response.data)
      } else {
        throw new Error(response.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Spinner className="w-8 h-8" />
        </div>
      </MainLayout>
    )
  }

  if (error || !letter) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error || 'Lettre non trouvée'}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <LetterEditor
          letter={letter}
          onUpdate={handleUpdate}
        />

        {analysis && (
          <LetterAnalysis analysis={analysis} />
        )}
      </div>
    </MainLayout>
  )
} 