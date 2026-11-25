(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (document.body.dataset.page !== 'category' || params.get('category') !== 'daily') return;
  const world = params.get('id') || 'modern';
  const names = {modern:'現代',yese:'葉塞大陸',paradise:'樂園',spirit:'靈界',mist:'霧隱都市',godforsaken:'神棄之地',empire:'千之帝國'};
  const $ = id => document.getElementById(id);
  const gallery = $('dailyGallery'), modal = $('galleryLightbox');
  if (!names[world]) { $('categoryTitle').textContent = '找不到世界線'; return; }
  $('categoryTitle').textContent = '日常';
  $('categoryEnglish').textContent = 'DAILY LIFE';
  $('categoryWorld').textContent = `MAIN STORY / ${names[world]}`;
  $('headerBack').href = $('backToWorld').href = `./story.html?id=${encodeURIComponent(world)}`;
  $('galleryWorldLabel').textContent = `${names[world]} / DAILY LIFE`;
  gallery.hidden = false;
  let current = null, position = 0, lastFocus = null, startX = null;
  const make = (tag, className, content) => { const e = document.createElement(tag); if(className)e.className=className; if(content!==undefined)e.textContent=content; return e; };
  const safeImage = src => typeof src === 'string' && /^\.\/assets\/(?:images|uploads)\/[a-zA-Z0-9_./-]+$/.test(src) && !src.includes('..');
  const display = () => {
    if (!current) return;
    const src = current.images[position];
    $('galleryImage').src = src;
    $('galleryImage').alt = current.title || `作品圖片 ${position+1}`;
    const multi = current.images.length > 1;
    $('galleryPrev').hidden = $('galleryNext').hidden = !multi;
    $('galleryCounter').hidden = !multi;
    $('galleryCounter').textContent = multi ? `${String(position+1).padStart(2,'0')} / ${String(current.images.length).padStart(2,'0')}` : '';
    for (const [id,value] of [['galleryTitle',current.title],['galleryDate',current.date],['galleryDescription',current.description]]) {
      $(id).textContent = value || ''; $(id).hidden = !value;
    }
  };
  const move = step => { if (!current || current.images.length < 2) return; position = (position + step + current.images.length) % current.images.length; display(); };
  const open = (item, trigger) => { current = item; position = 0; lastFocus = trigger; modal.hidden = false; document.body.classList.add('gallery-open'); display(); $('galleryClose').focus(); };
  const close = () => { if(modal.hidden)return; modal.hidden = true; document.body.classList.remove('gallery-open'); $('galleryImage').removeAttribute('src'); current = null; lastFocus?.focus(); };
  $('galleryClose').addEventListener('click',close);
  $('galleryPrev').addEventListener('click',()=>move(-1));
  $('galleryNext').addEventListener('click',()=>move(1));
  modal.addEventListener('click',e=>{ if(e.target===modal)close(); });
  document.addEventListener('keydown',e=>{
    if(modal.hidden)return;
    if(e.key==='Escape')close();
    else if(e.key==='ArrowLeft')move(-1);
    else if(e.key==='ArrowRight')move(1);
    else if(e.key==='Tab') { e.preventDefault(); $('galleryClose').focus(); }
  });
  $('galleryStage').addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.screenX??null;},{passive:true});
  $('galleryStage').addEventListener('touchend',e=>{
    if(startX===null)return;
    const delta=(e.changedTouches[0]?.screenX??startX)-startX;
    if(Math.abs(delta)>45)move(delta<0?1:-1);
    startX=null;
  },{passive:true});
  fetch('./data/daily-gallery.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json();}).then(data=>{
    if(!Array.isArray(data))throw Error('資料格式必須為陣列');
    const items=data.filter(item=>item && item.published===true && item.world===world && Array.isArray(item.images))
      .map(item=>({...item,images:item.images.filter(safeImage)})).filter(item=>item.images.length)
      .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    if(!items.length){$('articleStatus').textContent='目前還沒有公開的日常作品。';$('articleStatus').hidden=false;return;}
    items.forEach(item=>{
      const button=make('button','gallery-tile');button.type='button';button.setAttribute('aria-label',`檢視${item.title||'日常作品'}`);
      const cover=make('span','gallery-cover');const img=make('img');img.src=item.images[0];img.alt=item.title||'日常作品';img.loading='lazy';cover.append(img);
      if(item.images.length>1)cover.append(make('span','gallery-count',`1 / ${item.images.length}`));
      button.append(cover);
      if(item.title)button.append(make('span','gallery-tile-title',item.title));
      button.addEventListener('click',()=>open(item,button));gallery.append(button);
    });
  }).catch(err=>{console.error('日常相簿讀取失敗',err);$('articleStatus').textContent='相簿讀取失敗，請檢查 data/daily-gallery.json 並使用 Live Server。';$('articleStatus').hidden=false;});
})();
