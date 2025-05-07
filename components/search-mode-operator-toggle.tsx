// components/SearchModeOperatorToggle.tsx
'use client'

import { cn } from '@/lib/utils'
import { Monitor } from 'lucide-react'
import { Toggle } from './ui/toggle'

export interface SearchModeOperatorToggleProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
}

export function SearchModeOperatorToggle({
  pressed,
  onPressedChange
}: SearchModeOperatorToggleProps) {
  return (
    <Toggle
      aria-label="Toggle browser operator mode"
      pressed={pressed}
      onPressedChange={onPressedChange}
      variant="outline"
      className={cn(
        'gap-1 px-3 border border-input text-muted-foreground bg-background',
        'data-[state=on]:bg-accent-blue',
        'data-[state=on]:text-accent-blue-foreground',
        'data-[state=on]:border-accent-blue-border',
        'hover:bg-accent hover:text-accent-foreground',
        'rounded-full'
      )}
    >
      <Monitor className="size-4" />
      <span className="text-xs">Browser Operator</span>
    </Toggle>
  )
}
