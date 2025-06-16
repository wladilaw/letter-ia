import { useRouter } from 'next/router'
import { MainLayout } from '@/components/layout/MainLayout'
import { JobSearch } from '@/components/job/JobSearch'

export default function JobsPage() {
  const router = useRouter()

  const handleSelectJob = (job: any) => {
    router.push(`/jobs/${job.id}`)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Offres d'emploi</h1>
          <JobSearch onSelect={handleSelectJob} />
        </div>
      </div>
    </MainLayout>
  )
} 