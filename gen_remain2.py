#!/usr/bin/env python3
"""Generate remaining page.js files - batch 2"""
import os

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
LOCALE_DIR = 'src/app/[locale]'

def write_page(tool, body, state_extra=""):
    name = ''.join(w.capitalize() for w in tool.replace('-', ' ').split())
    lines = ["'use client';", "",
             "import { useState, useCallback } from 'react';",
             "import { useParams } from 'next/navigation';"]
    for loc in LOCALES:
        lines.append(f"import {loc}Msgs from '../../../messages/{loc}/{tool}.json';")
    lines.append(f"const pageMsgs = {{ en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs }};")
    lines.append(f"")
    lines.append(f"export default function {name}Page() {{")
    lines.append(f"  const params = useParams();")
    lines.append(f"  const locale = params?.locale || 'en';")
    lines.append(f"  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;")
    lines.append(f"  const changeLang = (l) => {{ window.location.href = '/' + l + '/{tool}'; }};")
    if state_extra:
        lines.append(state_extra)
    lines.append("")
    lines.append("  return (")
    lines.append('    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: \'var(--os9-bg)\' }}>')
    lines.append('      <div className="os9-window" style={{ maxWidth: 520, width: \'100%\' }}>')
    lines.append('        <div className="os9-titlebar relative">')
    lines.append('          <div className="os9-window-controls">')
    lines.append('            <div className="os9-dot os9-dot-close" />')
    lines.append('            <div className="os9-dot os9-dot-minimize" />')
    lines.append('            <div className="os9-dot os9-dot-zoom" />')
    lines.append('          </div>')
    lines.append('          <span className="tracking-[0.5px] text-sm">{t(\'title\')}</span>')
    lines.append('        </div>')
    lines.append('        <div className="os9-window-body">')
    lines.append('          <div className="flex justify-between items-center mb-4">')
    lines.append('            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>')
    lines.append('              <option value="en">English</option>')
    lines.append('              <option value="es">Español</option>')
    lines.append('              <option value="zh">中文</option>')
    lines.append('              <option value="ko">한국어</option>')
    lines.append('              <option value="pt">Português</option>')
    lines.append('            </select>')
    lines.append('          </div>')
    for line in body.split('\n'):
        lines.append('          ' + line)
    lines.append('          <div className="mt-4 px-1">')
    lines.append('            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t(\'seoDescription\')}</p>')
    lines.append('          </div>')
    lines.append('        </div>')
    lines.append('      </div>')
    lines.append('      <div className="os9-footer" style={{ maxWidth: 520, width: \'100%\', textAlign: \'center\', fontSize: 10, opacity: 0.6, marginTop: 12 }}>')
    lines.append('        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>')
    lines.append('        <span className="mx-2">|</span>')
    lines.append('        {t(\'footer\') || \'hello-tools 2026\'}')
    lines.append('      </div>')
    lines.append('    </div>')
    lines.append('  );')
    lines.append('}')
    
    fp = f'{LOCALE_DIR}/{tool}/page.js'
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f'  ✅ {tool}')

# === Time Calculator ===
write_page('time-calc', '''<div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="os9-label">{t('hours') || 'Hours'}</label><input className="os9-input" type="number" min="0" value={h1} onChange={(e) => setH1(e.target.value)} /></div>
            <div><label className="os9-label">{t('minutes') || 'Minutes'}</label><input className="os9-input" type="number" min="0" max="59" value={m1} onChange={(e) => setM1(e.target.value)} /></div>
            <div><label className="os9-label">{t('hours') || 'Hours'}</label><input className="os9-input" type="number" min="0" value={h2} onChange={(e) => setH2(e.target.value)} /></div>
            <div><label className="os9-label">{t('minutes') || 'Minutes'}</label><input className="os9-input" type="number" min="0" max="59" value={m2} onChange={(e) => setM2(e.target.value)} /></div>
          </div>
          <div className="flex gap-2 mb-3">
            <button className="os9-btn os9-btn-primary flex-1" onClick={() => calc("add")}>{t('add') || 'Add'}</button>
            <button className="os9-btn flex-1" onClick={() => calc("subtract")}>{t('subtract') || 'Subtract'}</button>
          </div>
          {result !== null && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('result')}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>{result.h}h {result.m}m</div></div>}''',
    '''  const [h1, setH1] = useState('2');
  const [m1, setM1] = useState('30');
  const [h2, setH2] = useState('1');
  const [m2, setM2] = useState('45');
  const [result, setResult] = useState(null);

  const calc = (op) => {
    const t1 = (parseInt(h1)||0)*60 + (parseInt(m1)||0);
    const t2 = (parseInt(h2)||0)*60 + (parseInt(m2)||0);
    const total = op === "add" ? t1 + t2 : Math.max(0, t1 - t2);
    setResult({ h: Math.floor(total/60), m: total%60 });
  };'''
)

