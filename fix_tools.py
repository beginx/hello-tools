import json, os, glob as gb

BASE = r"C:\Users\1one\Documents\dev\hello-tools"
LOCALES = ['en','es','zh','ko','pt']

# ============================================================
# Read all messages
# ============================================================
def load_msgs(tool):
    msgs = {}
    for loc in LOCALES:
        path = os.path.join(BASE, 'src', 'messages', loc, tool + '.json')
        with open(path, 'r', encoding='utf-8') as f:
            msgs[loc] = json.load(f)
    return msgs

# ============================================================
# Generate complete page.js for each tool
# ============================================================

# Template: static import messages, not useTranslations
def gen_page(tool, title_key, body_jsx, extra_fields=None):
    msgs = load_msgs(tool)
    # Build static import lines
    import_lines = []
    page_msgs_entries = []
    for loc in LOCALES:
        var = loc + 'Msgs'
        import_lines.append(f'import {var} from \'../../../messages/{loc}/{tool}.json\';')
        page_msgs_entries.append(f'  {loc}: {var}')
    import_str = '\n'.join(import_lines)
    page_msgs_str = ',\n'.join(page_msgs_entries)

    seo_desc = msgs['en'].get('seoDescription', '')
    footer_text = msgs['en'].get('footer', 'hello-tools 2026')

    return f"""'use client';

import {{ useState, useCallback }} from 'react';
import {{ useParams }} from 'next/navigation';
{import_str}
const pageMsgs = {{ {page_msgs_str} }};

export default function {tool[0].upper() + tool[1:]}Page() {{
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => {{ window.location.href = '/' + l + '/{tool}'; }};

{body_jsx}

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{{{ background: 'var(--os9-bg)' }}}}>
      <div className="os9-window" style={{{{ maxWidth: 440, width: '100%' }}}}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{{t('title')}}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={{locale}} onChange={{(e) => changeLang(e.target.value)}}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>
{extra_fields or ''}
{body_jsx}
        </div>
      </div>
      <!-- SEO Description -->
      <div className="os9-window" style={{maxWidth:440,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{{t('seoDescription')}}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:440,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={{'/' + locale}} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/coinflip'}} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/dice'}} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/ratio'}} className="underline">Ratio</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/speed'}} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/ohm'}} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/lotto'}} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        <a href={{'/' + locale + '/bmi'}} className="underline">BMI</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}}
"""

