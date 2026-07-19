'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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

  const [mode, setMode] = useState('60');
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [lang, setLang] = useState('en');
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const wordLists = {
    en: "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me".split(' '),
    ko: "안녕하세요 감사합니다 미안합니다 사랑합니다 행복합니다 건강하세요 축하합니다 수고했습니다 잘부탁드립니다 반갑습니다 좋은날씨 오늘도 화이팅 좋은아침 좋은저녁 맛있는점심 즐거운주말 행복한하루 힘내세요 화이팅 응원합니다 고생많으셨습니다 수고많으셨습니다".split(' ')
  };

  const modes = {
    '15': { label: { en: '15 seconds', es: '15 segundos', zh: '15秒', ko: '15초', pt: '15 segundos' }, time: 15, type: 'time' },
    '30': { label: { en: '30 seconds', es: '30 segundos', zh: '30秒', ko: '30초', pt: '30 segundos' }, time: 30, type: 'time' },
    '60': { label: { en: '60 seconds', es: '60 segundos', zh: '60秒', ko: '60초', pt: '60 segundos' }, time: 60, type: 'time' },
    '10': { label: { en: '10 words', es: '10 palabras', zh: '10词', ko: '10단어', pt: '10 palavras' }, count: 10, type: 'words' },
    '25': { label: { en: '25 words', es: '25 palabras', zh: '25词', ko: '25단어', pt: '25 palavras' }, count: 25, type: 'words' }
  };

  const start = () => {
    const list = wordLists[lang];
    const wordCount = modes[mode].type === 'words' ? modes[mode].count : 50;
    setWords(Array.from({ length: wordCount }, () => list[Math.floor(Math.random() * list.length)]));
    setInput('');
    setCurrent(0);
    setCorrect([]);
    setStarted(true);
    setFinished(false);
    setTimeLeft(modes[mode].time || 60);
    setWpm(0);
    setAccuracy(100);
    if (modes[mode].type === 'time') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { finish(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finish = () => {
    clearInterval(timerRef.current);
    setFinished(true);
    setStarted(false);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (!started) return;
    const target = words[current];
    if (val.endsWith(' ') || val.length >= target.length) {
      const typed = val.trim();
      const isCorrect = typed === target;
      setCorrect(c => [...c, isCorrect]);
      setCurrent(c => c + 1);
      setInput('');
      const correctCount = correct.filter(x => x).length + (isCorrect ? 1 : 0);
      const total = current + 1;
      setAccuracy(Math.round((correctCount / total) * 100));
      const elapsed = (modes[mode].time || 60) - timeLeft;
      if (elapsed > 0 && modes[mode].type === 'time') {
        setWpm(Math.round((correctCount / 5) / (elapsed / 60)));
      }
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    start();
  };

  const modeLabels = {
    '15': modes['15'].label[locale] || modes['15'].label.en,
    '30': modes['30'].label[locale] || modes['30'].label.en,
    '60': modes['60'].label[locale] || modes['60'].label.en,
    '10': modes['10'].label[locale] || modes['10'].label.en,
    '25': modes['25'].label[locale] || modes['25'].label.en,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 680, width: '100%' }}>
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
            <label className="os9-label mb-1 block">{t('language') || 'Language'}</label>
            <div className="flex gap-2">
              <button className={'os9-btn flex-1' + (lang === 'en' ? ' os9-btn-primary' : '')} onClick={() => setLang('en')}>English</button>
              <button className={'os9-btn flex-1' + (lang === 'ko' ? ' os9-btn-primary' : '')} onClick={() => setLang('ko')}>한국어</button>
            </div>
          </div>

          <div className="mb-3">
            <label className="os9-label mb-1 block">{t('mode') || 'Mode'}</label>
            <select className="os9-select w-full" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="15">{modeLabels['15']}</option>
              <option value="30">{modeLabels['30']}</option>
              <option value="60">{modeLabels['60']}</option>
              <option value="10">{modeLabels['10']}</option>
              <option value="25">{modeLabels['25']}</option>
            </select>
          </div>

          <div className="mb-3">
            <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wpm') || 'WPM'}</div><div className="font-bold text-lg">{wpm}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('accuracy') || 'Accuracy'}</div><div className="font-bold text-lg">{accuracy}%</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('time') || 'Time'}</div><div className="font-bold text-lg">{modes[mode].type === 'time' ? timeLeft + 's' : current + '/' + words.length}</div></div>
            </div>
            <div className="min-h-[100px] p-4 bg-gray-50 rounded border border-gray-200 font-mono text-base leading-relaxed overflow-hidden">
              {words.map((w, i) => (
                <span key={i} className={i === current ? 'bg-yellow-100 px-1' : ''} style={{ color: i < current ? (correct[i] ? 'green' : 'red') : 'inherit' }}>
                  {w}{' '}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <input
              ref={inputRef}
              className="os9-input w-full"
              type="text"
              value={input}
              onChange={handleInput}
              placeholder={started ? '' : (t('startTyping') || 'Start typing...')}
              disabled={!started || finished}
              autoFocus
            />
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
}// v2
