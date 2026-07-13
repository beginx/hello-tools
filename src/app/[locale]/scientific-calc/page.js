'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

import enMsgs from '../../../messages/en/scientific-calc.json';
import esMsgs from '../../../messages/es/scientific-calc.json';
import zhMsgs from '../../../messages/zh/scientific-calc.json';
import koMsgs from '../../../messages/ko/scientific-calc.json';
import ptMsgs from '../../../messages/pt/scientific-calc.json';

const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function ScientificCalcPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/scientific-calc'; };

  const [display, setDisplay] = useState('0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handle = (btn) => {
    if ('0123456789.'.includes(btn)) {
      if (waitingForOperand || display === '0') { setDisplay(btn === '.' ? '0.' : btn); setWaitingForOperand(false); }
      else { setDisplay(display + btn); }
    } else if (btn === 'C') { setDisplay('0'); setWaitingForOperand(false); }
    else if (btn === '⌫') { setDisplay(display.length > 1 ? display.slice(0,-1) : '0'); }
    else if (btn === '=') { 
      try { 
        const expr = display
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/ln/g, 'Math.log')
          .replace(/log/g, 'Math.log10')
          .replace(/\^/g, '**');
        setDisplay(String(eval(expr))); 
      } catch(e) { setDisplay('Error'); } 
      setWaitingForOperand(true); 
    }
    else if (['+','-','*','/','^'].includes(btn)) { setDisplay(display + btn); setWaitingForOperand(false); }
    else if (['sin','cos','tan','ln','log','π','e'].includes(btn)) { 
      setDisplay(display + (btn === 'π' ? 'Math.PI' : btn === 'e' ? 'Math.E' : btn + '(')); 
      setWaitingForOperand(false); 
    }
    else if (btn === '(' || btn === ')') { setDisplay(display + btn); setWaitingForOperand(false); }
  };

  const buttons = ['C','⌫','(',')','sin','cos','tan','π','ln','log','e','^','7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 520, width: '100%' }}>
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
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div className="mb-3">
            <input className="os9-input w-full text-right text-lg" type="text" value={display} readOnly />
          </div>
          <div className="grid grid-cols-4 gap-1 mb-1">
            {buttons.map((btn, i) => {
              const isPrimary = ['=', 'C'].includes(btn);
              const isWide = btn === '0';
              return (
                <button 
                  key={i} 
                  className={"os9-btn h-10 text-sm" + (isPrimary ? ' os9-btn-primary' : '') + (isWide ? ' col-span-2' : '')}
                  onClick={() => handle(btn)}
                >
                  {btn}
                </button>
              );
            })}
          </div>
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%', textAlign: 'center', fontSize: 10, opacity: 0.6, marginTop: 12 }}>
        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {t('footer') || 'hello-tools 2026'}
      </div>
    </div>
  );
}
