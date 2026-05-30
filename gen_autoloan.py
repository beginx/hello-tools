import json, os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'

MSGS = {
    'en': {
        "title": "Auto Loan Calculator",
        "subtitle": "Estimate Your Car Loan Payments",
        "vehiclePrice": "Vehicle Price",
        "downPayment": "Down Payment",
        "interestRate": "Annual Interest Rate (%)",
        "loanTerm": "Loan Term (Years)",
        "monthlyPayment": "Monthly Payment",
        "totalPayment": "Total Payment",
        "totalInterest": "Total Interest",
        "downPaymentAmount": "Down Payment",
        "amountFinanced": "Amount Financed",
        "calculate": "Calculate Auto Loan",
        "clear": "Clear All",
        "error": "Please enter valid numbers",
        "placeholderPrice": "e.g. 35000",
        "placeholderDown": "e.g. 5000",
        "placeholderRate": "e.g. 6.5",
        "placeholderTerm": "e.g. 5",
        "seoDescription": "Free online auto loan calculator: estimate your monthly car payments, total interest, and total loan cost. Enter vehicle price, down payment, interest rate, and loan term. Perfect for new and used car buyers. Mac OS 9 retro style."
    },
    'es': {
        "title": "Calculadora de Pr\u00e9stamo de Auto",
        "subtitle": "Calcule los Pagos de su Auto",
        "vehiclePrice": "Precio del Veh\u00edculo",
        "downPayment": "Pago Inicial",
        "interestRate": "Tasa de Inter\u00e9s Anual (%)",
        "loanTerm": "Plazo del Pr\u00e9stamo (A\u00f1os)",
        "monthlyPayment": "Pago Mensual",
        "totalPayment": "Pago Total",
        "totalInterest": "Inter\u00e9s Total",
        "downPaymentAmount": "Pago Inicial",
        "amountFinanced": "Monto Financiado",
        "calculate": "Calcular Pr\u00e9stamo",
        "clear": "Limpiar Todo",
        "error": "Ingrese n\u00fameros v\u00e1lidos",
        "placeholderPrice": "Ej. 35000",
        "placeholderDown": "Ej. 5000",
        "placeholderRate": "Ej. 6.5",
        "placeholderTerm": "Ej. 5",
        "seoDescription": "Calculadora gratuita de pr\u00e9stamos para autos: calcule sus pagos mensuales, inter\u00e9s total y costo total del pr\u00e9stamo. Perfecta para compradores de autos nuevos y usados. Estilo retro Mac OS 9."
    },
    'zh': {
        "title": "\u6c7d\u8f66\u8d37\u6b3e\u8ba1\u7b97\u5668",
        "subtitle": "\u4f30\u7b97\u60a8\u7684\u6c7d\u8f66\u8d37\u6b3e\u6708\u4f9b",
        "vehiclePrice": "\u8f66\u8f86\u4ef7\u683c",
        "downPayment": "\u9996\u4ed8\u6b3e",
        "interestRate": "\u5e74\u5229\u7387 (%)",
        "loanTerm": "\u8d37\u6b3e\u671f\u9650 (\u5e74)",
        "monthlyPayment": "\u6708\u4f9b",
        "totalPayment": "\u603b\u8fd8\u6b3e\u989d",
        "totalInterest": "\u603b\u5229\u606f",
        "downPaymentAmount": "\u9996\u4ed8\u6b3e",
        "amountFinanced": "\u8d37\u6b3e\u91d1\u989d",
        "calculate": "\u8ba1\u7b97\u6c7d\u8f66\u8d37\u6b3e",
        "clear": "\u6e05\u9664\u5168\u90e8",
        "error": "\u8bf7\u8f93\u5165\u6709\u6548\u6570\u5b57",
        "placeholderPrice": "\u4f8b\u5982 35000",
        "placeholderDown": "\u4f8b\u5982 5000",
        "placeholderRate": "\u4f8b\u5982 6.5",
        "placeholderTerm": "\u4f8b\u5982 5",
        "seoDescription": "\u514d\u8d39\u5728\u7ebf\u6c7d\u8f66\u8d37\u6b3e\u8ba1\u7b97\u5668\uff1a\u4f30\u7b97\u60a8\u7684\u6c7d\u8f66\u8d37\u6b3e\u6708\u4f9b\u3001\u603b\u5229\u606f\u548c\u603b\u8d37\u6b3e\u6210\u672c\u3002\u9002\u5408\u65b0\u8f66\u548c\u4e8c\u624b\u8f66\u4e70\u5bb6\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002"
    },
    'ko': {
        "title": "\uc790\ub3d9\ucc28 \ud560\ubd80 \uacc4\uc0b0\uae30",
        "subtitle": "\ucc28\ub7c9 \ud560\ubd80\uae08\uc744 \ucd94\uc815\ud558\uc138\uc694",
        "vehiclePrice": "\ucc28\ub7c9\uac00\uaca9",
        "downPayment": "\uacc4\uc57d\uae08",
        "interestRate": "\uc5f0 \uc774\uc728 (%)",
        "loanTerm": "\ud560\ubd80 \uae30\uac04 (\ub144)",
        "monthlyPayment": "\uc6d4 \ud560\ubd80\uae08",
        "totalPayment": "\ucd1d \uc0c1\ud658\uae08",
        "totalInterest": "\ucd1d \uc774\uc790",
        "downPaymentAmount": "\uacc4\uc57d\uae08",
        "amountFinanced": "\ub300\ucd9c \uae08\uc561",
        "calculate": "\ud560\ubd80 \uacc4\uc0b0",
        "clear": "\uc804\uccb4 \uc9c0\uc6b0\uae30",
        "error": "\uc720\ud6a8\ud55c \uc22b\uc790\ub97c \uc785\ub825\ud558\uc138\uc694",
        "placeholderPrice": "\uc608) 35,000,000",
        "placeholderDown": "\uc608) 5,000,000",
        "placeholderRate": "\uc608) 6.5",
        "placeholderTerm": "\uc608) 5",
        "seoDescription": "\ubb34\ub8cc \uc790\ub3d9\ucc28 \ud560\ubd80 \uacc4\uc0b0\uae30: \ucc28\ub7c9\uac00\uaca9, \uacc4\uc57d\uae08, \uc774\uc728, \ud560\ubd80 \uae30\uac04\uc744 \uc785\ub825\ud558\uc5ec \uc6d4 \ud560\ubd80\uae08\uacfc \ucd1d \uc0c1\ud658\uae08\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \uc2e0\ucc28 \ubc0f \uc911\uace0\ucc28 \uad6c\ub9e4\uc790\ub97c \uc704\ud55c \ubb34\ub8cc \uc6f9 \ud234\uc785\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c."
    },
    'pt': {
        "title": "Calculadora de Empr\u00e9stimo de Carro",
        "subtitle": "Estime as Parcelas do seu Carro",
        "vehiclePrice": "Pre\u00e7o do Ve\u00edculo",
        "downPayment": "Entrada",
        "interestRate": "Taxa de Juros Anual (%)",
        "loanTerm": "Prazo do Empr\u00e9stimo (Anos)",
        "monthlyPayment": "Parcelamento Mensal",
        "totalPayment": "Pagamento Total",
        "totalInterest": "Juros Totais",
        "downPaymentAmount": "Entrada",
        "amountFinanced": "Valor Financiado",
        "calculate": "Calcular Empr\u00e9stimo",
        "clear": "Limpar Tudo",
        "error": "Insira n\u00fameros v\u00e1lidos",
        "placeholderPrice": "Ex. 35000",
        "placeholderDown": "Ex. 5000",
        "placeholderRate": "Ex. 6.5",
        "placeholderTerm": "Ex. 5",
        "seoDescription": "Calculadora gratuita de empr\u00e9stimo de carro online: estime suas parcelas mensais, juros totais e custo total do empr\u00e9stimo. Perfeita para compradores de carros novos e usados. Estilo retro Mac OS 9."
    }
}

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
MSGS_DIR = os.path.join(BASE, 'src', 'messages')

