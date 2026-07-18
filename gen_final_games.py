#!/usr/bin/env python3
"""Generate the final 6 complex game page.js files"""
import os

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
LOCALE_DIR = 'src/app/[locale]'

def write_page(tool, body, state_extra="", maxW="600"):
    name = ''.join(w.capitalize() for w in tool.replace('-', ' ').split())
    lines = ["'use client';", "",
             "import { useState, useCallback, useRef, useEffect } from 'react';",
             "import { useParams } from 'next/navigation';"]
    for loc in LOCALES:
        lines.append(f"import {loc}Msgs from '../../../messages/{loc}/{tool}.json';")
    lines.append(f"const pageMsgs = {{ en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs }};")
    lines.append(f"")
    lines.append(f"export default function {name}Page() {{")
    lines.append(f"  const params = useParams();")
    lines.append(f"  const locale = params?.locale || 'en';")
    lines.append(f"  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;")
    lines.append(f"  const changeLang = (l) => {{ window.location.href = '/' + l + '/{tool}'; }};")
    if state_extra:
        lines.append(state_extra)
    lines.append("")
    lines.append("  return (")
    lines.append('    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: \'var(--os9-bg)\' }}>')
    lines.append(f'      <div className="os9-window" style={{ maxWidth: {maxW}, width: \'100%\' }}>')
    lines.append('        <div className="os9-titlebar relative">')
    lines.append('          <div className="os9-window-controls">')
    lines.append('            <div className="os9-dot os9-dot-close" />')
    lines.append('            <div className="os9-dot os9-dot-minimize" />')
    lines.append('            <div className="os9-dot os9-dot-zoom" />')
    lines.append('          </div>')
    lines.append('          <span className="tracking-[0.5px] text-sm">{t(\'title\')}</span>')
    lines.append('        </div>')
    lines.append('        <div className="os9-window-body">')
    lines.append('          <div className="flex justify-between items-center mb-4">')
    lines.append('            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>')
    lines.append('              <option value="en">English</option>')
    lines.append('              <option value="es">Español</option>')
    lines.append('              <option value="zh">中文</option>')
    lines.append('              <option value="ko">한국어</option>')
    lines.append('              <option value="pt">Português</option>')
    lines.append('            </select>')
    lines.append('          </div>')
    for line in body.split('\n'):
        lines.append('          ' + line)
    lines.append('          <div className="mt-4 px-1">')
    lines.append('            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t(\'seoDescription\')}</p>')
    lines.append('          </div>')
    lines.append('        </div>')
    lines.append('      </div>')
    lines.append('      <div className="os9-footer" style={{ maxWidth: 520, width: \'100%\', textAlign: \'center\', fontSize: 10, opacity: 0.6, marginTop: 12 }}>')
    lines.append('        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>')
    lines.append('        <span className="mx-2">|</span>')
    lines.append('        {t(\'footer\') || \'hello-tools 2026\'}')
    lines.append('      </div>')
    lines.append('    </div>')
    lines.append('  );')
    lines.append('}')
    
    fp = f'{LOCALE_DIR}/{tool}/page.js'
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f'  ✅ {tool}')

