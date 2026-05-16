<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:sisyphus-postmortem -->
# Postmortem: next-intl 언어 전환 이슈 (2026-05-09 ~ 2026-05-10)

## 요약
Vercel에 배포한 oxoxox1.com 웹사이트에서 새로 추가된 도구들(timer/tip/discount/average/compound)의 언어 전환이 Vercel 환경에서만 실패. 로컬에서는 정상 동작했으나 Vercel에서만 `MISSING_MESSAGE` 에러 발생. 2일간의 디버깅 끝에 `next-intl` v4.11.0을 완전히 제거하고 직접 JSON import 방식으로 전환하여 해결.

## 문제 타임라인

### 1일차: 증상 발견
- 4개 새 도구(tip/discount/average/compound) + 타이머 추가
- Vercel 배포 후 타이머 언어 전환 실패 (`timer.title` 키 문자열 그대로 노출)
- 기존 도구(percent, convert 등)는 언어 전환 정상
- 콘솔 에러: `MISSING_MESSAGE: timer (ko)`
- 로컬 clean build + start에서는 정상, Vercel에서만 실패

### 1일차 시도:
1. `getMessages()`가 새 네임스페이스를 누락하는 것으로 추정 → layout.js에서 직접 messages import로 변경
2. 모든 메시지 import를 `src/lib/messages.js`로 리팩토링 (단일 진실 공급원)
3. `request.js`와 `layout.js`가 동일한 `messages.js`를 import하도록 통일
4. → 모두 Vercel에서 실패 (로컬은 정상)

### 2일차: 근본 원인 접근
5. `next-intl` 플러그인 의심 → `next.config.mjs`에서 `createNextIntlPlugin`과 `middleware.js`를 next-intl 없는 직접 구현체로 교체
6. `useTranslations`를 `useTrans`(직접 구현 훅)로 교체 시도
7. **Turbopack이 `[locale]` 동적 라우트 디렉토리 밖으로의 JS/TS import를 차단**하는 현상 발견
   - `_lib/useTrans.js` → 실패
   - `shared/useTrans.js` → 실패
   - 직접 JSON import (`../../../messages/en/timer.json`) → 성공
8. 모든 page.js를 직접 JSON import 방식으로 변경 시도 중 너무 많은 파일을 건드려서 복잡도 폭발

### 2일차: 해결
9. git reset으로 `bfccfaf`(마지막 성공 빌드)로 복원
10. 새 브랜치 `feat/remove-next-intl` 생성
11. `next-intl` 완전 제거:
    - `package.json`에서 `next-intl` 의존성 제거
    - `next.config.mjs`에서 `createNextIntlPlugin` 제거
    - `src/i18n/request.js` 삭제
    - `layout.js`에서 `NextIntlClientProvider` 제거
    - 모든 page.js에서 `useTranslations` → 직접 5개국어 JSON import + `t()` 래퍼
    - `middleware.js` → `src/proxy.js`로 교체 (Next.js 16에서는 middleware 대신 proxy 사용)
12. 로컬 clean build + 5개국어 테스트 통과
13. main에 강제 push → Vercel 배포 성공

## 근본 원인

### 1차 원인: `next-intl` v4.11.0의 Vercel 호환성 문제
- 서버 사이드(SSR)에서는 `getMessages()`로 정상 번역
- 클라이언트 사이드(hydration)에서 next-intl이 내부적으로 메시지를 다시 로드하려다 실패
- 콘솔에 `MISSING_MESSAGE` 에러 발생 후 `t('key')`가 키 이름을 그대로 반환
- **로컬에서는 동작, Vercel에서만 실패** → Vercel Turbopack 환경 특정 이슈

### 2차 원인: Next.js 16과 next-intl의 호환성
- Next.js 16.2.4는 Turbopack 기반, `next-intl` v4.11.0과의 조합에서 Vercel 환경에서만 문제 발생
- `next-intl`의 클라이언트 번들이 Turbopack 최적화와 충돌하는 것으로 추정