for loc in LOCALES:
    path = os.path.join(MSGS_DIR, loc, 'autoloan.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(MSGS[loc], f, ensure_ascii=False)
    print(f'Created: {path}')

# Auto Loan page.js
PAGE_JS = """'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/autoloan.json';
import esMsgs from '../../../messages/es/autoloan.json';
import zhMsgs from '../../../messages/zh/autoloan.json';
import koMsgs from '../../../messages/ko/autoloan.json';
import ptMsgs from '../../../messages/pt/autoloan.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function AutoloanPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/autoloan'; };

  const [price, setPrice] = useState('');
  const [down, setDown] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [result, setResult] = useState(null);

  const fmt = (n) => {
    if (locale === 'ko') return '\\u20a9' + Math.round(n).toLocaleString('ko-KR');
    if (locale === 'es' || locale === 'pt') {
      const opts = { style: 'currency', currency: locale === 'es' ? 'EUR' : 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 };
      return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'pt-BR', opts).format(n);
    }
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calc = () => {
    const p = parseFloat(price);
    const d = parseFloat(down) || 0;
    const r = parseFloat(rate);
    const y = parseFloat(term);
    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || r < 0 || y <= 0 || d < 0 || d >= p) {
      setResult(null);
      return;
    }
    const principal = p - d;
    const annualRate = r / 100;
    if (annualRate === 0) {
      const monthly = principal / (y * 12);
      setResult({
        monthly: Math.round(monthly * 100) / 100,
        total: Math.round((monthly * y * 12) * 100) / 100,
        interest: 0,
        financed: principal,
        downAmt: d
      });
      return;
    }
    const monthlyRate = annualRate / 12;
    const numPayments = y * 12;
    const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const total = monthly * numPayments;
    setResult({
      monthly: Math.round(monthly * 100) / 100,
      total: Math.round((total) * 100) / 100,
      interest: Math.round((total - principal) * 100) / 100,
      financed: Math.round(principal * 100) / 100,
      downAmt: d
    });
  };

  const clearAll = () => {
    setPrice(''); setDown(''); setRate(''); setTerm(''); setResult(null);
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
          {/* Language selector */}
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          {/* Vehicle Price */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('vehiclePrice')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={price} onChange={(e) => { setPrice(e.target.value); setResult(null); }}
              placeholder={t('placeholderPrice')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Down Payment */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('downPayment')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={down} onChange={(e) => { setDown(e.target.value); setResult(null); }}
              placeholder={t('placeholderDown')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Interest Rate */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('interestRate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={rate} onChange={(e) => { setRate(e.target.value); setResult(null); }}
              placeholder={t('placeholderRate')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Loan Term */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('loanTerm')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={term} onChange={(e) => { setTerm(e.target.value); setResult(null); }}
              placeholder={t('placeholderTerm')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('monthlyPayment')}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>{fmt(result.monthly)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('amountFinanced')}</span>
                <span className="font-bold">{fmt(result.financed)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('totalPayment')}</span>
                <span className="font-bold">{fmt(result.total)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('totalInterest')}</span>
                <span className="font-bold" style={{ color: '#22aa22' }}>{fmt(result.interest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('downPaymentAmount')}</span>
                <span className="font-bold" style={{ opacity: 0.7 }}>{fmt(result.downAmt)}</span>
              </div>
            </div>
          )}
          {!result && price && rate && term && (
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
                <a href={`/${locale}/loan`} className="underline">Loan Calculator</a>
                <a href={`/${locale}/mortgage`} className="underline">Mortgage Calculator</a>
                <a href={`/${locale}/compound`} className="underline">Compound Interest Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/autoloan'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Auto Loan</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""

PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]', 'autoloan')
os.makedirs(PAGES_DIR, exist_ok=True)
path = os.path.join(PAGES_DIR, 'page.js')
with open(path, 'w', encoding='utf-8') as f:
    # Fix the backtick escape issue in template literals
    content = PAGE_JS.replace('\\u0060', '`')
    f.write(content)
print(f'Created: {path}')
print('\nDone!')