import json, os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'

MSGS = {
    'en': {
        "title": "Investment Calculator",
        "subtitle": "Project Your Investment Growth",
        "initial": "Initial Investment",
        "monthly": "Monthly Contribution",
        "rate": "Expected Annual Return (%)",
        "years": "Investment Period (Years)",
        "futureValue": "Future Value",
        "totalInterest": "Total Return",
        "totalContributions": "Total Contributions",
        "calculate": "Calculate Investment",
        "clear": "Clear All",
        "error": "Please enter valid numbers",
        "placeholderInitial": "e.g. 10000",
        "placeholderMonthly": "e.g. 500",
        "placeholderRate": "e.g. 8",
        "placeholderYears": "e.g. 10",
        "yearTable": "Year",
        "depositTable": "Contributions",
        "interestTable": "Return",
        "balanceTable": "Balance",
        "seoDescription": "Free online investment calculator: project how your investments grow over time. Enter initial amount, monthly contributions, expected return rate, and time horizon. See year-by-year growth with detailed breakdown. Perfect for retirement planning, wealth building, and financial goal setting. Mac OS 9 retro style."
    },
    'es': {
        "title": "Calculadora de Inversi\u00f3n",
        "subtitle": "Proyecte el Crecimiento de su Inversi\u00f3n",
        "initial": "Inversi\u00f3n Inicial",
        "monthly": "Aporte Mensual",
        "rate": "Rendimiento Anual Esperado (%)",
        "years": "Per\u00edodo de Inversi\u00f3n (A\u00f1os)",
        "futureValue": "Valor Futuro",
        "totalInterest": "Rendimiento Total",
        "totalContributions": "Aportes Totales",
        "calculate": "Calcular Inversi\u00f3n",
        "clear": "Limpiar Todo",
        "error": "Ingrese n\u00fameros v\u00e1lidos",
        "placeholderInitial": "Ej. 10000",
        "placeholderMonthly": "Ej. 500",
        "placeholderRate": "Ej. 8",
        "placeholderYears": "Ej. 10",
        "yearTable": "A\u00f1o",
        "depositTable": "Aportes",
        "interestTable": "Rendimiento",
        "balanceTable": "Saldo",
        "seoDescription": "Calculadora de inversi\u00f3n gratuita: proyecte el crecimiento de sus inversiones. Perfecta para planificaci\u00f3n de jubilaci\u00f3n y objetivos financieros. Estilo retro Mac OS 9."
    },
    'zh': {
        "title": "\u6295\u8d44\u8ba1\u7b97\u5668",
        "subtitle": "\u9884\u6d4b\u60a8\u7684\u6295\u8d44\u589e\u957f",
        "initial": "\u521d\u59cb\u6295\u8d44\u989d",
        "monthly": "\u6bcf\u6708\u5b9a\u6295",
        "rate": "\u9884\u671f\u5e74\u5316\u6536\u76ca\u7387 (%)",
        "years": "\u6295\u8d44\u5468\u671f (\u5e74)",
        "futureValue": "\u672a\u6765\u4ef7\u503c",
        "totalInterest": "\u603b\u6536\u76ca",
        "totalContributions": "\u603b\u6295\u5165",
        "calculate": "\u8ba1\u7b97\u6295\u8d44",
        "clear": "\u6e05\u9664\u5168\u90e8",
        "error": "\u8bf7\u8f93\u5165\u6709\u6548\u6570\u5b57",
        "placeholderInitial": "\u4f8b\u5982 10000",
        "placeholderMonthly": "\u4f8b\u5982 500",
        "placeholderRate": "\u4f8b\u5982 8",
        "placeholderYears": "\u4f8b\u5982 10",
        "yearTable": "\u5e74\u4efd",
        "depositTable": "\u6295\u5165",
        "interestTable": "\u6536\u76ca",
        "balanceTable": "\u4f59\u989d",
        "seoDescription": "\u514d\u8d39\u5728\u7ebf\u6295\u8d44\u8ba1\u7b97\u5668\uff1a\u9884\u6d4b\u60a8\u7684\u6295\u8d44\u589e\u957f\u3002\u9002\u5408\u9000\u4f11\u89c4\u5212\u548c\u8d22\u5bcc\u7d2f\u79ef\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002"
    },
    'ko': {
        "title": "\ud22c\uc790 \uacc4\uc0b0\uae30",
        "subtitle": "\ud22c\uc790 \uc218\uc775\ub960\uc744 \uc608\uce21\ud558\uc138\uc694",
        "initial": "\ucd08\uae30 \ud22c\uc790\uae08",
        "monthly": "\uc6d4 \uc801\ub9bd\uae08",
        "rate": "\uae30\ub300 \uc5f0 \uc218\uc775\ub960 (%)",
        "years": "\ud22c\uc790 \uae30\uac04 (\ub144)",
        "futureValue": "\ubbf8\ub798 \uac00\uce58",
        "totalInterest": "\ucd1d \uc218\uc775",
        "totalContributions": "\ucd1d \ud22c\uc785\uae08",
        "calculate": "\ud22c\uc790 \uacc4\uc0b0",
        "clear": "\uc804\uccb4 \uc9c0\uc6b0\uae30",
        "error": "\uc720\ud6a8\ud55c \uc22b\uc790\ub97c \uc785\ub825\ud558\uc138\uc694",
        "placeholderInitial": "\uc608) 10,000,000",
        "placeholderMonthly": "\uc608) 500,000",
        "placeholderRate": "\uc608) 8",
        "placeholderYears": "\uc608) 10",
        "yearTable": "\ub144\ub3c4",
        "depositTable": "\ud22c\uc785",
        "interestTable": "\uc218\uc775",
        "balanceTable": "\uc794\uc561",
        "seoDescription": "\ubb34\ub8cc \ud22c\uc790 \uacc4\uc0b0\uae30: \ucd08\uae30 \ud22c\uc790\uae08, \uc6d4 \uc801\ub9bd\uae08, \uae30\ub300 \uc218\uc775\ub960, \ud22c\uc790 \uae30\uac04\uc744 \uc785\ub825\ud558\uc5ec \ubbf8\ub798 \uac00\uce58\uc640 \uc218\uc775\ub960\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \uc5f0\ub3c4\ubcc4 \ubd84\uc11d \ud3ec\ud568. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c."
    },
    'pt': {
        "title": "Calculadora de Investimento",
        "subtitle": "Projete o Crescimento do seu Investimento",
        "initial": "Investimento Inicial",
        "monthly": "Contribui\u00e7\u00e3o Mensal",
        "rate": "Retorno Anual Esperado (%)",
        "years": "Per\u00edodo de Investimento (Anos)",
        "futureValue": "Valor Futuro",
        "totalInterest": "Retorno Total",
        "totalContributions": "Contribui\u00e7\u00f5es Totais",
        "calculate": "Calcular Investimento",
        "clear": "Limpar Tudo",
        "error": "Insira n\u00fameros v\u00e1lidos",
        "placeholderInitial": "Ex. 10000",
        "placeholderMonthly": "Ex. 500",
        "placeholderRate": "Ex. 8",
        "placeholderYears": "Ex. 10",
        "yearTable": "Ano",
        "depositTable": "Contribui\u00e7\u00f5es",
        "interestTable": "Retorno",
        "balanceTable": "Saldo",
        "seoDescription": "Calculadora de investimento gratuita: projete o crescimento dos seus investimentos. Perfeita para planejamento de aposentadoria e metas financeiras. Estilo retro Mac OS 9."
    }
}

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
MSGS_DIR = os.path.join(BASE, 'src', 'messages')

