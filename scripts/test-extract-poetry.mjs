import * as cheerio from 'cheerio';
import fs from 'fs';

async function testPoetry() {
  console.log('Fetching poetry page...');
  const res = await fetch('https://sites.google.com/view/lindaemefadaniels/poetry');
  const html = await res.text();
  const $ = cheerio.load(html);

  // Find all paragraphs and headings in order
  const elements = [];
  $('h1, h2, h3, h4, p').each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      elements.push({
        tag: el.tagName.toLowerCase(),
        text,
        align: $(el).css('text-align') || 'left'
      });
    }
  });

  console.log(`Extracted ${elements.length} elements from poetry page.`);
  fs.writeFileSync('scripts/poetry_elements.json', JSON.stringify(elements, null, 2));
}

testPoetry().catch(console.error);
