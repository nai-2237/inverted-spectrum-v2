import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { lexer } from 'marked';

const root = process.cwd();
const readJSON = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const listFiles = folder => {
  const dir = path.join(root, folder);
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.(md|json)$/i.test(f)).sort().map(f => path.join(dir, f)) : [];
};
const validImage = value => {
  if (typeof value !== 'string') return null;
  let s = value.trim().replace(/^\//, './');
  if (s.startsWith('assets/')) s = './' + s;
  return /^\.\/assets\/(?:images|uploads)\/[\w./-]+$/.test(s) && !s.includes('..') ? s : null;
};
const normalizeDate = value => {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};
const textBlocks = markdown => {
  const blocks = [];
  for (const token of lexer(markdown)) {
    if (token.type === 'space') continue;
    if (token.type === 'paragraph' || token.type === 'text') {
      const raw = token.text || '';
      const imageOnly = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)$/.exec(raw.trim());
      if (imageOnly) {
        const src = validImage(imageOnly[2]);
        if (src) blocks.push({ type: 'image', src, alt: imageOnly[1] });
      } else {
        // Existing reader renders plain-text paragraphs, not Markdown HTML.
        blocks.push({ type: 'text', text: raw.replace(/\r/g, '') });
      }
    } else if (token.type === 'heading' || token.type === 'blockquote' || token.type === 'code') {
      blocks.push({ type: 'text', text: token.text || '' });
    } else if (token.type === 'list') {
      blocks.push({ type: 'text', text: token.items.map(i => i.text).join('\n') });
    }
  }
  return blocks;
};
const cmsArticles = [];
for (const [folder, category] of [['content/excerpts', 'excerpt'], ['content/after-stories', 'after']]) {
  for (const file of listFiles(folder)) {
    if (!file.endsWith('.md')) continue;
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const id = `${category}-${path.basename(file, '.md')}`;
    cmsArticles.push({ id, category, world: data.world || '', title: data.title || '',
      summary: data.description || '', date: normalizeDate(data.date), order: data.order ?? 999999,
      published: data.published === true, content: textBlocks(content) });
  }
}
const legacyArticles = readJSON('data/legacy-articles.json');
const cmsIds = new Set(cmsArticles.map(a => a.id));
const articles = [...legacyArticles.filter(a => !cmsIds.has(a.id)), ...cmsArticles];
fs.writeFileSync(path.join(root, 'data/articles.json'), JSON.stringify(articles, null, 2) + '\n');
const cmsGallery = [];
for (const file of listFiles('content/daily-life')) {
  if (!file.endsWith('.json')) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const images = Array.isArray(data.images) ? data.images.map(v => validImage(typeof v === 'string' ? v : v?.image)).filter(Boolean) : [];
  cmsGallery.push({ id: `daily-${path.basename(file, '.json')}`, world: data.world || '', title: data.title || '',
    date: normalizeDate(data.date), description: data.description || '', published: data.published === true, images });
}
const legacyGallery = readJSON('data/legacy-daily-gallery.json');
const galleryIds = new Set(cmsGallery.map(g => g.id));
fs.writeFileSync(path.join(root, 'data/daily-gallery.json'), JSON.stringify([...legacyGallery.filter(g => !galleryIds.has(g.id)), ...cmsGallery], null, 2) + '\n');
console.log(`CMS build: ${cmsArticles.length} articles, ${cmsGallery.length} gallery entries`);
