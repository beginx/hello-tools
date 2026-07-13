'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/mbti.json';
import esMsgs from '../../../messages/es/mbti.json';
import zhMsgs from '../../../messages/zh/mbti.json';
import koMsgs from '../../../messages/ko/mbti.json';
import ptMsgs from '../../../messages/pt/mbti.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function MbtiPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/mbti'; };
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const questions = [
    { q: "You prefer working alone or in a small group rather than a large group.", options: ["Agree", "Disagree"] },
    { q: "You make decisions based on logic and facts, not feelings.", options: ["Agree", "Disagree"] },
    { q: "You prefer a structured schedule over going with the flow.", options: ["Agree", "Disagree"] },
    { q: "You enjoy abstract ideas and theories more than concrete facts.", options: ["Agree", "Disagree"] },
    { q: "You feel energized after social interactions.", options: ["Agree", "Disagree"] },
    { q: "You value harmony and tact more than blunt honesty.", options: ["Agree", "Disagree"] },
    { q: "You prefer to plan ahead rather than be spontaneous.", options: ["Agree", "Disagree"] },
    { q: "You focus more on the present reality than future possibilities.", options: ["Agree", "Disagree"] }
  ];

  const resultType = (() => {
    if (step <= questions.length) return "";
    let E = 0, S = 0, T = 0, J = 0;
    if (answers[4] === "Agree") E++; else S++;
    if (answers[7] === "Agree") S++; else E++;
    if (answers[1] === "Agree") T++; else T++;
    if (answers[5] === "Agree") T++; else T++;
    if (answers[2] === "Agree") J++; else J++;
    if (answers[6] === "Agree") J++; else J++;
    if (answers[0] === "Agree") S++; else E++;
    if (answers[3] === "Agree") E++; else S++;
    return (E > 4 ? "E" : "I") + (S > 4 ? "S" : "N") + (T > 4 ? "T" : "F") + (J > 4 ? "J" : "P");
  })();

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
          {step === 0 ? (
                      <div className="text-center">
                        <button className="os9-btn os9-btn-primary" onClick={() => setStep(1)}>{t('start') || 'Start Test'}</button>
                      </div>
                    ) : step <= questions.length ? (
                      <div>
                        <div className="text-xs mb-2" style={{ opacity: 0.6 }}>{t('question') || 'Question'} {step}/{questions.length}</div>
                        <p className="text-sm mb-4 font-bold">{questions[step-1].q}</p>
                        <div className="flex flex-col gap-2">
                          {questions[step-1].options.map((opt, i) => (
                            <button key={i} className="os9-btn" onClick={() => { const a = [...answers]; a[step-1] = opt; setAnswers(a); setStep(step+1); }}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="os9-big-number" style={{ fontSize: '2rem' }}>{resultType}</div>
                        <div className="text-sm mt-2 mb-3">{t('result') || 'Your personality type'}</div>
                        <button className="os9-btn" onClick={() => { setStep(0); setAnswers([]); }}>{t('restart') || 'Restart'}</button>
                      </div>
                    )}
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