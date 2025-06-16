import { useRouter } from 'next/router'
import { MainLayout } from '@/components/layout/MainLayout'
import { LetterGenerator } from '@/components/letter/LetterGenerator'

export default function GenerateLetterPage() {
  const router = useRouter()
  const { jobTitle, companyName, jobDescription } = router.query

  const handleSuccess = (letterId: string) => {
    router.push(`/letter/${letterId}`)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <LetterGenerator
          jobTitle={jobTitle as string}
          companyName={companyName as string}
          jobDescription={jobDescription as string}
          onSuccess={handleSuccess}
        />
      </div>
    </MainLayout>
  )
} 