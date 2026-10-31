/* 彩之語：台灣縣市＋鄉鎮市區下拉選單、測驗配對條件（地區／預算／方式）與引路人比對。
   地區一律存成「縣市＋區」連在一起的文字，例如「新北市三重區」；只選縣市就是「新北市」；國外是「海外」。 */
(function(){
var D={
  '臺北市':'中正區 大同區 中山區 松山區 大安區 萬華區 信義區 士林區 北投區 內湖區 南港區 文山區',
  '新北市':'板橋區 三重區 中和區 永和區 新莊區 新店區 樹林區 鶯歌區 三峽區 淡水區 汐止區 瑞芳區 土城區 蘆洲區 五股區 泰山區 林口區 深坑區 石碇區 坪林區 三芝區 石門區 八里區 平溪區 雙溪區 貢寮區 金山區 萬里區 烏來區',
  '基隆市':'仁愛區 信義區 中正區 中山區 安樂區 暖暖區 七堵區',
  '桃園市':'桃園區 中壢區 大溪區 楊梅區 蘆竹區 大園區 龜山區 八德區 龍潭區 平鎮區 新屋區 觀音區 復興區',
  '新竹市':'東區 北區 香山區',
  '新竹縣':'竹北市 竹東鎮 新埔鎮 關西鎮 湖口鄉 新豐鄉 芎林鄉 橫山鄉 北埔鄉 寶山鄉 峨眉鄉 尖石鄉 五峰鄉',
  '苗栗縣':'苗栗市 頭份市 苑裡鎮 通霄鎮 竹南鎮 後龍鎮 卓蘭鎮 大湖鄉 公館鄉 銅鑼鄉 南庄鄉 頭屋鄉 三義鄉 西湖鄉 造橋鄉 三灣鄉 獅潭鄉 泰安鄉',
  '臺中市':'中區 東區 南區 西區 北區 北屯區 西屯區 南屯區 太平區 大里區 霧峰區 烏日區 豐原區 后里區 石岡區 東勢區 和平區 新社區 潭子區 大雅區 神岡區 大肚區 沙鹿區 龍井區 梧棲區 清水區 大甲區 外埔區 大安區',
  '彰化縣':'彰化市 員林市 鹿港鎮 和美鎮 北斗鎮 溪湖鎮 田中鎮 二林鎮 線西鄉 伸港鄉 福興鄉 秀水鄉 花壇鄉 芬園鄉 大村鄉 埔鹽鄉 埔心鄉 永靖鄉 社頭鄉 二水鄉 田尾鄉 埤頭鄉 芳苑鄉 大城鄉 竹塘鄉 溪州鄉',
  '南投縣':'南投市 埔里鎮 草屯鎮 竹山鎮 集集鎮 名間鄉 鹿谷鄉 中寮鄉 魚池鄉 國姓鄉 水里鄉 信義鄉 仁愛鄉',
  '雲林縣':'斗六市 斗南鎮 虎尾鎮 西螺鎮 土庫鎮 北港鎮 古坑鄉 大埤鄉 莿桐鄉 林內鄉 二崙鄉 崙背鄉 麥寮鄉 東勢鄉 褒忠鄉 臺西鄉 元長鄉 四湖鄉 口湖鄉 水林鄉',
  '嘉義市':'東區 西區',
  '嘉義縣':'太保市 朴子市 布袋鎮 大林鎮 民雄鄉 溪口鄉 新港鄉 六腳鄉 東石鄉 義竹鄉 鹿草鄉 水上鄉 中埔鄉 竹崎鄉 梅山鄉 番路鄉 大埔鄉 阿里山鄉',
  '臺南市':'中西區 東區 南區 北區 安平區 安南區 永康區 歸仁區 新化區 左鎮區 玉井區 楠西區 南化區 仁德區 關廟區 龍崎區 官田區 麻豆區 佳里區 西港區 七股區 將軍區 學甲區 北門區 新營區 後壁區 白河區 東山區 六甲區 下營區 柳營區 鹽水區 善化區 大內區 山上區 新市區 安定區',
  '高雄市':'楠梓區 左營區 鼓山區 三民區 鹽埕區 前金區 新興區 苓雅區 前鎮區 旗津區 小港區 鳳山區 大寮區 鳥松區 林園區 仁武區 大樹區 大社區 岡山區 路竹區 橋頭區 梓官區 彌陀區 永安區 燕巢區 田寮區 阿蓮區 茄萣區 湖內區 旗山區 美濃區 內門區 杉林區 甲仙區 六龜區 茂林區 桃源區 那瑪夏區',
  '屏東縣':'屏東市 潮州鎮 東港鎮 恆春鎮 萬丹鄉 長治鄉 麟洛鄉 九如鄉 里港鄉 鹽埔鄉 高樹鄉 萬巒鄉 內埔鄉 竹田鄉 新埤鄉 枋寮鄉 新園鄉 崁頂鄉 林邊鄉 南州鄉 佳冬鄉 琉球鄉 車城鄉 滿州鄉 枋山鄉 三地門鄉 霧臺鄉 瑪家鄉 泰武鄉 來義鄉 春日鄉 獅子鄉 牡丹鄉',
  '宜蘭縣':'宜蘭市 羅東鎮 蘇澳鎮 頭城鎮 礁溪鄉 壯圍鄉 員山鄉 冬山鄉 五結鄉 三星鄉 大同鄉 南澳鄉',
  '花蓮縣':'花蓮市 鳳林鎮 玉里鎮 新城鄉 吉安鄉 壽豐鄉 光復鄉 豐濱鄉 瑞穗鄉 富里鄉 秀林鄉 萬榮鄉 卓溪鄉',
  '臺東縣':'臺東市 成功鎮 關山鎮 卑南鄉 鹿野鄉 池上鄉 東河鄉 長濱鄉 太麻里鄉 大武鄉 綠島鄉 海端鄉 延平鄉 金峰鄉 達仁鄉 蘭嶼鄉',
  '澎湖縣':'馬公市 湖西鄉 白沙鄉 西嶼鄉 望安鄉 七美鄉',
  '金門縣':'金城鎮 金湖鎮 金沙鎮 金寧鄉 烈嶼鄉 烏坵鄉',
  '連江縣':'南竿鄉 北竿鄉 莒光鄉 東引鄉',
  '海外':''
};
var COUNTIES=Object.keys(D), AREAS={};
COUNTIES.forEach(function(c){ AREAS[c]=D[c]?D[c].split(' '):[]; });

function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function norm(s){ return String(s||'').replace(/台/g,'臺').replace(/\s+/g,''); }
// 「新北市三重區」→ {c:'新北市', d:'三重區'}；只有縣市 → d 為空；認不得 → c 為空
function split(v){
  v=norm(v); if(!v) return {c:'',d:''};
  for(var i=0;i<COUNTIES.length;i++){ var c=COUNTIES[i]; if(v.indexOf(c)===0){ var rest=v.slice(c.length); return {c:c, d:AREAS[c].indexOf(rest)>=0?rest:''}; } }
  return {c:'',d:''};
}
// 引路人的服務區域可能有好幾個（「新北市三重區、臺北市大安區／線上」）→ ['新北市三重區','臺北市大安區']
function parseList(v){
  var out=[];
  String(v||'').split(/[、,，\/／;；\s]+/).forEach(function(t){ var p=split(t); if(p.c){ var k=p.c+p.d; if(out.indexOf(k)<0) out.push(k); } });
  return out;
}

// 兩層下拉：opt.cls 給 select 的 class、opt.value 初始值、opt.onChange(value, complete)、opt.anyDistrict 區的第一個選項文字
function picker(el,opt){
  opt=opt||{};
  var cls=opt.cls?' class="'+opt.cls+'"':'';
  el.innerHTML='<select'+cls+' data-area-c aria-label="縣市"><option value="">'+esc(opt.cPh||'選擇縣市')+'</option>'+COUNTIES.map(function(c){ return '<option>'+c+'</option>'; }).join('')+'</select>'+
    '<select'+cls+' data-area-d aria-label="區"></select>';
  var sc=el.querySelector('[data-area-c]'), sd=el.querySelector('[data-area-d]');
  function fillD(c,d){
    var L=AREAS[c]||[];
    sd.innerHTML='<option value="">'+esc(c?(opt.anyDistrict||'選擇區'):'先選縣市')+'</option>'+L.map(function(x){ return '<option'+(x===d?' selected':'')+'>'+x+'</option>'; }).join('');
    sd.disabled=!c || !L.length; sd.style.display=(c==='海外')?'none':'';
  }
  function val(){ return sc.value+(sd.disabled?'':sd.value); }
  function complete(){ var c=sc.value; return !!c && (!AREAS[c].length || !!sd.value); }
  function set(v){ var p=split(v); sc.value=p.c; fillD(p.c,p.d); }
  sc.onchange=function(){ fillD(sc.value,''); if(opt.onChange) opt.onChange(val(),complete()); };
  sd.onchange=function(){ if(opt.onChange) opt.onChange(val(),complete()); };
  set(opt.value||'');
  return {get:val, set:set, complete:complete, county:function(){ return sc.value; }, el:el};
}

// 多選（引路人服務區域）：一列已選的地區＋下拉＋「加入」；value 用「、」串起來
function multi(el,opt){
  opt=opt||{};
  var items=parseList(opt.value), raw=String(opt.value||'').trim();
  var leftover=raw && !items.length ? raw : '';
  el.innerHTML='<div data-area-list style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px"></div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span data-area-pick style="display:contents"></span><button type="button" data-area-add style="font:inherit;font-size:13px;color:#4A3A2A;background:var(--rainbow);border:0;border-radius:999px;padding:7px 14px;cursor:pointer">＋ 加入</button></div>'+
    '<div data-area-note style="font-size:11.5px;color:var(--soft);margin-top:5px"></div>';
  var list=el.querySelector('[data-area-list]'), note=el.querySelector('[data-area-note]');
  var pk=picker(el.querySelector('[data-area-pick]'),{cls:opt.cls,anyDistrict:'整個縣市'});
  el.querySelectorAll('[data-area-pick] select').forEach(function(x){ x.style.flex='1 1 110px'; x.style.width='auto'; x.style.minWidth='0'; });
  function draw(){
    list.innerHTML=items.length?items.map(function(x,i){ return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--ink);background:#fff;border:1.5px solid #EFE3CE;border-radius:999px;padding:4px 8px 4px 12px">'+esc(x)+'<b data-area-rm="'+i+'" style="color:#C0506A;cursor:pointer;font-weight:400" title="移除">×</b></span>'; }).join(''):'<span style="font-size:12.5px;color:var(--soft)">'+esc(opt.emptyText||'還沒選服務區域（只有線上可以不選）')+'</span>';
    note.textContent=leftover?'原本填的：「'+leftover+'」— 請改用下拉選單重新選':(opt.hint||'可以加好幾個；選「整個縣市」代表那個縣市都可以服務');
  }
  function changed(){ leftover=''; draw(); if(opt.onChange) opt.onChange(items.join('、')); }
  list.addEventListener('click',function(e){ var b=e.target.closest('[data-area-rm]'); if(!b) return; items.splice(+b.getAttribute('data-area-rm'),1); changed(); });
  el.querySelector('[data-area-add]').onclick=function(){ var v=pk.get(); if(!pk.county()) return; if(items.indexOf(v)<0) items.push(v); pk.set(''); changed(); };
  draw();
  return {get:function(){ return items.join('、'); }};
}

// 客人地區 vs 引路人服務區域：'district' 同區／整個縣市都服務、'county' 同縣市、'none' 不同縣市、'unknown' 引路人沒填
function regionFit(userArea,guideRegion){
  var u=split(userArea), L=parseList(guideRegion);
  if(!u.c || !L.length) return 'unknown';
  var best='none';
  L.forEach(function(x){ var g=split(x); if(g.c!==u.c) return; if(!g.d || (u.d && g.d===u.d)) best='district'; else if(best!=='district') best='county'; });
  return best;
}

window.RWArea={COUNTIES:COUNTIES, AREAS:AREAS, norm:norm, split:split, parseList:parseList, picker:picker, multi:multi, regionFit:regionFit, esc:esc};

/* ===== 測驗最後一題：地區／預算／方式 ＋ 引路人比對 ===== */
var BUDGETS=[{k:'b1',t:'$1,000 以內',max:1000},{k:'b2',t:'$1,000～2,000',max:2000},{k:'b3',t:'$2,000～3,000',max:3000},{k:'b4',t:'$3,000 以上',max:Infinity},{k:'any',t:'還不確定',max:Infinity}];
var MODES=[{k:'online',t:'線上（視訊／語音）',s:'線上'},{k:'offline',t:'實體見面',s:'實體見面'},{k:'any',t:'都可以',s:'線上或實體'}];
function bOf(k){ return BUDGETS.filter(function(b){ return b.k===k; })[0]; }
function mOf(k){ return MODES.filter(function(m){ return m.k===k; })[0]; }
var LS='rw_match_prefs';
function loadLocal(){ try{ return JSON.parse(localStorage.getItem(LS)||'null')||{}; }catch(e){ return {}; } }
function saveLocal(p){ try{ localStorage.setItem(LS,JSON.stringify(p)); }catch(e){} }
function label(p){ if(!p) return ''; var b=bOf(p.budget), m=mOf(p.mode); return [p.area||'', b?b.t:'', m?m.s:''].filter(Boolean).join('・'); }
// 存進客戶資料用（後台看得懂的文字）
function forDb(p){ if(!p) return null; var b=bOf(p.budget), m=mOf(p.mode); return {area:p.area||'', budget:b?b.t:'', mode:m?m.s:''}; }

var CSS='.pf-q{font-size:14.5px;font-weight:500;color:var(--brush);margin:18px 0 8px;text-align:left}.pf-q small{font-weight:400;color:var(--soft);font-size:12px;margin-left:4px}'+
  '.pf-area{display:flex;gap:8px}.pf-sel{flex:1;min-width:0;font:inherit;font-size:15px;color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:12px;padding:11px 10px;outline:none}.pf-sel:disabled{opacity:.55}'+
  '.pf-hint{font-size:11.5px;color:var(--soft);margin-top:6px;text-align:left}'+
  '.pf-chips{display:flex;flex-wrap:wrap;gap:8px}.pf-chip{font:inherit;font-size:14px;color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:999px;padding:8px 14px;cursor:pointer}.pf-chip.on{background:var(--brush);border-color:var(--brush);color:#fff}'+
  '.pf-err{font-size:12.5px;color:#C0506A;min-height:1.2em;margin-top:10px;text-align:center}.pf-note{font-size:12px;color:var(--soft);text-align:center;margin-top:10px}'+
  '.pf-line{font-size:12.5px;color:var(--soft);text-align:center;margin:2px 0 6px}.pf-line b{color:var(--brush);font-weight:500}'+
  '.mt-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}.mt-tag{white-space:nowrap;font-size:11px;border-radius:999px;padding:1px 8px;background:#E4F2E7;color:#3F7A5E;font-weight:400}.mt-tag.no{background:#F6E6DF;color:#B4614A}'+
  '.mt-help{margin-top:16px;background:#F1F8F2;border:1.5px solid #CFE6D5;border-radius:16px;padding:16px;text-align:left}.mt-help b{display:block;color:#3F7A5E;font-size:15px;margin-bottom:4px}.mt-help p{font-size:13px;color:var(--ink);line-height:1.7;margin:0}'+
  '.mt-help a{display:block;text-align:center;margin-top:12px;background:#06C755;color:#fff;border-radius:999px;padding:11px;font-size:14.5px;font-weight:500;text-decoration:none}'+
  '.mt-soft{font-size:12.5px;color:var(--soft);text-align:center;margin-top:12px}.mt-soft a{color:#3F7A5E;text-decoration:underline}';
function injectCss(){ if(document.getElementById('rw-match-css')) return; var s=document.createElement('style'); s.id='rw-match-css'; s.textContent=CSS; document.head.appendChild(s); }

function formHTML(){
  return '<div class="pf-q">① 你住在哪裡？<small data-pf-from></small></div><div class="pf-area" data-pf-area></div><div class="pf-hint">先選縣市，再選區（鄉鎮市）；住國外選「海外」</div>'+
    '<div class="pf-q">② 一次諮詢，你能接受的預算？</div><div class="pf-chips" data-pf-g="budget">'+BUDGETS.map(function(b){ return '<button type="button" class="pf-chip" data-k="'+b.k+'">'+b.t+'</button>'; }).join('')+'</div>'+
    '<div class="pf-q">③ 想用什麼方式？</div><div class="pf-chips" data-pf-g="mode">'+MODES.map(function(m){ return '<button type="button" class="pf-chip" data-k="'+m.k+'">'+m.t+'</button>'; }).join('')+'</div>';
}
// 把三題掛到 box 裡；回傳 {get(), check()}：check() 沒填完會顯示提示並回傳 null
function mount(box,errEl){
  injectCss();
  var p=loadLocal(), cur={area:p.area||'', budget:p.budget||'', mode:p.mode||''};
  var pk=picker(box.querySelector('[data-pf-area]'),{cls:'pf-sel',value:cur.area,onChange:function(v){ cur.area=v; saveLocal(cur); if(errEl) errEl.textContent=''; }});
  function drawChips(){ box.querySelectorAll('[data-pf-g]').forEach(function(g){ var f=g.getAttribute('data-pf-g'); g.querySelectorAll('.pf-chip').forEach(function(c){ c.classList.toggle('on',c.getAttribute('data-k')===cur[f]); }); }); }
  box.querySelectorAll('[data-pf-g]').forEach(function(g){ g.addEventListener('click',function(e){ var c=e.target.closest('.pf-chip'); if(!c) return; cur[g.getAttribute('data-pf-g')]=c.getAttribute('data-k'); saveLocal(cur); drawChips(); if(errEl) errEl.textContent=''; }); });
  drawChips();
  // 會員登入中、還沒選過地區 → 帶入會員資料的地區
  if(!cur.area && window.SUPA && window.rwMemberToken && window.rwMemberToken()){
    fetch(SUPA.url+'/rest/v1/rpc/my_account',{method:'POST',headers:{apikey:SUPA.key,Authorization:'Bearer '+window.rwMemberToken(),'Content-Type':'application/json'},body:'{}'})
      .then(function(r){ return r.ok?r.json():null; }).then(function(d){ if(d && d.area && !cur.area){ cur.area=RWArea.split(d.area).c?d.area:''; if(cur.area){ pk.set(cur.area); var f=box.querySelector('[data-pf-from]'); if(f) f.textContent='已帶入會員資料'; } } }).catch(function(){});
  }
  return {
    get:function(){ return {area:pk.get(), budget:cur.budget, mode:cur.mode}; },
    check:function(){
      var msg=!pk.county()?'請選擇你住的縣市':!pk.complete()?'請選擇你住的區（鄉鎮市）':!cur.budget?'請選擇預算':!cur.mode?'請選擇想要的方式':'';
      if(msg){ if(errEl) errEl.textContent=msg; return null; }
      var out={area:pk.get(), budget:cur.budget, mode:cur.mode}; saveLocal(out); return out;
    }
  };
}

// 引路人最低價：已核准方案（public_plans）的最低價；沒有自訂方案就用預約頁的預設方案（最低 $200）
var PRICE_CACHE=null;
function loadPrices(){
  if(PRICE_CACHE) return PRICE_CACHE;
  PRICE_CACHE=(window.SUPA?fetch(SUPA.url+'/rest/v1/public_plans?select=guide_id,price',{headers:{apikey:SUPA.key,Authorization:'Bearer '+SUPA.key}}).then(function(r){ return r.ok?r.json():[]; }).catch(function(){ return []; }):Promise.resolve([]))
    .then(function(rows){ var m={}; (Array.isArray(rows)?rows:[]).forEach(function(x){ var v=Number(x.price); if(!isFinite(v)) return; if(m[x.guide_id]==null || v<m[x.guide_id]) m[x.guide_id]=v; }); return m; });
  return PRICE_CACHE;
}
function minPrice(g,prices){ if(prices && prices[g.id]!=null) return prices[g.id]; return 200; }
function money(n){ return '$'+Number(n||0).toLocaleString(); }
function firstCounty(region){ var L=parseList(region); return L.length?split(L[0]).c:''; }
// 一位引路人符不符合：tags=[{ok,t}]、bad=不符合的數量、pts=排序加分
function fit(g,p,prices){
  var tags=[], bad=0, pts=0; if(!p) return {tags:tags,bad:0,pts:0};
  var sm=String(g.service_mode||''), on=/線上/.test(sm), off=/實體/.test(sm), known=!!sm.trim();
  var rf=regionFit(p.area,g.region);
  if(p.mode==='online'){ if(on){ tags.push({ok:1,t:'✓ 線上'}); pts+=3; } else if(known){ tags.push({ok:0,t:'✕ 沒有線上'}); bad++; } }
  else if(p.mode==='offline'){
    if(known && !off){ tags.push({ok:0,t:'✕ 沒有實體'}); bad++; }
    else if(rf==='none'){ tags.push({ok:0,t:'✕ 距離較遠（'+firstCounty(g.region)+'）'}); bad++; }
    else if(off){ tags.push({ok:1,t:'✓ 實體'}); pts+=3; }
  } else { if(on) tags.push({ok:1,t:'✓ 線上'}); if(off && rf!=='none' && rf!=='unknown') tags.push({ok:1,t:'✓ 實體'}); pts+=1; }
  if(rf==='district'){ tags.push({ok:1,t:'✓ 同區'}); pts+=2; } else if(rf==='county'){ tags.push({ok:1,t:'✓ 同縣市'}); pts+=1; }
  var b=bOf(p.budget), mp=minPrice(g,prices);
  if(b && b.k!=='any'){ if(mp<=b.max){ tags.push({ok:1,t:'✓ 預算內 '+money(mp)+' 起'}); pts+=2; } else { tags.push({ok:0,t:'✕ '+money(mp)+' 起'}); bad++; } }
  return {tags:tags,bad:bad,pts:pts-bad*4};
}
function tagsHTML(f){ return f&&f.tags.length?'<span class="mt-tags">'+f.tags.map(function(t){ return '<span class="mt-tag'+(t.ok?'':' no')+'">'+esc(t.t)+'</span>'; }).join('')+'</span>':''; }
// 從這個方向的人（kwScore(g)>0）裡排序：條件都符合的優先，其次專長越合、條件加分越多越前面
function rank(guides,p,prices,kwScore,exclude){
  return (guides||[]).filter(function(g){ return !(exclude&&exclude[g.id]); }).map(function(g){ var k=kwScore?kwScore(g):1; var f=fit(g,p,prices); return {g:g,k:k,f:f,s:k*10+f.pts-f.bad*100}; })
    .filter(function(x){ return x.k>0; }).sort(function(a,b){ return b.s-a.s; });
}
function helpHTML(show,href){
  injectCss();
  return show
    ?'<div class="mt-help"><b>沒有完全符合的引路人嗎？</b><p>距離太遠、預算不合，或沒有你想要的項目——加官方 LINE，我們用真人幫你找一位條件合的引路人，連時間都幫你約好。</p><a href="'+esc(href)+'" target="_blank" rel="noopener">加 LINE，請專人幫我配</a></div>'
    :'<div class="mt-soft">不是你想要的項目或距離？<a href="'+esc(href)+'" target="_blank" rel="noopener">加 LINE 請專人幫你配</a></div>';
}
window.RWMatch={BUDGETS:BUDGETS, MODES:MODES, label:label, forDb:forDb, formHTML:formHTML, mount:mount, loadPrices:loadPrices, fit:fit, tagsHTML:tagsHTML, rank:rank, helpHTML:helpHTML, injectCss:injectCss, loadLocal:loadLocal};
})();
