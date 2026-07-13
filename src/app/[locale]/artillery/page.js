'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/artillery.json';
import esMsgs from '../../../messages/es/artillery.json';
import zhMsgs from '../../../messages/zh/artillery.json';
import koMsgs from '../../../messages/ko/artillery.json';
import ptMsgs from '../../../messages/pt/artillery.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function ArtilleryPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/artillery'; };
  const canvasRef = useRef(null);
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

  const reset = () => { generateTerrain(); setPlayers([{ x: 80, y: 0, health: 100 }, { x: 720, y: 0, health: 100 }]); setCurrentPlayer(0); setTurn(1); setWinner(null); setWind(Math.floor(Math.random() * 10) - 5); setAngle(45); setPower(50); setFiring(false); setProjectile(null); };

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
          <div className="relative" style={{ width: '100%', height: 300, background: '#87CEEB', border: '2px solid #333', borderRadius: 4, overflow: 'hidden' }}>
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
                    <button className="os9-btn w-full mt-2" onClick={reset}>{t('newGame') || 'New Game'}</button>
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