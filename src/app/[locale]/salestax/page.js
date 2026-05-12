'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/salestax.json';
import esMsgs from '../../../messages/es/salestax.json';
import zhMsgs from '../../../messages/zh/salestax.json';
import koMsgs from '../../../messages/ko/salestax.json';
import ptMsgs from '../../../messages/pt/salestax.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const US_STATES = [
  { name: 'Alabama', stateRate: 4.0, avgCombined: 9.29, abbr: 'AL' },
  { name: 'Alaska', stateRate: 0.0, avgCombined: 1.76, abbr: 'AK' },
  { name: 'Arizona', stateRate: 5.6, avgCombined: 8.40, abbr: 'AZ' },
  { name: 'Arkansas', stateRate: 6.5, avgCombined: 9.47, abbr: 'AR' },
  { name: 'California', stateRate: 7.25, avgCombined: 8.82, abbr: 'CA' },
  { name: 'Colorado', stateRate: 2.9, avgCombined: 8.01, abbr: 'CO' },
  { name: 'Connecticut', stateRate: 6.35, avgCombined: 6.35, abbr: 'CT' },
  { name: 'Delaware', stateRate: 0.0, avgCombined: 0.0, abbr: 'DE' },
  { name: 'Florida', stateRate: 6.0, avgCombined: 7.08, abbr: 'FL' },
  { name: 'Georgia', stateRate: 4.0, avgCombined: 7.35, abbr: 'GA' },
  { name: 'Hawaii', stateRate: 4.0, avgCombined: 4.44, abbr: 'HI' },
  { name: 'Idaho', stateRate: 6.0, avgCombined: 6.03, abbr: 'ID' },
  { name: 'Illinois', stateRate: 6.25, avgCombined: 8.82, abbr: 'IL' },
  { name: 'Indiana', stateRate: 7.0, avgCombined: 7.0, abbr: 'IN' },
  { name: 'Iowa', stateRate: 6.0, avgCombined: 6.94, abbr: 'IA' },
  { name: 'Kansas', stateRate: 6.5, avgCombined: 8.71, abbr: 'KS' },
  { name: 'Kentucky', stateRate: 6.0, avgCombined: 6.0, abbr: 'KY' },
  { name: 'Louisiana', stateRate: 4.45, avgCombined: 9.56, abbr: 'LA' },
  { name: 'Maine', stateRate: 5.5, avgCombined: 5.5, abbr: 'ME' },
  { name: 'Maryland', stateRate: 6.0, avgCombined: 6.0, abbr: 'MD' },
  { name: 'Massachusetts', stateRate: 6.25, avgCombined: 6.25, abbr: 'MA' },
  { name: 'Michigan', stateRate: 6.0, avgCombined: 6.0, abbr: 'MI' },
  { name: 'Minnesota', stateRate: 6.875, avgCombined: 7.49, abbr: 'MN' },
  { name: 'Mississippi', stateRate: 7.0, avgCombined: 7.07, abbr: 'MS' },
  { name: 'Missouri', stateRate: 4.225, avgCombined: 8.07, abbr: 'MO' },
  { name: 'Montana', stateRate: 0.0, avgCombined: 0.0, abbr: 'MT' },
  { name: 'Nebraska', stateRate: 5.5, avgCombined: 6.93, abbr: 'NE' },
  { name: 'Nevada', stateRate: 6.85, avgCombined: 8.26, abbr: 'NV' },
  { name: 'New Hampshire', stateRate: 0.0, avgCombined: 0.0, abbr: 'NH' },
  { name: 'New Jersey', stateRate: 6.625, avgCombined: 6.63, abbr: 'NJ' },
  { name: 'New Mexico', stateRate: 5.125, avgCombined: 7.65, abbr: 'NM' },
  { name: 'New York', stateRate: 4.0, avgCombined: 8.52, abbr: 'NY' },
  { name: 'North Carolina', stateRate: 4.75, avgCombined: 6.97, abbr: 'NC' },
  { name: 'North Dakota', stateRate: 5.0, avgCombined: 6.88, abbr: 'ND' },
  { name: 'Ohio', stateRate: 5.75, avgCombined: 7.22, abbr: 'OH' },
  { name: 'Oklahoma', stateRate: 4.5, avgCombined: 8.95, abbr: 'OK' },
  { name: 'Oregon', stateRate: 0.0, avgCombined: 0.0, abbr: 'OR' },
  { name: 'Pennsylvania', stateRate: 6.0, avgCombined: 6.34, abbr: 'PA' },
  { name: 'Rhode Island', stateRate: 7.0, avgCombined: 7.0, abbr: 'RI' },
  { name: 'South Carolina', stateRate: 6.0, avgCombined: 7.43, abbr: 'SC' },
  { name: 'South Dakota', stateRate: 4.5, avgCombined: 4.55, abbr: 'SD' },
  { name: 'Tennessee', stateRate: 7.0, avgCombined: 9.55, abbr: 'TN' },
  { name: 'Texas', stateRate: 6.25, avgCombined: 8.19, abbr: 'TX' },
  { name: 'Utah', stateRate: 6.1, avgCombined: 7.11, abbr: 'UT' },
  { name: 'Vermont', stateRate: 6.0, avgCombined: 6.22, abbr: 'VT' },
  { name: 'Virginia', stateRate: 5.3, avgCombined: 5.75, abbr: 'VA' },
  { name: 'Washington', stateRate: 6.5, avgCombined: 9.37, abbr: 'WA' },
  { name: 'West Virginia', stateRate: 6.0, avgCombined: 6.51, abbr: 'WV' },
  { name: 'Wisconsin', stateRate: 5.0, avgCombined: 5.71, abbr: 'WI' },
  { name: 'Wyoming', stateRate: 4.0, avgCombined: 5.5, abbr: 'WY' },
  { name: 'District of Columbia', stateRate: 6.0, avgCombined: 6.0, abbr: 'DC' },
];

