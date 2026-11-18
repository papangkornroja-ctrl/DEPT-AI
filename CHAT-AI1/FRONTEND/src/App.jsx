import { useEffect, useRef, useState } from 'react'
import ChatBox from './ChatBox.jsx'
import './App.css'
import './pokemon.css'
import PixelCrew from './PixelCrew.jsx'
import { BootScreen, Scramble, FX } from './FX.jsx'

const TEAM = {
  name: 'ยะฮู้ววผมเดปว์',
  intro:
    'พวกเราคือทีมพัฒนารุ่นใหม่ที่สนใจการสร้างเว็บไซต์และเทคโนโลยี โดยมุ่งเน้นการเรียนรู้และพัฒนาผลงานที่สามารถนำไปใช้งานจริง',
  strengths: [
    'มีความคิดสร้างสรรค์',
    'ทำงานร่วมกันเป็นทีม',
    'สนใจเทคโนโลยีใหม่ ๆ',
    'มุ่งเน้นการพัฒนาทักษะอย่างต่อเนื่อง',
  ],
}
const STRENGTH_ICONS = ['💡', '🤝', '🚀', '📈']
const WORDS = ['Learn', 'Build', 'Improve']

const SKILLS = ['PostgreSQL', 'REST API', 'React', 'Tailwind CSS', 'Node.js', 'Prompt Engineering', 'Git']
const LANGS = ['Python', 'SQL', 'HTML', 'CSS', 'JavaScript']

// desc = คำอธิบายทั่วไป, here = ใช้ในโปรเจกต์นี้อย่างไร (ใส่เฉพาะที่ใช้จริง)
const SKILL_INFO = {
  PostgreSQL: {
    desc: 'ระบบฐานข้อมูลแบบโอเพนซอร์สที่เก็บข้อมูลเป็นตารางและมีความสัมพันธ์ระหว่างกัน ค้นหาและจัดการด้วยภาษา SQL เหมาะกับข้อมูลที่ต้องแม่นยำ เช่น ข้อมูลผู้ใช้ ประวัติแชต หรือคำสั่งซื้อ',
  },
  'REST API': {
    desc: 'แนวทางออกแบบช่องทางให้หน้าเว็บคุยกับเซิร์ฟเวอร์ผ่าน HTTP โดยใช้คำสั่งอย่าง GET, POST, PUT, DELETE แต่ละ URL แทนข้อมูลหนึ่งอย่าง และส่งข้อมูลกลับเป็น JSON',
    here: 'หน้าเว็บส่งข้อความไปที่ POST /api/chat แล้วได้คำตอบของ AI กลับมาเป็น JSON',
  },
  React: {
    desc: 'ไลบรารี JavaScript สำหรับสร้างหน้าเว็บจากคอมโพเนนต์ย่อย ๆ ที่นำกลับมาใช้ซ้ำได้ และอัปเดตหน้าจออัตโนมัติเมื่อข้อมูลเปลี่ยน',
    here: 'หน้าพอร์ตโฟลิโอและกล่องแชตทั้งหมดสร้างด้วย React',
  },
  'Tailwind CSS': {
    desc: 'เฟรมเวิร์ก CSS ที่จัดสไตล์ด้วย class สั้น ๆ เขียนไว้ในโค้ด HTML ได้เลย เช่น flex หรือ p-4 ทำให้ออกแบบหน้าเว็บได้เร็วโดยไม่ต้องเขียนไฟล์ CSS ยาว ๆ',
  },
  'Node.js': {
    desc: 'สภาพแวดล้อมที่รัน JavaScript นอกเบราว์เซอร์ ใช้สร้างเซิร์ฟเวอร์ฝั่งหลังบ้านที่รับคำขอจากหน้าเว็บ ติดต่อฐานข้อมูล และเรียกบริการอื่น เช่น AI',
    here: 'backend ของแชตรันด้วย Node.js และ Express',
  },
  'Prompt Engineering': {
    desc: 'ศิลปะการเขียนคำสั่งให้ AI ตอบได้ตรงตามต้องการ เช่น กำหนดบทบาท รูปแบบคำตอบ และกฎที่ต้องทำตาม',
    here: 'บอทมี system prompt กำหนดให้เป็นผู้ช่วยของทีม และตอบจากข้อมูลทีมเท่านั้น',
  },
  Git: {
    desc: 'ระบบควบคุมเวอร์ชันที่บันทึกประวัติการแก้โค้ดทุกครั้ง ย้อนกลับได้เมื่อพลาด และช่วยให้หลายคนทำงานในโปรเจกต์เดียวกันโดยไม่เขียนทับกัน',
  },
}