# === Typing Test ===
write_page('typing-test', '''<div className="mb-3">
            <select className="os9-select" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="15">{t('time15') || '15 seconds'}</option>
              <option value="30">{t('time30') || '30 seconds'}</option>
              <option value="60">{t('time60') || '60 seconds'}</option>
              <option value="words">{t('words10') || '10 words'}</option>
              <option value="words25">{t('words25') || '25 words'}</option>
            </select>
          </div>
          <div className="mb-3">
            <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wpm') || 'WPM'}</div><div className="font-bold text-lg">{wpm}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('accuracy') || 'Accuracy'}</div><div className="font-bold text-lg">{accuracy}%</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('time') || 'Time'}</div><div className="font-bold text-lg">{timeLeft}s</div></div>
            </div>
            <div className="min-h-[80px] p-4 bg-gray-50 rounded border border-gray-200 font-mono text-base leading-relaxed overflow-hidden">
              {words.map((w, i) => (
                <span key={i} className={i === current ? 'bg-yellow-100 px-1' : ''} style={{ color: i < current ? (correct[i] ? 'green' : 'red') : 'inherit' }}>
                  {w}{' '}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <input className="os9-input w-full" type="text" value={input} onChange={handleInput} placeholder={started ? '' : (t('startTyping') || 'Start typing...')} disabled={!started || finished} autoFocus />
          </div>
          {!started && <button className="os9-btn os9-btn-primary w-full" onClick={start}>{t('start') || 'Start'}</button>}
          {finished && <button className="os9-btn w-full" onClick={reset}>{t('tryAgain') || 'Try Again'}</button>}''',
    '''  const [mode, setMode] = useState('30');
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef(null);
  const wordList = "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me".split(' ');

  const start = () => {
    setWords(Array.from({ length: 50 }, () => wordList[Math.floor(Math.random() * wordList.length)]));
    setInput(''); setCurrent(0); setCorrect([]); setStarted(true); setFinished(false);
    setTimeLeft(mode === '15' ? 15 : mode === '30' ? 30 : mode === '60' ? 60 : 30);
    setWpm(0); setAccuracy(100);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { finish(); return 0; } return t - 1; });
    }, 1000);
  };

  const finish = () => { clearInterval(timerRef.current); setFinished(true); setStarted(false); };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (!started) return;
    const target = words[current];
    if (val.endsWith(' ') || val.length >= target.length) {
      const typed = val.trim();
      const c = typed === target;
      setCorrect(c => [...c, c]);
      setCurrent(c => c + 1);
      setInput('');
      const correctCount = correct.filter(x => x).length + (c ? 1 : 0);
      const total = current + 1;
      setAccuracy(Math.round((correctCount / total) * 100));
      const elapsed = (mode === '15' ? 15 : mode === '30' ? 30 : mode === '60' ? 60 : 30) - timeLeft;
      if (elapsed > 0) setWpm(Math.round((correctCount / 5) / (elapsed / 60)));
    }
  };

  const reset = () => { clearInterval(timerRef.current); start(); };'''
)

# === Minesweeper ===
write_page('minesweeper', '''<div className="flex justify-between mb-3 text-sm">
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
          {won && <div className="mt-3 text-center text-green-600 font-bold">{t('youWin') || 'You Win!'}</div>}''',
    '''  const [difficulty, setDifficulty] = useState('easy');
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

  useEffect(() => { newGame(); return () => clearInterval(timerRef.current); }, [difficulty]);'''
)

# === Solitaire (Klondike) ===
write_page('solitaire', '''<div className="flex justify-between mb-2 text-sm">
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
          <button className="os9-btn os9-btn-primary w-full" onClick={newGame}>{t('newGame') || 'New Game'}</button>''',
    '''  const suits = ['♥', '♦', '♣', '♠'];
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

  useEffect(() => { newGame(); }, []);'''
)

# === Checkers ===
write_page('checkers', '''<div className="mb-3">
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
          <button className="os9-btn os9-btn-primary w-full mt-2" onClick={newGame}>{t('newGame') || 'New Game'}</button>''',
    '''  const [board, setBoard] = useState([]);
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

  useEffect(() => { newGame(); }, []);'''
)

# === Video Poker ===
write_page('video-poker', '''<div className="flex justify-between mb-3 text-sm">
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
          {result && <div className="mt-3 text-center text-lg font-bold" style={{ color: result.startsWith(t('win') || 'Win') ? 'green' : 'black' }}>{result}</div>}''',
    '''  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
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
      const eval = evaluate(hand.map((c,i) => held[i] ? c : deck.pop()));
      const win = eval.payout * bet;
      setCredits(c => c + win);
      setLastWin(win);
      setResult(win > 0 ? (t('win') || 'Win') + ': ' + eval.name + ' ($' + win + ')' : (t('lose') || 'Lose'));
      setDealing(false);
    }
  };

  useEffect(() => { deal(); }, []);'''
)

