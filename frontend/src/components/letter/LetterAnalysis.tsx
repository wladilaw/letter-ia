import { Card } from '@/components/ui/Card'
import type { LetterAnalysis as LetterAnalysisType } from '@/lib/api/types'

interface LetterAnalysisProps {
  analysis: LetterAnalysisType
}

export const LetterAnalysis = ({ analysis }: LetterAnalysisProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analyse de la lettre</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Lisibilité</h3>
            <div className="flex items-center justify-between">
              <span>Score</span>
              <span className={`font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                {analysis.readabilityScore}/10
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analysis.readabilityFeedback}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Pertinence</h3>
            <div className="flex items-center justify-between">
              <span>Score</span>
              <span className={`font-bold ${getScoreColor(analysis.relevanceScore)}`}>
                {analysis.relevanceScore}/10
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analysis.relevanceFeedback}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Structure</h3>
            <div className="flex items-center justify-between">
              <span>Score</span>
              <span className={`font-bold ${getScoreColor(analysis.structureScore)}`}>
                {analysis.structureScore}/10
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analysis.structureFeedback}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Ton</h3>
            <div className="flex items-center justify-between">
              <span>Score</span>
              <span className={`font-bold ${getScoreColor(analysis.toneScore)}`}>
                {analysis.toneScore}/10
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {analysis.toneFeedback}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Mots-clés pertinents</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Suggestions d'amélioration</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {analysis.improvementSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Points forts</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Points à améliorer</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
} 