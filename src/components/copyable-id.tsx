import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyableIdProps {
  id: string
  /** Optional shorter label to display in place of the full id. */
  label?: string
}

/** Inline monospace id with click-to-copy — mirrors Torque's CopyableId. */
export function CopyableId({ id, label }: CopyableIdProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    void navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 font-mono text-[10px] text-text-subtle transition-colors hover:text-text-muted"
      title={`Copy ${id}`}
      aria-label={copied ? `Copied ${id}` : `Copy ${id}`}
      data-row-interactive="true"
    >
      {label ?? id}
      {copied ? (
        <Check className="h-2.5 w-2.5 text-status-indexed" />
      ) : (
        <Copy className="h-2.5 w-2.5" />
      )}
    </button>
  )
}
