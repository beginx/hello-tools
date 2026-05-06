'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

function secureRandom(min, max) {
  const range = max - min + 1;
  const maxValid = 0x100000000 - (0x100000000 % range);
  const arr = new Uint32Array(1);
  let r;
  do {
    crypto.getRandomValues(arr);
    r = arr[0];
  } while (r >= maxValid);
  return min + (r % range);
}

export default function RandomPage() {
  const t = useTranslations('random');
  const params = useParams();
  const locale = params?.locale || 'en';
  const changeLang = (l) => { window.location.href = '/' + l + '/random'; };

  const [minVal, setMinVal] = useState('1');
  const [maxVal, setMaxVal] = useState('100');
  const [countVal, setCountVal] = useState('1');
  const [unique, setUnique] = useState(true);
  const [sortMode, setSortMode] = useState('ascending');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const doGenerate = useCallback(() => {
    setError(null);
    const min = parseInt(minVal);
    const max = parseInt(maxVal);
    const cnt = parseInt(countVal);
    if (isNaN(min) || isNaN(max) || isNaN(cnt)) { setError(t('error')); return; }
    if (min >= max) { setError(t('errorRange')); return; }
    if (cnt < 1 || cnt > 100) { setError(t('errorCount')); return; }
    if (unique && cnt > (max - min + 1)) { setError(t('errorUnique')); return; }

    const numbers = [];
    if (unique) {
      const pool = [];
      for (let i = min; i <= max; i++) pool.push(i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = secureRandom(0, i);
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      numbers.push(...pool.slice(0, cnt));
    } else {
      for (let i = 0; i < cnt; i++) {
        numbers.push(secureRandom(min, max));
      }
    }

    if (sortMode === 'ascending') numbers.sort((a, b) => a - b);

    setResult(numbers);
    setHistory(prev => [numbers, ...prev].slice(0, 20));
  }, [minVal, maxVal, countVal, unique, sortMode, t]);

  const keyDown = (e) => { if (e.key === 'Enter') doGenerate(); };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.join(', ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 480, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="os9-result">
            {/* Range inputs */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="os9-label">{t('min')}</label>
                <input className="os9-input" type="number" value={minVal}
                  onChange={(e) => setMinVal(e.target.value)} onKeyDown={keyDown} placeholder="1" />
              </div>
              <div>
                <label className="os9-label">{t('max')}</label>
                <input className="os9-input" type="number" value={maxVal}
                  onChange={(e) => setMaxVal(e.target.value)} onKeyDown={keyDown} placeholder="100" />
              </div>
            </div>

            {/* Count */}
            <div className="mb-3">
              <label className="os9-label">{t('count')}</label>
              <input className="os9-input" type="number" min={1} max={100} value={countVal}
                onChange={(e) => setCountVal(e.target.value)} onKeyDown={keyDown} placeholder="1" />
            </div>

            {/* Options */}
            <div className="flex gap-4 mb-3 items-center">
              <label className="flex items-center gap-1 text-xs" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)}
                  className="w-3 h-3" />
                {t('unique')}
              </label>
              <label className="text-xs" style={{ opacity: 0.7 }}>{t('sort')}:</label>
              <select className="os9-select !w-auto !text-xs !py-1" value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}>
                <option value="ascending">{t('ascending')}</option>
                <option value="none">{t('none')}</option>
              </select>
            </div>

            {/* Generate button */}
            <button className="os9-btn os9-btn-primary w-full text-sm py-3" onClick={doGenerate}>
              {t('generate')}
            </button>

            {/* Error */}
            {error && (
              <p className="text-xs text-center mt-3" style={{ color: 'var(--os9-red)' }}>{error}</p>
            )}

            {/* Result */}
            {result && !error && (
              <div className="mt-4">
                <hr className="os9-divider" />
                <div className="os9-result text-center">
                  <p className="text-xs mb-2" style={{ opacity: 0.6 }}>{t('result')}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.map((n, i) => (
                      <span key={i} className="os9-big-number text-lg px-2 py-1 rounded"
                        style={{ background: 'var(--os9-surface)', border: '1px solid var(--os9-highlight)' }}>
                        {n.toLocaleString()}
                      </span>
                    ))}
                  </div>
                  <button className="os9-btn text-xs !py-1 !px-4 mt-3" onClick={copyResult}>
                    {copied ? t('copied') : t('copy')}
                  </button>
                </div>
              </div>
            )}

            {/* Max size note */}
            {!result && !error && (
              <p className="text-[10px] text-center mt-3" style={{ opacity: 0.4 }}>{t('maxSizeNote')}</p>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-4">
              <hr className="os9-divider" />
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label" style={{ marginBottom: 0 }}>{t('history')}</span>
                <button className="text-xs underline" style={{ opacity: 0.5 }}
                  onClick={() => setHistory([])}>{t('clear')}</button>
              </div>
              <div className="space-y-1">
                {history.map((h, i) => (
                  <div key={i} className="os9-result !py-1 !px-3 text-xs flex items-center gap-2"
                    style={{ background: 'var(--os9-surface)' }}>
                    <span style={{ opacity: 0.4 }}>#{history.length - i}</span>
                    <span className="truncate">{h.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}