# ============================================================
# COIN FLIP
# ============================================================
coinflip_page = """'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/coinflip.json';
import esMsgs from '../../../messages/es/coinflip.json';
import zhMsgs from '../../../messages/zh/coinflip.json';
import koMsgs from '../../../messages/ko/coinflip.json';
import ptMsgs from '../../../messages/pt/coinflip.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CoinflipPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/coinflip'; };

  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState([]);

  const flip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setFlipping(false);
      setHistory(prev => [outcome, ...prev].slice(0, 100));
    }, 400);
  }, [flipping]);

  const clear = () => { setResult(null); setHistory([]); };

  const total = history.length;
  const heads = history.filter(h => h === 'heads').length;
  const tails = total - heads;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 400, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-36 h-36 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
              style={{
                background: flipping ? 'linear-gradient(135deg, #c0c0c0, #888888)' :
                  result === 'heads' ? 'linear-gradient(135deg, #ffd700, #daa520)' :
                  result === 'tails' ? 'linear-gradient(135deg, #c0c0c0, #888888)' : 'linear-gradient(135deg, #e0e0e0, #b0b0b0)',
                border: '4px solid #666',
                boxShadow: flipping ? '0 0 20px rgba(0,0,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.1)',
                transform: flipping ? 'rotateY(720deg)' : 'rotateY(0deg)',
                transition: 'all 0.4s ease-in-out',
              }}>
              <span className="text-5xl font-bold" style={{ fontFamily: 'Monaco, monospace' }}>
                {flipping ? '?' : result === 'heads' ? 'H' : result === 'tails' ? 'T' : ''}
              </span>
            </div>
            <div className="text-center">
              {flipping && <p className="text-sm" style={{ opacity: 0.7 }}>{t('flipping')}</p>}
              {!flipping && result && (
                <p className="text-xl font-bold" style={{ color: 'var(--os9-accent)' }}>
                  {result === 'heads' ? t('heads') : t('tails')}
                </p>
              )}
              {!flipping && !result && <p className="text-sm" style={{ opacity: 0.5 }}>{t('flip')}</p>}
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3 mb-4" onClick={flip} disabled={flipping}>
            {t('flip')}
          </button>

          {total > 0 && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('statistics')}</p>
              <div className="os9-result mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t('totalFlips')}: <strong>{total}</strong></span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span>{t('totalHeads')}: <strong>{heads}</strong> ({total > 0 ? (heads/total*100).toFixed(1) : 0}%)</span>
                  <span>{t('totalTails')}: <strong>{tails}</strong> ({total > 0 ? (tails/total*100).toFixed(1) : 0}%)</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden mt-2" style={{ background: '#ddd', border: '1px solid #aaa' }}>
                  <div style={{ width: total > 0 ? (heads/total*100) + '%' : '50%', background: 'var(--os9-accent)', transition: 'width 0.3s' }} />
                  <div style={{ width: total > 0 ? (tails/total*100) + '%' : '50%', background: '#888', transition: 'width 0.3s' }} />
                </div>
                <div className="flex justify-between text-[10px] mt-1" style={{ opacity: 0.6 }}>
                  <span>{t('heads')} {(total > 0 ? (heads/total*100) : 50).toFixed(1)}%</span>
                  <span>{t('tails')} {(total > 0 ? (tails/total*100) : 50).toFixed(1)}%</span>
                </div>
              </div>
              <button className="os9-btn !px-4 text-xs" onClick={clear}>{t('clear')}</button>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:400,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:400,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/dice'} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ratio'} className="underline">Ratio</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/speed'} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ohm'} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""

# ============================================================
# DICE ROLLER
# ============================================================
dice_page = """'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/dice.json';
import esMsgs from '../../../messages/es/dice.json';
import zhMsgs from '../../../messages/zh/dice.json';
import koMsgs from '../../../messages/ko/dice.json';
import ptMsgs from '../../../messages/pt/dice.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const DICE_TYPES = [
  { sides: 4, key: 'd4' },
  { sides: 6, key: 'd6' },
  { sides: 8, key: 'd8' },
  { sides: 10, key: 'd10' },
  { sides: 12, key: 'd12' },
  { sides: 20, key: 'd20' },
  { sides: 100, key: 'd100' },
];

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export default function DicePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/dice'; };

  const [selectedDie, setSelectedDie] = useState('d6');
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState(null);
  const [rolling, setRolling] = useState(false);

  const die = DICE_TYPES.find(d => d.key === selectedDie) || DICE_TYPES[1];

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setResults(null);
    setTimeout(() => {
      const count = Math.min(Math.max(parseInt(diceCount) || 1, 1), 20);
      const rolls = [];
      for (let i = 0; i < count; i++) {
        rolls.push(rollDie(die.sides));
      }
      setResults(rolls);
      setRolling(false);
    }, 300);
  }, [selectedDie, diceCount, rolling, die.sides]);

  const total = results ? results.reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 440, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="os9-label">{t('custom')}</label>
            <div className="flex flex-wrap gap-2">
              {DICE_TYPES.map(d => (
                <button key={d.key}
                  className="os9-btn !px-3 !py-2 text-xs flex-1 min-w-[52px]"
                  style={selectedDie === d.key ? { background: 'var(--os9-accent)', color: 'white', borderColor: 'var(--os9-accent)' } : {}}
                  onClick={() => { setSelectedDie(d.key); setResults(null); }}>
                  {t(d.key)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="os9-label">{t('count')}</label>
            <input className="os9-input" type="number" min={1} max={20} value={diceCount}
              onChange={(e) => setDiceCount(e.target.value)} placeholder="1" />
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3 mb-4" onClick={roll} disabled={rolling}>
            {rolling ? t('rolling') : t('roll')}
          </button>

          {results && (
            <>
              <hr className="os9-divider" />
              <div className="os9-result">
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {results.map((r, i) => (
                    <span key={i}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-lg font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #f5f5f5, #ddd)',
                        border: '2px solid #999',
                        color: '#333',
                        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)',
                      }}>
                      {r}
                    </span>
                  ))}
                </div>
                {results.length > 1 && (
                  <div className="text-center">
                    <span className="text-xs" style={{ opacity: 0.6 }}>{t('total')}: </span>
                    <span className="text-lg font-bold" style={{ color: 'var(--os9-accent)' }}>{total}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:440,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:440,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/coinflip'} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ratio'} className="underline">Ratio</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/speed'} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ohm'} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""

# ============================================================
# RATIO CALCULATOR
# ============================================================
ratio_page = """'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/ratio.json';
import esMsgs from '../../../messages/es/ratio.json';
import zhMsgs from '../../../messages/zh/ratio.json';
import koMsgs from '../../../messages/ko/ratio.json';
import ptMsgs from '../../../messages/pt/ratio.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export default function RatioPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/ratio'; };

  const [mode, setMode] = useState('simplify');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (mode === 'simplify') {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      if (numA <= 0 || numB <= 0) return;
      const g = gcd(numA, numB);
      setResult({ type: 'simplify', a: numA / g, b: numB / g });
    } else {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      const numC = parseInt(c) || 0;
      const numD = parseInt(d) || 0;
      let filled = null;
      if (numA > 0 && numB > 0 && numC > 0 && numD <= 0) {
        filled = { label: 'D', value: (numB * numC) / numA };
      } else if (numA > 0 && numB > 0 && numD > 0 && numC <= 0) {
        filled = { label: 'C', value: (numA * numD) / numB };
      } else if (numA > 0 && numC > 0 && numD > 0 && numB <= 0) {
        filled = { label: 'B', value: (numA * numD) / numC };
      } else if (numB > 0 && numC > 0 && numD > 0 && numA <= 0) {
        filled = { label: 'A', value: (numB * numC) / numD };
      }
      if (filled) {
        setResult({ type: 'find', ...filled, a: numA || filled.value, b: numB || filled.value, c: numC || filled.value, d: numD || filled.value });
      }
    }
  };

  const clear = () => { setA(''); setB(''); setC(''); setD(''); setResult(null); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 420, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="os9-label">{t('modeLabel')}</label>
            <div className="flex gap-2">
              <button className={'os9-btn flex-1 !px-2 !py-2 text-xs ' + (mode === 'simplify' ? 'os9-btn-primary' : '')}
                onClick={() => { setMode('simplify'); setResult(null); }}>{t('modeSimplify')}</button>
              <button className={'os9-btn flex-1 !px-2 !py-2 text-xs ' + (mode === 'find' ? 'os9-btn-primary' : '')}
                onClick={() => { setMode('find'); setResult(null); }}>{t('modeFind')}</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="os9-label">{t('aLabel')}</label>
              <input className="os9-input" type="number" min={0} value={a} onChange={(e) => setA(e.target.value)} placeholder="0" />
            </div>
            <span className="text-lg font-bold mt-5" style={{ opacity: 0.6 }}>:</span>
            <div className="flex-1">
              <label className="os9-label">{t('bLabel')}</label>
              <input className="os9-input" type="number" min={0} value={b} onChange={(e) => setB(e.target.value)} placeholder="0" />
            </div>
          </div>

          {mode === 'find' && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="os9-label">{t('cLabel')}</label>
                <input className="os9-input" type="number" min={0} value={c} onChange={(e) => setC(e.target.value)} placeholder="0" />
              </div>
              <span className="text-lg font-bold mt-5" style={{ opacity: 0.6 }}>:</span>
              <div className="flex-1">
                <label className="os9-label">{t('dLabel')}</label>
                <input className="os9-input" type="number" min={0} value={d} onChange={(e) => setD(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={calculate}>{t('calculate')}</button>
            <button className="os9-btn !px-4" onClick={clear}>{t('clear')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <div className="os9-result text-center">
                {result.type === 'simplify' && (
                  <>
                    <p className="os9-label mb-1">{t('resultSimplify')}</p>
                    <p className="os9-big-number">{Math.round(result.a)}:{Math.round(result.b)}</p>
                  </>
                )}
                {result.type === 'find' && (
                  <>
                    <p className="os9-label mb-1">{t('resultFind')}</p>
                    <p className="os9-big-number">{Math.round(result.a)}:{Math.round(result.b)} = {Math.round(result.c)}:{Math.round(result.d)}</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:420,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:420,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/coinflip'} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/dice'} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/speed'} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ohm'} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""

# ============================================================
# SPEED CALCULATOR
# ============================================================
speed_page = """'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/speed.json';
import esMsgs from '../../../messages/es/speed.json';
import zhMsgs from '../../../messages/zh/speed.json';
import koMsgs from '../../../messages/ko/speed.json';
import ptMsgs from '../../../messages/pt/speed.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function SpeedPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/speed'; };

  const [mode, setMode] = useState('speed');
  const [distVal, setDistVal] = useState('');
  const [timeVal, setTimeVal] = useState('');
  const [speedVal, setSpeedVal] = useState('');
  const [distUnit, setDistUnit] = useState('km');
  const [timeUnit, setTimeUnit] = useState('h');
  const [speedUnit, setSpeedUnit] = useState('kmh');
  const [result, setResult] = useState(null);

  function toBaseKmH(val, unit) {
    if (unit === 'km') return val;
    if (unit === 'mi') return val * 1.60934;
    if (unit === 'm') return val / 1000;
    return val;
  }

  function fromBaseKmH(val, unit) {
    if (unit === 'km') return val;
    if (unit === 'mi') return val / 1.60934;
    if (unit === 'm') return val * 1000;
    return val;
  }

  function toBaseH(val, unit) {
    if (unit === 'h') return val;
    if (unit === 'min') return val / 60;
    if (unit === 's') return val / 3600;
    return val;
  }

  function fromBaseH(val, unit) {
    if (unit === 'h') return val;
    if (unit === 'min') return val * 60;
    if (unit === 's') return val * 3600;
    return val;
  }

  function formatVal(val) {
    if (val > 1000000 || (val < 0.001 && val !== 0)) return val.toExponential(3);
    if (val > 1000) return val.toFixed(0);
    if (val > 100) return val.toFixed(1);
    if (val > 1) return val.toFixed(2);
    return val.toFixed(4);
  }

  const calculate = () => {
    if (mode === 'speed') {
      const d = parseFloat(distVal);
      const t = parseFloat(timeVal);
      if (d > 0 && t > 0) {
        setResult({ type: 'speed', value: toBaseKmH(d, distUnit) / toBaseH(t, timeUnit) });
      }
    } else if (mode === 'distance') {
      const s = parseFloat(speedVal);
      const t = parseFloat(timeVal);
      if (s > 0 && t > 0) {
        let sBase = s;
        if (speedUnit === 'mph') sBase = s * 1.60934;
        else if (speedUnit === 'ms') sBase = s * 3.6;
        setResult({ type: 'distance', value: sBase * toBaseH(t, timeUnit) });
      }
    } else if (mode === 'time') {
      const d = parseFloat(distVal);
      const s = parseFloat(speedVal);
      if (d > 0 && s > 0) {
        let sBase = s;
        if (speedUnit === 'mph') sBase = s * 1.60934;
        else if (speedUnit === 'ms') sBase = s * 3.6;
        setResult({ type: 'time', value: toBaseKmH(d, distUnit) / sBase });
      }
    }
  };

  const clear = () => { setDistVal(''); setTimeVal(''); setSpeedVal(''); setResult(null); };

  const speedUnitLabel = speedUnit === 'kmh' ? t('unitKmph') : speedUnit === 'mph' ? t('unitMiph') : t('unitMs');

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 440, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="os9-tab-group mb-3">
            {['speed', 'distance', 'time'].map(m => (
              <button key={m} className={'os9-tab text-xs ' + (mode === m ? 'os9-tab-active' : '')}
                onClick={() => { setMode(m); setResult(null); }}>
                {t(m === 'speed' ? 'speedLabel' : m === 'distance' ? 'distanceLabel' : 'timeLabel')}
              </button>
            ))}
          </div>

          {mode === 'speed' && (
            <>
              <div className="mb-3"><label className="os9-label">{t('distanceLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={distVal} onChange={(e) => setDistVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={distUnit} onChange={(e) => setDistUnit(e.target.value)}>
                    <option value="km">{t('unitKm')}</option><option value="mi">{t('unitMi')}</option><option value="m">{t('unitM')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-3"><label className="os9-label">{t('timeLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                    <option value="h">{t('unitH')}</option><option value="min">{t('unitMin')}</option><option value="s">{t('unitS')}</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {mode === 'distance' && (
            <>
              <div className="mb-3"><label className="os9-label">{t('speedLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={speedVal} onChange={(e) => setSpeedVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}>
                    <option value="kmh">{t('unitKmh')}</option><option value="mph">{t('unitMph')}</option><option value="ms">{t('unitMs')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-3"><label className="os9-label">{t('timeLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                    <option value="h">{t('unitH')}</option><option value="min">{t('unitMin')}</option><option value="s">{t('unitS')}</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {mode === 'time' && (
            <>
              <div className="mb-3"><label className="os9-label">{t('distanceLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={distVal} onChange={(e) => setDistVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={distUnit} onChange={(e) => setDistUnit(e.target.value)}>
                    <option value="km">{t('unitKm')}</option><option value="mi">{t('unitMi')}</option><option value="m">{t('unitM')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-3"><label className="os9-label">{t('speedLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={speedVal} onChange={(e) => setSpeedVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}>
                    <option value="kmh">{t('unitKmh')}</option><option value="mph">{t('unitMph')}</option><option value="ms">{t('unitMs')}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 mb-4">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={calculate}>{t('calculate')}</button>
            <button className="os9-btn !px-4" onClick={clear}>{t('clear')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <div className="os9-result text-center">
                <p className="os9-label mb-1">{mode === 'speed' ? t('speedLabel') : mode === 'distance' ? t('distanceLabel') : t('timeLabel')}</p>
                {result.type === 'speed' && <><p className="os9-big-number">{formatVal(result.value)}</p><p className="text-xs mt-1" style={{opacity:0.6}}>{speedUnitLabel}</p></>}
                {result.type === 'distance' && <><p className="os9-big-number">{formatVal(fromBaseKmH(result.value, distUnit))}</p><p className="text-xs mt-1" style={{opacity:0.6}}>{distUnit === 'km' ? t('unitKm') : distUnit === 'mi' ? t('unitMi') : t('unitM')}</p></>}
                {result.type === 'time' && <><p className="os9-big-number">{formatVal(fromBaseH(result.value, 'h'))}</p><p className="text-xs mt-1" style={{opacity:0.6}}>{t('unitH')}</p></>}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:440,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:440,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/coinflip'} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/dice'} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ratio'} className="underline">Ratio</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ohm'} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""

# ============================================================
# OHM'S LAW
# ============================================================
ohm_page = """'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/ohm.json';
import esMsgs from '../../../messages/es/ohm.json';
import zhMsgs from '../../../messages/zh/ohm.json';
import koMsgs from '../../../messages/ko/ohm.json';
import ptMsgs from '../../../messages/pt/ohm.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function OhmPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/ohm'; };

  const [v, setV] = useState('');
  const [i, setI] = useState('');
  const [r, setR] = useState('');
  const [p, setP] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const nV = parseFloat(v);
    const nI = parseFloat(i);
    const nR = parseFloat(r);
    const nP = parseFloat(p);
    let filled = 0;
    if (v !== '' && !isNaN(nV)) filled++;
    if (i !== '' && !isNaN(nI)) filled++;
    if (r !== '' && !isNaN(nR)) filled++;
    if (p !== '' && !isNaN(nP)) filled++;
    if (filled < 2) return;

    let res = {};
    if (v !== '' && i !== '' && !isNaN(nV) && !isNaN(nI) && nI !== 0) {
      res.rv = nV / nI; res.pv = nV * nI;
    }
    if (v !== '' && r !== '' && !isNaN(nV) && !isNaN(nR) && nR !== 0) {
      res.iv = nV / nR; res.pv2 = (nV * nV) / nR;
    }
    if (v !== '' && p !== '' && !isNaN(nV) && !isNaN(nP) && nV !== 0) {
      res.iv2 = nP / nV; res.rv2 = (nV * nV) / nP;
    }
    if (i !== '' && r !== '' && !isNaN(nI) && !isNaN(nR)) {
      res.vv = nI * nR; res.pv3 = (nI * nI) * nR;
    }
    if (i !== '' && p !== '' && !isNaN(nI) && !isNaN(nP) && nI !== 0) {
      res.vv2 = nP / nI; res.rv3 = nP / (nI * nI);
    }
    if (r !== '' && p !== '' && !isNaN(nR) && !isNaN(nP)) {
      res.vv3 = Math.sqrt(nP * nR); res.iv3 = Math.sqrt(nP / nR);
    }
    setResult(res);
  };

  const clear = () => { setV(''); setI(''); setR(''); setP(''); setResult(null); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 440, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <p className="text-xs mb-4 text-center" style={{ opacity: 0.6 }}>{t('selectTwo')}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="os9-label">{t('voltage')}</label><input className="os9-input" type="number" step="any" min={0} value={v} onChange={(e) => setV(e.target.value)} placeholder="0" /></div>
            <div><label className="os9-label">{t('current')}</label><input className="os9-input" type="number" step="any" min={0} value={i} onChange={(e) => setI(e.target.value)} placeholder="0" /></div>
            <div><label className="os9-label">{t('resistance')}</label><input className="os9-input" type="number" step="any" min={0} value={r} onChange={(e) => setR(e.target.value)} placeholder="0" /></div>
            <div><label className="os9-label">{t('power')}</label><input className="os9-input" type="number" step="any" min={0} value={p} onChange={(e) => setP(e.target.value)} placeholder="0" /></div>
          </div>

          <div className="flex gap-2">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={calc}>{t('calculate')}</button>
            <button className="os9-btn !px-4" onClick={clear}>{t('clear')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2">
                {(result.vv !== undefined || result.vv2 !== undefined || result.vv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultVoltage')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.vv || result.vv2 || result.vv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitV')}</p>
                  </div>
                )}
                {(result.iv !== undefined || result.iv2 !== undefined || result.iv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultCurrent')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.iv || result.iv2 || result.iv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitI')}</p>
                  </div>
                )}
                {(result.rv !== undefined || result.rv2 !== undefined || result.rv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultResistance')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.rv || result.rv2 || result.rv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitR')}</p>
                  </div>
                )}
                {(result.pv !== undefined || result.pv2 !== undefined || result.pv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultPower')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.pv || result.pv2 || result.pv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitP')}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:440,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:440,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/coinflip'} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/dice'} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ratio'} className="underline">Ratio</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/speed'} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""

# ============================================================
# WRITE ALL FILES
# ============================================================
pages = {
    'coinflip': coinflip_page,
    'dice': dice_page,
    'ratio': ratio_page,
    'speed': speed_page,
    'ohm': ohm_page,
}

for tool, content in pages.items():
    path = os.path.join(BASE, 'src', 'app', '[locale]', tool, 'page.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrote {path}")

print("\nDONE!")