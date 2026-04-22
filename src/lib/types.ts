export type TaskType = 'tache2' | 'tache3'

export interface Topic {
  id: string
  task_type: TaskType
  question: string
  theme: string
  difficulty: 'B1' | 'B2'
  is_active: boolean
}

export interface IdeasBank {
  id: string
  topic_id: string
  idea: string
  ready_sentence: string
  position: 'pour' | 'contre' | 'neutral'
  sample_opinion?: string
}

export interface Template {
  id: string
  task_type: TaskType
  title: string
  content: string
  order_index: number
}

export interface SosIdea {
  idea: string
  sentence: string
}

export interface FeedbackResult {
  mistakes: string[]
  improved: string
  level: 'A2' | 'B1' | 'B2' | 'C1'
}

export interface UpgradeResult {
  versions: Array<{
    text: string
    highlights: string[]
  }>
}

export interface DailyQuestion {
  topic: Topic
  ideas: {
    pour: IdeasBank[]
    contre: IdeasBank[]
    sample_opinion: string
  }
  templates: Template[]
}
