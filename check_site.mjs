import { chromium } from 'playwright';

const BASE = 'https://oxoxox1.com';
const locales = ['en', 'es', 'zh', 'ko', 'pt'];

// Known tools from codebase (60 tools)
const codebaseTools = [
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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  
  // First, get all tools from sitemap
  console.log('=== Fetching sitemap ===');
  const sitemapPage = await context.newPage();
  await sitemapPage.goto(`${BASE}/sitemap.xml`, { waitUntil: 'domcontentloaded' });
  const sitemapContent = await sitemapPage.content();
  const allUrls = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`Total URLs in sitemap: ${allUrls.length}`);
  
  // Extract unique tool names (without locale prefix)
  const allTools = [...new Set(allUrls.map(u => {
    const match = u.match(/https:\/\/oxoxox1\.com\/[a-z]{2}\/([^/]+)/);
    return match ? match[1] : null;
  }).filter(Boolean))].sort();
  
  console.log(`Unique tools in sitemap: ${allTools.length}`);
  
  // Find missing from codebase
  const missingTools = allTools.filter(t => !codebaseTools.includes(t));
  console.log(`\n=== Missing from codebase (${missingTools.length} tools) ===`);
  console.log(missingTools.join('\n'));
  
  // Now check each missing tool page with Playwright
  console.log(`\n=== Checking ${missingTools.length} missing tools ===`);
  
  const results = [];
  
  for (const tool of missingTools) {
    const url = `${BASE}/en/${tool}`;
    try {
      const page = await context.newPage();
      const startTime = Date.now();
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      const loadTime = Date.now() - startTime;
      
      const status = response.status();
      const title = await page.title();
      const bodyText = await page.evaluate(() => document.body?.innerText || '');
      const hasInteractiveUI = await page.evaluate(() => {
        // Check for interactive elements
        const hasButtons = document.querySelectorAll('button').length > 0;
        const hasInputs = document.querySelectorAll('input, select, textarea').length > 0;
        const hasCanvas = document.querySelectorAll('canvas').length > 0;
        const body = document.body?.innerText || '';
        // If page has buttons/inputs AND not just SEO text, it has real functionality
        return { hasButtons, hasInputs, hasCanvas, bodyLength: body.length };
      });
      
      // Get unique JS chunks for this page
      const html = await page.content();
      const jsChunks = [...html.matchAll(/chunks\/([^"]*)\.js/g)].map(m => m[1]);
      const uniqueChunks = [...new Set(jsChunks)];
      
      results.push({
        tool,
        status,
        title,
        loadTime,
        ...hasInteractiveUI,
        chunkCount: uniqueChunks.length
      });
      
      console.log(`${status} | ${String(loadTime).padStart(4)}ms | buttons:${hasInteractiveUI.hasButtons} inputs:${hasInteractiveUI.hasInputs} canvas:${hasInteractiveUI.hasCanvas} | ${tool} → ${title.slice(0,60)}`);
      
      await page.close();
    } catch (err) {
      console.error(`FAIL | ${tool} → ${err.message.slice(0,60)}`);
      results.push({ tool, status: 0, error: err.message });
    }
  }
  
  // Summary
  console.log(`\n=== SUMMARY ===`);
  const working = results.filter(r => r.status === 200);
  const withUI = results.filter(r => r.hasButtons || r.hasInputs || r.hasCanvas);
  console.log(`Total missing tools: ${missingTools.length}`);
  console.log(`Working (200): ${working.length}`);
  console.log(`With interactive UI: ${withUI.length}`);
  console.log(`\nTools WITH interactive UI (real functionality):`);
  withUI.forEach(r => console.log(`  ✅ ${r.tool} (${r.title?.slice(0,50)})`));
  
  console.log(`\nTools WITHOUT interactive UI (SEO-only shells):`);
  results.filter(r => r.status === 200 && !r.hasButtons && !r.hasInputs).forEach(r => {
    console.log(`  ⚠️  ${r.tool} (${r.title?.slice(0,50)})`);
  });
  
  await browser.close();
}

main().catch(console.error);
