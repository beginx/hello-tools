'use client';

import { useState, useCallback, useRef } from 'react';

const AM = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
const AL = {
  sedentary: '\uac70\uc758 \uc5c6\uc74c (\uc0ac\ubb34\uc9c1, \uc6b4\ub3d9 X)',
  light: '\uac00\ubc0c\uc5c4 (\uc8fc 1-3\uc77c \uc6b4\ub3d9)',
  moderate: '\ubcf4\ud1b5 (\uc8fc 3-5\uc77c \uc6b4\ub3d9)',
  active: '\ud65c\ubc1c\ud568 (\uc8fc 6-7\uc77c \uc6b4\ub3d9)',
  extra: '\ub9e4\uc6b0 \ud65c\ubc1c\ud568 (\uaca9\ub82c\ud55c \uc6b4\ub3d9/\uc721\uccb4\ub178\ub3d9)',
};
const GL = { lose: '\uccb4\uc911 \uac10\ub7c9', maintain: '\uccb4\uc911 \uc720\uc9c0', gain: '\uccb4\uc911 \uc99d\ub7c9' };
const AS = { sedentary: '\uc88c\uc2dd', light: '\uac00\ubc0c\uc74c', moderate: '\ubcf4\ud1b5', active: '\ud65c\ubc1c', extra: '\uaca9\ub82c' };

function bmiCat(b) {
  if (b < 18.5) return '\uc800\uccb4\uc911';
  if (b < 23) return '\uc815\uc0c1';
  if (b < 25) return '\uacfc\uccb4\uc911';
  if (b < 30) return '\ube44\ub9cc 1\ub2e8\uacc4';
  return '\ube44\ub9cc 2\ub2e8\uacc4 \uc774\uc0c1';
}

function calcBMR(g, w, h, a) {
  if (g === 'male') return 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
  return 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
}

function calcMacros(cal, goal) {
  let pr, fr;
  if (goal === 'lose') { pr = 0.35; fr = 0.25; }
  else if (goal === 'maintain') { pr = 0.30; fr = 0.25; }
  else { pr = 0.30; fr = 0.20; }
  const cr = 1 - pr - fr;
  return { protein: Math.round(cal * pr / 4), carbs: Math.round(cal * cr / 4), fat: Math.round(cal * fr / 9) };
}

function goalAdj(goal, tdee) {
  if (goal === 'lose') return tdee - 500;
  if (goal === 'gain') return tdee + 300;
  return tdee;
}

