'use client'

import { Button } from '@/components/ui/button'

type VictoryModalProps = {
  open: boolean
  attempts: number
  secret: string
  onPlayAgain: () => void
  onGoToDashboard: () => void
}

export function VictoryModal({
  open,
  attempts,
  secret,
  onPlayAgain,
  onGoToDashboard,
}: VictoryModalProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Victoria"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-primary bg-card box-glow scanlines">
        <div className="border-b border-primary/40 bg-popover px-4 py-2.5 text-center text-xs tracking-widest text-primary">
          // SYSTEM_BREACH_SUCCESS
        </div>
        <div className="p-8 text-center">
          <p className="text-xs tracking-widest text-muted-foreground">4 FAMAS // 0 PICAS</p>
          <h2 className="mt-3 text-3xl font-bold text-primary text-glow">ACCESO CONCEDIDO</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            código <span className="font-bold text-amber">{secret}</span> descifrado en
          </p>
          <p className="mt-2 text-5xl font-bold text-primary text-glow">{attempts}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">intentos</p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={onPlayAgain}
              className="w-full bg-primary font-bold tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              &gt; NUEVA_PARTIDA
            </Button>
            <Button
              onClick={onGoToDashboard}
              variant="outline"
              className="w-full border-border bg-transparent font-bold tracking-widest text-foreground hover:bg-secondary hover:text-primary"
            >
              &gt; VER_ESTADÍSTICAS
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
