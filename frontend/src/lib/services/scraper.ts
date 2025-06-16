import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Job } from '@/lib/api/types'

interface ScrapingResult {
  jobs: Job[]
  totalPages: number
  currentPage: number
}

export class JobScraper {
  private static readonly SOURCES = {
    HELLOWORK: {
      baseUrl: 'https://www.hellowork.com',
      searchUrl: '/emplois/recherche.html',
      selectors: {
        jobList: '.job-list-item',
        title: '.job-title',
        company: '.company-name',
        location: '.job-location',
        description: '.job-description',
        contractType: '.job-contract',
        salary: '.job-salary',
        date: '.job-date',
        link: '.job-link'
      }
    },
    INDEED: {
      baseUrl: 'https://fr.indeed.com',
      searchUrl: '/jobs',
      selectors: {
        jobList: '.job_seen_beacon',
        title: '.jobTitle',
        company: '.companyName',
        location: '.companyLocation',
        description: '.job-snippet',
        salary: '.salary-snippet',
        date: '.date',
        link: '.jobTitle a'
      }
    },
    LINKEDIN: {
      baseUrl: 'https://www.linkedin.com',
      searchUrl: '/jobs/search',
      selectors: {
        jobList: '.job-card-container',
        title: '.job-card-list__title',
        company: '.job-card-container__company-name',
        location: '.job-card-container__metadata-item',
        description: '.job-card-container__description',
        salary: '.job-card-container__salary-info',
        date: '.job-card-container__footer-item',
        link: '.job-card-list__title'
      }
    }
  }

  private static async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors du scraping:', error)
      throw new Error('Impossible de récupérer les offres d\'emploi')
    }
  }

  private static parseJobFromHTML(html: string, source: keyof typeof JobScraper.SOURCES): Job[] {
    const $ = cheerio.load(html)
    const sourceConfig = JobScraper.SOURCES[source]
    const jobs: Job[] = []

    $(sourceConfig.selectors.jobList).each((_, element) => {
      const $element = $(element)
      
      const title = $element.find(sourceConfig.selectors.title).text().trim()
      const company = $element.find(sourceConfig.selectors.company).text().trim()
      const location = $element.find(sourceConfig.selectors.location).text().trim()
      const description = $element.find(sourceConfig.selectors.description).text().trim()
      const salary = $element.find(sourceConfig.selectors.salary).text().trim()
      const date = $element.find(sourceConfig.selectors.date).text().trim()
      const link = $element.find(sourceConfig.selectors.link).attr('href')

      if (title && company) {
        jobs.push({
          id: `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          company: {
            id: `scraped-company-${Date.now()}`,
            name: company,
            description: '',
            website: '',
            logo: '',
            location: location
          },
          description,
          requirements: '',
          benefits: '',
          location,
          contractType: this.detectContractType(description),
          experienceLevel: this.detectExperienceLevel(description),
          salary: salary || undefined,
          remote: this.detectRemote(description),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          expiresAt: undefined,
          applicationStatus: 'NOT_APPLIED',
          source: source,
          sourceUrl: link ? `${sourceConfig.baseUrl}${link}` : undefined
        })
      }
    })

    return jobs
  }

  private static detectContractType(description: string): string {
    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('cdi')) return 'CDI'
    if (lowerDesc.includes('cdd')) return 'CDD'
    if (lowerDesc.includes('freelance') || lowerDesc.includes('indépendant')) return 'FREELANCE'
    if (lowerDesc.includes('stage')) return 'STAGE'
    if (lowerDesc.includes('alternance')) return 'ALTERNANCE'
    return 'CDI' // Par défaut
  }

  private static detectExperienceLevel(description: string): string {
    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('expert') || lowerDesc.includes('senior')) return 'EXPERT'
    if (lowerDesc.includes('confirmé')) return 'SENIOR'
    if (lowerDesc.includes('junior')) return 'JUNIOR'
    return 'MID_LEVEL' // Par défaut
  }

  private static detectRemote(description: string): boolean {
    const lowerDesc = description.toLowerCase()
    return lowerDesc.includes('télétravail') || 
           lowerDesc.includes('remote') || 
           lowerDesc.includes('à distance')
  }

  public static async scrapeJobs(
    source: keyof typeof JobScraper.SOURCES,
    query: string,
    page: number = 1
  ): Promise<ScrapingResult> {
    const sourceConfig = JobScraper.SOURCES[source]
    const searchUrl = `${sourceConfig.baseUrl}${sourceConfig.searchUrl}?q=${encodeURIComponent(query)}&page=${page}`
    
    const html = await this.fetchPage(searchUrl)
    const jobs = this.parseJobFromHTML(html, source)

    // Estimation du nombre total de pages (à adapter selon la source)
    const totalPages = Math.ceil(jobs.length / 20) // Supposons 20 offres par page

    return {
      jobs,
      totalPages,
      currentPage: page
    }
  }

  public static async scrapeMultipleSources(
    query: string,
    page: number = 1
  ): Promise<ScrapingResult> {
    const sources = Object.keys(JobScraper.SOURCES) as Array<keyof typeof JobScraper.SOURCES>
    const results = await Promise.all(
      sources.map(source => this.scrapeJobs(source, query, page))
    )

    const allJobs = results.flatMap(result => result.jobs)
    const maxPages = Math.max(...results.map(result => result.totalPages))

    return {
      jobs: allJobs,
      totalPages: maxPages,
      currentPage: page
    }
  }
} 