const LANG_INFO = {
  Python: {
    desc: 'ภาษาโปรแกรมที่อ่านง่าย ใช้ได้หลากหลาย ทั้งเว็บหลังบ้าน การวิเคราะห์ข้อมูล และงาน AI',
  },
  SQL: {
    desc: 'ภาษามาตรฐานสำหรับสั่งงานฐานข้อมูล เช่น SELECT ดึงข้อมูล INSERT เพิ่มข้อมูล UPDATE แก้ไข และ DELETE ลบข้อมูล',
  },
  HTML: {
    desc: 'ภาษากำหนดโครงสร้างของหน้าเว็บ เช่น หัวข้อ ย่อหน้า ลิงก์ และรูปภาพ',
  },
  CSS: {
    desc: 'ภาษากำหนดหน้าตาของเว็บ ทั้งสี ขนาด การจัดวาง และแอนิเมชัน',
    here: 'ลูกเล่นของหน้านี้ เช่น ตึกเงา การ์ดเอียง และกล่องแชต เขียนด้วย CSS',
  },
  JavaScript: {
    desc: 'ภาษาที่ทำให้หน้าเว็บโต้ตอบกับผู้ใช้ได้ และรันฝั่งเซิร์ฟเวอร์ได้ด้วย Node.js',
    here: 'โค้ดทั้ง frontend และ backend ของโปรเจกต์นี้เขียนด้วย JavaScript',
  },
}

const MEMBERS = [
  {
    name: 'ปภังกร โรจนถาวร',
    role: 'Full Stack Developer',
    task: 'พัฒนา Backend และออกแบบ Database',
    bio: 'สนใจการพัฒนาระบบหลังบ้านและจัดการฐานข้อมูล ชอบออกแบบเว็บไซต์',
    email: 'papangkorn.roja@bumail.net',
    photo: '/members/papangkorn.jpg',
  },
  {
    name: 'มนัญชัย กิจฉลอง',
    role: 'AI Developer',
    task: 'เชื่อมต่อ AI และจัดการระบบ Chatbot',
    bio: 'สนใจการจัดการฐานข้อมูล ชอบออกแบบเว็บไซต์',
    email: 'manunchai.kitc@bumail.net',
    photo: '/members/manunchai.jpg',
  },
  {
    name: 'วรธน นันทวรศิลป์',
    role: 'Frontend Developer',
    task: 'ออกแบบและพัฒนาหน้า Portfolio และ Chat UI',
    bio: 'สนใจพัฒนาการออกเเบบหน้าWedsiteเเละระบบหน้าบ้านต่างๆ',
    email: 'Worathon.nunt@bumail.net',
    photo: '/members/worathon.jpg',
  },
]

// ----- ให้ทุก element ที่มี class "reveal" เลื่อนขึ้นมาเมื่อเลื่อนหน้าถึง -----
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ----- ตัวอักษรพิมพ์แล้วลบ วนคำใน words -----
function Typewriter({ words }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = words[i]
    let delay = del ? 60 : 110
    if (!del && text === word) delay = 1200
    if (del && text === '') delay = 300

    const t = setTimeout(() => {
      if (!del && text === word) setDel(true)
      else if (del && text === '') {
        setDel(false)
        setI((i + 1) % words.length)
      } else setText(del ? text.slice(0, -1) : word.slice(0, text.length + 1))
    }, delay)
    return () => clearTimeout(t)
  }, [text, del, i, words])

  return (
    <span className="type">
      {text}
      <span className="caret" />
    </span>
  )
}

// ----- ตัวเลขนับขึ้นเมื่อเลื่อนมาถึง -----
function Counter({ to }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1200, 1)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])

  return <span ref={ref}>{n}</span>
}

