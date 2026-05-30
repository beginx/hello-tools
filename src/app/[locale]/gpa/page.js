'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/gpa.json';
import esMsgs from '../../../messages/es/gpa.json';
import zhMsgs from '../../../messages/zh/gpa.json';
import koMsgs from '../../../messages/ko/gpa.json';
import ptMsgs from '../../../messages/pt/gpa.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const GRADE_POINTS = {
  'A+': 4.5, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

export default function GpaPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/gpa'; };

  const [scale, setScale] = useState('4.0');
  const [courses, setCourses] = useState([{ name: '', credits: '3', grade: 'A' }]);
  const [result, setResult] = useState(null);

  const addCourse = () => {
    setCourses([...courses, { name: '', credits: '3', grade: 'A' }]);
  };

  const updateCourse = (idx, field, value) => {
    const updated = [...courses];
    updated[idx][field] = value;
    setCourses(updated);
    setResult(null);
  };

  const removeCourse = (idx) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((_, i) => i !== idx));
    setResult(null);
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    const scaleVal = parseFloat(scale);
    const maxGrade = scaleVal === 4.5 ? 'A+' : 'A';

    courses.forEach(c => {
      const cred = parseFloat(c.credits) || 0;
      let grade = c.grade;
      // Adjust grade based on scale
      if (scaleVal < 4.5 && grade === 'A+') grade = 'A';
      const points = (GRADE_POINTS[grade] || 0) * cred;
      totalPoints += points;
      totalCredits += cred;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    setResult({ gpa: gpa.toFixed(2), totalCredits, totalPoints: totalPoints.toFixed(1) });
  };

  const clearAll = () => {
    setCourses([{ name: '', credits: '3', grade: 'A' }]);
    setResult(null);
  };

  const grades = scale === '4.5'
    ? ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
    : ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

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
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="mb-3">
            <p className="os9-label mb-1">{t('gpaScale')}</p>
            <div className="flex gap-2">
              {['4.0', '4.3', '4.5'].map(s => (
                <label key={s} className="flex items-center gap-1 text-xs cursor-pointer">
                  <input type="radio" name="scale" value={s} checked={scale===s} onChange={() => { setScale(s); setResult(null); }} />
                  {t('scale' + s.replace('.', '_'))}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-2 max-h-64 overflow-y-auto space-y-2">
            {courses.map((c, i) => (
              <div key={i} className="flex gap-1 items-end">
                <div className="flex-1">
                  <p className="text-[10px] mb-0.5" style={{opacity:0.6}}>{t('courseName')}</p>
                  <input className="os9-input !py-1 text-xs" value={c.name} onChange={(e) => updateCourse(i, 'name', e.target.value)} placeholder="Math 101" />
                </div>
                <div style={{width:55}}>
                  <p className="text-[10px] mb-0.5" style={{opacity:0.6}}>{t('credits')}</p>
                  <input className="os9-input !py-1 text-xs" type="number" min="0" max="10" step="0.5" value={c.credits} onChange={(e) => updateCourse(i, 'credits', e.target.value)} />
                </div>
                <div style={{width:60}}>
                  <p className="text-[10px] mb-0.5" style={{opacity:0.6}}>{t('grade')}</p>
                  <select className="os9-select !py-1 text-xs" value={c.grade} onChange={(e) => updateCourse(i, 'grade', e.target.value)}>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <button className="os9-btn !px-2 !py-1 text-xs mt-4" onClick={() => removeCourse(i)} style={{opacity:courses.length>1?1:0.3}} disabled={courses.length<=1}>x</button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <button className="os9-btn !px-3 text-xs" onClick={addCourse}>{t('addCourse')}</button>
            <button className="os9-btn !px-3 text-xs" onClick={clearAll}>{t('clear')}</button>
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculateGpa}>{t('calculate')}</button>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result">
                <p className="text-3xl font-bold text-center" style={{color:'var(--os9-accent)'}}>{result.gpa}</p>
                <p className="text-xs text-center mb-2" style={{opacity:0.6}}>/ {scale}</p>
                <div className="flex justify-between text-xs">
                  <span>{t('totalCredits')}: <strong>{result.totalCredits}</strong></span>
                  <span>{t('totalPoints')}: <strong>{result.totalPoints}</strong></span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:480,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:480,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/grade'} className="underline">Grade</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/average'} className="underline">Average</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline">Percent</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
