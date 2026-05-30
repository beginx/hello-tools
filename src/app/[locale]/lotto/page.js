'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/lotto.json';
import esMsgs from '../../../messages/es/lotto.json';
import zhMsgs from '../../../messages/zh/lotto.json';
import koMsgs from '../../../messages/ko/lotto.json';
import ptMsgs from '../../../messages/pt/lotto.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const PRESETS = {
  powerball:  { mainCount: 5, mainMax: 69, bonusCount: 1, bonusMax: 26, key: 'powerball' },
  megamillions: { mainCount: 5, mainMax: 70, bonusCount: 1, bonusMax: 25, key: 'megamillions' },
  euromillions: { mainCount: 5, mainMax: 50, bonusCount: 2, bonusMax: 12, key: 'euromillions' },
  uklotto:    { mainCount: 6, mainMax: 59, bonusCount: 0, bonusMax: 0, key: 'uklotto' },
};

function drawNumbers(max, count) {
  const pool = [];
  for (let i = 1; i <= max; i++) pool.push(i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

function generateDraws(mainCount, mainMax, bonusCount, bonusMax, draws) {
  const result = [];
  for (let d = 0; d < draws; d++) {
    const mains = drawNumbers(mainMax, mainCount);
    const bonuses = bonusCount > 0 ? drawNumbers(bonusMax, bonusCount) : [];
    result.push({ mains, bonuses });
  }
  return result;
}

export default function LottoPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/lotto'; };

  const [preset, setPreset] = useState('powerball');
  const [customMC, setCustomMC] = useState('5');
  const [customMM, setCustomMM] = useState('69');
  const [customBC, setCustomBC] = useState('1');
  const [customBM, setCustomBM] = useState('26');
  const [drawCount, setDrawCount] = useState('5');
  const [results, setResults] = useState(null);

  const isCustom = preset === 'custom';

  const gen = useCallback(() => {
    let mainCount, mainMax, bonusCount, bonusMax;
    if (isCustom) {
      mainCount = parseInt(customMC) || 5;
      mainMax = parseInt(customMM) || 69;
      bonusCount = parseInt(customBC) || 0;
      bonusMax = parseInt(customBM) || 0;
    } else {
      const p = PRESETS[preset];
      mainCount = p.mainCount;
      mainMax = p.mainMax;
      bonusCount = p.bonusCount;
      bonusMax = p.bonusMax;
    }
    const draws = Math.min(Math.max(parseInt(drawCount) || 1, 1), 20);
    setResults(generateDraws(mainCount, mainMax, bonusCount, bonusMax, draws));
  }, [preset, customMC, customMM, customBC, customBM, drawCount, isCustom]);

  const handleClear = () => setResults(null);

  const presetInfo = !isCustom ? PRESETS[preset] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
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
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Preset */}
          <div className="mb-3">
            <label className="os9-label">{t('preset')}</label>
            <select className="os9-select" value={preset} onChange={(e) => setPreset(e.target.value)}>
              <option value="powerball">{t('powerball')} — {t('powerballDesc')}</option>
              <option value="megamillions">{t('megamillions')} — {t('megamillionsDesc')}</option>
              <option value="euromillions">{t('euromillions')} — {t('euromillionsDesc')}</option>
              <option value="uklotto">{t('uklotto')} — {t('uklottoDesc')}</option>
              <option value="custom">{t('custom')}</option>
            </select>
          </div>

          {/* Preset Info */}
          {presetInfo && !isCustom && (
            <div className="os9-result mb-3 text-center text-sm" style={{ opacity: 0.7 }}>
              {t(presetInfo.key + 'Desc')}
            </div>
          )}

          {/* Custom Settings */}
          {isCustom && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="os9-label">{t('mainNumbers')}</label>
                <input className="os9-input" type="number" min={1} max={20} value={customMC}
                  onChange={(e) => setCustomMC(e.target.value)} placeholder="5" />
              </div>
              <div>
                <label className="os9-label">{t('totalNumbers')} (max)</label>
                <input className="os9-input" type="number" min={1} max={99} value={customMM}
                  onChange={(e) => setCustomMM(e.target.value)} placeholder="69" />
              </div>
              <div>
                <label className="os9-label">{t('bonusNumber')} (count)</label>
                <input className="os9-input" type="number" min={0} max={5} value={customBC}
                  onChange={(e) => setCustomBC(e.target.value)} placeholder="1" />
              </div>
              <div>
                <label className="os9-label">{t('bonusNumber')} (max)</label>
                <input className="os9-input" type="number" min={1} max={99} value={customBM}
                  onChange={(e) => setCustomBM(e.target.value)} placeholder="26" />
              </div>
            </div>
          )}

          {/* Draws */}
          <div className="mb-4">
            <label className="os9-label">{t('draws')}</label>
            <input className="os9-input" type="number" min={1} max={20} value={drawCount}
              onChange={(e) => setDrawCount(e.target.value)} placeholder="5" />
          </div>

          <div className="flex gap-2">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={gen}>
              {t('generate')}
            </button>
            {results && (
              <button className="os9-btn !px-4" onClick={handleClear}>{t('clear')}</button>
            )}
          </div>

          {/* Results */}
          {results && (
            <div className="mt-5">
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('yourNumbers')}</p>
              {results.map((draw, idx) => (
                <div key={idx} className="os9-result mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold min-w-[24px]" style={{ opacity: 0.5 }}>#{idx + 1}</span>
                  <span className="flex flex-wrap gap-1">
                    {draw.mains.map((n, i) => (
                      <span key={i} className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                        style={{ background: 'var(--os9-accent)', color: 'white' }}>
                        {n}
                      </span>
                    ))}
                  </span>
                  {draw.bonuses.length > 0 && (
                    <span className="flex items-center gap-1 ml-1">
                      <span className="text-xs" style={{ opacity: 0.6 }}>★</span>
                      {draw.bonuses.map((n, i) => (
                        <span key={i} className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                          style={{ background: '#cc8800', color: 'white' }}>
                          {n}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              ))}
              <p className="text-[10px] mt-2 text-center" style={{ opacity: 0.4 }}>{t('disclaimer')}</p>
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/random`} className="underline">Random Generator</a>
                <a href={`/${locale}/password`} className="underline">Password Generator</a>
                <a href={`/${locale}/qr`} className="underline">QR Code Generator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo Editor</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline" style={{ opacity: 0.7 }}>Lotto</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/pdf'} className="underline" style={{ opacity: 0.7 }}>PDF</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/text'} className="underline" style={{ opacity: 0.7 }}>Text</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}