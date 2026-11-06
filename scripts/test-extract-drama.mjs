import * as cheerio from 'cheerio';
import fs from 'fs';

async function testDrama() {
  console.log('Fetching drama page...');
  const res = await fetch('https://sites.google.com/view/lindaemefadaniels/drama');
  const html = await res.text();
  const $ = cheerio.load(html);

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

  console.log(`Extracted ${elements.length} elements from drama page.`);
  fs.writeFileSync('scripts/drama_elements.json', JSON.stringify(elements, null, 2));

  const headings = elements.filter(e => e.tag === 'h1' || e.tag === 'h2' || e.tag === 'h3');
  console.log('Headings in drama:');
  headings.forEach(h => console.log(h.tag, ':', h.text));
}

testDrama().catch(console.error);
