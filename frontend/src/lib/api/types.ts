// ===== BASE TYPES =====

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface APIError {
  code: string
  message: string
  details?: any
}

// ===== AUTHENTICATION TYPES =====

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  company?: string
  role?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// ===== USER TYPES =====

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  createdAt: Date
  updatedAt: Date
  profile?: UserProfile
}

export interface UserProfile {
  userId: string
  title?: string
  bio?: string
  location?: string
  website?: string
  company?: string
  industry?: string
  experienceLevel?: string
  skills?: string[]
  languages?: Language[]
  education?: Education[]
  experience?: Experience[]
  careerObjectives?: string
  preferences?: UserPreferences
}

export interface Language {
  name: string
  level: 'NATIVE' | 'FLUENT' | 'ADVANCED' | 'INTERMEDIATE' | 'BASIC'
}

export interface Education {
  school: string
  degree: string
  field: string
  startDate: Date
  endDate?: Date
  description?: string
}

export interface Experience {
  company: string
  title: string
  startDate: Date
  endDate?: Date
  description?: string
  achievements?: string[]
}

export interface UserPreferences {
  emailNotifications: boolean
  jobAlerts: boolean
  newsletter: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
}

// ===== LETTER TYPES =====

export interface Letter {
  id: string
  userId: string
  jobId?: string
  templateId?: string
  title: string
  content: string
  status: LetterStatus
  tone: Tone
  wordCount: number
  aiScore?: number
  createdAt: Date
  updatedAt: Date
  analysis?: LetterAnalysis
}

export interface GenerateLetterRequest {
  jobTitle: string
  companyName: string
  jobDescription: string
  tone: Tone
  templateId?: string
  personalNotes?: string
}

export interface LetterAnalysis {
  score: number
  strengths: string[]
  improvements: string[]
  readability: {
    fleschScore: number
    complexity: 'simple' | 'moderate' | 'complex'
    avgWordsPerSentence: number
  }
  keywords: {
    matched: string[]
    missing: string[]
    density: number
  }
  sentiment: {
    score: number
    label: 'negative' | 'neutral' | 'positive'
  }
  structure: {
    hasOpening: boolean
    hasBody: boolean
    hasClosing: boolean
    paragraphCount: number
  }
}

// ===== JOB TYPES =====

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  type: string
  description: string
  requirements: string[]
  benefits: string[]
  salary?: {
    min: number
    max: number
    currency: string
  }
  status: JobStatus
  createdAt: Date
  updatedAt: Date
}

export interface JobSearchParams {
  query?: string
  location?: string
  type?: string
  company?: string
  salary?: {
    min?: number
    max?: number
  }
  experience?: string
  skills?: string[]
  page?: number
  limit?: number
}

export interface JobsList {
  jobs: Job[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ===== COMPANY TYPES =====

export interface Company {
  id: string
  name: string
  description: string
  website: string
  logo?: string
  industry: string
  size?: string
  location: string
  founded?: number
  type?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  updatedAt: Date
}

export interface CompaniesList {
  companies: Company[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ===== TEMPLATE TYPES =====

export interface Template {
  id: string
  name: string
  description: string
  content: string
  category: string
  industry?: string
  tone: Tone
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TemplatesList {
  templates: Template[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ===== SUBSCRIPTION TYPES =====

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'MONTHLY' | 'YEARLY'
  features: string[]
  limits: {
    lettersPerMonth: number
    templates: number
    aiAnalysis: boolean
    prioritySupport: boolean
  }
}

export interface SubscribeRequest {
  planId: string
  paymentMethod: string
  billingAddress?: {
    country: string
    city: string
    postalCode: string
    address: string
  }
}

export interface SubscriptionResponse {
  subscription: {
    id: string
    status: SubscriptionStatus
    plan: SubscriptionPlan
    startDate: Date
    endDate: Date
    cancelAtPeriodEnd: boolean
  }
  payment: {
    id: string
    status: PaymentStatus
    amount: number
    currency: string
    date: Date
  }
}

// ===== USAGE STATISTICS =====

export interface UsageStats {
  totalLetters: number
  lettersThisMonth: number
  aiAnalysisCount: number
  templatesUsed: number
  subscription: {
    plan: string
    status: SubscriptionStatus
    nextBillingDate: Date
  }
}

// ===== ENUMS =====

export enum Role {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN'
}

export enum Plan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum LetterStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  EDITED = 'EDITED',
  FINAL = 'FINAL',
  ARCHIVED = 'ARCHIVED'
}

export enum Tone {
  PROFESSIONAL = 'PROFESSIONAL',
  ENTHUSIASTIC = 'ENTHUSIASTIC',
  FORMAL = 'FORMAL',
  CREATIVE = 'CREATIVE',
  CASUAL = 'CASUAL'
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT'
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
  TRIAL = 'TRIAL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum ServiceType {
  LETTER_GENERATION = 'LETTER_GENERATION',
  LETTER_IMPROVEMENT = 'LETTER_IMPROVEMENT',
  LETTER_ANALYSIS = 'LETTER_ANALYSIS'
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
} 