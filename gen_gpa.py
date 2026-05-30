import json, os

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']

MSGS = {
    'en': {
        "title": "GPA Calculator",
        "subtitle": "Calculate your Grade Point Average",
        "courseName": "Course Name",
        "credits": "Credits",
        "grade": "Grade",
        "addCourse": "Add Course",
        "calculate": "Calculate GPA",
        "results": "Your GPA",
        "totalCredits": "Total Credits",
        "totalPoints": "Total Points",
        "gpaScale": "GPA Scale",
        "scale4_0": "4.0 Scale",
        "scale4_3": "4.3 Scale",
        "scale4_5": "4.5 Scale",
        "clear": "Clear All",
        "seoDescription": "Free online GPA calculator: calculate your Grade Point Average on 4.0, 4.3, or 4.5 scale. Add courses with custom names, credits, and letter grades. Perfect for college and university students. Mac OS 9 retro style."
    },
    'es': {
        "title": "Calculadora de GPA",
        "subtitle": "Calcule su Promedio de Calificaciones",
        "courseName": "Nombre del Curso",
        "credits": "Cr\u00e9ditos",
        "grade": "Nota",
        "addCourse": "Agregar Curso",
        "calculate": "Calcular GPA",
        "results": "Su GPA",
        "totalCredits": "Total Cr\u00e9ditos",
        "totalPoints": "Total Puntos",
        "gpaScale": "Escala GPA",
        "scale4_0": "Escala 4.0",
        "scale4_3": "Escala 4.3",
        "scale4_5": "Escala 4.5",
        "clear": "Limpiar Todo",
        "seoDescription": "Calculadora de GPA gratuita: calcule su promedio de calificaciones en escala 4.0, 4.3 o 4.5. Perfecta para estudiantes universitarios. Estilo retro Mac OS 9."
    },
    'zh': {
        "title": "GPA\u8ba1\u7b97\u5668",
        "subtitle": "\u8ba1\u7b97\u60a8\u7684\u5e73\u5747\u5b66\u5206\u79ef\u70b9",
        "courseName": "\u8bfe\u7a0b\u540d\u79f0",
        "credits": "\u5b66\u5206",
        "grade": "\u6210\u7ee9",
        "addCourse": "\u6dfb\u52a0\u8bfe\u7a0b",
        "calculate": "\u8ba1\u7b97GPA",
        "results": "\u60a8\u7684GPA",
        "totalCredits": "\u603b\u5b66\u5206",
        "totalPoints": "\u603b\u79ef\u70b9",
        "gpaScale": "GPA\u6807\u5ea6",
        "scale4_0": "4.0\u6807\u5ea6",
        "scale4_3": "4.3\u6807\u5ea6",
        "scale4_5": "4.5\u6807\u5ea6",
        "clear": "\u6e05\u9664\u5168\u90e8",
        "seoDescription": "\u514d\u8d39\u5728\u7ebfGPA\u8ba1\u7b97\u5668\uff1a\u57284.0\u30014.3\u62164.5\u6807\u5ea6\u4e0a\u8ba1\u7b97\u60a8\u7684\u5e73\u5747\u5b66\u5206\u79ef\u70b9\u3002\u9002\u5408\u5927\u5b66\u751f\u4f7f\u7528\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002"
    },
    'ko': {
        "title": "GPA \uacc4\uc0b0\uae30",
        "subtitle": "\ud559\uc810 \ud3c9\uade0\uc810\uc744 \uacc4\uc0b0\ud558\uc138\uc694",
        "courseName": "\uacfc\ubaa9\uba85",
        "credits": "\ud559\uc810",
        "grade": "\uc131\uc801",
        "addCourse": "\uacfc\ubaa9 \ucd94\uac00",
        "calculate": "GPA \uacc4\uc0b0",
        "results": "\ub2f9\uc2e0\uc758 GPA",
        "totalCredits": "\ucd1d \ud559\uc810",
        "totalPoints": "\ucd1d \ud3c9\uc810",
        "gpaScale": "GPA \uc2a4\ucf00\uc77c",
        "scale4_0": "4.0 \uc2a4\ucf00\uc77c",
        "scale4_3": "4.3 \uc2a4\ucf00\uc77c",
        "scale4_5": "4.5 \uc2a4\ucf00\uc77c",
        "clear": "\uc804\uccb4 \uc9c0\uc6b0\uae30",
        "seoDescription": "\ubb34\ub8cc GPA \uacc4\uc0b0\uae30: 4.0, 4.3, 4.5 \uc2a4\ucf00\uc77c\uc5d0\uc11c \ud559\uc810 \ud3c9\uade0\uc810\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \uacfc\ubaa9\uba85, \ud559\uc810, \uc131\uc801\uc744 \uc785\ub825\ud558\uc138\uc694. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c."
    },
    'pt': {
        "title": "Calculadora de GPA",
        "subtitle": "Calcule sua M\u00e9dia de Notas",
        "courseName": "Nome do Curso",
        "credits": "Cr\u00e9ditos",
        "grade": "Nota",
        "addCourse": "Adicionar Curso",
        "calculate": "Calcular GPA",
        "results": "Seu GPA",
        "totalCredits": "Total de Cr\u00e9ditos",
        "totalPoints": "Total de Pontos",
        "gpaScale": "Escala GPA",
        "scale4_0": "Escala 4.0",
        "scale4_3": "Escala 4.3",
        "scale4_5": "Escala 4.5",
        "clear": "Limpar Tudo",
        "seoDescription": "Calculadora de GPA gratuita: calcule sua m\u00e9dia de notas nas escalas 4.0, 4.3 ou 4.5. Perfeita para estudantes universit\u00e1rios. Estilo retro Mac OS 9."
    }
}

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
MSGS_DIR = os.path.join(BASE, 'src', 'messages')

for loc in LOCALES:
    path = os.path.join(MSGS_DIR, loc, 'gpa.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(MSGS[loc], f, ensure_ascii=False)
    print(f'Created: {path}')

# GPA page.js
PAGE_JS = """'use client';

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
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
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
"""

PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]', 'gpa')
os.makedirs(PAGES_DIR, exist_ok=True)
path = os.path.join(PAGES_DIR, 'page.js')
with open(path, 'w', encoding='utf-8') as f:
    f.write(PAGE_JS)
print(f'Created: {path}')

print('\nDone!')