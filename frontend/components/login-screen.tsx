'use client'

import { useState } from 'react'
import { TerminalWindow } from '@/components/terminal-window'
import { TerminalField } from '@/components/terminal-field'
import { Button } from '@/components/ui/button'
import { loginUser } from '@/lib/api'

type LoginScreenProps = {
  onLogin: () => void
  onGoToRegister: () => void
}

export function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await loginUser(email, password)
      
      if (response.ok) {
        onLogin() // El redireccionamiento lo maneja el componente padre
      } else {
        setError(response.data?.message || 'Error: Credenciales inválidas.')
      }
    } catch (err) {
      setError('Error crítico: Sin conexión al servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TerminalWindow title="~/picas-y-famas/acceso.sh" className="w-full max-w-md" scanlines>
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <header className="mb-6">
          <p className="text-xs text-muted-foreground">$ ./login --secure</p>
          <h1 className="mt-2 text-2xl font-bold text-primary text-glow">
            AUTENTICACIÓN<span className="cursor-blink" />
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            introduce tus credenciales para continuar
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <TerminalField
            label="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="operador@matrix.io"
            autoComplete="email"
            required
            disabled={isLoading}
          />
          <TerminalField
            label="password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="mt-4 text-center text-xs text-red-500 font-bold text-glow">
            &gt; {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-7 w-full bg-primary font-bold tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? '> CONECTANDO...' : '> CONECTAR'}
        </Button>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          ¿sin cuenta?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            disabled={isLoading}
            className="text-primary underline-offset-4 hover:underline disabled:opacity-50"
          >
            ./registro
          </button>
        </p>
      </form>
    </TerminalWindow>
  )
}