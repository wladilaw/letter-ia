import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { apiClient } from '@/lib/api/client'
import type { Template } from '@/lib/api/types'

interface TemplateListProps {
  onSelect?: (template: Template) => void
}

export const TemplateList = ({ onSelect }: TemplateListProps) => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.getTemplates()

      if (response.success && response.data) {
        setTemplates(response.data.templates)
      } else {
        throw new Error(response.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{template.name}</h3>
            <p className="text-gray-600">{template.description}</p>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Ton: {template.tone}
              </span>
              <Button
                variant="outline"
                onClick={() => onSelect?.(template)}
              >
                Utiliser
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 