### 3차 발견: Next.js 16에서 middleware → proxy
- Next.js 16.2.4에서는 `middleware.js` 대신 `src/proxy.js` 사용이 필수
- 루트 `middleware.js`를 사용하면 Vercel 빌드 시 `middleware.js.nft.json` ENOENT 에러 발생
- 이 에러는 Vercel의 Next.js output file tracing이 middleware를 제대로 처리하지 못해서 발생

## 교훈 및 규칙

### 1. Vercel 배포 전 로컬에서 반드시 clean build
```bash
Stop-Process -Name "node" -Force
Remove-Item .next -Recurse -Force
npx next build  # ← 반드시 clean build로 테스트
```
`npx next dev`만으로는 Vercel 환경과 차이가 있어 신뢰할 수 없음.

### 2. 새 기능은 브랜치를 따서 개발
```bash
git checkout -b feat/도구명
# 개발 및 테스트
git push origin feat/도구명
# main에 머지 전 Vercel에서도 테스트
```

### 3. `next-intl` 사용 금지
- 모든 번역은 직접 JSON import 방식 사용
- 패턴: 각 page.js에서 5개국어 JSON 파일 직접 import
```js
import enMsgs from '../../../messages/en/toolname.json';
import koMsgs from '../../../messages/ko/toolname.json';
// ...es, zh, pt
const pageMsgs = { en: enMsgs, ko: koMsgs, /* ... */ };
// 컴포넌트 내:
const params = useParams();
const locale = params?.locale || 'en';
const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
```

### 4. Next.js 16 proxy 사용
- `middleware.js`를 루트에 두지 말 것
- 대신 `src/proxy.js` 사용 (Next.js 16 필수)
- proxy 함수는 `Response.redirect()` 또는 `request.headers.set()` 후 `return` 없이 종료

### 5. `[locale]` 동적 라우트 import 제한
- `[locale]` 디렉토리 안에서 밖으로의 **JS/TS 파일 import**는 Turbopack에서 실패
- **JSON 파일 import는 가능** (직접 import 방식은 안전)
- 공통 헬퍼 함수가 필요하면 각 page.js에 인라인으로 작성

### 6. Vercel 강제 push 주의
- `git push --force`는 Vercel webhook을 트리거하지 않을 수 있음
- 강제 push 후에는 Vercel Dashboard에서 수동 Deploy 권장
- 또는 빈 커밋(`git commit --allow-empty`) 후 일반 push로 트리거

### 7. Turbopack `[locale]` 경로 버그
- Turbopack이 `[locale]` (동적 라우트) 디렉토리명을 literal path가 아닌 glob/wildcard로 해석
- 이로 인해 `[locale]` 밖으로의 모듈 import가 실패할 수 있음
- 해결: JSON 파일만 직접 import, JS 헬퍼는 각 page.js에 인라인

## 현재 아키텍처
- 번역: 직접 JSON import (next-intl 의존성 0)
- 라우팅: `src/proxy.js` (locale 감지 + 리디렉션)
- 레이아웃: `layout.js`에 `x-pathname` 헤더 기반 tool metadata 제공
- 빌드: `npx next build` (Turbopack), `Compiled successfully`
- 배포: GitHub push → Vercel 자동 배포
<!-- END:sisyphus-postmortem -->

<!-- BEGIN:sisyphus-adsense -->
# AdSense 운영 규칙 (2026-05-11)

## Google AdSense 상태
- **사이트**: `oxoxox1.com`
- **상태**: "주의 필요" — "게시자 콘텐츠가 없는 화면에 Google 게재 광고"
- **해결 조치**: layout.js에 동적 `<title>` + `<meta name="description">` + `<og:title/description>` + `<twitter:card>` 추가 완료
- **해결 조치**: layout.js에 모든 페이지 하단 공통 SEO 텍스트 섹션 추가 완료 (5개국어)
- **최초 검토 요청**: 2026-05-06 (거절)
- **다음 검토 요청 가능일**: **2026년 5월 12일 (화)** ← 중요! 이 날짜 이후에만 재요청 가능

