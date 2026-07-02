'use client'

import { useState } from 'react'
import { RegisterScreen } from '@/components/register-screen'
import { LoginScreen } from '@/components/login-screen'
import { GameScreen } from '@/components/game-screen'
import { DashboardScreen } from '@/components/dashboard-screen'
import { cn } from '@/lib/utils'

type Screen = 'register' | 'login' | 'game' | 'dashboard'

const AUTHED_TABS: { id: Screen; label: string }[] = [
  { id: 'game', label: './jugar' },
  { id: 'dashboard', label: './stats' },
]

export default function Page() {
  const [screen, setScreen] = useState<Screen>('login')
  const authed = screen === 'game' || screen === 'dashboard'

  return (
    <main className="relative flex min-h-dvh flex-col">
      {/* Top status bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-popover/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-2">
          <span className="size-2.5 animate-pulse rounded-full bg-primary box-glow" />
          <span className="text-sm font-bold tracking-widest text-primary text-glow">
            PICAS_Y_FAMAS
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">v1.0.0 // tty0</span>
        </div>

        {authed ? (
          <nav className="flex items-center gap-1">
            {AUTHED_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setScreen(tab.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs tracking-widest transition',
                  screen === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-primary',
                )}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setScreen('login')}
              className="ml-1 rounded-md px-3 py-1.5 text-xs tracking-widest text-muted-foreground transition hover:bg-secondary hover:text-destructive"
            >
              ./exit
            </button>
          </nav>
        ) : (
          <span className="text-xs text-muted-foreground">
            sesión: <span className="text-amber">no autenticado</span>
          </span>
        )}
      </header>

      {/* Screen area */}
      <div className="flex flex-1 items-start justify-center px-4 py-8 sm:px-6 sm:py-12">
        {screen === 'register' && (
          <RegisterScreen
            onRegister={() => setScreen('game')}
            onGoToLogin={() => setScreen('login')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            onLogin={() => setScreen('game')}
            onGoToRegister={() => setScreen('register')}
          />
        )}
        {screen === 'game' && <GameScreen onGoToDashboard={() => setScreen('dashboard')} />}
        {screen === 'dashboard' && <DashboardScreen />}
      </div>

      <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
        <span className="cursor-blink">root@picas-y-famas:~$ </span>
      </footer>
    </main>
  )
}
