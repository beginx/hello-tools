'use client';

export default function LanguageSelector({ locale = 'en', onChange }) {
  return (
    <select
      className="os9-select !w-auto text-sm"
      value={locale}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="zh">中文</option>
      <option value="ko">한국어</option>
      <option value="pt">Português</option>
    </select>
  );
}
