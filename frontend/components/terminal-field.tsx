'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

type TerminalFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  min?: number
  max?: number
  className?: string
}

export function TerminalField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  required,
  min,
  max,
  className,
}: TerminalFieldProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground"
      >
        <span className="text-primary">&gt;</span>
        {label}
        {required && <span className="text-amber">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground caret-primary outline-none transition focus:border-primary focus:box-glow placeholder:text-muted-foreground/60"
      />
    </div>
  )
}
