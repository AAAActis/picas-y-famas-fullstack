'use client'

import { useRef } from 'react'

type DigitInputProps = {
  digits: string[]
  onChange: (digits: string[]) => void
  disabled?: boolean
}

export function DigitInput({ digits, onChange, disabled }: DigitInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = clean
    onChange(next)
    if (clean && index < digits.length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < digits.length - 1) refs.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits.length)
    if (!pasted) return
    const next = digits.map((_, i) => pasted[i] ?? '')
    onChange(next)
    refs.current[Math.min(pasted.length, digits.length - 1)]?.focus()
  }

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          aria-label={`Dígito ${i + 1}`}
          value={digit}
          disabled={disabled}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="size-14 rounded-md border border-input bg-background text-center text-2xl font-bold text-primary caret-primary outline-none transition focus:border-primary focus:box-glow disabled:opacity-50 sm:size-16 sm:text-3xl"
        />
      ))}
    </div>
  )
}