# === Artillery Game ===
write_page('artillery', '''<div className="relative" style={{ width: '100%', height: 300, background: '#87CEEB', border: '2px solid #333', borderRadius: 4, overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div><label className="os9-label">{t('angle') || 'Angle'}: {angle}°</label><input className="os9-input w-full" type="range" min="0" max="90" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} /></div>
            <div><label className="os9-label">{t('power') || 'Power'}: {power}%</label><input className="os9-input w-full" type="range" min="10" max="100" value={power} onChange={(e) => setPower(parseInt(e.target.value))} /></div>
            <div className="flex items-end"><button className="os9-btn os9-btn-primary w-full" onClick={fire} disabled={firing}>{t('fire') || 'Fire!'}</button></div>
          </div>
          <div className="flex justify-between text-sm">
            <div>{t('player') || 'Player'} {currentPlayer + 1}: {t('health') || 'HP'} {players[currentPlayer].health}</div>
            <div>{t('wind') || 'Wind'}: {wind > 0 ? '→' : '←'} {Math.abs(wind)}</div>
            <div>{t('turn') || 'Turn'}: {turn}</div>
          </div>
          {winner !== null && <div className="mt-3 text-center text-2xl font-bold text-green-600">{t('winner') || 'Winner'}: Player {winner + 1}!</div>}
          <button className="os9-btn w-full mt-2" onClick={reset}>{t('newGame') || 'New Game'}</button>''',
    '''  const canvasRef = useRef(null);
  const [players, setPlayers] = useState([{ x: 80, y: 0, health: 100 }, { x: 0, y: 0, health: 100 }]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [wind, setWind] = useState(0);
  const [firing, setFiring] = useState(false);
  const [projectile, setProjectile] = useState(null);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const terrainRef = useRef([]);

  const generateTerrain = () => {
    const t = []; let y = 200;
    for (let x = 0; x < 800; x += 4) {
      y += (Math.random() - 0.5) * 20;
      y = Math.max(150, Math.min(280, y));
      t.push({ x, y });
    }
    terrainRef.current = t;
    setPlayers(p => {
      const np = [...p];
      np[0].y = t.find(p => p.x >= 80)?.y || 200;
      np[1].y = t.find(p => p.x >= 720)?.y || 200;
      return np;
    });
  };

  const fire = () => {
    setFiring(true);
    const p = players[currentPlayer];
    const rad = angle * Math.PI / 180;
    const vel = power * 0.5;
    setProjectile({ x: p.x, y: 300 - p.y, vx: Math.cos(rad) * vel, vy: -Math.sin(rad) * vel });
  };

  useEffect(() => {
    generateTerrain();
    setWind(Math.floor(Math.random() * 10) - 5);
  }, []);

  useEffect(() => {
    if (!firing || !projectile) return;
    const id = requestAnimationFrame(function step() {
      setProjectile(proj => {
        if (!proj) return null;
        const nx = proj.x + proj.vx;
        const ny = proj.y + proj.vy * 0.016 + 0.5 * 9.8 * 0.016 * 0.016;
        const nvx = proj.vx + wind * 0.01;
        const nvy = proj.vy + 9.8 * 0.016;
        const terrain = terrainRef.current;
        const groundY = terrain.find(t => t.x >= nx)?.y || 300;
        if (300 - ny >= groundY - 10 || nx < 0 || nx > 800) {
          setFiring(false);
          const target = 1 - currentPlayer;
          const dist = Math.abs(nx - players[target].x);
          if (dist < 40) {
            setPlayers(p => { const np = [...p]; np[target].health = Math.max(0, np[target].health - Math.max(10, 40 - dist)); return np; });
            if (players[target].health <= Math.max(10, 40 - dist)) setWinner(currentPlayer);
          }
          setCurrentPlayer(cp => 1 - cp);
          setTurn(t => t + 1);
          setWind(Math.floor(Math.random() * 10) - 5);
          setAngle(45); setPower(50);
          return null;
        }
        return { ...proj, x: nx, y: ny, vx: nvx, vy: nvy };
      });
      if (firing) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(id);
  }, [firing, projectile, players, currentPlayer, wind]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize(); window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 800, scaleY = canvas.height / 300;
      ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath(); ctx.moveTo(0, canvas.height);
      terrainRef.current.forEach(t => ctx.lineTo(t.x * scaleX, canvas.height - t.y * scaleY));
      ctx.lineTo(canvas.width, canvas.height); ctx.closePath(); ctx.fillStyle = '#8B4513'; ctx.fill();
      players.forEach((p, i) => {
        const px = p.x * scaleX, py = canvas.height - p.y * scaleY;
        ctx.fillStyle = i === 0 ? 'red' : 'blue';
        ctx.beginPath(); ctx.arc(px, py, 10 * scaleX, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'black'; ctx.font = '10px Arial'; ctx.fillText(`${p.health} HP`, px - 15, py - 15);
      });
      if (projectile) {
        const px = projectile.x * scaleX, py = canvas.height - projectile.y * scaleY;
        ctx.fillStyle = 'yellow'; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
      }
    };
    const loop = () => { draw(); requestAnimationFrame(loop); };
    loop();
    return () => window.removeEventListener('resize', resize);
  }, [players, projectile]);

  const reset = () => { generateTerrain(); setPlayers([{ x: 80, y: 0, health: 100 }, { x: 720, y: 0, health: 100 }]); setCurrentPlayer(0); setTurn(1); setWinner(null); setWind(Math.floor(Math.random() * 10) - 5); setAngle(45); setPower(50); setFiring(false); setProjectile(null); };'''
)

print("\nAll 6 complex games generated!")