function StateRow(props) {
  var s = props.state;
  return (
    <tr key={s.abbr} style={{ borderBottom: '1px solid var(--os9-border)' }}
      className="cursor-pointer hover:font-bold"
      onClick={function() { props.onSelect(s); }}>
      <td className="px-2 py-1">{s.name} <span style={{ opacity: 0.4 }}>({s.abbr})</span></td>
      <td className="px-2 py-1 text-right">{s.stateRate.toFixed(1)}%</td>
      <td className="px-2 py-1 text-right">{s.avgCombined.toFixed(1)}%</td>
    </tr>
  );
}

function StateItem(props) {
  var s = props.state;
  return (
    <div key={s.abbr}
      className="flex justify-between items-center px-3 py-1.5 text-sm cursor-pointer hover:font-bold"
      style={{ borderBottom: '1px solid var(--os9-border)' }}
      onClick={function() { props.onSelect(s); }}>
      <span>{s.name} <span style={{ opacity: 0.5 }}>({s.abbr})</span></span>
      <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>{s.avgCombined}%</span>
    </div>
  );
}

export default function SalesTaxPage() {
  var params = useParams();
  var locale = params && params.locale ? params.locale : 'en';
  var t = function(k) { return (pageMsgs[locale] || pageMsgs.en)[k] || k; };
  var changeLang = function(l) { window.location.href = '/' + l + '/salestax'; };

  var _a = useState('100');
  var amount = _a[0];
  var setAmount = _a[1];

  var _b = useState('');
  var customRate = _b[0];
  var setCustomRate = _b[1];

  var _c = useState('add');
  var mode = _c[0];
  var setMode = _c[1];

  var _d = useState(null);
  var selectedState = _d[0];
  var setSelectedState = _d[1];

  var _e = useState('');
  var searchQuery = _e[0];
  var setSearchQuery = _e[1];

  var _f = useState(false);
  var showRateTable = _f[0];
  var setShowRateTable = _f[1];

  var filteredStates = useMemo(function() {
    if (!searchQuery) return US_STATES;
    var q = searchQuery.toLowerCase();
    return US_STATES.filter(function(s) {
      return s.name.toLowerCase().indexOf(q) !== -1 || s.abbr.toLowerCase().indexOf(q) !== -1;
    });
  }, [searchQuery]);

  var selectState = function(s) {
    setSelectedState(s);
    setSearchQuery(s.name + ' (' + s.abbr + ')');
    setCustomRate('');
  };

  var activeRate = selectedState
    ? (customRate ? parseFloat(customRate) : selectedState.avgCombined)
    : (customRate ? parseFloat(customRate) : 0);

  var result = useMemo(function() {
    var a = parseFloat(amount) || 0;
    var r = activeRate || 0;
    if (a <= 0 || r <= 0) return null;
    if (mode === 'add') {
      var tax = a * (r / 100);
      return { original: a, tax: tax, total: a + tax, rate: r };
    } else {
      var net = a / (1 + r / 100);
      var tax = a - net;
      return { original: a, tax: tax, total: net, rate: r };
    }
  }, [amount, activeRate, mode]);

  var searchItems = [];
  if (searchQuery) {
    for (var si = 0; si < filteredStates.length; si++) {
      var state = filteredStates[si];
      searchItems.push(<StateItem key={state.abbr} state={state} onSelect={selectState} />);
    }
  }

  var tableRows = [];
  for (var ri = 0; ri < US_STATES.length; ri++) {
    var state = US_STATES[ri];
    tableRows.push(<StateRow key={state.abbr} state={state} onSelect={selectState} />);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn flex-1 text-sm ' + (mode === 'add' ? 'os9-btn-primary' : '')} onClick={function() { setMode('add'); }}>{t('addTax')}</button>
            <button className={'os9-btn flex-1 text-sm ' + (mode === 'remove' ? 'os9-btn-primary' : '')} onClick={function() { setMode('remove'); }}>{t('removeTax')}</button>
          </div>

          <div className="mb-3">
            <label className="os9-label">{t('amountLabel')}</label>
            <input className="os9-input w-full" type="number" min="0" step="0.01" value={amount} onChange={function(e) { setAmount(e.target.value); }} />
          </div>

          <div className="mb-3">
            <label className="os9-label">{t('selectState')}</label>
            <input className="os9-input w-full" type="text"
              value={searchQuery}
              onChange={function(e) { setSearchQuery(e.target.value); setSelectedState(null); }}
              placeholder={t('searchState')}
              autoComplete="off" />
            {searchQuery && filteredStates.length > 0 ? (
              <div className="mt-1 max-h-48 overflow-y-auto" style={{
                border: '1px solid var(--os9-border)',
                background: 'var(--os9-bg)',
                borderRadius: 4,
              }}>
                {searchItems}
              </div>
            ) : null}
            {searchQuery && filteredStates.length === 0 ? (
              <p className="text-xs mt-1" style={{ opacity: 0.5 }}>{t('noStates')}</p>
            ) : null}
          </div>

          {selectedState ? (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs" style={{ opacity: 0.6 }}>{t('orEnterRate')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input className="os9-input flex-1" type="number" min="0" max="20" step="0.1"
                  value={customRate} onChange={function(e) { setCustomRate(e.target.value); }}
                  placeholder={String(selectedState.avgCombined)} />
                <span className="text-xs" style={{ opacity: 0.5 }}>%</span>
                <span className="text-xs" style={{ opacity: 0.5 }}>
                  ({selectedState.abbr}: {selectedState.stateRate}%{selectedState.avgCombined !== selectedState.stateRate ? ' avg ' + selectedState.avgCombined + '%' : ''})
                </span>
              </div>
            </div>
          ) : null}

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4">{t('calculate')}</button>

          {result ? (
            <div className="os9-result">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-semibold">${result.original.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{mode === 'add' ? t('netAmount') : t('grossAmount')}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--os9-accent)' }}>${result.tax.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('taxAmount')} ({result.rate.toFixed(1)}%)</div>
                </div>
                <div>
                  <div className="font-semibold">${result.total.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{mode === 'add' ? t('grossAmount') : t('netAmount')}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-3">
            <button className="text-xs underline" style={{ opacity: 0.55 }}
              onClick={function() { setShowRateTable(!showRateTable); }}>
              {showRateTable ? 'Hide State Rates' : 'Show State Rates'}
            </button>
            {showRateTable ? (
              <div className="mt-2 max-h-60 overflow-y-auto text-xs" style={{
                border: '1px solid var(--os9-border)',
                borderRadius: 4,
              }}>
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--os9-bg)', borderBottom: '1px solid var(--os9-border)' }}>
                      <th className="px-2 py-1 text-left">State</th>
                      <th className="px-2 py-1 text-right">State Rate</th>
                      <th className="px-2 py-1 text-right">Avg Combined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={'/' + locale + '/vat'} className="underline">VAT Calculator</a>
                <a href={'/' + locale + '/discount'} className="underline">Discount Calculator</a>
                <a href={'/' + locale + '/tip'} className="underline">Tip Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/salestax'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Sales Tax</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}