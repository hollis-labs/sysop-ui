import { toast } from 'sonner'

/**
 * Unwrap a thrown value into user-facing text. The single place to extend
 * when the API starts returning structured errors (`{ code, message, … }`).
 */
function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message
  if (typeof err === 'string' && err.length > 0) return err
  return fallback
}

/** Show an error toast — call from `catch` blocks with a fallback message. */
export function notifyError(err: unknown, fallback: string): void {
  toast.error(extractMessage(err, fallback))
}

/** Show a success toast. */
export function notifySuccess(message: string): void {
  toast.success(message)
}