for loc in LOCALES:
    path = os.path.join(MSGS_DIR, loc, 'investment.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(MSGS[loc], f, ensure_ascii=False)
    print(f'Created: {path}')

# Investment page.js (based on compound page.js)
PAGE_JS = '''// \ud22c\uc790 \uc218\uc775\ub960\uc744 \uacc4\uc0b0\ud558\ub294 \uceec\ud050\ub808\uc774\ud130 \ud398\uc774\uc9c0
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/investment.json';
import esMsgs from '../../../messages/es/investment.json';
import zhMsgs from '../../../messages/zh/investment.json';
import koMsgs from '../../../messages/ko/investment.json';
import ptMsgs from '../../../messages/pt/investment.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function InvestmentPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/investment'; };
  const fmt = (n) => {
    if (locale === 'ko') return '\\u20a9' + Math.round(n).toLocaleString('ko-KR');
    if (locale === 'es' || locale === 'pt') {
      const opts = { style: 'currency', currency: locale === 'es' ? 'EUR' : 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 };
      return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'pt-BR', opts).format(n);
    }
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const calc = () => {
    const p = parseFloat(initial) || 0;
    const m = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    if (t <= 0) { setResult(null); setShowTable(true); return; }

    const n = 12;
    const ratePerPeriod = r / n;
    const totalPeriods = t * n;

    let fvLumpSum = 0;
    if (p > 0) fvLumpSum = p * Math.pow(1 + ratePerPeriod, totalPeriods);
    let fvContributions = 0;
    if (m > 0 && r > 0) fvContributions = m * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
    else if (m > 0 && r === 0) fvContributions = m * totalPeriods;
    const futureValue = fvLumpSum + fvContributions;
    const totalContribs = p + m * totalPeriods;
    const totalInt = Math.max(0, futureValue - totalContribs);

    // Year-by-year
    const yearly = [];
    let bal = p;
    let cumContribs = p;
    for (let y = 1; y <= t; y++) {
      const startBal = bal;
      const yearDeposits = m * 12;
      cumContribs += yearDeposits;
      for (let mo = 0; mo < 12; mo++) {
        if (r > 0) bal = bal * (1 + ratePerPeriod) + m;
        else bal = bal + m;
      }
      if (r === 0) bal = cumContribs;
      const yearReturn = bal - startBal - yearDeposits;
      yearly.push({
        year: y,
        deposits: Math.round(yearDeposits * 100) / 100,
        interest: Math.round(yearReturn * 100) / 100,
        balance: Math.round(bal * 100) / 100,
      });
    }

    setResult({
      futureValue: Math.round(futureValue * 100) / 100,
      totalInterest: Math.round(totalInt * 100) / 100,
      totalContributions: Math.round(totalContribs * 100) / 100,
      yearly,
    });
    setShowTable(true);
  };

  const clearAll = () => {
    setInitial(''); setMonthly(''); setRate(''); setYears('');
    setResult(null); setShowTable(false);
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
          {/* Language selector */}
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\\u00f1ol</option>
              <option value="zh">\\u4e2d\\u6587</option>
              <option value="ko">\\ud55c\\uad6d\\uc5b4</option>
              <option value="pt">Portugu\\u00eas</option>
            </select>
          </div>

          {/* Initial Investment */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('initial')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={initial} onChange={(e) => { setInitial(e.target.value); setResult(null); }}
              placeholder={t('placeholderInitial')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Monthly Contribution */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('monthly')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={monthly} onChange={(e) => { setMonthly(e.target.value); setResult(null); }}
              placeholder={t('placeholderMonthly')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Rate */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('rate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={rate} onChange={(e) => { setRate(e.target.value); setResult(null); }}
              placeholder={t('placeholderRate')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Years */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('years')}</label>
            <input className="os9-input w-full" type="number" step="any" min="1"
              value={years} onChange={(e) => { setYears(e.target.value); setResult(null); }}
              placeholder={t('placeholderYears')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <>
              <div className="os9-result" style={{ padding: '16px 12px', marginBottom: 12 }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="os9-label text-sm">{t('futureValue')}</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>{fmt(result.futureValue)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="os9-label text-sm">{t('totalContributions')}</span>
                  <span className="font-bold">{fmt(result.totalContributions)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="os9-label text-sm">{t('totalInterest')}</span>
                  <span className="font-bold" style={{ color: '#22aa22' }}>{fmt(result.totalInterest)}</span>
                </div>
              </div>

              {/* Year-by-year table */}
              {showTable && result.yearly && result.yearly.length > 0 && (
                <details open>
                  <summary className="text-xs underline cursor-pointer mb-2" style={{ opacity: 0.7 }}>{t('yearTable')} ({result.yearly.length})</summary>
                  <div className="os9-table-wrap" style={{ maxHeight: 240, overflowY: 'auto', fontSize: 11 }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="sticky top-0" style={{ background: 'var(--os9-bg)', borderBottom: '1px solid var(--os9-border)' }}>
                          <th className="text-left p-1">{t('yearTable')}</th>
                          <th className="text-right p-1">{t('depositTable')}</th>
                          <th className="text-right p-1">{t('interestTable')}</th>
                          <th className="text-right p-1">{t('balanceTable')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearly.map((row) => (
                          <tr key={row.year} className="border-b" style={{ borderColor: 'var(--os9-border)', opacity: 0.8 }}>
                            <td className="p-1">{row.year}</td>
                            <td className="text-right p-1">{fmt(row.deposits)}</td>
                            <td className="text-right p-1" style={{ color: '#22aa22' }}>{fmt(row.interest)}</td>
                            <td className="text-right p-1 font-bold">{fmt(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </>
          )}
          {!result && (initial || monthly || rate || years) && showTable && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={clearAll}>{t('clear')}</button>
          </div>

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/compound`} className="underline">Compound Interest Calculator</a>
                <a href={`/${locale}/cagr`} className="underline">CAGR Calculator</a>
                <a href={`/${locale}/simpleinterest`} className="underline">Simple Interest Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/investment'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Investment</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
'''

# Fix unicode escapes that Python doubled
PAGE_JS = PAGE_JS.replace('\\\\u00f1', '\\u00f1')
PAGE_JS = PAGE_JS.replace('\\\\u4e2d\\\\u6587', '\\u4e2d\\u6587')
PAGE_JS = PAGE_JS.replace('\\\\ud55c\\\\uad6d\\\\uc5b4', '\\ud55c\\uad6d\\uc5b4')
PAGE_JS = PAGE_JS.replace('\\\\u00eas', '\\u00eas')

PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]', 'investment')
os.makedirs(PAGES_DIR, exist_ok=True)
path = os.path.join(PAGES_DIR, 'page.js')
with open(path, 'w', encoding='utf-8') as f:
    f.write(PAGE_JS)
print(f'Created: {path}')

print('\\nDone!')