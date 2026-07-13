'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/video-poker.json';
import esMsgs from '../../../messages/es/video-poker.json';
import zhMsgs from '../../../messages/zh/video-poker.json';
import koMsgs from '../../../messages/ko/video-poker.json';
import ptMsgs from '../../../messages/pt/video-poker.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function VideoPokerPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/video-poker'; };
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♥','♦','♣','♠'];
  const [hand, setHand] = useState([]);
  const [held, setHeld] = useState([false,false,false,false,false]);
  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(1);
  const [lastWin, setLastWin] = useState(0);
  const [result, setResult] = useState('');
  const [dealing, setDealing] = useState(false);

  const newDeck = () => {
    const d = [];
    for (const s of suits) for (const r of ranks) d.push({ suit: s, rank: r });
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
    return d;
  };

  const evaluate = (cards) => {
    const r = cards.map(c => c.rank).sort();
    const s = cards.map(c => c.suit);
    const flush = s.every(x => x === s[0]);
    const straight = (() => {
      const vals = r.map(x => x === 'A' ? 14 : x === 'K' ? 13 : x === 'Q' ? 12 : x === 'J' ? 11 : parseInt(x)).sort((a,b) => a-b);
      return vals.every((v,i) => i===0 || v === vals[i-1]+1) || vals.join(',') === '2,3,4,5,14';
    })();
    const counts = {}; r.forEach(x => counts[x] = (counts[x]||0)+1);
    const c = Object.values(counts).sort((a,b) => b-a);
    if (flush && straight && r.includes('A') && r.includes('K')) return { name: 'Royal Flush', payout: 250 };
    if (flush && straight) return { name: 'Straight Flush', payout: 50 };
    if (c[0] === 4) return { name: 'Four of a Kind', payout: 25 };
    if (c[0] === 3 && c[1] === 2) return { name: 'Full House', payout: 9 };
    if (flush) return { name: 'Flush', payout: 6 };
    if (straight) return { name: 'Straight', payout: 4 };
    if (c[0] === 3) return { name: 'Three of a Kind', payout: 3 };
    if (c[0] === 2 && c[1] === 2) return { name: 'Two Pair', payout: 2 };
    if (c[0] === 2 && ['J','Q','K','A'].includes(Object.keys(counts).find(k => counts[k]===2))) return { name: 'Jacks or Better', payout: 1 };
    return { name: 'Nothing', payout: 0 };
  };

  const deal = () => {
    if (dealing) return;
    if (!dealing) {
      if (credits < bet) return;
      setCredits(c => c - bet);
      setDealing(true);
      const deck = newDeck();
      setHand(deck.slice(0, 5));
      setHeld([false,false,false,false,false]);
      setResult('');
    } else {
      const deck = newDeck();
      setHand(h => h.map((c,i) => held[i] ? c : deck.pop()));
      const evaluation = evaluate(hand.map((c,i) => held[i] ? c : deck.pop()));
      const win = evaluation.payout * bet;
      setCredits(c => c + win);
      setLastWin(win);
      setResult(win > 0 ? (t('win') || 'Win') + ': ' + eval.name + ' ($' + win + ')' : (t('lose') || 'Lose'));
      setDealing(false);
    }
  };

  useEffect(() => { deal(); }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 600, width: '100%' }}>
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
          <div className="flex justify-between mb-3 text-sm">
                      <div>{t('credits') || 'Credits'}: {credits}</div>
                      <div>{t('bet') || 'Bet'}: {bet}</div>
                      <div>{t('lastWin') || 'Last Win'}: {lastWin}</div>
                    </div>
                    <div className="flex gap-2 mb-3 justify-center">
                      {hand.map((card, i) => (
                        <div key={i} className="relative" style={{ width: 70, height: 100, border: '2px solid ' + (held[i] ? '#ffd700' : '#333'), borderRadius: 6, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} onClick={() => setHeld(h => { const nh = [...h]; nh[i] = !nh[i]; return nh; })}>
                          <div style={{ fontSize: 24, color: ['♥','♦'].includes(card.suit) ? 'red' : 'black' }}>{card.rank}{card.suit}</div>
                          {held[i] && <div className="absolute top-1 right-1 text-yellow-600 font-bold text-sm">⭐</div>}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button className="os9-btn os9-btn-primary flex-1" onClick={deal} disabled={dealing || credits < bet}>{dealing ? (t('deal') || 'Deal') : (t('draw') || 'Draw')}</button>
                      <button className="os9-btn flex-1" onClick={() => setBet(b => Math.min(b + 1, 5, credits))} disabled={dealing}>{t('bet') || 'Bet'} {bet}</button>
                    </div>
                    {result && <div className="mt-3 text-center text-lg font-bold" style={{ color: result.startsWith(t('win') || 'Win') ? 'green' : 'black' }}>{result}</div>}
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