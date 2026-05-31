'use client';

export default function OS9Window({ title, children, maxWidth = 420, className = '' }) {
  return (
    <div className={`os9-window ${className}`} style={{ maxWidth, width: '100%' }}>
      <div className="os9-titlebar relative">
        <div className="os9-window-controls">
          <div className="os9-dot os9-dot-close" />
          <div className="os9-dot os9-dot-minimize" />
          <div className="os9-dot os9-dot-zoom" />
        </div>
        <span className="tracking-[0.5px] text-sm">{title}</span>
      </div>
      <div className="os9-window-body">
        {children}
      </div>
    </div>
  );
}
