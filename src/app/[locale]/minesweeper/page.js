'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/minesweeper.json';
import esMsgs from '../../../messages/es/minesweeper.json';
import zhMsgs from '../../../messages/zh/minesweeper.json';
import koMsgs from '../../../messages/ko/minesweeper.json';
import ptMsgs from '../../../messages/pt/minesweeper.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function MinesweeperPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/minesweeper'; };
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [minesLeft, setMinesLeft] = useState(0);
  const timerRef = useRef(null);

  const configs = { easy: { rows: 9, cols: 9, mines: 10 }, medium: { rows: 16, cols: 16, mines: 40 }, hard: { rows: 16, cols: 30, mines: 99 } };
  const { rows, cols, mines } = configs[difficulty];

  const newGame = () => {
    clearInterval(timerRef.current);
    setTime(0); setGameOver(false); setWon(false); setMinesLeft(mines);
    const newBoard = Array(rows * cols).fill(null).map(() => ({ mine: false, revealed: false, flagged: false, count: 0 }));
    const mineIndices = new Set();
    while (mineIndices.size < mines) mineIndices.add(Math.floor(Math.random() * rows * cols));
    mineIndices.forEach(idx => { newBoard[idx].mine = true; });
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r * cols + c].mine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr * cols + nc].mine) count++;
          }
          newBoard[r * cols + c].count = count;
        }
      }
    }
    setBoard(newBoard);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const reveal = (i) => {
    if (gameOver || won || board[i].revealed || board[i].flagged) return;
    setBoard(b => {
      const nb = [...b];
      const flood = (idx) => {
        if (idx < 0 || idx >= rows * cols || nb[idx].revealed || nb[idx].flagged) return;
        nb[idx].revealed = true;
        if (nb[idx].mine) { setGameOver(true); clearInterval(timerRef.current); return; }
        if (nb[idx].count === 0) {
          const r = Math.floor(idx / cols), c = idx % cols;
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) flood(nr * cols + nc);
          }
        }
      };
      flood(i);
      const unrevealedSafe = nb.filter(c => !c.mine && !c.revealed).length;
      if (unrevealedSafe === 0) { setWon(true); clearInterval(timerRef.current); }
      return nb;
    });
  };

  const flag = (i) => {
    if (gameOver || won || board[i].revealed) return;
    setBoard(b => { const nb = [...b]; nb[i].flagged = !nb[i].flagged; setMinesLeft(m => m + (nb[i].flagged ? -1 : 1)); return nb; });
  };

  useEffect(() => { newGame(); return () => clearInterval(timerRef.current); }, [difficulty]);

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
                      <div>{t('mines') || 'Mines'}: {minesLeft}</div>
                      <div>{t('time') || 'Time'}: {time}s</div>
                    </div>
                    <div className="grid gap-0.5 mb-3" style={{ gridTemplateColumns: `repeat(${cols}, 28px)` }}>
                      {board.map((cell, i) => (
                        <button key={i} className={cell.revealed ? 'bg-gray-200' : ''} style={{ width: 28, height: 28, fontSize: 12, padding: 0 }} onClick={() => reveal(i)} onContextMenu={(e) => { e.preventDefault(); flag(i); }}>
                          {cell.revealed ? (cell.mine ? '💣' : (cell.count > 0 ? cell.count : '')) : (cell.flagged ? '🚩' : '')}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="os9-btn os9-btn-primary flex-1" onClick={newGame}>{t('newGame') || 'New Game'}</button>
                      <select className="os9-select flex-1" value={difficulty} onChange={(e) => { setDifficulty(e.target.value); newGame(); }}>
                        <option value="easy">{t('easy') || 'Easy (9x9, 10)'}</option>
                        <option value="medium">{t('medium') || 'Medium (16x16, 40)'}</option>
                        <option value="hard">{t('hard') || 'Hard (16x30, 99)'}</option>
                      </select>
                    </div>
                    {gameOver && <div className="mt-3 text-center text-red-600 font-bold">{t('gameOver') || 'Game Over!'}</div>}
                    {won && <div className="mt-3 text-center text-green-600 font-bold">{t('youWin') || 'You Win!'}</div>}
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