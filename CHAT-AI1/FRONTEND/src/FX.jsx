import { useCallback, useEffect, useRef, useState } from 'react'
import './fx.css'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const BOOT_LINES = ['INIT CORE MODULES', 'LOADING NEURAL INTERFACE', 'LINKING GEMINI API', 'SYSTEM ONLINE']

// ===== หน้าจอบูต =====
export function BootScreen() {
  const [p, setP] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('booting')
    const timers = []
    const t0 = performance.now()
    const DUR = reduced() ? 300 : 1800
    let raf

    const tick = (now) => {
      const v = Math.min((now - t0) / DUR, 1)
      setP(Math.round(v * 100))
      if (v < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        timers.push(setTimeout(() => setOut(true), 250))
        timers.push(
          setTimeout(() => {
            setGone(true)
            root.classList.remove('booting')
          }, 1000)
        )
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      root.classList.remove('booting')
    }
  }, [])

  if (gone) return null

  return (
    <div className={`boot ${out ? 'out' : ''}`} role="status" aria-label="กำลังโหลด">
      <div className="boot-box">
        <p className="boot-title">&gt; TEAM.OS v1.0 // BOOT</p>
        {BOOT_LINES.map((line, i) => (
          <p key={line} className={`boot-line ${p >= i * 25 ? 'show' : ''}`}>
            <span>[{p >= (i + 1) * 25 ? ' OK ' : ' .. '}]</span> {line}
          </p>
        ))}
        <div className="boot-bar">
          <i style={{ width: `${p}%` }} />
        </div>
        <p className="boot-pct">{p}%</p>
      </div>
    </div>
  )
}

// ===== ข้อความถอดรหัส (ตัวอักษรสลับแล้วค่อยล็อก) =====
export function Scramble({ text, delay = 0 }) {
  const [out, setOut] = useState(text)
  const timer = useRef(null)

  const run = useCallback(() => {
    if (reduced()) return
    clearInterval(timer.current)
    const pool = (text.replace(/\s/g, '') + '01<>/_#').split('')
    let frame = 0
    timer.current = setInterval(() => {
      frame++
      setOut(
        text
          .split('')
          .map((ch, i) =>
            ch === ' ' || frame > i * 2 + 8 ? ch : pool[Math.floor(Math.random() * pool.length)]
          )
          .join('')
      )
      if (frame > text.length * 2 + 8) {
        clearInterval(timer.current)
        setOut(text)
      }
    }, 35)
  }, [text])

  useEffect(() => {
    const t = setTimeout(run, delay)
    return () => {
      clearTimeout(t)
      clearInterval(timer.current)
    }
  }, [run, delay])

  return (
    <span aria-label={text} onMouseEnter={run}>
      {out}
    </span>
  )
}

// ===== เครือข่ายอนุภาค + เส้นสแกน + เคอร์เซอร์วงแหวน + ปุ่มแม่เหล็ก =====
export function FX() {
  const canvasRef = useRef(null)
  const ringRef = useRef(null)

  // --- เครือข่ายอนุภาค ---
  useEffect(() => {
    if (reduced()) return
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const mouse = { x: -999, y: -999 }
    let w = 0
    let h = 0
    let pts = []
    let raf

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(80, Math.floor((w * h) / 18000))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }))
    }
    const move = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.fillStyle = 'rgba(34, 211, 238, 0.7)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.strokeStyle = `rgba(124, 92, 255, ${(1 - d / 120) * 0.35})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (dm < 170) {
          ctx.strokeStyle = `rgba(255, 78, 205, ${(1 - dm / 170) * 0.6})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  // --- เคอร์เซอร์วงแหวน + ปุ่มแม่เหล็ก (เฉพาะเครื่องที่มีเมาส์) ---
  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return
    const ring = ringRef.current
    ring.style.display = 'block'
    const MAG = '.skill-btn, .chat-toggle, .logo, .nav-links a'
    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let raf

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      ring.classList.toggle('hot', !!e.target.closest?.('a, button, input, .tilt'))
      document.querySelectorAll(MAG).forEach((el) => {
        const r = el.getBoundingClientRect()
        const dx = x - (r.left + r.width / 2)
        const dy = y - (r.top + r.height / 2)
        if (Math.hypot(dx, dy) < 90) el.style.translate = `${dx * 0.25}px ${dy * 0.25}px`
        else if (el.style.translate) el.style.translate = ''
      })
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      ring.style.display = 'none'
      document.querySelectorAll(MAG).forEach((el) => (el.style.translate = ''))
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="net" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <div ref={ringRef} className="cur-ring" aria-hidden="true" />
    </>
  )
}