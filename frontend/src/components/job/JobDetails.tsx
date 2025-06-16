import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { apiClient } from '@/lib/api/client'
import type { Job } from '@/lib/api/types'

interface JobDetailsProps {
  job: Job
}

export const JobDetails = ({ job }: JobDetailsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApply = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.applyToJob(job.id)

      if (response.success && response.data) {
        router.push(`/letter/generate?jobId=${job.id}`)
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
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600">{job.company.name}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {job.contractType}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {job.experienceLevel}
          </span>
          {job.remote && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              Télétravail
            </span>
          )}
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {job.location}
          </span>
        </div>

        <div className="prose max-w-none">
          <h3>Description du poste</h3>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />

          {job.requirements && (
            <>
              <h3>Prérequis</h3>
              <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </>
          )}

          {job.benefits && (
            <>
              <h3>Avantages</h3>
              <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
            </>
          )}
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Publié le {new Date(job.createdAt).toLocaleDateString()}
              </p>
              {job.expiresAt && (
                <p className="text-sm text-gray-500">
                  Expire le {new Date(job.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <Button
              onClick={handleApply}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Traitement...
                </>
              ) : (
                'Postuler'
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </Card>
  )
} 