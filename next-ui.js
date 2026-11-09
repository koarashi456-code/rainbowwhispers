/* 彩之語：測驗結果「想再多認識自己一點？」（狀態不錯的時候給的下一步）
   用在：心靈導航（漫遊者／黃燈）、七大脈輪（七輪平衡）。
   RWNext.markDone('quiz'|'num'|'ck')：做完一個測驗就記下來（推薦測驗時標「✓ 做過」；會員的「30 天後再測」提醒也會拿掉）
   RWNext.mount(el,{current:'quiz'|'ck', prefs, sub})
   SQL：set_my_retest、clear_my_retest（30 天後小鈴鐺提醒） */
(function(){
var TESTS=[{k:'quiz',n:'心靈導航測驗',t:'3 分鐘',s:'你的探索類型',href:'quiz.html'},{k:'num',n:'生命靈數',t:'1 分鐘',s:'天生的個性密碼',href:'numerology.html'},{k:'ck',n:'七大脈輪',t:'3 分鐘',s:'最近的能量狀態',href:'chakra.html'}];
var PROMPTS=['最近一次讓你覺得「這很像我」的時刻，是在做什麼？','如果明天醒來一切都剛剛好，你第一個注意到的改變會是什麼？','最近有什麼小事，讓你偷偷開心了一下？','你最想對三年前的自己說哪一句話？','現在的你，最想多給自己一點什麼？（時間、休息、勇氣…）','有沒有一件事，你一直想試卻還沒開始？是什麼讓你停下來？','最近誰讓你覺得被理解？那是什麼樣的感覺？','如果把這個月的心情畫成天氣，會是什麼天氣？','有什麼習慣，是你想溫柔地放下的？','今天的你，可以為自己做的一件小事是什麼？','你最近最常對自己說的一句話是什麼？它是溫柔的嗎？','一年後的你，會想感謝現在的你做了什麼？'];
var KEY='rw_tests_done';
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function done(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}')||{}; }catch(e){ return {}; } }
function token(){ try{ return window.rwMemberToken && window.rwMemberToken(); }catch(e){ return null; } }
function rpc(name,args){ var tk=token(); if(!tk || !window.SUPA) return Promise.reject(new Error('請先登入會員'));
  return fetch(SUPA.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:SUPA.key,Authorization:'Bearer '+tk,'Content-Type':'application/json'},body:JSON.stringify(args||{})})
    .then(function(r){ return r.json().catch(function(){ return null; }).then(function(j){ if(!r.ok) throw new Error((j&&j.message)||'沒有成功'); return j; }); }); }
function markDone(k){
  try{ var d=done(); d[k]=new Date().toISOString(); localStorage.setItem(KEY,JSON.stringify(d)); }catch(e){}
  if(token()) rpc('clear_my_retest',{p_test:k}).catch(function(){});
}
var CSS='.nx-card{background:var(--card,#FFFDF8);border:1px solid var(--line,#ECDFC6);border-radius:20px;padding:18px 16px;margin:18px 0 6px;text-align:left}'+
  '.nx-h{font-family:"Noto Serif TC",serif;font-size:18px;font-weight:700;color:var(--brush,#6B4A33);text-align:center}'+
  '.nx-sub{font-size:13px;color:var(--soft,#8A7659);text-align:center;margin-top:2px;line-height:1.7}'+
  '.nx-row{display:flex;gap:11px;align-items:flex-start;background:#fff;border:1.5px solid #EFE3CE;border-radius:14px;padding:11px 12px;margin-top:10px}'+
  '.nx-ic{flex:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px}'+
  '.nx-m{flex:1;min-width:0}.nx-m b{display:block;font-size:14.5px;color:var(--brush,#6B4A33)}.nx-d{font-size:12.5px;color:var(--soft,#8A7659);line-height:1.6}'+
  '.nx-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}'+
  '.nx-pill{font:inherit;border:1.5px solid #EFE3CE;background:#FBF6EC;border-radius:999px;padding:5px 12px;font-size:13px;cursor:pointer;color:var(--brush,#6B4A33);text-decoration:none;display:inline-flex;align-items:center;gap:5px;line-height:1.5}'+
  '.nx-pill.pri{border-color:transparent;background:var(--rainbow);color:#4A3A2A;font-weight:500}.nx-pill small{font-size:11px;color:var(--soft,#8A7659)}.nx-pill:disabled{opacity:.7;cursor:default}'+
  '.nx-done{font-size:11px;background:#E4F2E7;color:#3F7A5E;border-radius:999px;padding:0 7px}'+
  '.nx-test{display:flex;flex-direction:column;align-items:flex-start;gap:0;border-radius:14px;padding:7px 12px;width:100%;box-sizing:border-box}.nx-test b{font-size:14px;font-weight:500;white-space:nowrap;display:flex;align-items:center;gap:6px}.nx-test small{font-size:11.5px}'+
  '.nx-g{display:flex;gap:10px;align-items:center;background:#FBF6EC;border-radius:12px;padding:8px 10px;margin-top:8px;text-decoration:none;color:inherit}'+
  '.nx-g img{flex:none;width:42px;height:42px;border-radius:50%;object-fit:cover;background:#F4EAD4}'+
  '.nx-g b{font-size:14px;color:var(--brush,#6B4A33)}.nx-g small{display:block;font-size:12px;color:var(--soft,#8A7659)}'+
  '.nx-prompt{background:#FBF3E4;border-radius:12px;padding:10px 12px;margin-top:8px;font-size:14px;color:var(--brush,#6B4A33);line-height:1.75}'+
  '.nx-msg{font-size:12px;color:var(--soft,#8A7659);margin-top:6px}';
