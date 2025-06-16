import { prisma } from '@/lib/prisma'
import type { UserProfile } from '@/lib/api/types'

// ===== AI SERVICE TYPES =====

export interface AIProvider {
  name: 'openai' | 'claude' | 'azure-openai'
  model: string
  maxTokens: number
  temperature: number
  baseURL?: string
  apiKey: string
}

export interface LetterPrompt {
  jobTitle: string
  companyName: string
  jobDescription: string
  userProfile: UserProfile
  tone: 'PROFESSIONAL' | 'ENTHUSIASTIC' | 'FORMAL' | 'CREATIVE' | 'CASUAL'
  templateId?: string
  personalNotes?: string
  industry?: string
  experienceLevel?: string
}

export interface GeneratedLetter {
  content: string
  wordCount: number
  aiScore: number
  suggestions: string[]
  keyPoints: string[]
  tone: string
  readingTime: number
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

// ===== AI SERVICE IMPLEMENTATION =====

export class AIService {
  private providers: Map<string, AIProvider> = new Map()
  private primaryProvider: string = 'openai'
  private fallbackProvider: string = 'claude'

  constructor(providers: AIProvider[]) {
    providers.forEach(provider => {
      this.providers.set(provider.name, provider)
    })
  }

  // Main letter generation method
  async generateLetter(prompt: LetterPrompt): Promise<GeneratedLetter> {
    try {
      const result = await this.tryGeneration(prompt, this.primaryProvider)
      
      // Track usage for billing
      await this.trackUsage(prompt.userProfile.userId, 'letter_generation', result.wordCount)
      
      return result
    } catch (error) {
      console.error(`Primary provider ${this.primaryProvider} failed:`, error)
      
      // Fallback to secondary provider
      try {
        const result = await this.tryGeneration(prompt, this.fallbackProvider)
        await this.trackUsage(prompt.userProfile.userId, 'letter_generation', result.wordCount)
        return result
      } catch (fallbackError) {
        console.error(`Fallback provider ${this.fallbackProvider} failed:`, fallbackError)
        throw new Error('AI service temporarily unavailable. Please try again.')
      }
    }
  }

