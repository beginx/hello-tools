'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function PrivacyPage() {
  const t = useTranslations('privacy');
  const params = useParams();
  const locale = params?.locale || 'en';
  const changeLang = (l) => { window.location.href = '/' + l + '/privacy'; };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 640, width: '100%' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
            <span className="text-[10px]" style={{ opacity: 0.5 }}>{t('lastUpdated')}</span>
          </div>

          <div className="space-y-5 text-sm">
            <p style={{ opacity: 0.8 }}>{t('intro')}</p>

            <div>
              <h2 className="text-base font-bold mb-2">{t('infoWeCollect')}</h2>
              <p className="mb-2" style={{ opacity: 0.8 }}>{t('infoWeCollectDesc')}</p>
              <ul className="list-disc list-inside space-y-1" style={{ opacity: 0.8 }}>
                <li>{t('analytics')}</li>
                <li>{t('ads')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">{t('cookies')}</h2>
              <p style={{ opacity: 0.8 }}>{t('cookiesDesc')}</p>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">{t('dataUsage')}</h2>
              <ul className="list-disc list-inside space-y-1" style={{ opacity: 0.8 }}>
                <li>{t('dataUsageItem1')}</li>
                <li>{t('dataUsageItem2')}</li>
                <li>{t('dataUsageItem3')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">{t('thirdParty')}</h2>
              <p className="mb-2" style={{ opacity: 0.8 }}>{t('thirdPartyDesc')}</p>
              <ul className="list-disc list-inside space-y-1" style={{ opacity: 0.8 }}>
                <li>{t('thirdPartyVercel')}</li>
                <li>{t('thirdPartyGoogle')}</li>
                <li>{t('thirdPartyGithub')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">{t('yourRights')}</h2>
              <p className="mb-2" style={{ opacity: 0.8 }}>{t('yourRightsDesc')}</p>
              <ul className="list-disc list-inside space-y-1" style={{ opacity: 0.8 }}>
                <li>{t('right1')}</li>
                <li>{t('right2')}</li>
                <li>{t('right3')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">{t('contact')}</h2>
              <p style={{ opacity: 0.8 }}>{t('contactDesc')}</p>
            </div>

            <div>
              <h2 className="text-base font-bold mb-2">{t('changes')}</h2>
              <p style={{ opacity: 0.8 }}>{t('changesDesc')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 640, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/privacy'} className="underline" style={{ opacity: 0.7 }}>{t('title')}</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}