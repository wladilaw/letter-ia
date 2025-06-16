import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG, API_ENDPOINTS } from './config'
import {
  APIResponse,
  APIError,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
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
  UsageStats,
} from './types'

export class MotivAIClient {
  private client: AxiosInstance
  private accessToken?: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken
    this.client = axios.create({
      ...API_CONFIG,
      headers: {
        ...API_CONFIG.headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const { data } = await this.refreshToken()
            this.setAccessToken(data.accessToken)
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  setAccessToken(token: string) {
    this.accessToken = token
    this.client.defaults.headers.Authorization = `Bearer ${token}`
  }

  // Méthodes d'authentification
  async register(data: RegisterRequest): Promise<APIResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>(API_ENDPOINTS.auth.register, data)
    return response
  }

  async login(data: LoginRequest): Promise<APIResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>(API_ENDPOINTS.auth.login, data)
    return response
  }

  async refreshToken(): Promise<APIResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>(API_ENDPOINTS.auth.refresh, {
      refreshToken: localStorage.getItem('refreshToken'),
    })
    return response
  }

  // Méthodes utilisateur
  async getCurrentUser(): Promise<APIResponse<User>> {
    const response = await this.get<User>(API_ENDPOINTS.users.me)
    return response
  }

  async updateUser(data: Partial<User>): Promise<APIResponse<User>> {
    const response = await this.patch<User>(API_ENDPOINTS.users.me, data)
    return response
  }

  async getUserProfile(): Promise<APIResponse<UserProfile>> {
    const response = await this.get<UserProfile>(API_ENDPOINTS.users.profile)
    return response
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    const response = await this.put<UserProfile>(API_ENDPOINTS.users.profile, data)
    return response
  }

  // Méthodes de lettres
  async getLetters(params?: { page?: number; limit?: number; status?: string }): Promise<APIResponse<Letter[]>> {
    const response = await this.get<Letter[]>(API_ENDPOINTS.letters.list, { params })
    return response
  }

  async generateLetter(data: GenerateLetterRequest): Promise<APIResponse<Letter>> {
    const response = await this.post<Letter>(API_ENDPOINTS.letters.create, data)
    return response
  }

  async getLetter(id: string): Promise<APIResponse<Letter>> {
    const response = await this.get<Letter>(API_ENDPOINTS.letters.get(id))
    return response
  }

  async updateLetter(id: string, data: Partial<Letter>): Promise<APIResponse<Letter>> {
    const response = await this.put<Letter>(API_ENDPOINTS.letters.update(id), data)
    return response
  }

  async deleteLetter(id: string): Promise<APIResponse<void>> {
    const response = await this.delete<void>(API_ENDPOINTS.letters.delete(id))
    return response
  }

  async improveLetter(id: string, data: { suggestions: string[]; improvementType: string }): Promise<APIResponse<Letter>> {
    const response = await this.post<Letter>(API_ENDPOINTS.letters.improve(id), data)
    return response
  }

  async analyzeLetter(id: string): Promise<APIResponse<LetterAnalysis>> {
    const response = await this.post<LetterAnalysis>(API_ENDPOINTS.letters.analyze(id))
    return response
  }

  async exportLetter(id: string, format: 'pdf' | 'docx' = 'pdf'): Promise<Blob> {
    const response = await this.client.get(API_ENDPOINTS.letters.export(id), {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  }

  // Méthodes d'emploi
  async getJobs(params?: JobSearchParams): Promise<APIResponse<JobsList>> {
    const response = await this.get<JobsList>(API_ENDPOINTS.jobs.list, { params })
    return response
  }

  async getJob(id: string): Promise<APIResponse<Job>> {
    const response = await this.get<Job>(API_ENDPOINTS.jobs.get(id))
    return response
  }

  async applyToJob(id: string, data: { letterId: string; cvId?: string }): Promise<APIResponse<void>> {
    const response = await this.post<void>(API_ENDPOINTS.jobs.apply(id), data)
    return response
  }

  async getSavedJobs(): Promise<APIResponse<Job[]>> {
    const response = await this.get<Job[]>(API_ENDPOINTS.jobs.saved)
    return response
  }

  async saveJob(id: string): Promise<APIResponse<void>> {
    const response = await this.post<void>(API_ENDPOINTS.jobs.save(id))
    return response
  }

  // Méthodes d'entreprise
  async getCompanies(params?: { search?: string; industry?: string }): Promise<APIResponse<CompaniesList>> {
    const response = await this.get<CompaniesList>(API_ENDPOINTS.companies.list, { params })
    return response
  }

  async getCompany(id: string): Promise<APIResponse<Company>> {
    const response = await this.get<Company>(API_ENDPOINTS.companies.get(id))
    return response
  }

  async followCompany(id: string): Promise<APIResponse<void>> {
    const response = await this.post<void>(API_ENDPOINTS.companies.follow(id))
    return response
  }

  // Méthodes de template
  async getTemplates(params?: { category?: string; isPublic?: boolean }): Promise<APIResponse<TemplatesList>> {
    const response = await this.get<TemplatesList>(API_ENDPOINTS.templates.list, { params })
    return response
  }

  async createTemplate(data: Partial<Template>): Promise<APIResponse<Template>> {
    const response = await this.post<Template>(API_ENDPOINTS.templates.create, data)
    return response
  }

  // Méthodes d'abonnement
  async getSubscriptionPlans(): Promise<APIResponse<SubscriptionPlan[]>> {
    const response = await this.get<SubscriptionPlan[]>(API_ENDPOINTS.subscriptions.plans)
    return response
  }

  async subscribe(data: SubscribeRequest): Promise<APIResponse<SubscriptionResponse>> {
    const response = await this.post<SubscriptionResponse>(API_ENDPOINTS.subscriptions.subscribe, data)
    return response
  }

  async cancelSubscription(): Promise<APIResponse<void>> {
    const response = await this.post<void>(API_ENDPOINTS.subscriptions.cancel)
    return response
  }

  // Méthodes d'analyse
  async getUsageStats(): Promise<APIResponse<UsageStats>> {
    const response = await this.get<UsageStats>(API_ENDPOINTS.analytics.usage)
    return response
  }

  // Méthodes utilitaires
  private async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.get<APIResponse<T>>(url, config)
    return response.data
  }

  private async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.post<APIResponse<T>>(url, data, config)
    return response.data
  }

  private async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.put<APIResponse<T>>(url, data, config)
    return response.data
  }

  private async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.patch<APIResponse<T>>(url, data, config)
    return response.data
  }

  private async delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.delete<APIResponse<T>>(url, config)
    return response.data
  }
} 