# === Cooking Converter ===
write_page('cooking', '''<div className="grid grid-cols-3 gap-2 mb-3">
            <div className="col-span-3"><label className="os9-label">{t('amount')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div><label className="os9-label">{t('from') || 'From'}</label><select className="os9-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
            <div><label className="os9-label">{t('to') || 'To'}</label><select className="os9-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
            <div className="flex items-end"><button className="os9-btn os9-btn-primary w-full" onClick={doConvert}>{t('convert')}</button></div>
          </div>
          {output && <div className="mb-3"><label className="os9-label">{t('result') || 'Result'}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}''',
    '''  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('ml');
  const [output, setOutput] = useState('');
  const units = ['cup','tbsp','tsp','ml','l','floz','pint'];
  const conv = {cup:240, tbsp:15, tsp:5, ml:1, l:1000, floz:29.574, pint:473.176};

  const doConvert = () => {
    const v = parseFloat(amount);
    if (!isNaN(v)) setOutput((v * conv[fromUnit] / conv[toUnit]).toFixed(2) + ' ' + toUnit);
  };'''
)

# === Timezone Converter ===
write_page('timezone', '''<div className="mb-3"><label className="os9-label">{t('selectTimezone') || 'Time'}</label><input className="os9-input w-full" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="os9-label">{t('from') || 'From'}</label><select className="os9-select" value={fromTz} onChange={(e) => setFromTz(e.target.value)}>{tzList.map(tz => <option key={tz} value={tz}>{tz.split('/').pop()}</option>)}</select></div>
            <div><label className="os9-label">{t('to') || 'To'}</label><select className="os9-select" value={toTz} onChange={(e) => setToTz(e.target.value)}>{tzList.map(tz => <option key={tz} value={tz}>{tz.split('/').pop()}</option>)}</select></div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={doConvert}>{t('convert')}</button>
          {converted && <div className="os9-result mb-3 text-center"><div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('convertedTime') || 'Converted Time'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{converted}</div></div>}''',
    '''  const [time, setTime] = useState('');
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Europe/London');
  const [converted, setConverted] = useState('');
  const tzList = ['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Europe/Berlin','Asia/Tokyo','Asia/Seoul','Asia/Shanghai','Asia/Dubai','Australia/Sydney','Pacific/Auckland','UTC'];

  const doConvert = () => {
    const now = time ? new Date('2024-01-01T' + time) : new Date();
    try { setConverted(new Intl.DateTimeFormat('en-US', { timeZone: toTz, hour: '2-digit', minute: '2-digit', hour12: true }).format(now)); }
    catch(e) { setConverted(t('error') || 'Error'); }
  };'''
)

# === WhatIsMyIP ===
write_page('whatismyip', '''<div className="text-center mb-4">
            <button className="os9-btn os9-btn-primary" onClick={fetchIP}>{t('refetch') || 'Check My IP'}</button>
          </div>
          {loading && <div className="text-center text-sm" style={{ opacity: 0.6 }}>{t('loading') || 'Loading...'}</div>}
          {data && <div className="os9-result mb-3"><div className="grid grid-cols-1 gap-2 text-sm">
            <div><span className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('ipAddress') || 'IP Address'}: </span><span className="font-bold">{data.ip}</span></div>
            {data.location && <div><span className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('location') || 'Location'}: </span><span>{data.location}</span></div>}
            {data.isp && <div><span className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('isp') || 'ISP'}: </span><span>{data.isp}</span></div>}
          </div></div>}
          {error && <div className="text-sm text-center" style={{ color: 'red' }}>{t('error') || 'Error loading data'}</div>}''',
    '''  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIP = async () => {
    setLoading(true); setError('');
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      setData({ ip: d.ip, location: d.city + ', ' + d.country_name, isp: d.org });
    } catch(e) {
      setError(t('error') || 'Failed to fetch');
    }
    setLoading(false);
  };'''
)

