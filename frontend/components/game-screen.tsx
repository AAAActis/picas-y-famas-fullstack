'use client'

import { useState } from 'react'
import { TerminalWindow } from '@/components/terminal-window'
import { DigitInput } from '@/components/digit-input'
import { VictoryModal } from '@/components/victory-modal'
import { Button } from '@/components/ui/button'
import { startGame, guessNumber } from '@/lib/api'

export type Attempt = {
  n: number
  guess: string
  famas: number
  picas: number
  message: string
}

export function GameScreen({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  const [gameId, setGameId] = useState<number | null>(null)
  const [digits, setDigits] = useState(['', '', '', ''])
  const [history, setHistory] = useState<Attempt[]>([])
  const [error, setError] = useState('')
  const [won, setWon] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const guess = digits.join('')
  const isComplete = guess.length === 4

  const startNewGame = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await startGame()
      if (res.ok) {
        // Asegurate de que la key coincide con lo que devuelve tu backend (gameid o gameId)
        setGameId(res.data.gameid || res.data.gameId)
        setHistory([])
        setDigits(['', '', '', ''])
        setWon(false)
      } else {
        setError(res.data?.message || 'Error al iniciar la partida.')
      }
    } catch (err) {
      setError('Error de conexión con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!gameId) {
      setError('vector inactivo // inicia una nueva partida primero')
      return
    }
    if (!isComplete) {
      setError('vector incompleto // ingresa 4 dígitos')
      return
    }
    
    setError('')
    setIsLoading(true)

    try {
      const res = await guessNumber(gameId, guess)
      if (res.ok) {
        const data = res.data
        const attempt: Attempt = {
          n: history.length + 1,
          guess,
          famas: data.famas,
          picas: data.picas,
          message: data.message,
        }
        
        setHistory((prev) => [attempt, ...prev])
        setDigits(['', '', '', ''])

        if (data.isFinished) {
          setWon(true)
        }
      } else {
        setError(res.data?.message || 'Error al procesar el intento.')
      }
    } catch (err) {
      setError('Error de conexión con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {/* Input panel */}
      <TerminalWindow title="~/picas-y-famas/consola.exe" scanlines className="self-start">
        <div className="p-6 sm:p-8">
          <header className="mb-6">
            <p className="text-xs text-muted-foreground">$ ./adivina --len 4</p>
            <h1 className="mt-2 text-2xl font-bold text-primary text-glow">
              DESCIFRA_EL_CÓDIGO<span className="cursor-blink" />
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {gameId 
                ? `intento #${history.length + 1} // encuentra los 4 dígitos secretos`
                : 'inicia una nueva partida para jugar'}
            </p>
          </header>

          <form onSubmit={submit}>
            <DigitInput digits={digits} onChange={setDigits} disabled={won || !gameId || isLoading} />
            
            {error && (
              <p className="mt-4 text-center text-xs text-destructive font-bold">! {error}</p>
            )}
            
            <Button
              type="submit"
              disabled={won || !gameId || isLoading}
              className="mt-6 w-full bg-primary font-bold tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              &gt; {isLoading ? 'PROCESANDO...' : 'ENVIAR_INTENTO'}
            </Button>
          </form>

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
            onClick={startNewGame}
            disabled={isLoading}
            className="mt-5 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline disabled:opacity-50"
          >
            ./nueva-partida
          </button>
        </div>
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
                      <span className="cursor-blink">
                        {gameId ? 'esperando primer intento' : 'inicia una partida'}
                      </span>
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
        secret={history.length > 0 ? history[0].guess : '0000'}
        onPlayAgain={startNewGame}
        onGoToDashboard={onGoToDashboard}
      />
    </div>
  )
}