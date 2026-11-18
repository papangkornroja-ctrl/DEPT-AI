import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

// ครอบ <pre> ของ Markdown เพื่อเพิ่มปุ่ม Copy
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false)
  const code = String(children?.props?.children ?? '').replace(/\n$/, '')

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard ใช้ไม่ได้ ไม่ต้องทำอะไร
    }
  }

  return (
    <div className="code-block">
      <button type="button" className="copy-btn" onClick={copy}>
        {copied ? 'คัดลอกแล้ว' : 'Copy'}
      </button>
      <pre>{children}</pre>
    </div>
  )
}

export default function ChatBox() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // { role: 'user' | 'assistant', text }
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const history = messages // ประวัติก่อนข้อความใหม่ ส่งไปให้ AI เป็นความจำ
    setMessages([...history, { role: 'user', text }])
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, history }),
        signal: AbortSignal.timeout(30000),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }])
    } catch (err) {
      if (err.name === 'TimeoutError') {
        setError('AI ตอบช้าเกินไป ลองใหม่อีกครั้ง')
      } else if (err instanceof TypeError) {
        setError('เชื่อมต่อ backend ไม่ได้ — รัน npm run dev ในโฟลเดอร์ backend แล้วหรือยัง?')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setMessages([])
    setError(null)
  }

  return (
    <>
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'ปิดแชต' : 'เปิดแชต'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <strong>ถามบอท AI</strong>
            <button type="button" className="link-btn" onClick={handleClear}>
              ล้างประวัติ
            </button>
          </div>

          <div className="chat-log">
            {messages.length === 0 && !loading && (
              <p className="chat-empty">เริ่มถามเรื่องผลงานของเราได้เลย 👋</p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`row ${m.role}`}>
                <div className={`bubble ${m.role}`}>
                  {m.role === 'assistant' ? (
                    <ReactMarkdown components={{ pre: CodeBlock }}>{m.text}</ReactMarkdown>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="row assistant">
                <div className="bubble assistant typing" role="status" aria-label="AI กำลังพิมพ์">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {error && <div className="chat-error">{error}</div>}

          <form className="chat-form" onSubmit={handleSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
            />
            <button type="submit" disabled={!input.trim() || loading}>
              ส่ง
            </button>
          </form>
        </div>
      )}
    </>
  )
}