# === MBTI Personality Test ===
write_page('mbti', '''{step === 0 ? (
            <div className="text-center">
              <button className="os9-btn os9-btn-primary" onClick={() => setStep(1)}>{t('start') || 'Start Test'}</button>
            </div>
          ) : step <= questions.length ? (
            <div>
              <div className="text-xs mb-2" style={{ opacity: 0.6 }}>{t('question') || 'Question'} {step}/{questions.length}</div>
              <p className="text-sm mb-4 font-bold">{questions[step-1].q}</p>
              <div className="flex flex-col gap-2">
                {questions[step-1].options.map((opt, i) => (
                  <button key={i} className="os9-btn" onClick={() => { const a = [...answers]; a[step-1] = opt; setAnswers(a); setStep(step+1); }}>{opt}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="os9-big-number" style={{ fontSize: '2rem' }}>{resultType}</div>
              <div className="text-sm mt-2 mb-3">{t('result') || 'Your personality type'}</div>
              <button className="os9-btn" onClick={() => { setStep(0); setAnswers([]); }}>{t('restart') || 'Restart'}</button>
            </div>
          )}''',
    '''  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const questions = [
    { q: "You prefer working alone or in a small group rather than a large group.", options: ["Agree", "Disagree"] },
    { q: "You make decisions based on logic and facts, not feelings.", options: ["Agree", "Disagree"] },
    { q: "You prefer a structured schedule over going with the flow.", options: ["Agree", "Disagree"] },
    { q: "You enjoy abstract ideas and theories more than concrete facts.", options: ["Agree", "Disagree"] },
    { q: "You feel energized after social interactions.", options: ["Agree", "Disagree"] },
    { q: "You value harmony and tact more than blunt honesty.", options: ["Agree", "Disagree"] },
    { q: "You prefer to plan ahead rather than be spontaneous.", options: ["Agree", "Disagree"] },
    { q: "You focus more on the present reality than future possibilities.", options: ["Agree", "Disagree"] }
  ];

  const resultType = (() => {
    if (step <= questions.length) return "";
    let E = 0, S = 0, T = 0, J = 0;
    if (answers[4] === "Agree") E++; else S++;
    if (answers[7] === "Agree") S++; else E++;
    if (answers[1] === "Agree") T++; else T++;
    if (answers[5] === "Agree") T++; else T++;
    if (answers[2] === "Agree") J++; else J++;
    if (answers[6] === "Agree") J++; else J++;
    if (answers[0] === "Agree") S++; else E++;
    if (answers[3] === "Agree") E++; else S++;
    return (E > 4 ? "E" : "I") + (S > 4 ? "S" : "N") + (T > 4 ? "T" : "F") + (J > 4 ? "J" : "P");
  })();'''
)

# === Zodiac Sign ===
write_page('zodiac', '''<div className="grid grid-cols-3 gap-2 mb-3">
            <div><label className="os9-label">{t('month')}</label><select className="os9-select" value={month} onChange={(e) => setMonth(e.target.value)}>{months.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className="os9-label">{t('day')}</label><input className="os9-input" type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} /></div>
            <div><label className="os9-label">{t('year')}</label><input className="os9-input" type="number" min="1900" max="2030" value={year} onChange={(e) => setYear(e.target.value)} /></div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('findSign') || 'Find Sign'}</button>
          {sign && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('yourSign') || 'Your Zodiac Sign'}</div><div className="os9-big-number" style={{ fontSize: '2rem' }}>{sign.emoji} {sign.name}</div><div className="text-xs" style={{ opacity: 0.6 }}>{sign.dates}</div></div>}''',
    '''  const [month, setMonth] = useState('January');
  const [day, setDay] = useState('15');
  const [year, setYear] = useState('1990');
  const [sign, setSign] = useState(null);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const calc = () => {
    const m = months.indexOf(month) + 1;
    const d = parseInt(day);
    const signs = [
      { name: 'Capricorn', emoji: '♑', start: [12,22], end: [1,19] },
      { name: 'Aquarius', emoji: '♒', start: [1,20], end: [2,18] },
      { name: 'Pisces', emoji: '♓', start: [2,19], end: [3,20] },
      { name: 'Aries', emoji: '♈', start: [3,21], end: [4,19] },
      { name: 'Taurus', emoji: '♉', start: [4,20], end: [5,20] },
      { name: 'Gemini', emoji: '♊', start: [5,21], end: [6,20] },
      { name: 'Cancer', emoji: '♋', start: [6,21], end: [7,22] },
      { name: 'Leo', emoji: '♌', start: [7,23], end: [8,22] },
      { name: 'Virgo', emoji: '♍', start: [8,23], end: [9,22] },
      { name: 'Libra', emoji: '♎', start: [9,23], end: [10,22] },
      { name: 'Scorpio', emoji: '♏', start: [10,23], end: [11,21] },
      { name: 'Sagittarius', emoji: '♐', start: [11,22], end: [12,21] }
    ];
    for (const s of signs) {
      if ((m === s.start[0] && d >= s.start[1]) || (m === s.end[0] && d <= s.end[1])) {
        setSign({ ...s, dates: s.start[0]+'/'+s.start[1]+' - '+s.end[0]+'/'+s.end[1] });
        return;
      }
    }
  };'''
)

