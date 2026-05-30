'use client';

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
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
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
