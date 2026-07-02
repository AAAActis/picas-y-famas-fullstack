'use client'

import { useState } from 'react'
import { TerminalWindow } from '@/components/terminal-window'
import { TerminalField } from '@/components/terminal-field'
import { Button } from '@/components/ui/button'
import { registerUser, RegisterData } from '@/lib/api'

type RegisterScreenProps = {
  onRegister: () => void
  onGoToLogin: () => void
}

export function RegisterScreen({ onRegister, onGoToLogin }: RegisterScreenProps) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    age: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const userData: RegisterData = {
        ...form,
        age: Number(form.age)
      }

      const response = await registerUser(userData)
      
      if (response.ok) {
        onRegister()
      } else {
        setError(response.data?.message || 'Error: No se pudo registrar el usuario.')
      }
    } catch (err) {
      setError('Error crítico: Sin conexión al servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TerminalWindow title="~/picas-y-famas/registro.sh" className="w-full max-w-lg" scanlines>
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <header className="mb-6">
          <p className="text-xs text-muted-foreground">$ ./crear_usuario --new</p>
          <h1 className="mt-2 text-2xl font-bold text-primary text-glow">
            NUEVO_OPERADOR<span className="cursor-blink" />
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            registra tus credenciales para acceder al núcleo
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <TerminalField
            label="firstname"
            value={form.firstname}
            onChange={set('firstname')}
            placeholder="Neo"
            autoComplete="given-name"
            required
            disabled={isLoading}
          />
          <TerminalField
            label="lastname"
            value={form.lastname}
            onChange={set('lastname')}
            placeholder="Anderson"
            autoComplete="family-name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mt-4">
          <TerminalField
            label="age"
            type="number"
            value={form.age}
            onChange={set('age')}
            placeholder="27"
            min={1}
            max={120}
            required
            disabled={isLoading}
          />
        </div>

        <div className="mt-4">
          <TerminalField
            label="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="operador@matrix.io"
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mt-4">
          <TerminalField
            label="password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            autoComplete="new-password"
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
          {isLoading ? '> PROCESANDO...' : '> INICIAR_REGISTRO'}
        </Button>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          ¿ya tienes acceso?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            disabled={isLoading}
            className="text-primary underline-offset-4 hover:underline disabled:opacity-50"
          >
            ./login
          </button>
        </p>
      </form>
    </TerminalWindow>
  )
}