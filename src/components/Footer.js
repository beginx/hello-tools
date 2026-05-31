'use client';

export default function Footer({ locale = 'en', maxWidth = 420 }) {
  return (
    <div className="os9-footer" style={{ maxWidth, width: '100%' }}>
      <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
      <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
      <a href={'/' + locale + '/timer'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Timer</a>
      <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
      <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Convert</a>
      <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
      <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Percent</a>
      <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
      hello-tools 2026
    </div>
  );
}
