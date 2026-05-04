'use client';

import { useState, useCallback, useRef } from 'react';

// --- Types ---
type Gender = 'male' | 'female';
type Unit = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
type Goal = 'lose' | 'maintain' | 'gain';

interface Results {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  bmi: number | null;
  bmiCategory: string;
}

// --- Constants ---
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9,
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: '거의 없음 (사무직, 운동 X)',
  light: '가벼움 (주 1-3일 운동)',
  moderate: '보통 (주 3-5일 운동)',
  active: '활발함 (주 6-7일 운동)',
  extra: '매우 활발함 (격렬한 운동/육체노동)',
};

const GOAL_LABELS: Record<Goal, string> = {
  lose: '체중 감량',
  maintain: '체중 유지',
  gain: '체중 증량',
};

const ACTIVITY_SHORT: Record<ActivityLevel, string> = {
  sedentary: '좌식',
  light: '가벼움',
  moderate: '보통',
  active: '활발',
  extra: '격렬',
};

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상';
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '비만 1단계';
  return '비만 2단계 이상';
}

function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (gender === 'male') {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

// --- Macro calculation ---
function calculateMacros(calories: number, goal: Goal) {
  let proteinRatio: number, fatRatio: number;
  switch (goal) {
    case 'lose':
      proteinRatio = 0.35; fatRatio = 0.25;
      break;
    case 'maintain':
      proteinRatio = 0.30; fatRatio = 0.25;
      break;
    case 'gain':
      proteinRatio = 0.30; fatRatio = 0.20;
      break;
  }
  const carbRatio = 1 - proteinRatio - fatRatio;
  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9),
  };
}

function GoalAdjust(goal: Goal, tdee: number): number {
  switch (goal) {
    case 'lose': return tdee - 500;
    case 'maintain': return tdee;
    case 'gain': return tdee + 300;
  }
}

