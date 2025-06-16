import { NextApiRequest, NextApiResponse } from 'next'
import { JobScraper } from '@/lib/services/scraper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  try {
    const { query, page, source } = req.query

    if (!query) {
      return res.status(400).json({ error: 'Le paramètre query est requis' })
    }

    const pageNumber = parseInt(page as string) || 1
    const sourceKey = source as keyof typeof JobScraper.SOURCES

    let result
    if (sourceKey && Object.keys(JobScraper.SOURCES).includes(sourceKey)) {
      result = await JobScraper.scrapeJobs(sourceKey, query as string, pageNumber)
    } else {
      result = await JobScraper.scrapeMultipleSources(query as string, pageNumber)
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Erreur lors du scraping:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des offres d\'emploi' })
  }
} 