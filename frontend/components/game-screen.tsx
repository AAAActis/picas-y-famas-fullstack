'use client'

import { useState } from 'react'
import { TerminalWindow } from '@/components/terminal-window'
import { DigitInput } from '@/components/digit-input'
import { VictoryModal } from '@/components/victory-modal'
import { Button } from '@/components/ui/button'
import {
  type Attempt,
  buildMessage,
  evaluateGuess,
  generateSecret,
} from '@/lib/game-logic'

export function GameScreen({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  const [secret, setSecret] = useState(generateSecret)
  const [digits, setDigits] = useState(['', '', '', ''])
  const [history, setHistory] = useState<Attempt[]>([])
  const [error, setError] = useState('')
  const [won, setWon] = useState(false)

  const guess = digits.join('')
  const isComplete = guess.length === 4

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete) {
      setError('vector incompleto // ingresa 4 dígitos')
      return
    }
    setError('')
    const { famas, picas } = evaluateGuess(secret, guess)
    const attempt: Attempt = {
      n: history.length + 1,
      guess,
      famas,
      picas,
      message: buildMessage(famas, picas),
    }
    setHistory((prev) => [attempt, ...prev])
    setDigits(['', '', '', ''])
    if (famas === 4) setWon(true)
  }

  const reset = () => {
    setSecret(generateSecret())
    setDigits(['', '', '', ''])
    setHistory([])
    setError('')
    setWon(false)
  }

  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {/* Input panel */}
      <TerminalWindow title="~/picas-y-famas/consola.exe" scanlines className="self-start">
        <form onSubmit={submit} className="p-6 sm:p-8">
          <header className="mb-6">
            <p className="text-xs text-muted-foreground">$ ./adivina --len 4</p>
            <h1 className="mt-2 text-2xl font-bold text-primary text-glow">
              DESCIFRA_EL_CÓDIGO<span className="cursor-blink" />
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              intento #{history.length + 1} // encuentra los 4 dígitos secretos
            </p>
          </header>

          <DigitInput digits={digits} onChange={setDigits} disabled={won} />

          {error && (
            <p className="mt-4 text-center text-xs text-destructive">! {error}</p>
          )}

          <Button
            type="submit"
            disabled={won}
            className="mt-6 w-full bg-primary font-bold tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            &gt; ENVIAR_INTENTO
          </Button>

          <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
              <span className="text-primary text-glow">FAMAS</span>
              <p className="mt-1 text-muted-foreground">dígito + posición correcta</p>
            </div>
            <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
              <span className="text-amber">PICAS</span>
              <p className="mt-1 text-muted-foreground">dígito correcto, mala posición</p>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-5 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            ./reiniciar --new-secret
          </button>
        </form>
      </TerminalWindow>

      {/* History panel */}
      <TerminalWindow title="~/picas-y-famas/historial.log" className="self-start">
        <div className="p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              registro de intentos
            </p>
            <span className="text-xs text-muted-foreground">{history.length} entradas</span>
          </div>

          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-popover text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">guess</th>
                  <th className="px-3 py-2 text-center font-medium text-primary">famas</th>
                  <th className="px-3 py-2 text-center font-medium text-amber">picas</th>
                  <th className="px-3 py-2 text-left font-medium">msg</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-xs text-muted-foreground">
                      <span className="cursor-blink">esperando primer intento</span>
                    </td>
                  </tr>
                ) : (
                  history.map((a) => (
                    <tr
                      key={a.n}
                      className="border-b border-border/60 last:border-0 odd:bg-secondary/20"
                    >
                      <td className="px-3 py-2.5 text-muted-foreground">{a.n}</td>
                      <td className="px-3 py-2.5 font-bold tracking-[0.3em] text-foreground">
                        {a.guess}
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-primary text-glow">
                        {a.famas}
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-amber">{a.picas}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{a.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </TerminalWindow>

      <VictoryModal
        open={won}
        attempts={history.length}
        secret={secret}
        onPlayAgain={reset}
        onGoToDashboard={onGoToDashboard}
      />
    </div>
  )
}