  private async tryGeneration(prompt: LetterPrompt, providerName: string): Promise<GeneratedLetter> {
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not configured`)
    }

    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(prompt)
    
    let content: string

    switch (provider.name) {
      case 'openai':
        content = await this.generateWithOpenAI(provider, systemPrompt, userPrompt)
        break
      case 'claude':
        content = await this.generateWithClaude(provider, systemPrompt, userPrompt)
        break
      case 'azure-openai':
        content = await this.generateWithAzureOpenAI(provider, systemPrompt, userPrompt)
        break
      default:
        throw new Error(`Unsupported provider: ${provider.name}`)
    }

    // Post-process and analyze the generated content
    const analysis = await this.analyzeContent(content, prompt)
    
    return {
      content: this.formatLetter(content),
      wordCount: this.countWords(content),
      aiScore: analysis.score,
      suggestions: analysis.improvements,
      keyPoints: this.extractKeyPoints(content),
      tone: prompt.tone,
      readingTime: Math.ceil(this.countWords(content) / 200)
    }
  }

  // ===== PROVIDER-SPECIFIC IMPLEMENTATIONS =====

  private async generateWithOpenAI(
    provider: AIProvider, 
    systemPrompt: string, 
    userPrompt: string
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: provider.maxTokens,
        temperature: provider.temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private async generateWithClaude(
    provider: AIProvider,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': provider.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: provider.maxTokens,
        temperature: provider.temperature,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json()
    return data.content[0].text
  }

  private async generateWithAzureOpenAI(
    provider: AIProvider,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const response = await fetch(`${provider.baseURL}/openai/deployments/${provider.model}/chat/completions?api-version=2023-05-15`, {
      method: 'POST',
      headers: {
        'api-key': provider.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: provider.maxTokens,
        temperature: provider.temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  // ===== PROMPT ENGINEERING =====

  private buildSystemPrompt(): string {
    return `Tu es un expert en rédaction de lettres de motivation et en recrutement avec plus de 15 ans d'expérience. 

MISSION: Générer des lettres de motivation personnalisées, percutantes et authentiques qui maximisent les chances d'obtenir un entretien.

PRINCIPES FONDAMENTAUX:
1. PERSONNALISATION: Chaque lettre doit être unique et adaptée au poste/entreprise
2. AUTHENTICITÉ: Le ton doit rester humain et sincère, jamais robotique
3. IMPACT: Chaque phrase doit apporter de la valeur et capter l'attention
4. STRUCTURE: Respecter les codes professionnels français
5. OPTIMISATION: Intégrer les mots-clés du poste naturellement

STRUCTURE OBLIGATOIRE:
1. ACCROCHE (1 phrase): Captiver immédiatement l'attention
2. MOTIVATION (1-2 paragraphes): Pourquoi cette entreprise/ce poste
3. VALEUR AJOUTÉE (1-2 paragraphes): Expériences et compétences pertinentes
4. PROJETS/RÉALISATIONS (1 paragraphe): Résultats concrets et chiffrés
5. VISION (1 paragraphe): Comment contribuer aux objectifs de l'entreprise
6. CLÔTURE (1-2 phrases): Appel à l'action confiant

RÈGLES DE STYLE:
- Longueur: 250-400 mots maximum
- Phrases: Variées (courtes et moyennes), maximum 25 mots
- Vocabulaire: Professionnel mais accessible
- Ton: Adapté à la demande (professionnel, enthousiaste, etc.)
- Éviter: Clichés, formulations banales, surutilisation d'adjectifs

INTERDICTIONS ABSOLUES:
- Phrases génériques ("Je suis motivé", "Votre entreprise m'intéresse")
- Répétition des informations du CV
- Formules trop obséquieuses ou prétentieuses
- Fautes d'orthographe ou de grammaire
- Longueurs inutiles ou blabla

ADAPTATION SECTORIELLE:
- Tech: Mentionner veille technologique, projets open source, agilité
- Marketing: Parler ROI, analytics, créativité, data-driven
- Finance: Évoquer rigueur, analyse, conformité, optimisation
- Santé: Insister sur l'humain, la précision, l'éthique
- Startup: Mettre en avant adaptabilité, polyvalence, croissance

La lettre doit donner envie au recruteur de rencontrer le candidat. Chaque mot compte.`
  }

  private buildUserPrompt(prompt: LetterPrompt): string {
    const { jobTitle, companyName, jobDescription, userProfile, tone, personalNotes, industry } = prompt

    let toneInstruction = ''
    switch (tone) {
      case 'PROFESSIONAL':
        toneInstruction = 'Ton professionnel et confiant, mais chaleureux'
        break
      case 'ENTHUSIASTIC':
        toneInstruction = 'Ton enthousiaste et énergique, montrant une vraie passion'
        break
      case 'FORMAL':
        toneInstruction = 'Ton formel et respectueux, très codifié'
        break
      case 'CREATIVE':
        toneInstruction = 'Ton créatif et original, sortant des sentiers battus'
        break
      case 'CASUAL':
        toneInstruction = 'Ton décontracté mais professionnel, moderne'
        break
    }

    return `GÉNÈRE UNE LETTRE DE MOTIVATION POUR:

POSTE: ${jobTitle}
ENTREPRISE: ${companyName}
SECTEUR: ${industry || 'Non spécifié'}

DESCRIPTION DU POSTE:
${jobDescription}

PROFIL DU CANDIDAT:
- Nom: ${userProfile.firstName} ${userProfile.lastName}
- Titre: ${userProfile.title || 'Non spécifié'}
- Niveau d'expérience: ${userProfile.experienceLevel || 'Non spécifié'}
- Compétences clés: ${userProfile.skills?.join(', ') || 'Non spécifié'}
- Objectifs de carrière: ${userProfile.careerObjectives || 'Non spécifié'}
- Bio: ${userProfile.bio || 'Non spécifié'}

${personalNotes ? `NOTES PERSONNELLES DU CANDIDAT:\n${personalNotes}` : ''}

INSTRUCTIONS SPÉCIFIQUES:
- ${toneInstruction}
- Intégrer naturellement les mots-clés de l'offre
- Mettre en avant l'adéquation profil/poste
- Montrer une connaissance de l'entreprise
- Éviter les généralités, être spécifique et concret

GÉNÈRE UNIQUEMENT LE CONTENU DE LA LETTRE, sans formule de politesse d'ouverture ni signature.`
  }

