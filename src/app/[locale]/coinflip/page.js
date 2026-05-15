'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function CoinflipPage() {
  const t = useTranslations('coinflip');
  const params = useParams();
  const locale = params?.locale || 'en';
  const changeLang = (l) => { window.location.href = '/' + l + '/coinflip'; };

  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState([]);

  const flip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setFlipping(false);
      setHistory(prev => [outcome, ...prev].slice(0, 100));
    }, 400);
  }, [flipping]);

  const clear = () => { setResult(null); setHistory([]); };

  const total = history.length;
  const heads = history.filter(h => h === 'heads').length;
  const tails = total - heads;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 400, width: '100%' }}>
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

          {/* Coin display */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-36 h-36 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
              style={{
                background: flipping ? 'linear-gradient(135deg, #c0c0c0, #888888)' :
                  result === 'heads' ? 'linear-gradient(135deg, #ffd700, #daa520)' :
                  result === 'tails' ? 'linear-gradient(135deg, #c0c0c0, #888888)' : 'linear-gradient(135deg, #e0e0e0, #b0b0b0)',
                border: '4px solid #666',
                boxShadow: flipping ? '0 0 20px rgba(0,0,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.1)',
                transform: flipping ? 'rotateY(720deg)' : 'rotateY(0deg)',
                transition: 'all 0.4s ease-in-out',
              }}>
              <span className="text-5xl font-bold" style={{ fontFamily: 'Monaco, monospace' }}>
                {flipping ? '?' : result === 'heads' ? 'H' : result === 'tails' ? 'T' : ''}
              </span>
            </div>
            <div className="text-center">
              {flipping && <p className="text-sm" style={{ opacity: 0.7 }}>{t('flipping')}</p>}
              {!flipping && result && (
                <p className="text-xl font-bold" style={{ color: 'var(--os9-accent)' }}>
                  {result === 'heads' ? t('heads') : t('tails')}
                </p>
              )}
              {!flipping && !result && <p className="text-sm" style={{ opacity: 0.5 }}>{t('flip')}</p>}
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3 mb-4" onClick={flip} disabled={flipping}>
            {t('flip')}
          </button>

          {/* Statistics */}
          {total > 0 && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('statistics')}</p>
              <div className="os9-result mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t('totalFlips')}: <strong>{total}</strong></span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span>{t('totalHeads')}: <strong>{heads}</strong> ({total > 0 ? (heads/total*100).toFixed(1) : 0}%)</span>
                  <span>{t('totalTails')}: <strong>{tails}</strong> ({total > 0 ? (tails/total*100).toFixed(1) : 0}%)</span>
                </div>
                {/* progress bar */}
                <div className="flex h-3 rounded-full overflow-hidden mt-2" style={{ background: '#ddd', border: '1px solid #aaa' }}>
                  <div style={{ width: total > 0 ? (heads/total*100) + '%' : '50%', background: 'var(--os9-accent)', transition: 'width 0.3s' }} />
                  <div style={{ width: total > 0 ? (tails/total*100) + '%' : '50%', background: '#888', transition: 'width 0.3s' }} />
                </div>
                <div className="flex justify-between text-[10px] mt-1" style={{ opacity: 0.6 }}>
                  <span>{t('heads')} {(total > 0 ? (heads/total*100) : 50).toFixed(1)}%</span>
                  <span>{t('tails')} {(total > 0 ? (tails/total*100) : 50).toFixed(1)}%</span>
                </div>
              </div>
              <button className="os9-btn !px-4 text-xs" onClick={clear}>{t('clear')}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
