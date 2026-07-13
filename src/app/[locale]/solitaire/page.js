'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/solitaire.json';
import esMsgs from '../../../messages/es/solitaire.json';
import zhMsgs from '../../../messages/zh/solitaire.json';
import koMsgs from '../../../messages/ko/solitaire.json';
import ptMsgs from '../../../messages/pt/solitaire.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function SolitairePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/solitaire'; };
  const suits = ['♥', '♦', '♣', '♠'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const [tableau, setTableau] = useState([]);
  const [stock, setStock] = useState([]);
  const [waste, setWaste] = useState([]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const newGame = () => {
    const deck = [];
    for (const s of suits) for (const r of ranks) deck.push({ suit: s, rank: r, faceUp: false });
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    const t = [];
    let idx = 0;
    for (let c = 0; c < 7; c++) {
      const pile = [];
      for (let r = 0; r <= c; r++) { pile.push({ ...deck[idx], faceUp: r === c }); idx++; }
      t.push(pile);
    }
    setTableau(t); setStock(deck.slice(idx)); setWaste([]); setFoundations([[], [], [], []]); setScore(0); setMoves(0);
  };

  const drawCard = () => {
    if (stock.length === 0) { setStock(waste.reverse().map(c => ({ ...c, faceUp: false }))); setWaste([]); return; }
    setStock(s => { const ns = [...s]; const card = ns.pop(); setWaste(w => [...w, { ...card, faceUp: true }]); return ns; });
  };

  const handleTableauClick = (col, row) => {
    const pile = tableau[col];
    if (row < pile.length - 1 && !pile[row].faceUp) return;
    // Simplified: just flip face down cards
    if (row === pile.length - 1 && !pile[row].faceUp) {
      setTableau(t => { const nt = [...t]; nt[col] = [...nt[col]]; nt[col][row] = { ...nt[col][row], faceUp: true }; return nt; });
      setScore(s => s + 5);
    }
  };

  useEffect(() => { newGame(); }, []);

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
          <div className="flex justify-between mb-2 text-sm">
                      <div>{t('score') || 'Score'}: {score}</div>
                      <div>{t('moves') || 'Moves'}: {moves}</div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      <div className="flex gap-1" style={{ minWidth: '7 * 52px' }}>
                        {tableau.map((pile, i) => (
                          <div key={i} className="relative" style={{ width: 52, height: 70, border: '1px solid #ccc', borderRadius: 4, background: pile.length === 0 ? '#e8f5e9' : 'white' }}>
                            {pile.map((card, j) => (
                              <div key={j} className="absolute" style={{ top: j * 20, left: 0, width: 50, height: 68, border: '1px solid #333', borderRadius: 3, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} onClick={() => handleTableauClick(i, j)}>
                                {card.faceUp ? `${card.rank}${card.suit}` : '🂠'}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      <div className="relative" style={{ width: 52, height: 70, border: '1px solid #ccc', borderRadius: 4, background: stock.length === 0 ? '#e8f5e9' : 'white' }}>
                        {stock.length > 0 && <div className="absolute" style={{ top: 1, left: 1, width: 50, height: 68, border: '1px solid #333', borderRadius: 3, background: '#1a3c5e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, cursor: 'pointer' }} onClick={drawCard}>🂠</div>}
                      </div>
                      <div className="relative" style={{ width: 52, height: 70, border: '1px solid #ccc', borderRadius: 4, background: waste.length === 0 ? '#e8f5e9' : 'white' }}>
                        {waste.length > 0 && <div className="absolute" style={{ top: 1, left: 1, width: 50, height: 68, border: '1px solid #333', borderRadius: 3, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{`${waste[waste.length-1].rank}${waste[waste.length-1].suit}`}</div>}
                      </div>
                      <div className="flex gap-1 ml-4">
                        {foundations.map((pile, i) => (
                          <div key={i} className="relative" style={{ width: 52, height: 70, border: '1px solid #ccc', borderRadius: 4, background: '#fff3e0' }}>
                            {pile.length > 0 && <div className="absolute" style={{ top: 1, left: 1, width: 50, height: 68, border: '1px solid #333', borderRadius: 3, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{`${pile[pile.length-1].rank}${pile[pile.length-1].suit}`}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="os9-btn os9-btn-primary w-full" onClick={newGame}>{t('newGame') || 'New Game'}</button>
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