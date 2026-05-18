import type { ComponentProps } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from './ui/button'
import { useCopy } from '../hooks/use-copy'

interface CopyButtonProps
  extends Omit<ComponentProps<typeof Button>, 'onClick' | 'children'> {
  /** Text written to the clipboard on click. */
  text: string
  /** Label shown before a copy (default `Copy`). */
  label?: string
  /** Label shown for `resetMs` after a successful copy (default `Copied`). */
  copiedLabel?: string
}

/**
 * Button that copies `text` to the clipboard and confirms inline by swapping
 * its icon + label for `resetMs`. Defaults to an `outline`/`sm` button; pass
 * `variant`/`size` to override.
 */
export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  variant = 'outline',
  size = 'sm',
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopy()
  return (
    <Button variant={variant} size={size} onClick={() => copy(text)} {...props}>
      {copied ? <Check /> : <Copy />}
      {copied ? copiedLabel : label}
    </Button>
  )
}
