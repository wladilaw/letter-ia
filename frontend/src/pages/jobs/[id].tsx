import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MainLayout } from '@/components/layout/MainLayout'
import { JobDetails } from '@/components/job/JobDetails'
import { Spinner } from '@/components/ui/Spinner'
import { apiClient } from '@/lib/api/client'
import type { Job } from '@/lib/api/types'

export default function JobDetailsPage() {
  const router = useRouter()
  const { id } = router.query

  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchJob = async () => {
      try {
        const response = await apiClient.getJob(id as string)

        if (response.success && response.data) {
          setJob(response.data)
        } else {
          throw new Error(response.error || 'Une erreur est survenue')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [id])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Spinner className="w-8 h-8" />
        </div>
      </MainLayout>
    )
  }

  if (error || !job) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error || 'Offre non trouvée'}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <JobDetails job={job} />
      </div>
    </MainLayout>
  )
} 