"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CODE_CS } from '@/lib/code-samples'

/* ------------------------------------------------------------------ */
/* Canvas helper: tamaño del contenedor, DPR, pausa si no se ve        */
/* ------------------------------------------------------------------ */
type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void

export function useCanvas(draw: Draw) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) draw(ctx, w, h, 0)
    }
    const loop = (t: number) => {
      draw(ctx, w, h, t)
      raf = requestAnimationFrame(loop)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    // Only animate while on screen: several canvases share the page.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting && !reduced) raf = requestAnimationFrame(loop)
    })
    io.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

/* ------------------------------------------------------------------ */
/* Respaldo de la capa base: red de nodos oscura                        */
/* ------------------------------------------------------------------ */
export function NetworkCanvas() {
  const nodes = useRef<{ x: number; y: number; vx: number; vy: number; hot: boolean }[]>([])
  const ref = useCanvas((ctx, w, h) => {
    if (nodes.current.length === 0 && w > 0) {
      const n = Math.round(Math.min(80, (w * h) / 18000))
      nodes.current = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hot: i % 8 === 0,
      }))
    }
    const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.75)
    g.addColorStop(0, '#13201c')
    g.addColorStop(1, '#050807')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    const ns = nodes.current
    for (const p of ns) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) p.vy *= -1
    }
    for (let i = 0; i < ns.length; i++)
      for (let j = i + 1; j < ns.length; j++) {
        const d = Math.hypot(ns[i].x - ns[j].x, ns[i].y - ns[j].y)
        if (d > 160) continue
        const a = (1 - d / 160) * 0.25
        ctx.strokeStyle = ns[i].hot || ns[j].hot ? `rgba(242,194,48,${a * 1.4})` : `rgba(255,255,255,${a})`
        ctx.beginPath()
        ctx.moveTo(ns[i].x, ns[i].y)
        ctx.lineTo(ns[j].x, ns[j].y)
        ctx.stroke()
      }
    for (const p of ns) {
      ctx.fillStyle = p.hot ? '#f2c230' : 'rgba(255,255,255,0.5)'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.hot ? 2.4 : 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* Respaldo de la capa revelada: UN archivo C# real, con su pestaña     */
/* ------------------------------------------------------------------ */
const CS_LINES = CODE_CS.split('\n')
const CS_KW = /\b(public|sealed|class|async|await|var|if|return|new|is|null|private|readonly)\b/g
const CS_TYPE = /\b(Task|Result|Factura|Pedido|AppDbContext|ISriClient|FacturaService)\b/g

function paintLine(ctx: CanvasRenderingContext2D, line: string, x: number, y: number) {
  // tokens: strings, números, palabras clave, tipos, resto
  const re = /("[^"]*")|(\b\d+(?:\.\d+)?m?\b)|(\w+)|(\s+)|(.)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    const tok = m[0]
    if (m[1]) ctx.fillStyle = '#3ddc97'
    else if (m[2]) ctx.fillStyle = '#ff9b6b'
    else if (m[3] && CS_KW.test(tok)) ctx.fillStyle = '#f2c230'
    else if (m[3] && CS_TYPE.test(tok)) ctx.fillStyle = '#7cc7ff'
    else ctx.fillStyle = 'rgba(230,239,233,0.92)'
    CS_KW.lastIndex = 0
    CS_TYPE.lastIndex = 0
    ctx.fillText(tok, x, y)
    x += ctx.measureText(tok).width
  }
}

// next/font hashes the family name; read the real one from the CSS variable.
let cachedMono = ""
export function monoFamily() {
  if (!cachedMono) {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim()
    cachedMono = v ? `${v}, ui-monospace, Menlo, monospace` : "ui-monospace, Menlo, monospace"
  }
  return cachedMono
}

export function CodeCanvas() {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.fillStyle = '#0b1210'
    ctx.fillRect(0, 0, w, h)
    const size = w < 640 ? 12 : 15
    const lh = size * 1.8
    ctx.font = `${size}px ${monoFamily()}`
    ctx.textBaseline = 'top'

    // el archivo se escribe solo, línea a línea, y vuelve a empezar
    const block = CS_LINES.length * lh
    const startY = Math.max(90, (h - block) / 2)
    const startX = Math.max(24, (w - size * 0.6 * 70) / 2)
    const chars = CODE_CS.length
    const cycle = chars * 35 + 3000
    const shown = Math.min(chars, Math.floor((t % cycle) / 35))

    // pestaña del archivo
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fillRect(startX - 12, startY - lh * 2.2, size * 11, lh * 1.3)
    ctx.fillStyle = '#f2c230'
    ctx.fillText('FacturaService.cs', startX, startY - lh * 2.2 + lh * 0.25)

    let used = 0
    CS_LINES.forEach((line, k) => {
      const y = startY + k * lh
      ctx.fillStyle = 'rgba(255,255,255,0.22)'
      ctx.fillText(String(k + 1).padStart(2, ' '), startX - size * 2.4, y)
      const visible = line.slice(0, Math.max(0, shown - used))
      used += line.length + 1
      paintLine(ctx, visible, startX + size, y)
      if (visible.length < line.length && visible.length >= 0 && shown >= used - line.length - 1 && shown < used) {
        ctx.fillStyle = '#f2c230'
        ctx.fillRect(startX + size + ctx.measureText(visible).width + 2, y, size * 0.55, size * 1.15)
      }
    })
  })
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* Video de capa con respaldo                                            */
/* ------------------------------------------------------------------ */
/**
 * Video on desktop and mobile, with a canvas fallback when playback is blocked.
 * Respect reduced motion and Save-Data on every device.
 */
export function LayerVideo({ src, fallback }: { src: string; fallback: ReactNode }) {
  const [ok, setOk] = useState(false)
  const [ready, setReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check must run on the client
    if (src && !reduced && !saveData) setOk(true)
  }, [src])
  useEffect(() => {
    if (!ok) return
    const play = () => {
      const video = videoRef.current
      if (!video || document.hidden) return
      video.muted = true
      void video.play().catch(() => { /* Retry after a user gesture. */ })
    }
    play()
    window.addEventListener('pointerdown', play, { passive: true })
    document.addEventListener('visibilitychange', play)
    return () => {
      window.removeEventListener('pointerdown', play)
      document.removeEventListener('visibilitychange', play)
    }
  }, [ok])
  return (
    <>
      {(!ok || !ready) && fallback}
      {ok && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setReady(true)}
          onError={() => setOk(false)}
        />
      )}
    </>
  )
}
