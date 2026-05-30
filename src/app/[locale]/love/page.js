'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/love.json';
import esMsgs from '../../../messages/es/love.json';
import zhMsgs from '../../../messages/zh/love.json';
import koMsgs from '../../../messages/ko/love.json';
import ptMsgs from '../../../messages/pt/love.json';
var pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

var ZODIAC_SIGNS = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];

// Zodiac compatibility matrix (0-100) based on traditional astrology
var ZODIAC_MATCH = {
  'Capricorn': { 'Aries': 45, 'Taurus': 85, 'Gemini': 40, 'Cancer': 70, 'Leo': 50, 'Virgo': 90, 'Libra': 55, 'Scorpio': 75, 'Sagittarius': 50, 'Capricorn': 60, 'Aquarius': 65, 'Pisces': 80 },
  'Aquarius': { 'Aries': 85, 'Taurus': 45, 'Gemini': 90, 'Cancer': 40, 'Leo': 75, 'Virgo': 50, 'Libra': 80, 'Scorpio': 55, 'Sagittarius': 70, 'Capricorn': 65, 'Aquarius': 50, 'Pisces': 60 },
  'Pisces': { 'Aries': 70, 'Taurus': 80, 'Gemini': 55, 'Cancer': 90, 'Leo': 45, 'Virgo': 65, 'Libra': 75, 'Scorpio': 85, 'Sagittarius': 50, 'Capricorn': 80, 'Aquarius': 60, 'Pisces': 50 },
  'Aries': { 'Aries': 50, 'Taurus': 60, 'Gemini': 85, 'Cancer': 45, 'Leo': 90, 'Virgo': 40, 'Libra': 75, 'Scorpio': 70, 'Sagittarius': 85, 'Capricorn': 45, 'Aquarius': 85, 'Pisces': 70 },
  'Taurus': { 'Aries': 60, 'Taurus': 50, 'Gemini': 55, 'Cancer': 85, 'Leo': 70, 'Virgo': 90, 'Libra': 45, 'Scorpio': 80, 'Sagittarius': 40, 'Capricorn': 85, 'Aquarius': 45, 'Pisces': 80 },
  'Gemini': { 'Aries': 85, 'Taurus': 55, 'Gemini': 50, 'Cancer': 60, 'Leo': 80, 'Virgo': 45, 'Libra': 90, 'Scorpio': 40, 'Sagittarius': 85, 'Capricorn': 40, 'Aquarius': 90, 'Pisces': 55 },
  'Cancer': { 'Aries': 45, 'Taurus': 85, 'Gemini': 60, 'Cancer': 50, 'Leo': 65, 'Virgo': 75, 'Libra': 55, 'Scorpio': 90, 'Sagittarius': 40, 'Capricorn': 70, 'Aquarius': 40, 'Pisces': 90 },
  'Leo': { 'Aries': 90, 'Taurus': 70, 'Gemini': 80, 'Cancer': 65, 'Leo': 50, 'Virgo': 55, 'Libra': 85, 'Scorpio': 45, 'Sagittarius': 90, 'Capricorn': 50, 'Aquarius': 75, 'Pisces': 45 },
  'Virgo': { 'Aries': 40, 'Taurus': 90, 'Gemini': 45, 'Cancer': 75, 'Leo': 55, 'Virgo': 50, 'Libra': 60, 'Scorpio': 85, 'Sagittarius': 40, 'Capricorn': 90, 'Aquarius': 50, 'Pisces': 65 },
  'Libra': { 'Aries': 75, 'Taurus': 45, 'Gemini': 90, 'Cancer': 55, 'Leo': 85, 'Virgo': 60, 'Libra': 50, 'Scorpio': 65, 'Sagittarius': 80, 'Capricorn': 55, 'Aquarius': 80, 'Pisces': 75 },
  'Scorpio': { 'Aries': 70, 'Taurus': 80, 'Gemini': 40, 'Cancer': 90, 'Leo': 45, 'Virgo': 85, 'Libra': 65, 'Scorpio': 50, 'Sagittarius': 55, 'Capricorn': 75, 'Aquarius': 55, 'Pisces': 85 },
  'Sagittarius': { 'Aries': 85, 'Taurus': 40, 'Gemini': 85, 'Cancer': 40, 'Leo': 90, 'Virgo': 40, 'Libra': 80, 'Scorpio': 55, 'Sagittarius': 50, 'Capricorn': 50, 'Aquarius': 70, 'Pisces': 50 },
};

