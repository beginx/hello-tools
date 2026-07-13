'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/typing-test.json';
import esMsgs from '../../../messages/es/typing-test.json';
import zhMsgs from '../../../messages/zh/typing-test.json';
import koMsgs from '../../../messages/ko/typing-test.json';
import ptMsgs from '../../../messages/pt/typing-test.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function TypingTestPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/typing-test'; };
  const [mode, setMode] = useState('30');
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef(null);
  const wordList = "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me".split(' ');

  const start = () => {
    setWords(Array.from({ length: 50 }, () => wordList[Math.floor(Math.random() * wordList.length)]));
    setInput(''); setCurrent(0); setCorrect([]); setStarted(true); setFinished(false);
    setTimeLeft(mode === '15' ? 15 : mode === '30' ? 30 : mode === '60' ? 60 : 30);
    setWpm(0); setAccuracy(100);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { finish(); return 0; } return t - 1; });
    }, 1000);
  };

  const finish = () => { clearInterval(timerRef.current); setFinished(true); setStarted(false); };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (!started) return;
    const target = words[current];
    if (val.endsWith(' ') || val.length >= target.length) {
      const typed = val.trim();
      const c = typed === target;
      setCorrect(c => [...c, c]);
      setCurrent(c => c + 1);
      setInput('');
      const correctCount = correct.filter(x => x).length + (c ? 1 : 0);
      const total = current + 1;
      setAccuracy(Math.round((correctCount / total) * 100));
      const elapsed = (mode === '15' ? 15 : mode === '30' ? 30 : mode === '60' ? 60 : 30) - timeLeft;
      if (elapsed > 0) setWpm(Math.round((correctCount / 5) / (elapsed / 60)));
    }
  };

  const reset = () => { clearInterval(timerRef.current); start(); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 600, width: '100%' }}>
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
                      <select className="os9-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="15">{t('time15') || '15 seconds'}</option>
                        <option value="30">{t('time30') || '30 seconds'}</option>
                        <option value="60">{t('time60') || '60 seconds'}</option>
                        <option value="words">{t('words10') || '10 words'}</option>
                        <option value="words25">{t('words25') || '25 words'}</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wpm') || 'WPM'}</div><div className="font-bold text-lg">{wpm}</div></div>
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('accuracy') || 'Accuracy'}</div><div className="font-bold text-lg">{accuracy}%</div></div>
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('time') || 'Time'}</div><div className="font-bold text-lg">{timeLeft}s</div></div>
                      </div>
                      <div className="min-h-[80px] p-4 bg-gray-50 rounded border border-gray-200 font-mono text-base leading-relaxed overflow-hidden">
                        {words.map((w, i) => (
                          <span key={i} className={i === current ? 'bg-yellow-100 px-1' : ''} style={{ color: i < current ? (correct[i] ? 'green' : 'red') : 'inherit' }}>
                            {w}{' '}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <input className="os9-input w-full" type="text" value={input} onChange={handleInput} placeholder={started ? '' : (t('startTyping') || 'Start typing...')} disabled={!started || finished} autoFocus />
                    </div>
                    {!started && <button className="os9-btn os9-btn-primary w-full" onClick={start}>{t('start') || 'Start'}</button>}
                    {finished && <button className="os9-btn w-full" onClick={reset}>{t('tryAgain') || 'Try Again'}</button>}
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