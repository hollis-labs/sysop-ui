import raw from './tasks.json'

export interface DemoTag {
  slug: string
  name: string
  color: string
}

export interface DemoTaskStats {
  run_count: number
  prompt_tokens: number
  completion_tokens: number
  cost: number
}

export interface DemoTask {
  id: string
  title: string
  description: string
  status: string
  priority: number
  kind: string
  manual: boolean
  executor: string
  agent_profile: string
  working_dir: string
  tags: DemoTag[]
  depends_on: string[]
  blocked_reason: string
  project_id: string | null
  created_at: string
  updated_at: string
  stats: DemoTaskStats
  metadata: Record<string, unknown>
}

/**
 * Torque-shaped task fixture. Captured into `demo/fixtures/tasks.json` so the
 * Operations + Detail views render real-shaped data without a live Torque
 * backend — a standing regression surface for the kit's layout components.
 */
export const TASKS = raw as unknown as DemoTask[]

export function getTask(id: string): DemoTask | undefined {
  return TASKS.find((task) => task.id === id)
}
