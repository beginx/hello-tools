'use client';

export default function SEODescription({ description, relatedTools = [], locale = 'en' }) {
  return (
    <div className="mt-4 px-1">
      <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>
        {description}
      </p>
      {relatedTools.length > 0 && (
        <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
          <span style={{ fontWeight: 600 }}>Related Tools:</span>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
            {relatedTools.map((tool, index) => (
              <a
                key={index}
                href={`/${locale}${tool.href}`}
                className="underline"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