// ----- การ์ดเอียง 3 มิติตามเมาส์ + แสงสปอตไลต์ -----
function TiltCard({ children, no }) {
  const ref = useRef(null)

  function onMove(e) {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * 14}deg`)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  function onLeave() {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <article ref={ref} className="card tilt" onMouseMove={onMove} onMouseLeave={onLeave}>
      <span className="pk-no">No.{String(no).padStart(3, '0')}</span>
      {children}
      <span className="pk-foil" aria-hidden="true" />
    </article>
  )
}

function Avatar({ name, photo }) {
  return (
    <div className="avatar">
      <div className="avatar-in">
        <span>{name.charAt(0)}</span>
        <img
          src={photo}
          alt={name}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}

// ----- กลุ่มปุ่มทักษะ -----
function SkillGroup({ title, items, group, sel, onSelect }) {
  return (
    <div className="skill-group">
      <p className="skill-label">{title}</p>
      <div className="skill-btns">
        {items.map((name) => {
          const active = sel.group === group && sel.name === name
          return (
            <button
              type="button"
              key={name}
              className={`skill-btn ${active ? 'active' : ''}`}
              aria-pressed={active}
              onClick={() => onSelect({ group, name })}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ----- ปุ่มกดทักษะ + กล่องอธิบาย -----
function SkillExplorer() {
  const [sel, setSel] = useState({ group: 'skill', name: 'React' })
  const info = (sel.group === 'skill' ? SKILL_INFO : LANG_INFO)[sel.name]

  return (
    <div>
      <SkillGroup title="ทักษะ" items={SKILLS} group="skill" sel={sel} onSelect={setSel} />
      <SkillGroup title="ภาษาโปรแกรม" items={LANGS} group="lang" sel={sel} onSelect={setSel} />

      <div className="skill-panel" key={sel.group + sel.name}>
        <span className="skill-cat">{sel.group === 'skill' ? 'ทักษะ' : 'ภาษาโปรแกรม'}</span>
        <h3>{sel.name}</h3>
        <p>{info.desc}</p>
        {info.here && (
          <p className="skill-here">
            <b>ในโปรเจกต์นี้:</b> {info.here}
          </p>
        )}
      </div>
    </div>
  )
}

// ----- ตึกเงา: สร้างแบบสุ่มคงที่ (seed เดิม = เมืองหน้าตาเดิมทุกครั้ง) -----
function makeCity({ seed, count, minW, maxW, minH, maxH, winRate }) {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  return Array.from({ length: count }, (_, id) => {
    const w = Math.round(minW + rand() * (maxW - minW))
    const h = Math.round(minH + rand() * (maxH - minH))
    const cols = Math.max(1, Math.floor((w - 12) / 14))
    const rows = Math.max(0, Math.floor((h - 16) / 20))
    const wins = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() < winRate) {
          const kind = rand()
          wins.push({
            key: `${r}-${c}`,
            left: 8 + c * 14,
            top: 10 + r * 20,
            cls: `${kind < 0.5 ? 'on' : 'tw'} ${rand() < 0.25 ? 'cy' : ''}`,
            delay: (rand() * 6).toFixed(1),
          })
        }
      }
    }
    return { id, w, h, wins, antenna: rand() < 0.3 }
  })
}

const LAYERS = [
  { cls: 'far', buildings: makeCity({ seed: 11, count: 40, minW: 40, maxW: 90, minH: 90, maxH: 230, winRate: 0 }) },
  { cls: 'mid', buildings: makeCity({ seed: 23, count: 34, minW: 50, maxW: 100, minH: 120, maxH: 300, winRate: 0.1 }) },
  { cls: 'near', buildings: makeCity({ seed: 37, count: 28, minW: 60, maxW: 120, minH: 140, maxH: 380, winRate: 0.16 }) },
]

function Skyline() {
  return (
    <div className="skyline" aria-hidden="true">
      <div className="moon" />
      {LAYERS.map((layer) => (
        <div className={`sky-layer ${layer.cls}`} key={layer.cls}>
          {layer.buildings.map((b) => (
            <div className="bld" key={b.id} style={{ width: b.w, height: b.h }}>
              {b.antenna && <i className="ant" />}
              {b.wins.map((w) => (
                <i
                  key={w.key}
                  className={`win ${w.cls}`}
                  style={{ left: w.left, top: w.top, animationDelay: `${w.delay}s` }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const glowRef = useRef(null)
  const barRef = useRef(null)
  useReveal()
  const [wipe, setWipe] = useState(false)

  // คลิกเมนู: จอวาบแบบเข้าฉากต่อสู้ แล้วค่อยเลื่อนไปหัวข้อ
  function go(e) {
    const id = e.currentTarget.getAttribute('href')
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return target.scrollIntoView()
    setWipe(true)
    setTimeout(() => target.scrollIntoView(), 450)
    setTimeout(() => setWipe(false), 1000)
  }

  useEffect(() => {
    const move = (e) => {
      glowRef.current?.style.setProperty('--x', `${e.clientX}px`)
      glowRef.current?.style.setProperty('--y', `${e.clientY}px`)
    }
    const scroll = () => {
      const h = document.documentElement
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1)
      h.style.setProperty('--p', p)
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('scroll', scroll)
    }
  }, [])

  return (
    <div className="app">
      <BootScreen />
      <div className="bar" ref={barRef} />
      <div className="pk-ball" aria-hidden="true" />
      <div className={`pk-wipe ${wipe ? 'on' : ''}`} aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Skyline />
      <FX />
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />

      <nav className="nav">
        <a className="logo" href="#top" onClick={go}>&lt;ยะฮู้วว/&gt;</a>
        <div className="nav-links">
          <a href="#team" onClick={go}>สมาชิก</a>
          <a href="#skills" onClick={go}>ทักษะ</a>
        </div>
      </nav>

      <main className="page" id="top">
        <header className="hero">
          <span className="chip reveal">
            <i className="dot" /> พร้อมสร้างสิ่งใหม่
          </span>
          <h1 className="reveal" style={{ '--d': '100ms' }}>
            <Scramble text={TEAM.name} delay={2600} />
          </h1>
          <p className="motto reveal" style={{ '--d': '200ms' }}>
            <Typewriter words={WORDS} />
          </p>
          <p className="intro reveal" style={{ '--d': '300ms' }}>{TEAM.intro}</p>
          <p className="hint reveal" style={{ '--d': '400ms' }}>ลองถามบอท AI มุมขวาล่างเกี่ยวกับทีมของเราได้เลย ↘</p>
        </header>

        <section className="stats reveal">
          <div><b><Counter to={MEMBERS.length} /></b><span>สมาชิก</span></div>
          <div><b><Counter to={SKILLS.length} /></b><span>ทักษะ</span></div>
          <div><b><Counter to={LANGS.length} /></b><span>ภาษาโปรแกรม</span></div>
        </section>

        <section className="section">
          <h2 className="sec-title reveal">จุดเด่นของทีม</h2>
          <ul className="strengths">
            {TEAM.strengths.map((s, i) => (
              <li className="reveal" style={{ '--d': `${i * 100}ms` }} key={s}>
                <span className="ico">{STRENGTH_ICONS[i]}</span>
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="team">
          <h2 className="sec-title reveal">สมาชิก</h2>
          <div className="cards">
            {MEMBERS.map((m, i) => (
              <div className="reveal" style={{ '--d': `${i * 150}ms` }} key={m.email}>
                <TiltCard no={i + 1}>
                  <Avatar name={m.name} photo={m.photo} />
                  <h3>{m.name}</h3>
                  <p className="role">{m.role}</p>
                  <p className="task">{m.task}</p>
                  <p className="bio">{m.bio}</p>
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                </TiltCard>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <h2 className="sec-title reveal">ทักษะของทีม</h2>
          <div className="reveal">
            <SkillExplorer />
          </div>
        </section>

        <footer className="foot">© 2026 {TEAM.name} · Learn · Build · Improve</footer>
      </main>

      <PixelCrew members={MEMBERS} />

      <ChatBox />
    </div>
  )
}