export default function CalorieCalculatorPage() {
  const [gender, setGender] = useState('male');
  const [unit, setUnit] = useState('metric');
  const [mWeight, setMWeight] = useState('72');
  const [mHeight, setMHeight] = useState('175');
  const [iWeight, setIWeight] = useState('158');
  const [iFt, setIFt] = useState('5');
  const [iIn, setIIn] = useState('9');
  const [age, setAge] = useState('30');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const wKg = unit === 'metric' ? (parseFloat(mWeight) || 0) : ((parseFloat(iWeight) || 0) * 0.453592);
  const hCm = unit === 'metric' ? (parseFloat(mHeight) || 0) : (((parseFloat(iFt) || 0) * 30.48) + ((parseFloat(iIn) || 0) * 2.54));

  const calc = useCallback(() => {
    const w = wKg, h = hCm, a = parseInt(age) || 30;
    if (w <= 0 || h <= 0) return;
    const bmr = Math.round(calcBMR(gender, w, h, a));
    const tdee = Math.round(bmr * AM[activity]);
    const tc = Math.round(goalAdj(goal, tdee));
    const m = calcMacros(tc, goal);
    const bmi = Math.round((w / ((h / 100) ** 2)) * 10) / 10;
    setResults({ bmr, tdee, targetCalories: tc, ...m, bmi, bmiCategory: bmiCat(bmi) });
    setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }, [gender, wKg, hCm, age, activity, goal]);

  const keyDown = (e) => { if (e.key === 'Enter') calc(); };

  const copyRes = () => {
    if (!results) return;
    const r = results;
    const txt = [
      'Calorie Calculator Results',
      'BMI: ' + r.bmi + ' (' + r.bmiCategory + ')',
      'BMR: ' + r.bmr.toLocaleString() + ' kcal',
      'TDEE: ' + r.tdee.toLocaleString() + ' kcal',
      'Target: ' + r.targetCalories.toLocaleString() + ' kcal/day',
      'Protein: ' + r.protein + 'g | Carbs: ' + r.carbs + 'g | Fat: ' + r.fat + 'g'
    ].join('\n');
    navigator.clipboard.writeText(txt).then(function() {
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2500);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 520, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">Calorie Calculator</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-5">
            <span className="os9-label" style={{ marginBottom: 0 }}>Unit</span>
            <div className="os9-unit-toggle">
              <div className={'os9-unit-option' + (unit === 'metric' ? ' os9-unit-option-active' : '')} onClick={function() { setUnit('metric'); }}>Metric</div>
              <div className={'os9-unit-option' + (unit === 'imperial' ? ' os9-unit-option-active' : '')} onClick={function() { setUnit('imperial'); }}>Imperial</div>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <button className={'os9-btn flex-1' + (gender === 'male' ? ' os9-btn-primary' : '')} onClick={function() { setGender('male'); }}>Male</button>
            <button className={'os9-btn flex-1' + (gender === 'female' ? ' os9-btn-primary' : '')} onClick={function() { setGender('female'); }}>Female</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">Age</label>
            <input className="os9-input" type="number" min={10} max={120} value={age} onChange={function(e) { setAge(e.target.value); }} onKeyDown={keyDown} placeholder="30" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</label>
              <input className="os9-input" type="number" step="0.1" min={20} max={400}
                value={unit === 'metric' ? mWeight : iWeight}
                onChange={function(e) { if (unit === 'metric') setMWeight(e.target.value); else setIWeight(e.target.value); }}
                onKeyDown={keyDown}
                placeholder={unit === 'metric' ? '72' : '158'} />
            </div>
            {unit === 'metric' ? (
              <div>
                <label className="os9-label">Height (cm)</label>
                <input className="os9-input" type="number" step="0.1" min={100} max={250} value={mHeight}
                  onChange={function(e) { setMHeight(e.target.value); }} onKeyDown={keyDown} placeholder="175" />
              </div>
            ) : (
              <div className="flex gap-1">
                <div style={{ flex: 1 }}>
                  <label className="os9-label">ft</label>
                  <input className="os9-input" type="number" min={3} max={8} value={iFt}
                    onChange={function(e) { setIFt(e.target.value); }} onKeyDown={keyDown} placeholder="5" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="os9-label">in</label>
                  <input className="os9-input" type="number" min={0} max={11} value={iIn}
                    onChange={function(e) { setIIn(e.target.value); }} onKeyDown={keyDown} placeholder="9" />
                </div>
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="os9-label">Activity</label>
            <select className="os9-select" value={activity} onChange={function(e) { setActivity(e.target.value); }}>
              {Object.keys(AL).map(function(k) { return <option key={k} value={k}>{AL[k]}</option>; })}
            </select>
          </div>
          <div className="mb-5">
            <label className="os9-label">Goal</label>
            <div className="flex gap-2">
              {Object.keys(GL).map(function(k) {
                return <button key={k} className={'os9-btn flex-1 text-xs px-1' + (goal === k ? ' os9-btn-primary' : '')}
                  onClick={function() { setGoal(k); }}>{GL[k]}</button>;
              })}
            </div>
          </div>
          <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calc}>Calculate</button>

          {results && (
            <div ref={ref} className="mt-5">
              <hr className="os9-divider" />
              <div className="os9-result mb-3 flex justify-between items-center">
                <div>
                  <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>BMI</div>
                  <div className="text-sm font-bold">{results.bmiCategory}</div>
                </div>
                <div className="os9-big-number">{results.bmi}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="os9-result text-center">
                  <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>BMR</div>
                  <div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{results.bmr.toLocaleString()}</div>
                  <div className="text-[10px]" style={{ opacity: 0.6 }}>kcal</div>
                </div>
                <div className="os9-result text-center" style={{ borderColor: 'var(--os9-accent)' }}>
                  <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>TDEE</div>
                  <div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{results.tdee.toLocaleString()}</div>
                  <div className="text-[10px]" style={{ opacity: 0.6 }}>kcal</div>
                </div>
                <div className="os9-result text-center">
                  <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>Target</div>
                  <div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{results.targetCalories.toLocaleString()}</div>
                  <div className="text-[10px]" style={{ opacity: 0.6 }}>kcal</div>
                </div>
              </div>
              <div className="os9-result mb-3">
                <div className="text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.6 }}>Macros</div>
                <div className="flex gap-2 text-center">
                  <div className="flex-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,165,0,0.15)' }}>
                    <div className="text-lg font-bold">{results.carbs}g</div>
                    <div className="text-[10px]" style={{ opacity: 0.6 }}>Carbs</div>
                  </div>
                  <div className="flex-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,0,0,0.15)' }}>
                    <div className="text-lg font-bold">{results.protein}g</div>
                    <div className="text-[10px]" style={{ opacity: 0.6 }}>Protein</div>
                  </div>
                  <div className="flex-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,200,0,0.15)' }}>
                    <div className="text-lg font-bold">{results.fat}g</div>
                    <div className="text-[10px]" style={{ opacity: 0.6 }}>Fat</div>
                  </div>
                </div>
              </div>
              <button className="os9-btn w-full text-xs py-2" onClick={copyRes}>{copied ? 'Copied!' : 'Copy Results'}</button>
              <p className="text-[10px] text-center mt-3" style={{ opacity: 0.5 }}>
                * Estimated using Mifflin-St Jeor equation.<br />Individual results may vary.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        hello-tools 2026
      </div>
    </div>
  );
}