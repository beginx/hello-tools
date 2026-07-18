'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/tarot.json';
import esMsgs from '../../../messages/es/tarot.json';
import zhMsgs from '../../../messages/zh/tarot.json';
import koMsgs from '../../../messages/ko/tarot.json';
import ptMsgs from '../../../messages/pt/tarot.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function TarotPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/tarot'; };
  
  const [spread, setSpread] = useState('single');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const deck = [
    { name: "The Fool", emoji: "🃏", meaning: "New beginnings, spontaneity, faith" },
    { name: "The Magician", emoji: "🔮", meaning: "Manifestation, resourcefulness, power" },
    { name: "The High Priestess", emoji: "🌙", meaning: "Intuition, sacred knowledge, divine feminine" },
    { name: "The Empress", emoji: "👑", meaning: "Fertility, femininity, beauty, nature" },
    { name: "The Emperor", emoji: "🏰", meaning: "Authority, structure, control, fatherhood" },
    { name: "The Hierophant", emoji: "⛪", meaning: "Tradition, conformity, morality, ethics" },
    { name: "The Lovers", emoji: "❤️", meaning: "Love, harmony, relationships, choices" },
    { name: "The Chariot", emoji: "🏆", meaning: "Control, willpower, victory, determination" },
    { name: "Strength", emoji: "🦁", meaning: "Courage, persuasion, influence, compassion" },
    { name: "The Hermit", emoji: "🕯️", meaning: "Soul searching, introspection, guidance" },
    { name: "Wheel of Fortune", emoji: "🎡", meaning: "Good luck, karma, life cycles, destiny" },
    { name: "Justice", emoji: "⚖️", meaning: "Justice, fairness, truth, cause and effect" },
    { name: "The Hanged Man", emoji: "🤸", meaning: "Pause, surrender, letting go, new perspectives" },
    { name: "Death", emoji: "💀", meaning: "Endings, change, transformation, transition" },
    { name: "Temperance", emoji: "🧪", meaning: "Balance, moderation, patience, purpose" },
    { name: "The Devil", emoji: "😈", meaning: "Shadow self, attachment, addiction, restriction" },
    { name: "The Tower", emoji: "🗼", meaning: "Sudden change, upheaval, chaos, revelation" },
    { name: "The Star", emoji: "⭐", meaning: "Hope, faith, purpose, renewal, spirituality" },
    { name: "The Moon", emoji: "🌙", meaning: "Illusion, fear, anxiety, subconscious, intuition" },
    { name: "The Sun", emoji: "☀️", meaning: "Positivity, fun, warmth, success, vitality" },
    { name: "Judgement", emoji: "📯", meaning: "Judgement, rebirth, inner calling, absolution" },
    { name: "The World", emoji: "🌍", meaning: "Completion, integration, accomplishment, travel" }
  ];

  const drawCards = () => {
    setLoading(true);
    const count = spread === 'single' ? 1 : 3;
    const drawn = [];
    for (let i = 0; i < count; i++) {
      const c = deck[Math.floor(Math.random() * deck.length)];
      drawn.push({ ...c, reversed: Math.random() > 0.5 });
    }
    setTimeout(() => {
      setCards(drawn);
      setLoading(false);
    }, 300);
  };

  const spreadLabels = {
    single: { en: 'Single Card', es: 'Una Carta', zh: '单张牌', ko: '한 장', pt: 'Uma Carta' },
    three: { en: '3-Card Spread', es: 'Tirada de 3', zh: '三张牌', ko: '세 장', pt: '3 Cartas' }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 520, width: '100%' }}>
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
          
          <div className="mb-4">
            <label className="os9-label mb-1 block">{t('spread') || 'Spread Type'}</label>
            <div className="flex gap-2">
              <button className={'os9-btn flex-1' + (spread === 'single' ? ' os9-btn-primary' : '')} onClick={() => setSpread('single')}>
                {spreadLabels.single[locale] || spreadLabels.single.en}
              </button>
              <button className={'os9-btn flex-1' + (spread === 'three' ? ' os9-btn-primary' : '')} onClick={() => setSpread('three')}>
                {spreadLabels.three[locale] || spreadLabels.three.en}
              </button>
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full mb-4" onClick={drawCards} disabled={loading}>
            {loading ? (t('drawing') || 'Drawing...') : (t('drawCard') || 'Draw Cards')}
          </button>

          {cards.length > 0 && (
            <div className="space-y-3 mb-4">
              {cards.map((card, i) => (
                <div key={i} className="os9-result p-3 text-center">
                  <div className="text-5xl mb-2">{card.emoji}</div>
                  <div className="text-lg font-bold mb-1">{card.name}</div>
                  {spread === 'three' && (
                    <div className="text-xs mb-1" style={{ opacity: 0.7 }}>
                      {i === 0 ? (t('past') || 'Past') : i === 1 ? (t('present') || 'Present') : (t('future') || 'Future')}
                    </div>
                  )}
                  <div className="text-sm mb-1" style={{ opacity: 0.8 }}>{card.meaning}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>
                    {card.reversed ? (t('reversed') || 'Reversed') : (t('upright') || 'Upright')}
                  </div>
                </div>
              ))}
            </div>
          )}

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

