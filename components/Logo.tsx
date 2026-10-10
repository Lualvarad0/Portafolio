"use client";

import { useId } from 'react'

/**
 * Logo de Cornerstone Develop.
 * El símbolo es una etiqueta de código </> construida como mampostería: cada trazo es un
 * bloque de piedra separado por juntas. El bloque de la esquina del "<", en amarillo,
 * es la "cornerstone" (piedra angular): el primer bloque, con el que se alinea todo lo demás.
 */
const PATHS = {
  lt: 'M60 12 L16 60 L60 108',
  corner: 'M32.2 42.3 L16 60 L32.2 77.7',
  gt: 'M132 12 L176 60 L132 108',
  slash: 'M84 112 L108 8',
}

export function LogoMark({
  size = 28,
  color = 'currentColor',
  accent = '#f2c230',
  title,
}: {
  /** alto en px; el ancho se calcula (proporción 1.6 : 1) */
  size?: number
  color?: string
  accent?: string
  title?: string
}) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      width={size * 1.6}
      height={size}
      viewBox="0 0 192 120"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <mask id={`joints-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="192" height="120">
          <rect width="192" height="120" fill="white" />
          <line x1="14.5" y1="26.1" x2="49.9" y2="58.5" stroke="black" strokeWidth="5" />
          <line x1="49.9" y1="61.5" x2="14.5" y2="93.9" stroke="black" strokeWidth="5" />
          <line x1="142.1" y1="58.5" x2="177.5" y2="26.1" stroke="black" strokeWidth="5" />
          <line x1="177.5" y1="93.9" x2="142.1" y2="61.5" stroke="black" strokeWidth="5" />
        </mask>
      </defs>
      <g mask={`url(#joints-${id})`} fill="none" strokeLinejoin="miter" strokeMiterlimit={10} strokeWidth={22}>
        <path d={PATHS.lt} stroke={color} />
        <path d={PATHS.corner} stroke={accent} />
        <path d={PATHS.gt} stroke={color} />
      </g>
      <path d={PATHS.slash} stroke={color} strokeWidth={19} fill="none" />
    </svg>
  )
}

/** Logo completo: símbolo + nombre. */
export function LogoLockup({
  size = 24,
  className = '',
  color = 'currentColor',
}: {
  size?: number
  className?: string
  color?: string
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} style={{ color }}>
      <LogoMark size={size} />
      <span className="flex items-baseline gap-1.5 leading-none" style={{ fontSize: size * 1.05 }}>
        <span className="font-playfair" style={{ letterSpacing: "-0.03em" }}>
          Cornerstone
        </span>
        <span className="font-semibold" style={{ letterSpacing: '-0.05em' }}>
          Develop
        </span>
      </span>
    </span>
  )
}
