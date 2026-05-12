'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/fuelcost.json';
import esMsgs from '../../../messages/es/fuelcost.json';
import zhMsgs from '../../../messages/zh/fuelcost.json';
import koMsgs from '../../../messages/ko/fuelcost.json';
import ptMsgs from '../../../messages/pt/fuelcost.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function FuelCostPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/fuelcost'; };

  const [distance, setDistance] = useState('500');
  const [fuelEcon, setFuelEcon] = useState('8');
  const [fuelPrice, setFuelPrice] = useState('1.50');
  const [unit, setUnit] = useState('metric'); // metric = L/100km, imperial = MPG
  const [result, setResult] = useState(null);

  const calc = () => {
    const dist = parseFloat(distance) || 0;
    const econ = parseFloat(fuelEcon) || 0;
    const price = parseFloat(fuelPrice) || 0;
    if (dist <= 0 || econ <= 0 || price <= 0) return;

    let totalFuel, totalCost;
    if (unit === 'metric') {
      // L/100km
      totalFuel = (dist / 100) * econ;
      totalCost = totalFuel * price;
    } else {
      // MPG, distance in miles, price in USD per gallon
      totalFuel = dist / econ; // gallons
      totalCost = totalFuel * price;
    }

    const fuelPer100km = unit === 'metric' ? econ : (235.21 / econ);

    setResult({
      totalFuel: totalFuel,
      totalCost: totalCost,
      costPerKm: unit === 'metric' ? totalCost / dist : totalCost / dist,
      fuelPer100km: fuelPer100km,
    });
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
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Unit toggle */}
          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn text-xs ' + (unit === 'metric' ? 'os9-btn-primary' : '')} onClick={() => setUnit('metric')}>{t('metric')} (L/100km)</button>
            <button className={'os9-btn text-xs ' + (unit === 'imperial' ? 'os9-btn-primary' : '')} onClick={() => setUnit('imperial')}>{t('imperial')} (MPG)</button>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{unit === 'metric' ? t('distanceKm') : t('distanceMi')}</label>
              <input className="os9-input w-full" type="number" min="1" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{unit === 'metric' ? t('fuelEconMetric') : t('fuelEconImperial')}</label>
              <input className="os9-input w-full" type="number" min="0.1" step="0.1" value={fuelEcon} onChange={(e) => setFuelEcon(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{unit === 'metric' ? t('fuelPricePerL') : t('fuelPricePerGal')}</label>
              <input className="os9-input w-full" type="number" min="0.01" step="0.01" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="os9-big-number">{result.totalCost.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('totalCost')}</div>
                </div>
                <div>
                  <div className="os9-big-number">{result.totalFuel.toFixed(1)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{unit === 'metric' ? t('liters') : t('gallons')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.costPerKm.toFixed(3)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{unit === 'metric' ? t('costPerKm') : t('costPerMi')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.fuelPer100km.toFixed(1)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>L/100km</div>
                </div>
              </div>
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/salary`} className="underline">Salary Converter</a>
                <a href={`/${locale}/overtime`} className="underline">Overtime Calculator</a>
                <a href={`/${locale}/vat`} className="underline">VAT Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/fuelcost'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Fuel Cost</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}