function css(){ if(document.getElementById('nx-css')) return; var s=document.createElement('style'); s.id='nx-css'; s.textContent=CSS; document.head.appendChild(s); }
var GCACHE=null;
function loadGuides(){
  if(GCACHE) return GCACHE;
  GCACHE=(window.SUPA?fetch(SUPA.url+'/rest/v1/public_guides?select=id,name,services,region,service_mode',{headers:{apikey:SUPA.key,Authorization:'Bearer '+SUPA.key}}).then(function(r){ return r.ok?r.json():[]; }).catch(function(){ return []; }):Promise.resolve([]));
  return GCACHE;
}
function mount(el,opt){
  if(!el) return; opt=opt||{}; css();
  var cur=opt.current||'', D=done(), pi=Math.floor(Math.random()*PROMPTS.length), gi=0, list=[];
  var tests=TESTS.filter(function(x){ return x.k!==cur; }).sort(function(a,b){ return (D[a.k]?1:0)-(D[b.k]?1:0); });
  el.innerHTML='<div class="nx-card"><div class="nx-h">想再多認識自己一點？</div><div class="nx-sub">'+esc(opt.sub||'你現在狀態不錯，不用急。挑一個你有興趣的，慢慢來就好')+'</div>'+
    '<div class="nx-row"><span class="nx-ic" style="background:#EFE6F6">🧭</span><div class="nx-m"><b>再做一個測驗</b><div class="nx-d">從不同角度看看自己，每個只要幾分鐘</div><div class="nx-btns">'+
      tests.map(function(x){ return '<a class="nx-pill nx-test'+(D[x.k]?'':' pri')+'" href="'+x.href+'"><b>'+x.n+(D[x.k]?'<span class="nx-done">✓ 做過</span>':'')+'</b><small>'+x.t+'・'+x.s+'</small></a>'; }).join('')+'</div></div></div>'+
    '<div class="nx-row" data-nx-g style="display:none"><span class="nx-ic" style="background:#FBE7CC">🌈</span><div class="nx-m"><b>跟一位引路人輕鬆聊聊</b><div class="nx-d">不用帶問題也可以，就當作認識自己的開始</div><div data-nx-gbox></div></div></div>'+
    '<div class="nx-row"><span class="nx-ic" style="background:#E4F2E7">✍️</span><div class="nx-m"><b>今天的小練習</b><div class="nx-d">寫在心裡或筆記本都好，不用給任何人看</div><div class="nx-prompt" data-nx-p></div><div class="nx-btns"><button type="button" class="nx-pill" data-nx-np>換一題</button></div></div></div>'+
    '<div class="nx-row"><span class="nx-ic" style="background:#E3EEF6">🔔</span><div class="nx-m"><b>30 天後提醒我再測一次</b><div class="nx-d">看看一個月後的自己，有沒有不一樣</div><div class="nx-btns">'+
      (token()?'<button type="button" class="nx-pill pri" data-nx-rm>好，提醒我</button>':'<a class="nx-pill pri" href="account.html">登入會員就能提醒你 ›</a>')+'</div><div class="nx-msg" data-nx-msg></div></div></div>'+
  '</div>';
  var pEl=el.querySelector('[data-nx-p]');
  function drawP(){ pEl.textContent='「'+PROMPTS[pi%PROMPTS.length]+'」'; }
  drawP(); el.querySelector('[data-nx-np]').onclick=function(){ pi++; drawP(); };
  var rm=el.querySelector('[data-nx-rm]');
  if(rm) rm.onclick=function(){ rm.disabled=true; rm.textContent='設定中…';
    rpc('set_my_retest',{p_test:cur}).then(function(){ rm.classList.remove('pri'); rm.textContent='✓ 30 天後提醒你'; el.querySelector('[data-nx-msg]').textContent='到時候網站右上角的小鈴鐺會提醒你'; })
      .catch(function(e){ rm.disabled=false; rm.textContent='好，提醒我'; el.querySelector('[data-nx-msg]').textContent='沒有設定成功：'+((e&&e.message)||''); }); };
  // 推薦一位引路人：照剛剛選的地區／預算／方式／角色排
  var gRow=el.querySelector('[data-nx-g]'), gBox=el.querySelector('[data-nx-gbox]');
  function drawG(){
    if(!list.length){ gRow.style.display='none'; return; }
    gRow.style.display='';
    var x=list[gi%list.length], g=x.g, sub=[(g.services||[]).slice(0,3).join('、'), g.region||''].filter(Boolean).join(' · ');
    gBox.innerHTML='<a class="nx-g" href="guide.html?id='+encodeURIComponent(g.id)+'"><img alt="" src="'+esc(SUPA.url+'/storage/v1/object/public/guide-photos/'+encodeURIComponent(g.id)+'.jpg')+'" onerror="this.onerror=null;this.src=\'avatar.svg\'"><span style="flex:1;min-width:0"><b>'+esc(g.name||'引路人')+'</b><small>'+esc(sub)+'</small>'+(window.RWMatch?RWMatch.tagsHTML(x.f):'')+'</span></a>'+
      '<div class="nx-btns"><a class="nx-pill pri" href="guide.html?id='+encodeURIComponent(g.id)+'">看看 '+esc(g.name||'引路人')+' ›</a>'+(list.length>1?'<button type="button" class="nx-pill" data-nx-ng>換一位</button>':'')+'</div>';
    var ng=gBox.querySelector('[data-nx-ng]'); if(ng) ng.onclick=function(){ gi++; drawG(); };
  }
  if(window.RWMatch && window.SUPA){
    Promise.all([loadGuides(), RWMatch.loadPrices()]).then(function(r){
      list=RWMatch.rank(r[0]||[], opt.prefs||null, r[1]||{}, null).slice(0,8);
      drawG();
    }).catch(function(){});
  }
}
window.RWNext={mount:mount, markDone:markDone, done:done};
})();
