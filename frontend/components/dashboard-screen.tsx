'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TerminalWindow } from '@/components/terminal-window'
import {
  intentosPorJuego,
  leaderboard,
  promedioIntentos,
  registrosPorDia,
} from '@/lib/game-logic'

const NEON = '#86efac'
const AMBER = '#fbbf24'
const GRID = '#24344f'
const MUTED = '#64748b'

function TerminalTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-primary/50 bg-popover px-3 py-2 text-xs box-glow">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-bold text-primary">
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  )
}

export function DashboardScreen() {
  return (
    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-2">
      {/* Registros por día */}
      <TerminalWindow title="~/stats/registros_por_dia.chart">
        <div className="p-4 sm:p-6">
          <h2 className="mb-1 text-sm font-bold text-primary text-glow">REGISTROS POR DÍA</h2>
          <p className="mb-4 text-xs text-muted-foreground">nuevos operadores / últimos 7 días</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={registrosPorDia} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: MUTED, fontSize: 11 }} stroke={GRID} />
              <YAxis tick={{ fill: MUTED, fontSize: 11 }} stroke={GRID} />
              <Tooltip cursor={{ fill: 'rgba(134,239,172,0.08)' }} content={<TerminalTooltip />} />
              <Bar dataKey="registros" name="registros" fill={NEON} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TerminalWindow>

      {/* Leaderboard */}
      <TerminalWindow title="~/stats/leaderboard.tbl">
        <div className="p-4 sm:p-6">
          <h2 className="mb-1 text-sm font-bold text-primary text-glow">TOP 5 // MENOS INTENTOS</h2>
          <p className="mb-4 text-xs text-muted-foreground">partidas resueltas más eficientes</p>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-popover text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">jugador</th>
                  <th className="px-3 py-2 text-center font-medium text-primary">intentos</th>
                  <th className="px-3 py-2 text-right font-medium">tiempo</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr
                    key={row.rank}
                    className="border-b border-border/60 last:border-0 odd:bg-secondary/20"
                  >
                    <td className="px-3 py-2.5">
                      <span
                        className={
                          row.rank === 1
                            ? 'font-bold text-amber'
                            : 'text-muted-foreground'
                        }
                      >
                        {String(row.rank).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-bold text-foreground">{row.jugador}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-primary text-glow">
                      {row.intentos}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{row.tiempo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TerminalWindow>

      {/* Intentos por juego con promedio */}
      <TerminalWindow title="~/stats/intentos_por_juego.chart" className="lg:col-span-2">
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-primary text-glow">INTENTOS POR JUEGO</h2>
              <p className="text-xs text-muted-foreground">con línea de promedio global</p>
            </div>
            <span className="rounded-md border border-amber/40 px-3 py-1 text-xs text-amber">
              promedio: {promedioIntentos.toFixed(1)} intentos
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={intentosPorJuego} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="juego" tick={{ fill: MUTED, fontSize: 11 }} stroke={GRID} />
              <YAxis tick={{ fill: MUTED, fontSize: 11 }} stroke={GRID} />
              <Tooltip cursor={{ fill: 'rgba(134,239,172,0.08)' }} content={<TerminalTooltip />} />
              <ReferenceLine
                y={promedioIntentos}
                stroke={AMBER}
                strokeDasharray="6 4"
                label={{
                  value: `avg ${promedioIntentos.toFixed(1)}`,
                  fill: AMBER,
                  fontSize: 11,
                  position: 'right',
                }}
              />
              <Bar dataKey="intentos" name="intentos" radius={[3, 3, 0, 0]}>
                {intentosPorJuego.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.intentos > promedioIntentos ? AMBER : NEON}
                    fillOpacity={entry.intentos > promedioIntentos ? 0.7 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TerminalWindow>
    </div>
  )
}
