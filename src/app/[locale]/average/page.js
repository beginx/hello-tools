'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/average.json';
import esMsgs from '../../../messages/es/average.json';
import zhMsgs from '../../../messages/zh/average.json';
import koMsgs from '../../../messages/ko/average.json';
import ptMsgs from '../../../messages/pt/average.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function AveragePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/average'; };

  const [nums, setNums] = useState([]);
  const [input, setInput] = useState('');

  const addNumber = () => {
    const v = parseFloat(input);
    if (!isNaN(v)) {
      setNums([...nums, v]);
      setInput('');
    }
  };

  const removeNumber = (idx) => {
    setNums(nums.filter((_, i) => i !== idx));
  };

  const result = useMemo(() => {
    if (nums.length === 0) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / count;
    const median = count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];
    const freq = {};
    nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    const range = sorted[count - 1] - sorted[0];
    return { count, sum, avg, median, mode, range, smallest: sorted[0], largest: sorted[count - 1] };
  }, [nums]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addNumber();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
          {/* Language */}
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Add Number */}
          <div className="flex gap-2 mb-3">
            <input className="os9-input flex-1" type="number" step="any"
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={t('placeholderNumber')} style={{ fontSize: 16, padding: '10px 8px' }} />
            <button className="os9-btn os9-btn-primary text-sm px-4" onClick={addNumber}
              style={{ whiteSpace: 'nowrap' }}>{t('addNumber')}</button>
          </div>

          {/* Number List */}
          {nums.length > 0 && (
            <div className="mb-3" style={{ maxHeight: 160, overflowY: 'auto' }}>
              {nums.map((n, i) => (
                <div key={i} className="flex justify-between items-center py-1 px-2 text-xs"
                  style={{ borderBottom: '1px solid var(--os9-border)' }}>
                  <span>{n}</span>
                  <button className="underline" style={{ opacity: 0.5, fontSize: 11 }}
                    onClick={() => removeNumber(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Calculate / Clear */}
          <div className="flex gap-2 mb-4">
            <button className="os9-btn-primary flex-1" style={{ padding: '12px 0', fontSize: 16 }}
              onClick={() => {}} disabled={nums.length === 0}>{t('calculate')}</button>
            <button className="os9-btn flex-none text-sm px-4" style={{ padding: '12px 0' }}
              onClick={() => { setNums([]); setInput(''); }}>{t('clear')}</button>
          </div>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('count')}</span>
                <span className="font-bold text-lg">{result.count}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('sum')}</span>
                <span className="font-bold text-lg">{result.sum}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('average')}</span>
                <span className="font-bold" style={{ color: 'var(--os9-red)', fontSize: 22 }}>{result.avg}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-xs" style={{ opacity: 0.7 }}>
                <span>{t('median')}</span>
                <span>{result.median}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-xs" style={{ opacity: 0.7 }}>
                <span>{t('mode')}</span>
                <span>{result.mode.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-xs" style={{ opacity: 0.7 }}>
                <span>{t('range')}</span>
                <span>{result.smallest} ~ {result.largest} ({result.range})</span>
              </div>
            </div>
          )}
          {nums.length === 0 && (
            <p className="text-xs text-center" style={{ opacity: 0.5 }}>{t('error')}</p>
          )}

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/grade`} className="underline">Grade Calculator</a>
                <a href={`/${locale}/percent`} className="underline">Percent Calculator</a>
                <a href={`/${locale}/fraction`} className="underline">Fraction Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/average'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Average</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}