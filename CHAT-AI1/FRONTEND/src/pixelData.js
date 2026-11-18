// ข้อมูล Pixel Art ทั้งหมด: 1 ตัวอักษร = 1 พิกเซล ('.' = โปร่งใส)
const c = (s, w = 12) => {
  const l = (w - s.length) >> 1
  return '.'.repeat(l) + s + '.'.repeat(w - s.length - l)
}
const r = (...p) => c(p.reduce((s, x, i) => (i % 2 ? s : s + x.repeat(p[i + 1])), ''))

const EYES = r('o', 1, 's', 1, 'e', 1, 's', 2, 'e', 1, 's', 1, 'o', 1)
const MOUTH = r('o', 1, 's', 2, 'm', 2, 's', 2, 'o', 1)
const CHIN = r('o', 6)
const BODY = [
  r('o', 1, 'C', 8, 'o', 1),
  r('o', 1, 'C', 1, 'D', 2, 'A', 2, 'D', 2, 'C', 1, 'o', 1),
  r('o', 1, 's', 1, 'D', 6, 's', 1, 'o', 1),
  r('o', 1, 'D', 8, 'o', 1),
]
const LEG = { f: ['oPPo', 'oPPo', 'oBBo'], s: ['oPPo', 'oBBo', '....'] }
const legs = (a, b) => [0, 1, 2].map((i) => c(LEG[a][i] + LEG[b][i]))
const frames = (head) => ({
  i: [...head, ...BODY, ...legs('f', 'f')],
  a: [...head, ...BODY, ...legs('f', 's')],
  b: [...head, ...BODY, ...legs('s', 'f')],
})

const HAIR = (top) => [
  top,
  r('o', 1, 'H', 4, 'o', 1),
  r('o', 1, 'H', 6, 'o', 1),
  r('o', 1, 'H', 6, 'o', 1),
  r('o', 1, 'H', 1, 's', 4, 'H', 1, 'o', 1),
]

// 1) Full Stack — ผมสั้น แว่นตา เสื้อฮู้ดสีน้ำเงิน
const HEAD_A = [...HAIR(r('o', 4)), r('o', 1, 'g', 1, 'e', 1, 'g', 2, 'e', 1, 'g', 1, 'o', 1), EYES, MOUTH, CHIN]
// 2) AI Developer — ผมสีเงินทรงแหลม ใส่ไวเซอร์ไซเบอร์
const HEAD_B = [
  ...HAIR(r('o', 1, '.', 1, 'o', 2, '.', 1, 'o', 1)),
  r('o', 1, 'V', 1, 'W', 1, 'V', 4, 'o', 1),
  r('o', 1, 's', 1, 'V', 4, 's', 1, 'o', 1),
  MOUTH,
  CHIN,
]
// 3) Frontend — หมวกแก๊ปสีแดง (ทริบิวต์เทรนเนอร์)
const HEAD_C = [
  r('o', 4),
  r('o', 1, 'A', 4, 'o', 1),
  r('o', 1, 'A', 2, 'W', 2, 'A', 2, 'o', 1),
  r('o', 1, 'A', 6, 'o', 1),
  r('o', 1, 'A', 8, 'o', 1),
  EYES, EYES, MOUTH, CHIN,
]

const base = { o: '#1b1530', e: '#1b1530', m: '#c4655d', W: '#ffffff' }
export const CREW = [
  { frames: frames(HEAD_A), icon: ['..oooo..', '.oaaaao.', '.oooooo.', '.obbbbo.', '.oooooo.', '.obbbbo.', '.oooooo.', '..oooo..'], iconPal: { o: '#0c4a6e', a: '#7dd3fc', b: '#38bdf8' },
    pal: { ...base, s: '#f1c9a5', H: '#3a2a22', C: '#3b82f6', D: '#2563b8', A: '#facc15', P: '#334155', B: '#e2e8f0', g: '#67e8f9' } },
  { frames: frames(HEAD_B), icon: ['...yy...', '...yy...', '..yyyy..', 'yyywwyyy', 'yyywwyyy', '..yyyy..', '...yy...', '...yy...'], iconPal: { y: '#fde047', w: '#fff' },
    pal: { ...base, s: '#e9b98f', H: '#cbd5e1', V: '#22d3ee', C: '#8b5cf6', D: '#6d3fd0', A: '#22d3ee', P: '#1e1b4b', B: '#22d3ee' } },
  { frames: frames(HEAD_C), icon: ['o.......', 'oo......', 'owo.....', 'owwo....', 'owwwo...', 'owwwwo..', 'owoowo..', 'oo..oo..'], iconPal: { o: '#0f172a', w: '#f8fafc' },
    pal: { ...base, s: '#c98b5e', A: '#ef4444', C: '#f8fafc', D: '#cbd5e1', P: '#1e3a8a', B: '#ef4444' } },
]

// ----- ฉาก -----
export const PINE = {
  pal: { o: '#0b1f17', L: '#2f8f5b', g: '#1f6b42', T: '#7a4b2a' },
  rows: [
    ...[2, 4, 6, 4, 6, 8, 6, 8, 10, 12, 14].map((w) => c('o' + 'L'.repeat((w - 2) / 2) + 'g'.repeat((w - 2) / 2) + 'o', 16)),
    c('oTTo', 16), c('oTTo', 16),
  ],
}
export const LAMP = {
  pal: { o: '#1a1428', y: '#fde68a', p: '#475569' },
  rows: ['.oooo.', 'oyyyyo', 'oyyyyo', '.oooo.', ...Array(10).fill('..pp..'), '.pppp.', 'pppppp'],
}
export const BALL = {
  pal: { o: '#1a1428', r: '#ef4444', w: '#f8fafc' },
  rows: ['..oooo..', '.orrrro.', 'orrwrrro', 'ooowwooo', 'owwwwwwo', 'owwwwwwo', '.owwwwo.', '..oooo..'],
}
export const HOUSE = (() => {
  const rows = [c('o'.repeat(24), 28), c('o' + 'R'.repeat(24) + 'o', 28), c('o' + 'R'.repeat(26) + 'o', 28).replace(/^\./, 'o').slice(0, 28), 'o' + 'W'.repeat(26) + 'o']
  rows[2] = 'o' + 'R'.repeat(26) + 'o'
  for (let y = 4; y < 16; y++) {
    let s = ''
    for (let x = 0; x < 28; x++) {
      let ch = x === 0 || x === 27 || y === 15 ? 'o' : 'F'
      if (((x >= 4 && x <= 7) || (x >= 20 && x <= 23)) && y >= 6 && y <= 9) ch = [4, 7, 20, 23].includes(x) || y === 6 || y === 9 ? 'o' : 'y'
      if (x >= 11 && x <= 16 && y >= 8) ch = x === 11 || x === 16 || y === 8 ? 'o' : 'D'
      s += ch
    }
    rows.push(s)
  }
  return { rows, pal: { o: '#1a1428', R: '#e11d48', W: '#f8fafc', F: '#e2e8f0', y: '#fde047', D: '#2563eb' } }
})()
