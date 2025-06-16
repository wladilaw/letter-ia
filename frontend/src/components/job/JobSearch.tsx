import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { apiClient } from '@/lib/api/client'
import type { Job, JobSearchParams } from '@/lib/api/types'

interface JobSearchProps {
  onSelect?: (job: Job) => void
}

export const JobSearch = ({ onSelect }: JobSearchProps) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSource, setSelectedSource] = useState<string>('all')

  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    query: '',
    location: '',
    remote: false,
    contractType: 'CDI',
    experienceLevel: 'JUNIOR'
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Utiliser l'API de scraping
      const response = await fetch(
        `/api/jobs/scrape?query=${encodeURIComponent(searchParams.query)}&page=${currentPage}${
          selectedSource !== 'all' ? `&source=${selectedSource}` : ''
        }`
      )

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche')
      }

      const data = await response.json()
      setJobs(data.jobs)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    handleSearch(new Event('submit') as any)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Mots-clés"
              value={searchParams.query}
              onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
              placeholder="Ex: Développeur Full Stack"
            />

            <Input
              label="Localisation"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              placeholder="Ex: Paris"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Source
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les sources</option>
                <option value="HELLOWORK">HelloWork</option>
                <option value="INDEED">Indeed</option>
                <option value="LINKEDIN">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type de contrat
              </label>
              <select
                value={searchParams.contractType}
                onChange={(e) => setSearchParams({ ...searchParams, contractType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="FREELANCE">Freelance</option>
                <option value="STAGE">Stage</option>
                <option value="ALTERNANCE">Alternance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Niveau d'expérience
              </label>
              <select
                value={searchParams.experienceLevel}
                onChange={(e) => setSearchParams({ ...searchParams, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="JUNIOR">Junior</option>
                <option value="MID_LEVEL">Confirmé</option>
                <option value="SENIOR">Senior</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Recherche en cours...
                </>
              ) : (
                'Rechercher'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company.name}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {job.contractType}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {job.experienceLevel}
                </span>
                {job.remote && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    Télétravail
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {job.source}
                </span>
              </div>

              <p className="text-gray-600 line-clamp-3">{job.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {job.location}
                </span>
                <div className="space-x-2">
                  {job.sourceUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(job.sourceUrl, '_blank')}
                    >
                      Voir l'offre
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => onSelect?.(job)}
                  >
                    Générer une lettre
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
} 