export default function CalorieCalculatorPage() {
  const [gender, setGender] = useState<Gender>('male');
  const [unit, setUnit] = useState<Unit>('metric');
  const [metricWeight, setMetricWeight] = useState('72');
  const [metricHeight, setMetricHeight] = useState('175');
  const [imperialWeight, setImperialWeight] = useState('158');
  const [imperialHeightFeet, setImperialHeightFeet] = useState('5');
  const [imperialHeightInches, setImperialHeightInches] = useState('9');
  const [age, setAge] = useState('30');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [results, setResults] = useState<Results | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const weightKg = unit === 'metric'
    ? parseFloat(metricWeight) || 0
    : (parseFloat(imperialWeight) || 0) * 0.453592;
  const heightCm = unit === 'metric'
    ? parseFloat(metricHeight) || 0
    : ((parseFloat(imperialHeightFeet) || 0) * 30.48) + ((parseFloat(imperialHeightInches) || 0) * 2.54);

  const handleCalculate = useCallback(() => {
    const w = weightKg;
    const h = heightCm;
    const a = parseInt(age) || 30;
    if (w <= 0 || h <= 0) return;

    const bmr = Math.round(calculateBMR(gender, w, h, a));
    const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
    const targetCalories = Math.round(GoalAdjust(goal, tdee));
    const macros = calculateMacros(targetCalories, goal);
    const bmi = Math.round((w / ((h / 100) ** 2)) * 10) / 10;

    setResults({
      bmr,
      tdee,
      targetCalories,
      ...macros,
      bmi,
      bmiCategory: getBMICategory(bmi),
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [gender, weightKg, heightCm, age, activity, goal]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate();
  };

  const copyResults = () => {
    if (!results) return;
    const text = `📊 칼로리 계산 결과
BMI: ${results.bmi} (${results.bmiCategory})
BMR: ${results.bmr.toLocaleString()} kcal
TDEE: ${results.tdee.toLocaleString()} kcal
목표 칼로리: ${results.targetCalories.toLocaleString()} kcal/일
단백질: ${results.protein}g | 탄수화물: ${results.carbs}g | 지방: ${results.fat}g`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      {/* Ad - Top */}
      <div className="os9-ad w-full max-w-[520px] mb-4">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <span className="text-[10px] opacity-50">— Ad —</span>
      </div>

      <div className="os9-window">
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">🍎 칼로리 계산기</span>
        </div>

        <div className="os9-window-body">
          {/* Unit Toggle */}
          <div className="flex justify-between items-center mb-5">
            <span className="os9-label !mb-0">단위</span>
            <div className="os9-unit-toggle">
              <div
                className={`os9-unit-option ${unit === 'metric' ? 'os9-unit-option-active' : ''}`}
                onClick={() => setUnit('metric')}
              >Metric</div>
              <div
                className={`os9-unit-option ${unit === 'imperial' ? 'os9-unit-option-active' : ''}`}
                onClick={() => setUnit('imperial')}
              >Imperial</div>
            </div>
          </div>

          {/* Gender */}
          <div className="flex gap-2 mb-4">
            <button
              className={`os9-btn flex-1 ${gender === 'male' ? 'os9-btn-primary' : ''}`}
              onClick={() => setGender('male')}
            >♂ 남성</button>
            <button
              className={`os9-btn flex-1 ${gender === 'female' ? 'os9-btn-primary' : ''}`}
              onClick={() => setGender('female')}
            >♀ 여성</button>
          </div>

          {/* Age */}
          <div className="mb-3">
            <label className="os9-label">나이</label>
            <input
              className="os9-input"
              type="number"
              min={10}
              max={120}
              value={age}
              onChange={e => setAge(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="30"
            />
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{unit === 'metric' ? '체중 (kg)' : '체중 (lbs)'}</label>
              <input
                className="os9-input"
                type="number"
                step="0.1"
                min={20}
                max={400}
                value={unit === 'metric' ? metricWeight : imperialWeight}
                onChange={e => unit === 'metric' ? setMetricWeight(e.target.value) : setImperialWeight(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={unit === 'metric' ? '72' : '158'}
              />
            </div>
            {unit === 'metric' ? (
              <div>
                <label className="os9-label">키 (cm)</label>
                <input
                  className="os9-input"
                  type="number"
                  step="0.1"
                  min={100}
                  max={250}
                  value={metricHeight}
                  onChange={e => setMetricHeight(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="175"
                />
              </div>
            ) : (
              <div className="flex gap-1">
                <div className="flex-1">
                  <label className="os9-label">키 (ft)</label>
                  <input
                    className="os9-input"
                    type="number"
                    min={3}
                    max={8}
                    value={imperialHeightFeet}
                    onChange={e => setImperialHeightFeet(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="5"
                  />
                </div>
                <div className="flex-1">
                  <label className="os9-label">inch</label>
                  <input
                    className="os9-input"
                    type="number"
                    min={0}
                    max={11}
                    value={imperialHeightInches}
                    onChange={e => setImperialHeightInches(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="9"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Activity Level */}
          <div className="mb-3">
            <label className="os9-label">활동량</label>
            <select
              className="os9-select"
              value={activity}
              onChange={e => setActivity(e.target.value as ActivityLevel)}
            >
              {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div className="mb-5">
            <label className="os9-label">목표</label>
            <div className="flex gap-2">
              {Object.entries(GOAL_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`os9-btn flex-1 text-[11px] px-2 ${goal === key ? 'os9-btn-primary' : ''}`}
                  onClick={() => setGoal(key as Goal)}
                >{key === 'lose' ? '⬇' : key === 'gain' ? '⬆' : '➡'} {label}</button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            className="os9-btn os9-btn-primary w-full text-base py-3"
            onClick={handleCalculate}
          >계산하기</button>

          {/* Results */}
          {results && (
            <div ref={resultRef} className="mt-5">
              <hr className="os9-divider" />

              {/* BMI */}
              <div className="os9-result mb-3 flex justify-between items-center">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-60">BMI</div>
                  <div className="text-sm font-bold">{results.bmiCategory}</div>
                </div>
                <div className="os9-big-number">{results.bmi}</div>
              </div>

              {/* Main calories grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="os9-result text-center">
                  <div className="text-[10px] uppercase tracking-wider opacity-60">BMR</div>
                  <div className="os9-big-number !text-xl">{results.bmr.toLocaleString()}</div>
                  <div className="text-[10px] opacity-60">kcal</div>
                </div>
                <div className="os9-result text-center" style={{ borderColor: 'var(--os9-accent)' }}>
                  <div className="text-[10px] uppercase tracking-wider opacity-60">TDEE</div>
                  <div className="os9-big-number !text-xl">{results.tdee.toLocaleString()}</div>
                  <div className="text-[10px] opacity-60">kcal</div>
                </div>
                <div className="os9-result text-center" style={{ borderColor: goal === 'lose' ? 'var(--os9-red)' : goal === 'gain' ? 'var(--os9-green)' : 'var(--os9-orange)' }}>
                  <div className="text-[10px] uppercase tracking-wider opacity-60">목표</div>
                  <div className="os9-big-number !text-xl">{results.targetCalories.toLocaleString()}</div>
                  <div className="text-[10px] opacity-60">kcal/일</div>
                </div>
              </div>

              {/* Macros */}
              <div className="os9-result mb-3">
                <div className="text-xs uppercase tracking-wider opacity-60 mb-2">영양소 분할 (탄/단/지)</div>
                <div className="flex gap-2 text-center">
                  <div className="flex-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold">{results.carbs}g</div>
                    <div className="text-[10px] opacity-60">탄수화물</div>
                  </div>
                  <div className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold">{results.protein}g</div>
                    <div className="text-[10px] opacity-60">단백질</div>
                  </div>
                  <div className="flex-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold">{results.fat}g</div>
                    <div className="text-[10px] opacity-60">지방</div>
                  </div>
                </div>
              </div>

              {/* Activity indicator */}
              <div className="flex justify-between items-center text-[11px] opacity-60 mb-2 px-1">
                <span>⚡ {ACTIVITY_SHORT[activity]}</span>
                <span>{gender === 'male' ? '♂' : '♀'} {age}세</span>
                <span>{weightKg.toFixed(0)}kg / {heightCm.toFixed(0)}cm</span>
              </div>

              {/* Copy Button */}
              <button
                className="os9-btn w-full text-xs py-2"
                onClick={copyResults}
              >{copied ? '✅ 복사됨!' : '📋 결과 복사하기'}</button>

              {/* Note */}
              <p className="text-[10px] opacity-50 text-center mt-3">
                * 결과는 Mifflin-St Jeor 공식 기반 추정치입니다.<br />
                개인별 차이가 있을 수 있으니 2-4주간 추세를 확인하며 조정하세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ad - Bottom */}
      <div className="os9-ad w-full max-w-[520px] mt-4">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <span className="text-[10px] opacity-50">— Ad —</span>
      </div>

      {/* Footer */}
      <div className="os9-footer max-w-[520px] w-full">
        hello-tools &copy; 2026 &middot; 무료 칼로리 계산기
      </div>
    </div>
  );
}