'use client'

import { cn } from '@/lib/utils'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { Monitor } from 'lucide-react' // optional icon change
import { useEffect, useState } from 'react'
import { Toggle } from './ui/toggle'

export function SearchModeOperatorToggle() {
  const [isOperatorMode, setIsOperatorMode] = useState(false)

  useEffect(() => {
    const savedMode = getCookie('operator-mode')
    if (savedMode !== null) {
      setIsOperatorMode(savedMode === 'true')
    } else {
      setCookie('operator-mode', 'false')
    }
  }, [])

  const handleOperatorModeChange = (pressed: boolean) => {
    setIsOperatorMode(pressed)
    setCookie('operator-mode', pressed.toString())
  }

  return (
    <Toggle
      aria-label="Toggle Browser Operator mode"
      pressed={isOperatorMode}
      onPressedChange={handleOperatorModeChange}
      variant="outline"
      className={cn(
        'gap-1 px-3 border border-input text-muted-foreground bg-background',
        'data-[state=on]:bg-accent-blue',
        'data-[state=on]:text-accent-blue-foreground',
        'data-[state=on]:border-accent-blue-border',
        'hover:bg-accent hover:text-accent-foreground rounded-full'
      )}
    >
      <Monitor className="size-4" />
      <span className="text-xs">Browser Operator</span>
    </Toggle>
  )
}
