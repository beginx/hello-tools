'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/petage.json';
import esMsgs from '../../../messages/es/petage.json';
import zhMsgs from '../../../messages/zh/petage.json';
import koMsgs from '../../../messages/ko/petage.json';
import ptMsgs from '../../../messages/pt/petage.json';
var pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function calcDogHumanAge(years, months, size) {
  // AVMA size-adjusted formula
  // Year 1 = 15, Year 2 = +9 (cumulative 24)
  // Year 3+: small=+4, medium=+5, large=+6, giant=+7 per year
  var totalYears = years + months / 12;
  if (totalYears <= 0) return null;
  var extraYears = totalYears - 2;
  if (extraYears < 0) extraYears = 0;
  var perYear = { small: 4, medium: 5, large: 6, giant: 7 }[size] || 5;
  var human = 24 + extraYears * perYear;
  if (totalYears < 1) {
    human = totalYears * 15;
  } else if (totalYears < 2) {
    human = 15 + (totalYears - 1) * 9;
  }
  return Math.round(human);
}

function calcCatHumanAge(years, months) {
  // Cat: Year 1 = 15, Year 2 = +9, Year 3+ = +4 each
  var totalYears = years + months / 12;
  if (totalYears <= 0) return null;
  if (totalYears < 1) return Math.round(totalYears * 15);
  if (totalYears < 2) return Math.round(15 + (totalYears - 1) * 9);
  return Math.round(24 + (totalYears - 2) * 4);
}

function getLifeStage(species, humanAge) {
  if (species === 'dog') {
    if (humanAge < 3) return 'puppyKitten';
    if (humanAge < 10) return 'youngAdult';
    if (humanAge < 18) return 'adult';
    if (humanAge < 30) return 'mature';
    if (humanAge < 45) return 'senior';
    return 'geriatric';
  } else {
    if (humanAge < 3) return 'puppyKitten';
    if (humanAge < 10) return 'youngAdult';
    if (humanAge < 20) return 'adult';
    if (humanAge < 35) return 'mature';
    if (humanAge < 55) return 'senior';
    return 'geriatric';
  }
}

export default function PetAgePage() {
  var params = useParams();
  var locale = params && params.locale ? params.locale : 'en';
  var t = function(k) { return (pageMsgs[locale] || pageMsgs.en)[k] || k; };
  var changeLang = function(l) { window.location.href = '/' + l + '/petage'; };

  var _a = useState('dog');
  var species = _a[0];
  var setSpecies = _a[1];

  var _b = useState('');
  var years = _b[0];
  var setYears = _b[1];

  var _c = useState('0');
  var months = _c[0];
  var setMonths = _c[1];

  var _d = useState('medium');
  var size = _d[0];
  var setSize = _d[1];

  var _e = useState(null);
  var result = _e[0];
  var setResult = _e[1];

  var calc = function() {
    var y = parseFloat(years) || 0;
    var m = parseFloat(months) || 0;
    if (y <= 0 && m <= 0) { setResult(null); return; }
    if (y > 30) { setResult(null); return; }
    var humanAge;
    if (species === 'dog') {
      humanAge = calcDogHumanAge(y, m, size);
    } else {
      humanAge = calcCatHumanAge(y, m);
    }
    if (humanAge === null) { setResult(null); return; }
    var stage = getLifeStage(species, humanAge);
    setResult({ humanAge: humanAge, stage: stage });
  };

  var clear = function() {
    setYears('');
    setMonths('0');
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 440, width: '100%' }}>
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
            <select className="os9-select !w-auto text-sm" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Species */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('species')}</label>
            <div className="flex gap-2">
              <button className={'os9-btn flex-1 text-sm ' + (species === 'dog' ? 'os9-btn-primary' : '')} onClick={function() { setSpecies('dog'); setResult(null); }}>{t('dog')}</button>
              <button className={'os9-btn flex-1 text-sm ' + (species === 'cat' ? 'os9-btn-primary' : '')} onClick={function() { setSpecies('cat'); setResult(null); }}>{t('cat')}</button>
            </div>
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('ageYears')}</label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input className="os9-input w-full text-center" type="number" min="0" max="30" step="0.5"
                  value={years} onChange={function(e) { setYears(e.target.value); setResult(null); }}
                  placeholder="5" style={{ fontSize: 16, padding: '10px 4px' }} />
              </div>
              <div style={{ width: 80 }}>
                <select className="os9-select w-full text-center" value={months}
                  onChange={function(e) { setMonths(e.target.value); setResult(null); }}
                  style={{ fontSize: 14, padding: '10px 4px' }}>
                  <option value="0">0 {t('months')}</option>
                  <option value="1">1 {t('months')}</option>
                  <option value="2">2 {t('months')}</option>
                  <option value="3">3 {t('months')}</option>
                  <option value="4">4 {t('months')}</option>
                  <option value="5">5 {t('months')}</option>
                  <option value="6">6 {t('months')}</option>
                  <option value="7">7 {t('months')}</option>
                  <option value="8">8 {t('months')}</option>
                  <option value="9">9 {t('months')}</option>
                  <option value="10">10 {t('months')}</option>
                  <option value="11">11 {t('months')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Breed Size (dog only) */}
          {species === 'dog' ? (
            <div className="mb-4">
              <label className="os9-label block text-xs mb-1">{t('size')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button className={'os9-btn text-xs ' + (size === 'small' ? 'os9-btn-primary' : '')} onClick={function() { setSize('small'); setResult(null); }}>{t('small')}</button>
                <button className={'os9-btn text-xs ' + (size === 'medium' ? 'os9-btn-primary' : '')} onClick={function() { setSize('medium'); setResult(null); }}>{t('medium')}</button>
                <button className={'os9-btn text-xs ' + (size === 'large' ? 'os9-btn-primary' : '')} onClick={function() { setSize('large'); setResult(null); }}>{t('large')}</button>
                <button className={'os9-btn text-xs ' + (size === 'giant' ? 'os9-btn-primary' : '')} onClick={function() { setSize('giant'); setResult(null); }}>{t('giant')}</button>
              </div>
            </div>
          ) : null}

          {/* Calculate */}
          <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result ? (
            <div className="os9-result text-center" style={{ padding: '16px 12px' }}>
              <div className="text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.6 }}>{t('humanAge')}</div>
              <div style={{ fontSize: 40, fontWeight: 'bold', color: 'var(--os9-red)', lineHeight: 1.1 }}>{result.humanAge}</div>
              <div className="text-xs mt-1" style={{ opacity: 0.6 }}>{t('years')}</div>
              <div className="mt-3 inline-block px-3 py-1 text-xs font-bold rounded-sm"
                style={{ background: 'var(--os9-bg)', border: '1px solid var(--os9-accent)' }}>
                {t('lifeStage')}: {t(result.stage)}
              </div>
            </div>
          ) : null}

          {/* Clear */}
          <div className="text-center mt-3 mb-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }} onClick={clear}>{t('clear')}</button>
          </div>

          {/* Note */}
          <div className="mt-3 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.55 }}>{t('note')}</p>
          </div>

          {/* SEO Description */}
          <div className="mt-3 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={'/' + locale + '/age'} className="underline">Age Calculator</a>
                <a href={'/' + locale + '/bmi'} className="underline">BMI Calculator</a>
                <a href={'/' + locale + '/idealweight'} className="underline">Ideal Weight Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 440, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/petage'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Pet Age</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}