var MONTH_SIGNS = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];

function hashStr(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function calcLoveScore(name1, name2) {
  var combined = name1.toLowerCase().trim() + name2.toLowerCase().trim();
  var hash = hashStr(combined);
  return (hash % 71) + 15; // 15-85 range, never 0 or 100 for credibility
}

function calcFlames(name1, name2) {
  var n1 = name1.toLowerCase().replace(/[^a-z]/g, '');
  var n2 = name2.toLowerCase().replace(/[^a-z]/g, '');
  var total = n1.length + n2.length;
  // count unique common chars
  var unique = {};
  for (var i = 0; i < n1.length; i++) {
    if (n2.indexOf(n1[i]) !== -1) {
      unique[n1[i]] = true;
    }
  }
  var common = 0;
  for (var k in unique) common++;
  var remaining = total - common * 2;
  if (remaining <= 0) remaining = 1;
  var flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  var idx = (remaining % 6) - 1;
  if (idx < 0) idx = 5;
  return idx; // 0=Friends, 1=Lovers, 2=Affection, 3=Marriage, 4=Enemies, 5=Siblings
}

function getZodiacSign(month) {
  if (!month) return null;
  return MONTH_SIGNS[month]; // month is 1-12 -> index 0-11, but offset... month-1 maps correctly: Jan(1)=Capricorn
  // Actually the cutoff is roughly: Dec22-Jan19=Cap, Jan20-Feb18=Aq, Feb19-Mar20=Pi... 
  // For simplicity use: month-2 (Feb=index0=Aq, etc) with Cap as default for Dec
  // Better: approximate by month
}

function getZodiacByMonth(month) {
  // Month 1-12, approximate zodiac sign
  // 1=Capricorn(Jan), 2=Aquarius(Feb), 3=Pisces(Mar), 4=Aries(Apr), 5=Taurus(May), 6=Gemini(Jun)
  // 7=Cancer(Jul), 8=Leo(Aug), 9=Virgo(Sep), 10=Libra(Oct), 11=Scorpio(Nov), 12=Sagittarius(Dec)
  return ZODIAC_SIGNS[(month % 12)]; // shift so Jan=Capricorn(index0)
}

var FLAME_KEYS = ['friends', 'lovers', 'affection', 'marriage', 'enemies', 'siblings'];

export default function LovePage() {
  var params = useParams();
  var locale = params && params.locale ? params.locale : 'en';
  var t = function(k) { return (pageMsgs[locale] || pageMsgs.en)[k] || k; };
  var changeLang = function(l) { window.location.href = '/' + l + '/love'; };

  var _a = useState('');
  var name1 = _a[0];
  var setName1 = _a[1];

  var _b = useState('');
  var name2 = _b[0];
  var setName2 = _b[1];

  var _c = useState('');
  var month1 = _c[0];
  var setMonth1 = _c[1];

  var _d = useState('');
  var month2 = _d[0];
  var setMonth2 = _d[1];

  var _e = useState(null);
  var result = _e[0];
  var setResult = _e[1];

  var _f = useState(false);
  var copied = _f[0];
  var setCopied = _f[1];

  var calc = function() {
    var n1 = name1.trim();
    var n2 = name2.trim();
    if (!n1 || !n2) { setResult(null); return; }
    
    var score = calcLoveScore(n1, n2);
    var flamesIdx = calcFlames(n1, n2);
    
    var zodiacScore = null;
    var sign1 = null;
    var sign2 = null;
    if (month1 && month2) {
      sign1 = getZodiacByMonth(parseInt(month1));
      sign2 = getZodiacByMonth(parseInt(month2));
      zodiacScore = ZODIAC_MATCH[sign1] ? (ZODIAC_MATCH[sign1][sign2] || 50) : 50;
    }

    setResult({
      score: score,
      flamesIdx: flamesIdx,
      flamesKey: FLAME_KEYS[flamesIdx],
      zodiacScore: zodiacScore,
      sign1: sign1,
      sign2: sign2,
      name1: n1,
      name2: n2,
    });
  };

  var share = function() {
    if (!result) return;
    var text;
    if (result.zodiacScore !== null) {
      text = t('shareZodiacText')
        .replace('{name1}', result.name1)
        .replace('{name2}', result.name2)
        .replace('{score}', result.score)
        .replace('{s1}', result.sign1)
        .replace('{s2}', result.sign2)
        .replace('{zodiac}', result.zodiacScore);
    } else {
      text = t('shareText')
        .replace('{name1}', result.name1)
        .replace('{name2}', result.name2)
        .replace('{score}', result.score);
    }
    text += ' https://oxoxox1.com/' + locale + '/love';

    // Try native share first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: t('title'), text: text, url: 'https://oxoxox1.com/' + locale + '/love' })
        .catch(function() {});
    } else {
      // Fallback: copy to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          setCopied(true);
          setTimeout(function() { setCopied(false); }, 2000);
        }).catch(function() {});
      }
    }
  };

  var clear = function() {
    setName1('');
    setName2('');
    setMonth1('');
    setMonth2('');
    setResult(null);
    setCopied(false);
  };

  var MONTHS = [
    { v: '1', l: t('jan') },
    { v: '2', l: t('feb') },
    { v: '3', l: t('mar') },
    { v: '4', l: t('apr') },
    { v: '5', l: t('may') },
    { v: '6', l: t('jun') },
    { v: '7', l: t('jul') },
    { v: '8', l: t('aug') },
    { v: '9', l: t('sep') },
    { v: '10', l: t('oct') },
    { v: '11', l: t('nov') },
    { v: '12', l: t('dec') },
  ];

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

          {/* Name 1 */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('yourName')}</label>
            <input className="os9-input w-full" type="text" value={name1}
              onChange={function(e) { setName1(e.target.value); setResult(null); }}
              placeholder="" autoComplete="off" maxLength="30" />
          </div>

          {/* Name 2 */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('crushName')}</label>
            <input className="os9-input w-full" type="text" value={name2}
              onChange={function(e) { setName2(e.target.value); setResult(null); }}
              placeholder="" autoComplete="off" maxLength="30" />
          </div>

          {/* Zodiac (optional) */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('zodiacOptional')}</label>
            <div className="flex gap-2">
              <select className="os9-select flex-1 text-sm" value={month1} onChange={function(e) { setMonth1(e.target.value); setResult(null); }}>
                <option value="">{t('month')}</option>
                {MONTHS.map(function(m) { return <option key={m.v} value={m.v}>{m.l}</option>; })}
              </select>
              <select className="os9-select flex-1 text-sm" value={month2} onChange={function(e) { setMonth2(e.target.value); setResult(null); }}>
                <option value="">{t('month')}</option>
                {MONTHS.map(function(m) { return <option key={m.v} value={m.v}>{m.l}</option>; })}
              </select>
            </div>
          </div>

          {/* Calculate */}
          <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result ? (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              {/* Love Score */}
              <div className="text-center mb-3">
                <div className="text-xs uppercase tracking-wider mb-1" style={{ opacity: 0.6 }}>{t('loveScore')}</div>
                <div style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--os9-red)', lineHeight: 1.1 }}>{result.score}%</div>
              </div>

              {/* FLAMES */}
              <div className="text-center mb-3">
                <div className="text-xs uppercase tracking-wider mb-1" style={{ opacity: 0.6 }}>{t('flamesResult')}</div>
                <div className="inline-block px-3 py-1 text-sm font-bold rounded-sm"
                  style={{ background: 'var(--os9-bg)', border: '1px solid var(--os9-accent)' }}>
                  {t(result.flamesKey)}
                </div>
              </div>

              {/* Zodiac */}
              {result.zodiacScore !== null ? (
                <div className="text-center mb-3 pt-2" style={{ borderTop: '1px solid var(--os9-border)' }}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ opacity: 0.6 }}>{t('zodiacMatch')}</div>
                  <div className="text-xs" style={{ opacity: 0.8 }}>{result.sign1} + {result.sign2}</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#22aa22', lineHeight: 1.2 }}>{result.zodiacScore}%</div>
                </div>
              ) : null}

              {/* Share */}
              <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid var(--os9-border)' }}>
                <button className="os9-btn !px-4 text-sm" onClick={share}>
                  {copied ? t('copied') : t('share')}
                </button>
                <p className="text-[10px] mt-1" style={{ opacity: 0.4 }}>{t('shareVia')}</p>
              </div>
            </div>
          ) : null}

          {/* Clear */}
          <div className="text-center mt-3 mb-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }} onClick={clear}>{t('clear')}</button>
          </div>

          {/* SEO Description */}
          <div className="mt-3 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={'/' + locale + '/age'} className="underline">Age Calculator</a>
                <a href={'/' + locale + '/petage'} className="underline">Pet Age Calculator</a>
                <a href={'/' + locale + '/lotto'} className="underline">Lotto Number Generator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 440, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/love'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Love</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}