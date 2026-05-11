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

## 새 도구 추가 시 반드시 확인할 사항 (AdSense 관련)
1. **`layout.js`의 `tools` 객체에 해당 locale 도구 metadata 등록** (name + desc + cat)
2. **`layout.js`의 `toolMap`에 경로 추가**
3. **`sitemap.xml`에 5개 locale URL 추가** (en/es/zh/ko/pt)
4. **`<title>`과 `<meta name="description">`는 layout.js가 `tool.name`/`tool.desc`로 자동 생성**하므로 별도 작업 불필요
5. **단, page.js 하단의 SEO 텍스트 섹션은 layout.js의 공통 섹션만으로는 부족할 수 있음** — 계산기 UI만 있는 페이지는 Google이 "콘텐츠 없음"으로 판단 가능
   - 대책: layout.js에 공통 SEO 섹션을 추가해 모든 페이지에 최소한의 텍스트 콘텐츠 보장

## AdSense 재심사 워크플로 (도구 추가 후)
```
도구 추가 및 배포
  → 1-2일 경과 (Google 크롤러가 새 콘텐츠 색인)
  → AdSense 계정 → 사이트 → 검토 요청
  → 1-2주 대기
  → 승인 or 거절
  → 거절 시: 구체적 사유 확인 → 수정 → 다음 검토 가능일까지 대기 → 재요청
```
<!-- END:sisyphus-adsense -->
