import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TerminalWindowProps = {
  title: string
  children: ReactNode
  className?: string
  bodyClassName?: string
  scanlines?: boolean
}

export function TerminalWindow({
  title,
  children,
  className,
  bodyClassName,
  scanlines = false,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-card box-glow',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-border bg-popover px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-destructive/80" />
          <span className="size-3 rounded-full bg-amber/80" />
          <span className="size-3 rounded-full bg-primary/80" />
        </div>
        <p className="flex-1 truncate text-center text-xs tracking-widest text-muted-foreground">
          {title}
        </p>
        <span className="text-xs text-muted-foreground">●REC</span>
      </div>

      <div className={cn('relative', scanlines && 'scanlines', bodyClassName)}>{children}</div>
    </div>
  )
}
