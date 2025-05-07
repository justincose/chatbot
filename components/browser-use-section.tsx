// components/browser-use-section.tsx
'use client'

import { CHAT_ID } from '@/lib/constants'
import { useChat } from '@ai-sdk/react'
import type { ToolInvocation } from 'ai'
import { CollapsibleMessage } from './collapsible-message'
import { Section } from './section'

interface BrowserUseSectionProps {
  tool: ToolInvocation & {
    args: { prompt: string }
    result?: { liveUrl: string | null; result: string | null }
  }
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function BrowserUseSection({
  tool,
  isOpen,
  onOpenChange
}: BrowserUseSectionProps) {
  const { status } = useChat({ id: CHAT_ID })
  const isLoading = status === 'submitted' || status === 'streaming'
  const prompt = (tool.args as any).prompt as string

  const header = (
    <button
      type="button"
      onClick={() => onOpenChange(!isOpen)}
      className="flex justify-between w-full p-1 rounded-md"
    >
      <strong>Operator</strong> “{prompt}”
    </button>
  )

  // still in-flight?
  if (tool.state !== 'result') {
    return (
      <CollapsibleMessage
        role="assistant"
        isCollapsible
        header={header}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Section>Launching browser...</Section>
      </CollapsibleMessage>
    )
  }

  // now it’s done, safely destruct
  const { liveUrl, result } = tool.result!

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {liveUrl ? (
        <iframe
          src={liveUrl}
          title="Live Browser Preview"
          className="w-full h-[350px] sm:h-[520px] border rounded"
        />
      ) : (
        <div className="text-muted-foreground italic">Loading browser...</div>
      )}

      {/* {result && (
        <Section title="Extracted Result">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </Section>
      )} */}
    </CollapsibleMessage>
  )
}
