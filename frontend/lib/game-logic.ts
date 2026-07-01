export type Attempt = {
  n: number
  guess: string
  famas: number
  picas: number
  message: string
}

/**
 * Picas y Famas (Bulls & Cows).
 * Famas = dígito correcto en la posición correcta.
 * Picas = dígito correcto en la posición incorrecta.
 */
export function evaluateGuess(secret: string, guess: string): { famas: number; picas: number } {
  let famas = 0
  let picas = 0
  const secretRest: string[] = []
  const guessRest: string[] = []

  for (let i = 0; i < secret.length; i++) {
    if (guess[i] === secret[i]) {
      famas++
    } else {
      secretRest.push(secret[i])
      guessRest.push(guess[i])
    }
  }

  const pool = [...secretRest]
  for (const g of guessRest) {
    const idx = pool.indexOf(g)
    if (idx !== -1) {
      picas++
      pool.splice(idx, 1)
    }
  }

  return { famas, picas }
}

export function buildMessage(famas: number, picas: number): string {
  if (famas === 4) return 'ACCESO CONCEDIDO // código descifrado'
  if (famas === 0 && picas === 0) return 'sin coincidencias // reinicia el vector'
  if (famas >= 3) return 'casi dentro // un dígito más'
  if (picas >= 3) return 'dígitos correctos, posición errónea'
  return 'analizando patrón...'
}

/** Genera un código secreto de 4 dígitos con dígitos únicos. */
export function generateSecret(): string {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[digits[i], digits[j]] = [digits[j], digits[i]]
  }
  return digits.slice(0, 4).join('')
}

/* -------------------------------------------------------------------------- */
/*                              Dashboard mock data                           */
/* -------------------------------------------------------------------------- */

export const registrosPorDia = [
  { dia: 'LUN', registros: 12 },
  { dia: 'MAR', registros: 19 },
  { dia: 'MIE', registros: 8 },
  { dia: 'JUE', registros: 23 },
  { dia: 'VIE', registros: 31 },
  { dia: 'SAB', registros: 27 },
  { dia: 'DOM', registros: 15 },
]

export const leaderboard = [
  { rank: 1, jugador: 'n30_kr4k3n', intentos: 4, tiempo: '01:12' },
  { rank: 2, jugador: 'gh0st_r00t', intentos: 5, tiempo: '00:58' },
  { rank: 3, jugador: 'binary_witch', intentos: 6, tiempo: '02:03' },
  { rank: 4, jugador: 'null_pointer', intentos: 6, tiempo: '02:44' },
  { rank: 5, jugador: 'seg_fault', intentos: 7, tiempo: '01:39' },
]

export const intentosPorJuego = [
  { juego: 'G-01', intentos: 4 },
  { juego: 'G-02', intentos: 9 },
  { juego: 'G-03', intentos: 6 },
  { juego: 'G-04', intentos: 12 },
  { juego: 'G-05', intentos: 7 },
  { juego: 'G-06', intentos: 5 },
  { juego: 'G-07', intentos: 11 },
  { juego: 'G-08', intentos: 8 },
]

export const promedioIntentos =
  intentosPorJuego.reduce((acc, g) => acc + g.intentos, 0) / intentosPorJuego.length
