(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const world = params.get('id') || 'modern';
  const category = params.get('category') || 'excerpt';
  const categories = {
    excerpt: ['正片截取', 'EXCERPTS'],
    after: ['後日談', 'AFTER STORIES'],
    daily: ['日常', 'DAILY LIFE'],
    wardrobe: ['衣櫃', 'WARDROBE']
  };
  const worldNames = {
    modern: '現代', yese: '葉塞大陸', paradise: '樂園',
    spirit: '靈界', mist: '霧隱都市',
    godforsaken: '神棄之地', empire: '千之帝國'
  };
  const categoryUrl = () => `./story-category.html?id=${encodeURIComponent(world)}&category=${encodeURIComponent(category)}`;
  const readUrl = id => `./story-read.html?id=${encodeURIComponent(world)}&category=${encodeURIComponent(category)}&article=${encodeURIComponent(id)}`;
  const setStatus = msg => { const el = $('articleStatus'); if (el) { el.textContent = msg; el.hidden = false; } };
  const sorted = articles => articles.filter(a => a && a.published === true && a.world === world && a.category === category)
    .sort((a, b) => category === 'excerpt'
      ? (Number(a.order ?? 999999) - Number(b.order ?? 999999)) || String(a.id).localeCompare(String(b.id))
      : String(b.date || '').localeCompare(String(a.date || '')) || String(a.id).localeCompare(String(b.id)));
  const load = async () => {
    const response = await fetch('./data/articles.json', {cache: 'no-cache'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('文章資料格式必須是陣列');
    return sorted(data);
  };
  const node = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const icon = direction => {
    const el = node('span', `story-icon story-icon-${direction}`);
    el.setAttribute('aria-hidden', 'true');
    return el;
  };
  const formatDate = date => /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date.replaceAll('-', '.') : '';
  const renderCategory = async () => {
    $('categoryTitle').textContent = categories[category]?.[0] || '分類';
    $('categoryEnglish').textContent = categories[category]?.[1] || '';
    $('categoryWorld').textContent = `MAIN STORY / ${worldNames[world] || world}`;
    $('headerBack').href = $('backToWorld').href = `./story.html?id=${encodeURIComponent(world)}`;
    if (!['excerpt', 'after'].includes(category)) {
      setStatus('這個分類的圖庫將在下一階段開放。');
      return;
    }
    const articles = await load();
    if (!articles.length) { setStatus('目前尚無公開文章。'); return; }
    articles.forEach((article, index) => {
      const link = node('a', 'article-list-item');
      link.href = readUrl(article.id);
      link.append(node('span', 'article-index', String(index + 1).padStart(2, '0')));
      const details = node('span', 'article-details');
      details.append(node('strong', 'article-name', article.title || '未命名文章'));
      if (article.summary) details.append(node('span', 'article-summary', article.summary));
      if (formatDate(article.date)) details.append(node('time', 'article-date', formatDate(article.date)));
      link.append(details, icon('up'));
      $('articleList').append(link);
    });
  };
  const renderRead = async () => {
    $('headerBack').href = $('backToCategory').href = categoryUrl();
    const articles = await load();
    const index = articles.findIndex(a => a.id === params.get('article'));
    if (index < 0) { $('readingTitle').textContent = '找不到文章'; setStatus('文章不存在，或尚未公開。'); return; }
    const article = articles[index];
    document.title = `${article.title} — Inverted Spectrum`;
    $('readingKicker').textContent = `${worldNames[world] || world} / ${categories[category]?.[0] || category}`;
    $('readingTitle').textContent = article.title || '未命名文章';
    const date = formatDate(article.date);
    if (date) { $('readingDate').textContent = date; $('readingDate').hidden = false; }
    const content = $('readingContent');
    for (const block of article.content || []) {
      if (block.type === 'text' && typeof block.text === 'string') content.append(node('p', '', block.text));
      if (block.type === 'image' && typeof block.src === 'string' && /^\.\/assets\/(?:images|uploads)\/[\w./-]+$/.test(block.src) && !block.src.includes('..')) {
        const figure = node('figure');
        const img = node('img');
        img.src = block.src;
        img.alt = block.alt || '';
        img.loading = 'lazy';
        figure.append(img);
        if (block.caption) figure.append(node('figcaption', '', block.caption));
        content.append(figure);
      }
    }
    if (!content.children.length) setStatus('這篇文章目前沒有正文。');
    const prev = $('previousArticle'), next = $('nextArticle');
    if (index > 0) { prev.href = readUrl(articles[index - 1].id); prev.hidden = false; }
    if (index < articles.length - 1) { next.href = readUrl(articles[index + 1].id); next.hidden = false; }
  };
  if (category === 'wardrobe' && document.body.dataset.page === 'category') {
    location.replace(`./story.html?id=${encodeURIComponent(worldNames[world] ? world : 'modern')}`);
    return;
  }
  if (category === 'daily' && document.body.dataset.page === 'category') return;
  if (!worldNames[world] || !categories[category]) { setStatus('找不到指定的世界線或分類。'); return; }
  (document.body.dataset.page === 'read' ? renderRead() : renderCategory()).catch(err => {
    console.error('MAIN STORY 文章載入失敗', err);
    setStatus('資料讀取失敗，請確認 data/articles.json 存在，並使用 Live Server 開啟。');
  });
})();