# === Tarot Card Reading ===
write_page('tarot', '''<div className="text-center">
            <button className="os9-btn os9-btn-primary mb-3" onClick={draw} disabled={loading}>{loading ? (t('drawing') || 'Drawing...') : (t('drawCard') || 'Draw a Card')}</button>
            {card && <div className="os9-result mb-3 text-center">
              <div className="text-6xl mb-2">{card.emoji}</div>
              <div className="text-lg font-bold">{card.name}</div>
              <div className="text-sm mt-2" style={{ opacity: 0.8 }}>{card.meaning}</div>
              <div className="text-xs mt-2" style={{ opacity: 0.5 }}>{card.reversed ? (t('reversed') || 'Reversed') : (t('upright') || 'Upright')}</div>
            </div>}
          </div>''',
    '''  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const deck = [
    { name: "The Fool", emoji: "🃏", meaning: "New beginnings, spontaneity, faith" },
    { name: "The Magician", emoji: "🔮", meaning: "Manifestation, resourcefulness, power" },
    { name: "The High Priestess", emoji: "🌙", meaning: "Intuition, sacred knowledge, divine feminine" },
    { name: "The Empress", emoji: "👑", meaning: "Fertility, femininity, beauty, nature" },
    { name: "The Emperor", emoji: "🏰", meaning: "Authority, structure, control, fatherhood" },
    { name: "The Hierophant", emoji: "⛪", meaning: "Tradition, conformity, morality, ethics" },
    { name: "The Lovers", emoji: "❤️", meaning: "Love, harmony, relationships, choices" },
    { name: "The Chariot", emoji: "🏆", meaning: "Control, willpower, victory, determination" },
    { name: "Strength", emoji: "🦁", meaning: "Courage, persuasion, influence, compassion" },
    { name: "The Hermit", emoji: "🕯️", meaning: "Soul searching, introspection, guidance" },
    { name: "Wheel of Fortune", emoji: "🎡", meaning: "Good luck, karma, life cycles, destiny" },
    { name: "Justice", emoji: "⚖️", meaning: "Justice, fairness, truth, cause and effect" },
    { name: "The Hanged Man", emoji: "🤸", meaning: "Pause, surrender, letting go, new perspectives" },
    { name: "Death", emoji: "💀", meaning: "Endings, change, transformation, transition" },
    { name: "Temperance", emoji: "🧪", meaning: "Balance, moderation, patience, purpose" },
    { name: "The Devil", emoji: "😈", meaning: "Shadow self, attachment, addiction, restriction" },
    { name: "The Tower", emoji: "🗼", meaning: "Sudden change, upheaval, chaos, revelation" },
    { name: "The Star", emoji: "⭐", meaning: "Hope, faith, purpose, renewal, spirituality" },
    { name: "The Moon", emoji: "🌙", meaning: "Illusion, fear, anxiety, subconscious, intuition" },
    { name: "The Sun", emoji: "☀️", meaning: "Positivity, fun, warmth, success, vitality" },
    { name: "Judgement", emoji: "📯", meaning: "Judgement, rebirth, inner calling, absolution" },
    { name: "The World", emoji: "🌍", meaning: "Completion, integration, accomplishment, travel" }
  ];

  const draw = () => {
    setLoading(true);
    setTimeout(() => {
      const c = deck[Math.floor(Math.random() * deck.length)];
      setCard({ ...c, reversed: Math.random() > 0.5 });
      setLoading(false);
    }, 300);
  };'''
)

# === Emoji Picker ===
write_page('emoji', '''<div className="mb-3">
            <input className="os9-input w-full" type="text" placeholder={t('search') || 'Search emoji...'} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-8 gap-1 max-h-64 overflow-auto mb-3">
            {filtered.map(e => (
              <button key={e} className="text-2xl p-1 hover:bg-gray-200 rounded" onClick={() => { navigator.clipboard.writeText(e); setCopied(e); setTimeout(() => setCopied(''), 1000); }} style={{ background: copied === e ? '#d4edda' : 'transparent' }}>{e}</button>
            ))}
          </div>
          {copied && <div className="text-center text-xs" style={{ color: 'green' }}>{t('copied') || 'Copied!'}: {copied}</div>}''',
    '''  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const all = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','💀','☠️','👻','👽','👾','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','💯','💢','💥','💫','💦','💨','🕳️','💣','💬','👁️','🗨️','🗯️','💭','💤'];
  const filtered = search ? all.filter(e => e.includes(search)) : all;'''
)

print("\nBatch 2 complete!")