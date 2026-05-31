const { test, expect } = require('@playwright/test');

// 테스트할 주요 페이지 목록
const pages = [
  { path: '/', name: 'Home' },
  { path: '/timer', name: 'Timer' },
  { path: '/bmi', name: 'BMI Calculator' },
  { path: '/date', name: 'Date Calculator' },
  { path: '/convert', name: 'Unit Converter' },
  { path: '/percent', name: 'Percent Calculator' },
  { path: '/currency', name: 'Currency Converter' },
  { path: '/loan', name: 'Loan Calculator' },
  { path: '/mortgage', name: 'Mortgage Calculator' },
  { path: '/tip', name: 'Tip Calculator' },
  { path: '/salary', name: 'Salary Calculator' },
  { path: '/age', name: 'Age Calculator' },
  { path: '/discount', name: 'Discount Calculator' },
  { path: '/emi', name: 'EMI Calculator' },
  { path: '/investment', name: 'Investment Calculator' },
];

// 각 언어별 테스트
const locales = ['en', 'ko', 'es', 'zh', 'pt'];

for (const locale of locales) {
  test.describe(`${locale} locale`, () => {
    for (const page of pages) {
      test(`${page.name} page should load`, async ({ request }) => {
        const response = await request.get(`https://oxoxox1.com/${locale}${page.path}`);
        expect(response.status()).toBe(200);
      });
    }
  });
}

// 메타 데이터 테스트
test.describe('Meta data', () => {
  test('Timer page should have meta description', async ({ request }) => {
    const response = await request.get('https://oxoxox1.com/en/timer');
    const html = await response.text();
    expect(html).toContain('meta name="description"');
  });

  test('Home page should have meta description', async ({ request }) => {
    const response = await request.get('https://oxoxox1.com/en');
    const html = await response.text();
    expect(html).toContain('meta name="description"');
  });
});

// JSON-LD 테스트
test.describe('Structured data', () => {
  test('Pages should have JSON-LD', async ({ request }) => {
    const response = await request.get('https://oxoxox1.com/en/timer');
    const html = await response.text();
    expect(html).toContain('application/ld+json');
  });
});