## 검토 요청 제한 규칙
- 검토 요청 가능 횟수가 모두 소진되면 일정 기간 동안 요청 불가
- 현재: 2026-05-12까지 대기 필요
- 재요청 시: AdSense 계정 → 사이트 → oxoxox1.com → 검토 요청 → "위반 사항을 해결했습니다" 선택
- 검토 소요 기간: 일반적으로 1-2주 (최대 4주)

## SEO 작업 내역 (2026-05-12)
### 각 page.js 하단에 추가한 콘텐츠
1. **SEO Description (5개국어)** — 각 도구별 고유한 서비스 설명 60-120단어
   - `messages/{locale}/{tool}.json`에 `"seoDescription"` 키 추가
   - page.js 하단에 `<p>{t('seoDescription')}</p>`로 렌더링
   - BMI 등 `app.json`을 공유하는 기존 도구는 직접 하드코딩 텍스트 사용
2. **Related Tools (영어 only)** — 관련 도구 3-4개 링크
   - 내부 링크로 SEO에 직접적 도움, 언어 번역 불필요
   - `page.js` 하단에 `<a href={\`/\${locale}/tool\`}>` 패턴으로 삽입

### 패턴: page.js 하단 구조
```
          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={...}>Tool Name</a>
              </div>
            </div>
          </div>
```

## 새 도구 추가 시 반드시 확인할 사항 (AdSense 관련)
1. **`layout.js`의 `tools` 객체에 해당 locale 도구 metadata 등록** (name + desc + cat)
2. **`layout.js`의 `toolMap`에 경로 추가**
3. **`sitemap.xml`에 5개 locale URL 추가** (en/es/zh/ko/pt)
4. **`<title>`과 `<meta name="description">`는 layout.js가 `tool.name`/`tool.desc`로 자동 생성**하므로 별도 작업 불필요
5. **page.js 하단에 SEO Description (5개국어) + Related Tools (영어) 추가** — 위 패턴 참조
   - 각 도구별로 고유한 `seoDescription` 텍스트 작성 (messages JSON에 5개국어로 추가)
   - English는 전문가 수준의 60-120단어 설명 작성
   - ko는 한국어 번역, es/zh/pt는 영어 fallback 사용
6. **messages JSON이 없는 도구 (BMI 등 기존 25개 앱)** — page.js에 직접 텍스트 하드코딩

## AdSense 재심사 워크플로 (도구 추가 후)
```
도구 추가 및 배포
  → 1-2일 경과 (Google 크롤러가 새 콘텐츠 색인)
  → AdSense 계정 → 사이트 → oxoxox1.com → 검토 요청 → "위반 사항을 해결했습니다" 선택
  → 1-2주 대기 (최대 4주)
  → 승인 or 거절
  → 거절 시: 구체적 사유 확인 → 수정 → 다음 검토 가능일까지 대기 → 재요청
```

## 주의: 대량 JSON 수정 시 BOM 문제
- PowerShell `Set-Content`는 UTF-8 BOM을 자동 추가함
- JSON 파일에 BOM이 있으면 Next.js 빌드 시 `Unable to make a module from invalid JSON` 발생
- **해결**: Python 스크립트로 `data[:3] == b'\xef\xbb\xbf'` 확인 후 제거
- 또는 `Set-Content` 대신 Python `json.dump` 사용

## 주의: 템플릿 리터럴 이스케이프
- Python에서 JSX `{` `}`를 포함한 문자열 생성 시 템플릿 리터럴 백틱이 깨질 수 있음
- `{\`/\${locale}/tool\`}` 패턴이 Python에서 `{\\`/\${locale}/tool\\`}`로 잘못 생성됨
- **해결**: Python 스크립트로 `\\`` → `` ` `` 일괄 치환 필요
<!-- END:sisyphus-adsense -->

<!-- BEGIN:sisyphus-sitemap-critical -->
# sitemap.xml 필수 규칙 (2026-05-16)
- `=======`, `>>>>>>>`, `<<<<<<<`, `---`, `----` 등 구분선/충돌 마커 절대 금지 → XML 파싱 깨짐
- sitemap 수정 후 반드시: XML 유효성 검증 → git push → Search Console 재제출
<!-- END:sisyphus-sitemap-critical -->
