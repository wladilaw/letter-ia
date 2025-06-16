import { API_CONFIG, API_ENDPOINTS } from './config'
import type {
  APIResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  User,
  UserProfile,
  Letter,
  GenerateLetterRequest,
  LetterAnalysis,
  Job,
  JobSearchParams,
  JobsList,
  Company,
  CompaniesList,
  Template,
  TemplatesList,
  SubscriptionPlan,
  SubscribeRequest,
  SubscriptionResponse,
  UsageStats
} from './types'

export class MotivAIClient {
  private baseURL: string
  private headers: Record<string, string>

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.headers = API_CONFIG.headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // ===== AUTHENTICATION =====

  async register(data: RegisterRequest): Promise<APIResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async login(credentials: LoginRequest): Promise<APIResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async logout(): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.auth.logout, {
      method: 'POST'
    })
  }

  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    return this.request<{ token: string }>(API_ENDPOINTS.auth.refresh, {
      method: 'POST'
    })
  }

  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.request<User>(API_ENDPOINTS.auth.me)
  }

  // ===== USER MANAGEMENT =====

  async updateProfile(profile: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    return this.request<UserProfile>(API_ENDPOINTS.users.profile, {
      method: 'PUT',
      body: JSON.stringify(profile)
    })
  }

  async deleteAccount(): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.users.delete, {
      method: 'DELETE'
    })
  }

  // ===== LETTER MANAGEMENT =====

  async generateLetter(data: GenerateLetterRequest): Promise<APIResponse<Letter>> {
    return this.request<Letter>(API_ENDPOINTS.letters.create, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateLetter(id: string, content: string): Promise<APIResponse<Letter>> {
    return this.request<Letter>(API_ENDPOINTS.letters.update, {
      method: 'PUT',
      body: JSON.stringify({ id, content })
    })
  }

  async deleteLetter(id: string): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.letters.delete, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  async getLetters(page = 1, limit = 10): Promise<APIResponse<Letter[]>> {
    return this.request<Letter[]>(`${API_ENDPOINTS.letters.list}?page=${page}&limit=${limit}`)
  }

  async getLetter(id: string): Promise<APIResponse<Letter>> {
    return this.request<Letter>(API_ENDPOINTS.letters.get.replace(':id', id))
  }

  async analyzeLetter(id: string): Promise<APIResponse<LetterAnalysis>> {
    return this.request<LetterAnalysis>(API_ENDPOINTS.letters.analyze, {
      method: 'POST',
      body: JSON.stringify({ id })
    })
  }

  async improveLetter(id: string): Promise<APIResponse<Letter>> {
    return this.request<Letter>(API_ENDPOINTS.letters.improve, {
      method: 'POST',
      body: JSON.stringify({ id })
    })
  }

  // ===== JOB MANAGEMENT =====

  async searchJobs(params: JobSearchParams): Promise<APIResponse<JobsList>> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, Array.isArray(value) ? value.join(',') : String(value))
      }
    })

    return this.request<JobsList>(`${API_ENDPOINTS.jobs.search}?${queryParams.toString()}`)
  }

  async getJob(id: string): Promise<APIResponse<Job>> {
    return this.request<Job>(API_ENDPOINTS.jobs.get.replace(':id', id))
  }

  async saveJob(id: string): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.jobs.save, {
      method: 'POST',
      body: JSON.stringify({ id })
    })
  }

  async applyToJob(id: string, letterId: string): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.jobs.apply, {
      method: 'POST',
      body: JSON.stringify({ jobId: id, letterId })
    })
  }

  // ===== COMPANY MANAGEMENT =====

  async searchCompanies(query: string, page = 1, limit = 10): Promise<APIResponse<CompaniesList>> {
    return this.request<CompaniesList>(
      `${API_ENDPOINTS.companies.search}?query=${query}&page=${page}&limit=${limit}`
    )
  }

  async getCompany(id: string): Promise<APIResponse<Company>> {
    return this.request<Company>(API_ENDPOINTS.companies.get.replace(':id', id))
  }

  async followCompany(id: string): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.companies.follow, {
      method: 'POST',
      body: JSON.stringify({ id })
    })
  }

  // ===== TEMPLATE MANAGEMENT =====

  async getTemplates(page = 1, limit = 10): Promise<APIResponse<TemplatesList>> {
    return this.request<TemplatesList>(
      `${API_ENDPOINTS.templates.list}?page=${page}&limit=${limit}`
    )
  }

  async getTemplate(id: string): Promise<APIResponse<Template>> {
    return this.request<Template>(API_ENDPOINTS.templates.get.replace(':id', id))
  }

  async createTemplate(template: Partial<Template>): Promise<APIResponse<Template>> {
    return this.request<Template>(API_ENDPOINTS.templates.create, {
      method: 'POST',
      body: JSON.stringify(template)
    })
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<APIResponse<Template>> {
    return this.request<Template>(API_ENDPOINTS.templates.update, {
      method: 'PUT',
      body: JSON.stringify({ id, ...template })
    })
  }

  async deleteTemplate(id: string): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.templates.delete, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
  }

  // ===== SUBSCRIPTION MANAGEMENT =====

  async getSubscriptionPlans(): Promise<APIResponse<SubscriptionPlan[]>> {
    return this.request<SubscriptionPlan[]>(API_ENDPOINTS.subscriptions.plans)
  }

  async subscribe(data: SubscribeRequest): Promise<APIResponse<SubscriptionResponse>> {
    return this.request<SubscriptionResponse>(API_ENDPOINTS.subscriptions.subscribe, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async cancelSubscription(): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.subscriptions.cancel, {
      method: 'POST'
    })
  }

  async getSubscriptionStatus(): Promise<APIResponse<SubscriptionResponse>> {
    return this.request<SubscriptionResponse>(API_ENDPOINTS.subscriptions.status)
  }

  // ===== ANALYTICS =====

  async getUsageStats(): Promise<APIResponse<UsageStats>> {
    return this.request<UsageStats>(API_ENDPOINTS.analytics.usage)
  }

  async getPerformanceStats(): Promise<APIResponse<any>> {
    return this.request<any>(API_ENDPOINTS.analytics.performance)
  }

  async submitFeedback(feedback: {
    type: string
    content: string
    rating?: number
  }): Promise<APIResponse<void>> {
    return this.request<void>(API_ENDPOINTS.analytics.feedback, {
      method: 'POST',
      body: JSON.stringify(feedback)
    })
  }
}

export const apiClient = new MotivAIClient() 