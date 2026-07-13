'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/checkers.json';
import esMsgs from '../../../messages/es/checkers.json';
import zhMsgs from '../../../messages/zh/checkers.json';
import koMsgs from '../../../messages/ko/checkers.json';
import ptMsgs from '../../../messages/pt/checkers.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CheckersPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/checkers'; };
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [captured, setCaptured] = useState([0, 0]);
  const [winner, setWinner] = useState(null);

  const newGame = () => {
    const b = Array(64).fill(null);
    for (let i = 0; i < 24; i++) {
      const row = Math.floor(i / 4), col = (i % 4) * 2 + (row % 2);
      b[row * 8 + col] = { player: 1, king: false };
    }
    for (let i = 40; i < 64; i++) {
      const row = Math.floor(i / 4), col = (i % 4) * 2 + (row % 2);
      if (row >= 5) b[row * 8 + col] = { player: 2, king: false };
    }
    setBoard(b); setCurrentPlayer(1); setSelected(null); setValidMoves([]); setCaptured([0, 0]); setWinner(null);
  };

  const getMoves = (idx) => {
    const piece = board[idx]; if (!piece || piece.player !== currentPlayer) return [];
    const row = Math.floor(idx / 8), col = idx % 8;
    const dirs = piece.king ? [-1, 1] : (piece.player === 1 ? [1] : [-1]);
    const moves = [], jumps = [];
    for (const dr of dirs) {
      for (const dc of [-1, 1]) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const nIdx = nr * 8 + nc;
          if (!board[nIdx]) moves.push({ to: nIdx, jump: null });
          else if (board[nIdx].player !== currentPlayer) {
            const jr = nr + dr, jc = nc + dc;
            if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !board[jr * 8 + jc]) jumps.push({ to: jr * 8 + jc, jump: nIdx });
          }
        }
      }
    }
    return jumps.length > 0 ? jumps : moves;
  };

  const handleClick = (idx) => {
    if (winner) return;
    if (selected === null) {
      const moves = getMoves(idx);
      if (moves.length > 0) { setSelected(idx); setValidMoves(moves); }
    } else if (selected === idx) {
      setSelected(null); setValidMoves([]);
    } else {
      const move = validMoves.find(m => m.to === idx);
      if (move) {
        setBoard(b => {
          const nb = [...b];
          nb[move.to] = { ...nb[selected] };
          if (move.jump !== null) { nb[move.jump] = null; setCaptured(c => { const nc = [...c]; nc[currentPlayer - 1]++; return nc; }); }
          nb[selected] = null;
          const r = Math.floor(move.to / 8);
          if ((currentPlayer === 1 && r === 7) || (currentPlayer === 2 && r === 0)) nb[move.to].king = true;
          return nb;
        });
        const hasMoreJumps = move.jump !== null && getMoves(move.to).some(m => m.jump !== null);
        if (!hasMoreJumps) { setCurrentPlayer(p => 3 - p); setSelected(null); setValidMoves([]); }
        else { setSelected(move.to); setValidMoves(getMoves(move.to).filter(m => m.jump !== null)); }
        const p1 = nb => nb.some(c => c && c.player === 1);
        const p2 = nb => nb.some(c => c && c.player === 2);
        if (!p1(board)) setWinner(2); else if (!p2(board)) setWinner(1);
      }
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
          <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <div>{t('player') || 'Player'}: {currentPlayer === 1 ? '🔴' : '⚫'}</div>
                        <div>{t('captured') || 'Captured'}: {captured[0]} / {captured[1]}</div>
                      </div>
                      <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(8, 40px)', gridTemplateRows: 'repeat(8, 40px)' }}>
                        {board.map((cell, i) => (
                          <div key={i} className="relative" style={{ width: 40, height: 40, background: (Math.floor(i/8)+i%8)%2===0 ? '#f0d9b5' : '#b58863' }} onClick={() => handleClick(i)}>
                            {cell && <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ cursor: selected === i ? 'default' : 'pointer' }}>
                              {cell.king ? (cell.player === 1 ? '🔴⭐' : '⚫⭐') : (cell.player === 1 ? '🔴' : '⚫')}
                            </div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    {winner && <div className="mt-3 text-center text-2xl font-bold" style={{ color: winner === 1 ? 'red' : 'black' }}>{t('winner') || 'Winner'}: {winner === 1 ? '🔴' : '⚫'}</div>}
                    <button className="os9-btn os9-btn-primary w-full mt-2" onClick={newGame}>{t('newGame') || 'New Game'}</button>
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