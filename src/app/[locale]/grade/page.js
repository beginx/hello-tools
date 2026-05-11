'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/grade.json';
import esMsgs from '../../../messages/es/grade.json';
import zhMsgs from '../../../messages/zh/grade.json';
import koMsgs from '../../../messages/ko/grade.json';
import ptMsgs from '../../../messages/pt/grade.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function toLetter(n) {
  if (n >= 90) return 'A';
  if (n >= 80) return 'B';
  if (n >= 70) return 'C';
  if (n >= 60) return 'D';
  return 'F';
}
function toGPA(n) {
  if (n >= 90) return 4.0;
  if (n >= 80) return 3.0;
  if (n >= 70) return 2.0;
  if (n >= 60) return 1.0;
  return 0.0;
}

export default function GradePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/grade'; };

  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [weight, setWeight] = useState('');

  const addSubject = () => {
    const s = parseFloat(score);
    const w = parseFloat(weight);
    if (name.trim() && !isNaN(s) && !isNaN(w) && s >= 0 && s <= 100 && w > 0) {
      setSubjects([...subjects, { name: name.trim(), score: s, weight: w }]);
      setName(''); setScore(''); setWeight('');
    }
  };

  const removeSubject = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const calc = () => {
    if (subjects.length === 0) return;
    const totalW = subjects.reduce((a, s) => a + s.weight, 0);
    const weightedSum = subjects.reduce((a, s) => a + s.score * s.weight, 0);
    const avg = totalW > 0 ? weightedSum / totalW : 0;
    const gpa = subjects.reduce((a, s) => a + toGPA(s.score), 0) / subjects.length;
    setResult({ avg: Math.round(avg * 100) / 100, gpa: Math.round(gpa * 100) / 100, letter: toLetter(avg), totalW });
  };

  const [result, setResult] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addSubject();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 460, width: '100%' }}>
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

          {/* Add subject row */}
          <div className="flex gap-2 mb-3 items-end">
            <div className="flex-1">
              <label className="os9-label block text-xs mb-1">{t('subject')}</label>
              <input className="os9-input w-full" type="text"
                value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={t('placeholderSubject')} style={{ fontSize: 14, padding: '8px 6px' }} />
            </div>
            <div style={{ width: 80 }}>
              <label className="os9-label block text-xs mb-1">{t('score')}</label>
              <input className="os9-input w-full text-center" type="number" min="0" max="100"
                value={score} onChange={(e) => setScore(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={t('placeholderScore')} style={{ fontSize: 14, padding: '8px 4px' }} />
            </div>
            <div style={{ width: 70 }}>
              <label className="os9-label block text-xs mb-1">{t('weight')}</label>
              <input className="os9-input w-full text-center" type="number" min="1"
                value={weight} onChange={(e) => setWeight(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={t('placeholderWeight')} style={{ fontSize: 14, padding: '8px 4px' }} />
            </div>
            <button className="os9-btn os9-btn-primary text-sm" onClick={addSubject}
              style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{t('addSubject')}</button>
          </div>

          {/* Subject list */}
          {subjects.length > 0 && (
            <div className="mb-3" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {subjects.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-1 px-2 text-xs"
                  style={{ borderBottom: '1px solid var(--os9-border)' }}>
                  <span className="flex-1">{s.name}</span>
                  <span className="mx-2">{s.score}%</span>
                  <span className="mx-2" style={{ opacity: 0.6 }}>({s.weight}%)</span>
                  <button className="underline" style={{ opacity: 0.5, fontSize: 11 }}
                    onClick={() => removeSubject(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Calculate / Clear */}
          <div className="flex gap-2 mb-4">
            <button className="os9-btn-primary flex-1" style={{ padding: '12px 0', fontSize: 16 }}
              onClick={calc}>{t('calculate')}</button>
            <button className="os9-btn flex-none text-sm px-4" style={{ padding: '12px 0' }}
              onClick={() => { setSubjects([]); setName(''); setScore(''); setWeight(''); setResult(null); }}>{t('clear')}</button>
          </div>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('averageScore')}</div>
                  <div className="font-bold" style={{ color: 'var(--os9-red)', fontSize: 24 }}>{result.avg}%</div>
                </div>
                <div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('gpa')}</div>
                  <div className="font-bold" style={{ fontSize: 24 }}>{result.gpa}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('letterGrade')}</div>
                  <div className="font-bold" style={{ color: result.letter === 'A' ? '#22aa22' : result.letter === 'F' ? 'var(--os9-red)' : 'inherit', fontSize: 24 }}>{result.letter}</div>
                </div>
              </div>
              <div className="text-xs text-center" style={{ opacity: 0.6 }}>{t('totalWeight')}: {result.totalW}%</div>
            </div>
          )}
          {!result && subjects.length === 0 && (
            <p className="text-xs text-center" style={{ opacity: 0.5 }}>{t('error')}</p>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/grade'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Grade</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}