  // ===== LETTER ANALYSIS =====

  async analyzeLetter(content: string, jobDescription?: string): Promise<LetterAnalysis> {
    const analysis = await Promise.all([
      this.analyzeReadability(content),
      this.analyzeKeywords(content, jobDescription),
      this.analyzeSentiment(content),
      this.analyzeStructure(content),
      this.calculateOverallScore(content, jobDescription)
    ])

    return {
      score: analysis[4],
      strengths: this.getStrengths(content),
      improvements: this.getImprovements(content),
      readability: analysis[0],
      keywords: analysis[1],
      sentiment: analysis[2],
      structure: analysis[3]
    }
  }

  private analyzeReadability(content: string) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const avgWordsPerSentence = words.length / sentences.length

    // Simplified Flesch score calculation
    const avgSentenceLength = avgWordsPerSentence
    const avgSyllablesPerWord = this.estimateSyllables(content) / words.length
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)

    let complexity: 'simple' | 'moderate' | 'complex'
    if (fleschScore >= 70) complexity = 'simple'
    else if (fleschScore >= 50) complexity = 'moderate'
    else complexity = 'complex'

    return {
      fleschScore: Math.max(0, Math.min(100, fleschScore)),
      complexity,
      avgWordsPerSentence: Math.round(avgWordsPerSentence)
    }
  }

  private analyzeKeywords(content: string, jobDescription?: string) {
    if (!jobDescription) {
      return {
        matched: [],
        missing: [],
        density: 0
      }
    }

    const jobKeywords = this.extractKeywords(jobDescription)
    const contentLower = content.toLowerCase()
    
    const matched = jobKeywords.filter(keyword => 
      contentLower.includes(keyword.toLowerCase())
    )
    
    const missing = jobKeywords.filter(keyword => 
      !contentLower.includes(keyword.toLowerCase())
    )

    const density = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) * 100 : 0

    return { matched, missing, density }
  }

  private analyzeSentiment(content: string) {
    // Simplified sentiment analysis using keyword matching
    const positiveWords = ['passionné', 'enthousiaste', 'motivé', 'excellent', 'expert', 'réussi', 'performant', 'innovation', 'créatif']
    const negativeWords = ['difficile', 'problème', 'échec', 'faible', 'limité']
    
    const words = content.toLowerCase().split(/\s+/)
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length
    
    const score = (positiveCount - negativeCount) / words.length * 100
    
    let label: 'negative' | 'neutral' | 'positive'
    if (score > 0.5) label = 'positive'
    else if (score < -0.5) label = 'negative'
    else label = 'neutral'

    return { score, label }
  }

  private analyzeStructure(content: string) {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const hasOpening = this.hasOpeningFormula(content)
    const hasClosing = this.hasClosingFormula(content)
    const hasBody = paragraphs.length >= 2

    return {
      hasOpening,
      hasBody,
      hasClosing,
      paragraphCount: paragraphs.length
    }
  }

  // ===== LETTER IMPROVEMENT =====

  async improveLetter(content: string, suggestions: string[]): Promise<string> {
    const provider = this.providers.get(this.primaryProvider)
    if (!provider) throw new Error('No provider available')

    const improvementPrompt = `
AMÉLIORE cette lettre de motivation en tenant compte des suggestions suivantes:

LETTRE ACTUELLE:
${content}

SUGGESTIONS D'AMÉLIORATION:
${suggestions.map(s => `- ${s}`).join('\n')}

INSTRUCTIONS:
- Conserve la structure générale et le ton
- Applique les améliorations suggérées de manière naturelle
- Améliore la fluidité et l'impact
- Garde la même longueur approximative
- Assure-toi que le résultat reste authentique

GÉNÈRE LA VERSION AMÉLIORÉE:`

    const systemPrompt = 'Tu es un expert en révision de lettres de motivation. Ton rôle est d\'améliorer les lettres en conservant leur authenticité.'

    return await this.generateWithOpenAI(provider, systemPrompt, improvementPrompt)
  }

  // ===== UTILITY METHODS =====

  private formatLetter(content: string): string {
    return content
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/\s{2,}/g, ' ') // Remove excessive spaces
      .replace(/^[,\s]+|[,\s]+$/g, '') // Remove leading/trailing commas and spaces
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  private extractKeyPoints(content: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    // Simple heuristic: sentences with action verbs or achievements
    const actionWords = ['dirigé', 'développé', 'créé', 'géré', 'optimisé', 'amélioré', 'réalisé']
    
    return sentences
      .filter(sentence => 
        actionWords.some(word => sentence.toLowerCase().includes(word)) ||
        /\d+%|\d+\s*(euros?|€|clients?|projets?|années?)/.test(sentence)
      )
      .map(sentence => sentence.trim())
      .slice(0, 3) // Top 3 key points
  }

  private extractKeywords(text: string): string[] {
    // Extract relevant keywords from job description
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)

    // Common tech/business keywords
    const relevantKeywords = words.filter(word => 
      /^(javascript|python|react|node|java|développement|management|marketing|commercial|finance|projet|équipe|client|innovation|digital|data|analyse|stratégie|performance|résultats|objectifs|croissance|expérience|compétence|formation|diplôme|certification|agile|scrum|startup|entreprise|international|export|vente|négociation|relation|communication|leadership|autonomie|rigueur|créativité|collaboration|anglais|français|europe|monde|secteur|industrie|marché|concurrence|solution|produit|service|qualité|sécurité|conformité|réglementation|budget|rentabilité|roi|kpi|dashboard|reporting|excel|powerpoint|word|outlook|crm|erp|sql|html|css|php|adobe|photoshop|illustrator|indesign|marketing|seo|sem|social|média|content|rédaction|édition|publication|événement|salon|conférence|formation|coaching|mentorat|recrutement|ressources|humaines|paie|juridique|comptabilité|fiscalité|audit|contrôle|gestion|administration|secrétariat|accueil|téléphone|mail|courrier|planning|agenda|organisation|méthode|processus|procédure|documentation|manuel|guide|formation|support|maintenance|dépannage|installation|configuration|réseau|système|serveur|base|données|sauvegarde|sécurité|antivirus|firewall|vpn|cloud|aws|azure|google|microsoft|office|teams|slack|zoom|skype|linkedin|facebook|twitter|instagram|youtube|google|analytics|adwords|facebook|ads|emailing|newsletter|blog|site|web|e-commerce|boutique|magasin|point|vente|caisse|stock|inventaire|logistique|transport|livraison|expédition|douane|import|export|international|anglais|espagnol|allemand|italien|chinois|arabe|niveau|bilingue|courant|notions|débutant|intermédiaire|avancé|expert|maîtrise|connaissance|compétence|aptitude|qualité|défaut|force|faiblesse|objectif|motivation|ambition|projet|avenir|carrière|évolution|promotion|augmentation|prime|bonus|salaire|rémunération|avantage|bénéfice|congé|vacances|rtt|télétravail|flexibilité|horaire|temps|partiel|plein|cdd|cdi|stage|alternance|apprentissage|formation|école|université|diplôme|bac|bts|dut|licence|master|doctorat|mba|certification|formation|continue|professionnelle|reconversion|mobilité|mutation|expatriation|mission|projet|client|fournisseur|partenaire|concurrent|marché|secteur|activité|domaine|spécialité|expertise|expérience|année|mois|poste|fonction|responsabilité|mission|tâche|activité|réalisation|résultat|objectif|performance|indicateur|mesure|évaluation|entretien|feedback|retour|amélioration|progression|développement|croissance|expansion|acquisition|fusion|restructuration|transformation|changement|innovation|nouveauté|tendance|évolution|futur|avenir|stratégie|vision|mission|valeur|culture|esprit|équipe|collaboration|communication|échange|partage|transmission|formation|apprentissage|développement|personnel|professionnel|compétence|soft|skills|hard|technique|fonctionnelle|transversale|généraliste|spécialisé|polyvalent|adaptable|flexible|mobile|disponible|réactif|proactif|autonome|indépendant|organisé|rigoureux|méthodique|précis|minutieux|consciencieux|fiable|ponctuel|assidu|persévérant|patient|calme|zen|stress|pression|urgence|délai|planning|échéance|livraison|résultat|objectif|cible|but|finalité|enjeu|défi|challenge|opportunité|chance|possibilité|perspective|horizon|futur|avenir|développement|croissance|expansion|international|export|import|commerce|négoce|vente|achat|approvisionnement|sourcing|logistique|supply|chain|transport|livraison|distribution|stockage|entrepôt|magasin|boutique|showroom|point|vente|corner|stand|salon|foire|exposition|événement|manifestation|congrès|colloque|séminaire|formation|atelier|workshop|masterclass|conférence|présentation|pitch|démonstration|prototype|maquette|échantillon|test|essai|validation|certification|homologation|agrément|autorisation|licence|brevet|marque|propriété|intellectuelle|droit|auteur|copyright|trademark|brand|image|réputation|notoriété|visibilité|communication|marketing|publicité|promotion|sponsoring|mécénat|partenariat|collaboration|alliance|joint|venture|fusion|acquisition|rachat|cession|vente|achat|investissement|financement|capital|fonds|subvention|aide|soutien|accompagnement|conseil|audit|expertise|diagnostic|analyse|étude|recherche|développement|innovation|création|conception|design|prototype|brevet|propriété|intellectuelle)$/.test(word)
    )

    // Remove duplicates and return top keywords
    return [...new Set(relevantKeywords)].slice(0, 20)
  }

  private estimateSyllables(text: string): number {
    // Simple syllable estimation for French text
    const words = text.toLowerCase().split(/\s+/)
    return words.reduce((total, word) => {
      const vowels = word.match(/[aeiouyàèéêîôû]/g)
      return total + Math.max(1, vowels ? vowels.length : 1)
    }, 0)
  }

  private hasOpeningFormula(content: string): boolean {
    const opening = content.substring(0, 100).toLowerCase()
    return /^(madame|monsieur|cher|chère|bonjour)/i.test(opening.trim())
  }

  private hasClosingFormula(content: string): boolean {
    const closing = content.substring(content.length - 200).toLowerCase()
    return /(cordialement|salutations|remercie|disposition|rencontrer|entretien)/.test(closing)
  }

  private calculateOverallScore(content: string, jobDescription?: string): number {
    let score = 70 // Base score

    // Length check (250-400 words ideal)
    const wordCount = this.countWords(content)
    if (wordCount >= 250 && wordCount <= 400) score += 10
    else if (wordCount < 200 || wordCount > 500) score -= 15

    // Structure check
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    if (paragraphs.length >= 3 && paragraphs.length <= 5) score += 10

    // Keyword density
    if (jobDescription) {
      const keywords = this.analyzeKeywords(content, jobDescription)
      score += Math.min(20, keywords.density / 5)
    }

    // Avoid common mistakes
    if (content.toLowerCase().includes('je suis motivé')) score -= 10
    if (content.toLowerCase().includes('votre entreprise m\'intéresse')) score -= 10
    if (/\b(très|vraiment|beaucoup|énormément)\b/gi.test(content)) score -= 5

    return Math.max(0, Math.min(100, score))
  }

  private getStrengths(content: string): string[] {
    const strengths = []
    
    if (this.countWords(content) >= 250 && this.countWords(content) <= 400) {
      strengths.push('Longueur optimale pour maintenir l\'attention')
    }
    
    if (/\d+%|\d+\s*(euros?|€|clients?|projets?|années?)/.test(content)) {
      strengths.push('Utilise des données chiffrées pour illustrer les réalisations')
    }
    
    if (!content.toLowerCase().includes('je suis motivé')) {
      strengths.push('Évite les formulations trop génériques')
    }

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length
    if (avgLength <= 20) {
      strengths.push('Phrases de longueur appropriée pour la lisibilité')
    }

    return strengths
  }

  private getImprovements(content: string): string[] {
    const improvements = []
    
    const wordCount = this.countWords(content)
    if (wordCount < 250) {
      improvements.push('Développer davantage les expériences et compétences')
    } else if (wordCount > 400) {
      improvements.push('Raccourcir pour plus d\'impact et de lisibilité')
    }
    
    if (content.toLowerCase().includes('je suis motivé')) {
      improvements.push('Remplacer les formulations génériques par des exemples concrets')
    }
    
    if (!/\d+%|\d+\s*(euros?|€|clients?|projets?|années?)/.test(content)) {
      improvements.push('Ajouter des résultats chiffrés pour renforcer la crédibilité')
    }
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const longSentences = sentences.filter(s => s.split(' ').length > 25)
    if (longSentences.length > 0) {
      improvements.push('Raccourcir les phrases trop longues pour améliorer la lisibilité')
    }

    return improvements
  }

  private async trackUsage(userId: string, serviceType: string, tokensUsed: number) {
    // Track AI usage for billing and analytics
    const cost = this.calculateCost(serviceType, tokensUsed)
    
    // Store in database
    await prisma.aIUsage.create({
      data: {
        userId,
        serviceType,
        tokensUsed,
        cost,
        createdAt: new Date()
      }
    })
  }

  private calculateCost(serviceType: string, tokensUsed: number): number {
    const rates = {
      'letter_generation': 0.002, // $0.002 per 1k tokens
      'letter_improvement': 0.001,
      'letter_analysis': 0.0005
    }
    
    return (tokensUsed / 1000) * (rates[serviceType] || 0.002)
  }
}

