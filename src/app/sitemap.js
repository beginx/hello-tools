// 도구 목록
const tools = [
  'age', 'autoloan', 'average', 'bmi', 'bodyfat', 'cagr', 'calorieburn',
  'coinflip', 'compound', 'convert', 'currency', 'date', 'daysuntil',
  'dice', 'discount', 'duedate', 'duration', 'emi', 'fraction', 'fuelcost',
  'gpa', 'grade', 'idealweight', 'investment', 'loan', 'lotto', 'love',
  'markup', 'mortgage', 'ohm', 'overtime', 'ovulation', 'pace', 'password',
  'pdf', 'percent', 'period', 'petage', 'photo', 'pregnancy', 'privacy',
  'qr', 'random', 'ratio', 'retirement', 'salary', 'salestax', 'simpleinterest',
  'sip', 'sleep', 'speed', 'sqft', 'tdee', 'text', 'timer', 'tip', 'vat',
  'waterintake', 'wordcounter'
];

// 언어 목록
const locales = ['en', 'ko', 'es', 'zh', 'pt'];

export default function sitemap() {
  const baseUrl = 'https://oxoxox1.com';
  
  // 메인 페이지
  const mainPages = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: locale === 'en' ? 1.0 : 0.8,
  }));

  // 도구 페이지
  const toolPages = [];
  for (const locale of locales) {
    for (const tool of tools) {
      toolPages.push({
        url: `${baseUrl}/${locale}/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return [...mainPages, ...toolPages];
}