// ===== SPECIALIZED PROMPT TEMPLATES =====

export class PromptTemplateManager {
  private templates = new Map<string, string>()

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    // Tech sector prompt
    this.templates.set('tech', `
SPÉCIALISATION TECH:
- Mentionner la veille technologique et l'apprentissage continu
- Parler de projets open source ou contributions GitHub si pertinent
- Utiliser le vocabulaire technique approprié sans être trop technique
- Montrer la capacité d'adaptation aux nouvelles technologies
- Mettre en avant les méthodologies agiles si approprié
- Évoquer l'esprit d'équipe et la collaboration en mode startup/scale-up
    `)

    // Marketing sector prompt
    this.templates.set('marketing', `
SPÉCIALISATION MARKETING:
- Parler en termes de ROI, conversion, acquisition, rétention
- Mentionner une approche data-driven avec des KPIs concrets
- Évoquer la créativité et l'innovation dans les campagnes
- Montrer la compréhension des enjeux digitaux (SEO, SEM, social media)
- Utiliser le vocabulaire du growth hacking si startup
- Démontrer la capacité à analyser et optimiser les performances
    `)

    // Sales sector prompt
    this.templates.set('sales', `
SPÉCIALISATION VENTE:
- Mettre en avant les résultats commerciaux chiffrés (CA, quotas)
- Parler de prospection, négociation, closing
- Évoquer la relation client et la fidélisation
- Montrer la connaissance du cycle de vente B2B/B2C
- Utiliser le vocabulaire CRM et pipeline commercial
- Démontrer l'esprit de compétition et l'orientation résultats
    `)

    // Finance sector prompt
    this.templates.set('finance', `
SPÉCIALISATION FINANCE:
- Insister sur la rigueur, la précision, l'analyse
- Parler de conformité, réglementation, audit
- Évoquer l'optimisation des coûts et la rentabilité
- Mentionner les outils Excel avancés, ERP, BI
- Utiliser le vocabulaire comptable et financier approprié
- Montrer la capacité à conseiller et éclairer les décisions
    `)
  }

  getTemplate(sector: string): string {
    return this.templates.get(sector.toLowerCase()) || ''
  }
}

// ===== EXPORT =====

export const aiService = new AIService([
  {
    name: 'openai',
    model: 'gpt-4-turbo-preview',
    maxTokens: 2000,
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY!
  },
  {
    name: 'claude',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 2000,
    temperature: 0.7,
    apiKey: process.env.CLAUDE_API_KEY!
  }
])

export const promptManager = new PromptTemplateManager() 