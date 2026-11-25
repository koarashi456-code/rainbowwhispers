/* 共用導覽：登入後把「會員」改成顯示登入帳號；手機漢堡選單把會員排到最上面。
   純讀 localStorage 的 Supabase session，不需載 supabase-js，可在每頁用。 */
// 登入中會員的 token（過期就回 null）：測驗頁用它把結果記到會員本人
window.rwMemberToken=function(){
  try{
    var raw=localStorage.getItem('sb-awqvsddsizqzttzzalps-auth-token');
    if(!raw){ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(/^sb-.*-auth-token$/.test(k)){ raw=localStorage.getItem(k); break; } } }
    if(!raw) return null;
    var o=JSON.parse(raw), sess=o&&(o.currentSession||o);
    var at=(sess&&sess.access_token)||null, exp=(sess&&sess.expires_at)||0;
    if(!at) return null;
    if(exp && exp*1000 < Date.now()+30000) return null;
    return at;
  }catch(e){ return null; }
};
(function(){
  try{
    var link=document.querySelector('.rw-links a[href="account.html"]');
    if(!link) return;
    link.classList.add('rw-mem');   // 搭配 style.css 的 @media：手機排到最上面

    // 找 Supabase 的登入 token（key 形如 sb-<ref>-auth-token）
    var raw=null;
    try{ raw=localStorage.getItem('sb-awqvsddsizqzttzzalps-auth-token'); }catch(e){}
    if(!raw){
      try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(/^sb-.*-auth-token$/.test(k)){ raw=localStorage.getItem(k); break; } } }catch(e){}
    }
    if(!raw) return;

    var o; try{ o=JSON.parse(raw); }catch(e){ return; }
    var sess = o && (o.currentSession || o);
    var user = (sess && sess.user) || (o && o.user) || null;
    var at = (sess && sess.access_token) || (o && o.access_token) || (Array.isArray(o)&&o[0]) || null;
    if(!user && at){
      try{
        var payload=at.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
        var p=JSON.parse(decodeURIComponent(escape(atob(payload))));
        user={email:p.email, user_metadata:p.user_metadata||{}};
      }catch(e){}
    }
    if(!user) return;

    var name=(user.user_metadata&&user.user_metadata.name)||'';
    var txt=name||user.email||'';
    if(!txt) return;
    if(txt.length>16) txt=txt.slice(0,15)+'…';
    link.textContent=txt;
    link.title=user.email||txt;
  }catch(e){}
})();

// 每日一抽（會員專屬）：點分頁列「每日一抽」、選單的「每日一抽」或網址 #draw，就打開抽卡（用到才載 daily-card.js）
window.rwDraw=function(){
  if(window.RWDaily) return window.RWDaily.open();
  if(window._rwDrawLoading) return; window._rwDrawLoading=true;
  var s=document.createElement('script'); s.src='daily-card.js?v=20261125b';
  s.onload=function(){ window._rwDrawLoading=false; if(window.RWDaily) window.RWDaily.open(); };
  s.onerror=function(){ window._rwDrawLoading=false; };
  document.head.appendChild(s);
};
document.addEventListener('click',function(e){
  var a=e.target.closest && e.target.closest('[data-draw]'); if(!a) return;
  e.preventDefault();
  var cb=document.querySelector('.rw-burger-cb'); if(cb && cb.checked){ cb.checked=false; try{ cb.dispatchEvent(new Event('change')); }catch(_){} }
  window.rwDraw();
});
(function(){ function go(){ if(location.hash==='#draw') window.rwDraw(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
  window.addEventListener('hashchange',go); })();

// 新版標題列（每一頁一樣）：彩虹圈＋彩之語｜全部地區▾｜🔍｜🔔｜會員；手機用底部分頁列，不用漢堡選單
var RW_COUNTIES=['臺北市','新北市','基隆市','桃園市','新竹市','新竹縣','苗栗縣','臺中市','彰化縣','南投縣','雲林縣','嘉義市','嘉義縣','臺南市','高雄市','屏東縣','宜蘭縣','花蓮縣','臺東縣','澎湖縣','金門縣','連江縣'];
(function(){
  try{
    var nav=document.querySelector('.rw-nav'), navIn=nav&&nav.querySelector('.rw-nav-in'); if(!navIn || nav.classList.contains('v2')) return;
    nav.classList.add('v2');
    var pg=(location.pathname.split('/').pop()||'index.html'), home=/^(index\.html)?$/.test(pg);
    if(pg==='account.html') nav.classList.add('rw-nav-mhide');   // 我的（會員中心）：手機版上面不要這排
    var br=navIn.querySelector('.rw-brand'); if(br) br.innerHTML='<i class="rw-ring" aria-hidden="true"></i>彩之語';
    var cur=''; try{ cur=new URLSearchParams(location.search).get('area')||localStorage.getItem('rw_area')||''; }catch(e){}
    var ar=document.createElement('label'); ar.className='rw-area';
    ar.innerHTML='<select id="rw-area" aria-label="選擇地區"><option value="">全部地區</option>'+RW_COUNTIES.map(function(c){ return '<option'+(c===cur?' selected':'')+'>'+c+'</option>'; }).join('')+'</select>';
    var sp=document.createElement('span'); sp.className='rw-nsp';
    var sb=document.createElement('button'); sb.type='button'; sb.className='rw-sbtn'; sb.setAttribute('aria-label','搜尋引路人');
    sb.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>';
    var mb=document.createElement('a'); mb.className='rw-mbtn'; mb.href='account.html'; mb.textContent=(window.rwMemberToken&&window.rwMemberToken())?'會員':'登入／註冊';
    var cb=navIn.querySelector('.rw-burger-cb');
    var lk=navIn.querySelector('.rw-links'); if(lk && !lk.querySelector('[data-draw]')){ var dr=document.createElement('a'); dr.href='#draw'; dr.setAttribute('data-draw',''); dr.textContent='每日一抽'; var t=lk.querySelector('a[href="tests.html"]'); lk.insertBefore(dr, t?t.nextSibling:lk.firstChild); }
    // 「全部地區」和 🔍 只放在首頁；其他頁只有 彩之語｜🔔｜會員
    if(home) navIn.insertBefore(ar, br?br.nextSibling:navIn.firstChild);
    navIn.insertBefore(sp, cb); if(home) navIn.insertBefore(sb, cb); navIn.appendChild(mb);   // 小鈴鐺之後會插在 cb 前面＝搜尋和會員中間
    // 選地區：首頁直接篩選；其他頁帶到首頁的引路人
    ar.querySelector('select').onchange=function(){ var v=this.value; try{ localStorage.setItem('rw_area',v); }catch(e){}
      if(window.rwOnArea) window.rwOnArea(v); else location.href='index.html'+(v?'?area='+encodeURIComponent(v):'')+'#hn-gsec'; };
    sb.onclick=function(){ if(window.rwOnSearch) window.rwOnSearch(); else location.href='index.html#search'; };
    // 三條線的選單：點選單外面或按 Esc 就收起來；可以用鍵盤打開
    var bcb=navIn.querySelector('.rw-burger-cb'), blb=navIn.querySelector('.rw-burger');
    if(bcb && blb){ blb.removeAttribute('aria-hidden'); blb.setAttribute('role','button'); blb.setAttribute('tabindex','0'); blb.setAttribute('aria-label','選單');
      var sync=function(){ blb.setAttribute('aria-expanded',bcb.checked); }; sync(); bcb.addEventListener('change',sync);
      blb.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); bcb.checked=!bcb.checked; sync(); } });
      document.addEventListener('click',function(e){ if(bcb.checked && !navIn.contains(e.target)){ bcb.checked=false; sync(); } });
      document.addEventListener('keydown',function(e){ if(e.key==='Escape' && bcb.checked){ bcb.checked=false; sync(); } }); }
  }catch(e){}
})();

// 手機版底部分頁列（首頁／測驗／每日一抽／引路人）；訂單、會員從上面的「會員」進去：≤ 768px 才出現；我的後台不放
(function(){
  var path=(location.pathname.split('/').pop()||'index.html');
  if(/^(admin|phone)\.html$/.test(path) || document.querySelector('.rw-tab')) return;
  var T=[
    {h:'index.html', t:'首頁', on:/^(index\.html|)$/, i:'<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>'},
    {h:'tests.html', t:'測驗', on:/^(tests|quiz|chakra|numerology)\.html$/, i:'<path d="M12 4.5c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/>'},
    {h:'#draw', t:'每日一抽', draw:true, on:/^$^/, i:'<rect x="6" y="3.5" width="12" height="17" rx="2.5"/><path d="M12 8.6c.3 1.7 1.1 2.5 2.8 2.8-1.7.3-2.5 1.1-2.8 2.8-.3-1.7-1.1-2.5-2.8-2.8 1.7-.3 2.5-1.1 2.8-2.8Z"/>'},
    {h:'booking.html', t:'引路人', on:/^(booking|guide|guides|shop)\.html$/, i:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'}
  ];
  var css=document.createElement('style');
  css.textContent='.rw-tab{display:none}@media (max-width:768px){'+
    'body{padding-bottom:calc(60px + env(safe-area-inset-bottom))}'+
    '.rw-tab{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:90;background:rgba(255,253,248,.96);-webkit-backdrop-filter:saturate(1.4) blur(12px);backdrop-filter:saturate(1.4) blur(12px);border-top:1px solid #EADFCC;padding-bottom:env(safe-area-inset-bottom)}'+
    '.rw-tab a{flex:1;min-height:56px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-decoration:none;color:#8C7963;font:500 11px/1.2 "Noto Sans TC",sans-serif;-webkit-tap-highlight-color:transparent}'+
    '.rw-tab a svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}'+
    '.rw-tab a.on{color:#6B4A33;font-weight:700}.rw-tab a.on svg{stroke-width:2.1}'+
    '.rw-tab .dot{display:none;width:4px;height:4px;border-radius:50%;background:linear-gradient(90deg,#EE9E86,#B0A2E4);margin-top:1px}.rw-tab a.on .dot{display:block}'+
    '.rw-tab a:active{opacity:.6}'+
    '.sp-bar{bottom:calc(56px + env(safe-area-inset-bottom))!important}}';
  document.head.appendChild(css);
  function mount(){ if(document.querySelector('.rw-tab')) return;
    var nav=document.createElement('nav'); nav.className='rw-tab'; nav.setAttribute('aria-label','主要分頁');
    nav.innerHTML=T.map(function(x){ var on=!x.draw && x.on.test(path); return '<a href="'+x.h+'"'+(x.draw?' data-draw':'')+(on?' class="on" aria-current="page"':'')+'><svg viewBox="0 0 24 24" aria-hidden="true">'+x.i+'</svg>'+x.t+'<span class="dot"></span></a>'; }).join('');
    document.body.appendChild(nav); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();

// 等頁面載入完再用 window.SUPA（有些頁面沒放 supabase-config.js，就自己載）
function rwWithSupa(cb){
  if(window.SUPA) return cb();
  var s=document.createElement('script'); s.src='supabase-config.js'; s.onload=function(){ if(window.SUPA) cb(); }; document.head.appendChild(s);
}
function rwTokenSub(tk){ try{ var p=JSON.parse(decodeURIComponent(escape(atob(tk.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))))); return p.sub||''; }catch(e){ return ''; } }
var RW_ADMIN_UID='0c7fd203-07c3-48ac-b94d-76965acfe733';

// 瀏覽統計：每位訪客、每頁、每天記一次（不記管理員；只有後台看得到）
window.addEventListener('load',function(){
  try{
    var tk=window.rwMemberToken&&window.rwMemberToken(); if(tk && rwTokenSub(tk)===RW_ADMIN_UID) return;
    var vid=''; try{ vid=localStorage.getItem('rw_vid')||''; }catch(e){}
    if(!/^[A-Za-z0-9]{8,40}$/.test(vid)){ var c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; vid=''; for(var i=0;i<20;i++) vid+=c.charAt(Math.floor(Math.random()*c.length)); try{ localStorage.setItem('rw_vid',vid); }catch(e){} }
    var path=(location.pathname.split('/').pop()||'index.html').toLowerCase(); if(!/^[a-z0-9_.-]+\.html$/.test(path)) path='index.html';
    rwWithSupa(function(){ fetch(window.SUPA.url+'/rest/v1/rpc/log_view',{method:'POST',headers:{apikey:window.SUPA.key,Authorization:'Bearer '+(tk||window.SUPA.key),'Content-Type':'application/json'},body:JSON.stringify({p_path:path,p_vid:vid}),keepalive:true}).catch(function(){}); });
  }catch(e){}
});

// 網站上方的小鈴鐺：會員看自己的通知（SQL：member_notices、my_notices）；管理員看後台通知（跟後台的鈴鐺同一份已讀）
window.addEventListener('load',function(){
  try{
    var tk=window.rwMemberToken&&window.rwMemberToken(); if(!tk) return;
    var isAdmin=rwTokenSub(tk)===RW_ADMIN_UID;
    var navIn=document.querySelector('.rw-nav-in'); if(!navIn || document.getElementById('rw-bell')) return;
    var css=document.createElement('style'); css.textContent=
      '.rw-bell-wrap{margin-left:auto;position:static}.rw-bell-wrap~.rw-burger{margin-left:2px}'+
      '.rw-bell{position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--brush);cursor:pointer;padding:0}'+
      '.rw-bell svg{width:18px;height:18px}.rw-bell b{position:absolute;top:-3px;right:-3px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:999px;background:#D4694E;color:#fff;font-size:11px;line-height:17px;text-align:center;display:none}.rw-bell b.on{display:block}'+
      '.rw-npanel{position:absolute;top:calc(100% + 6px);right:10px;width:330px;max-width:calc(100vw - 20px);max-height:70vh;overflow-y:auto;background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 16px 40px -16px rgba(120,90,60,.4);z-index:70;display:none;text-align:left}.rw-npanel.on{display:block}'+
      '.rw-nh{position:sticky;top:0;background:#fff;padding:12px 14px 8px;border-bottom:1px solid var(--line);font-family:"Noto Serif TC",serif;font-weight:600;color:var(--brush);font-size:15px;display:flex;justify-content:space-between;align-items:baseline}.rw-nh a{font-family:"Noto Sans TC",sans-serif;font-weight:400;font-size:12px;color:var(--brush)}'+
      '.rw-ni{display:block;text-decoration:none;color:var(--ink);padding:11px 14px;border-bottom:1px solid var(--line)}.rw-ni:last-child{border-bottom:0}.rw-ni.new{background:#FBF1E2}.rw-ni.pin{background:#F1F8F2}'+
      '.rw-ni .t{display:flex;justify-content:space-between;gap:8px;font-size:13.5px;font-weight:600;color:var(--brush)}.rw-ni .t small{font-weight:400;font-size:12px;color:#8F7550;white-space:nowrap}.rw-ni .t i{font-style:normal;display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:1px}.rw-ni .b{font-size:12.5px;color:var(--soft);margin-top:2px}'+
      '.rw-nempty{padding:28px 16px;text-align:center;color:var(--soft);font-size:13.5px}';
    document.head.appendChild(css);
    var wrap=document.createElement('div'); wrap.className='rw-bell-wrap';
    wrap.innerHTML='<button type="button" class="rw-bell" id="rw-bell" aria-label="通知"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><b id="rw-bell-n"></b></button>';
    var panel=document.createElement('div'); panel.className='rw-npanel'; panel.id='rw-npanel';
    var cb=navIn.querySelector('.rw-burger-cb'); navIn.insertBefore(wrap, cb||navIn.querySelector('.rw-links')); navIn.appendChild(panel);
    var KEY=isAdmin?'rw_notif_seen':'rw_mnotice_seen', LIST=[];
    if(isAdmin){ try{ if(!localStorage.getItem(KEY)) localStorage.setItem(KEY,new Date().toISOString()); }catch(e){} }  // 跟後台一樣：第一次不把舊資料全算未讀
    function seen(){ try{ return localStorage.getItem(KEY)||''; }catch(e){ return ''; } }
    function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
    function ago(s){ var d=(Date.now()-new Date(s).getTime())/1000; if(d<60) return '剛剛'; if(d<3600) return Math.floor(d/60)+' 分鐘前'; if(d<86400) return Math.floor(d/3600)+' 小時前'; if(d<86400*7) return Math.floor(d/86400)+' 天前'; var t=new Date(s); return (t.getMonth()+1)+'/'+t.getDate(); }
    function wall(s){ var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s||'')); return m?(+m[2])+'/'+(+m[3])+' '+m[4]+':'+m[5]:'未定時間'; }
    function badge(){ var s=seen(), n=LIST.filter(function(x){ return !s || new Date(x.ts)>new Date(s); }).length, b=document.getElementById('rw-bell-n'); b.textContent=n>99?'99+':n; b.classList.toggle('on',n>0); }
    var H=function(){ return {apikey:window.SUPA.key,Authorization:'Bearer '+tk,'Content-Type':'application/json'}; };
    function rpc(name){ return fetch(window.SUPA.url+'/rest/v1/rpc/'+name,{method:'POST',headers:H(),body:'{}'}).then(function(r){ return r.ok?r.json():null; }).catch(function(){ return null; }); }
    function rest(q){ return fetch(window.SUPA.url+'/rest/v1/'+q,{headers:H()}).then(function(r){ return r.ok?r.json():[]; }).catch(function(){ return []; }); }
    // 會員：自己的通知
    function loadMember(){ return rpc('my_notices').then(function(d){ return (Array.isArray(d)?d:[]).map(function(x){ return {title:x.title,body:x.body,link:x.link||'orders.html',ts:x.created_at}; }); }); }
    // 管理員：跟後台鈴鐺一樣的通知（新會員、測驗、引路人申請、新預約、會員取消）
    function loadAdmin(){
      return Promise.all([
        rest('customers?select=id,name,admin_alias,contact,source,result_type,topic,created_at,deleted&order=created_at.desc&limit=300'),
        rest('guides?select=id,name,pending,created_at,deleted&order=created_at.desc&limit=200'),
        rest('transactions?select=*&order=created_at.desc&limit=40'),
        rest('transactions?select=*&cancelled_at=not.is.null&order=cancelled_at.desc&limit=20'),
        rest('course_packages?select=id,customer_id,label,refund_status,refund_amount,refund_requested_at&refund_status=eq.'+encodeURIComponent('申請中')+'&order=refund_requested_at.desc&limit=20')
      ]).then(function(r){
        var C=(r[0]||[]).filter(function(x){ return !x.deleted; }), G=(r[1]||[]).filter(function(x){ return !x.deleted; }), T=(r[2]||[]).slice();
        (r[3]||[]).forEach(function(x){ if(!T.some(function(y){ return y.id===x.id; })) T.push(x); });
        var cn=function(id,t){ var c=C.find(function(x){ return x.id===id; }); return c?(c.admin_alias||c.name||c.contact||'客戶'):((t&&t.guest_name)?t.guest_name+'（訪客）':'客戶'); };
        var gn=function(id){ var g=G.find(function(x){ return x.id===id; }); return g?(g.name||'引路人'):'未指定引路人'; };
        var out=[];
        (Array.isArray(r[4])?r[4]:[]).forEach(function(k){ out.push({dot:'#E0A15E',title:'課程退費申請',body:cn(k.customer_id)+'　·　'+(k.label||'套裝課程')+'　·　可退 $'+Number(k.refund_amount||0).toLocaleString(),ts:k.refund_requested_at,link:'admin.html'}); });
        C.slice(0,40).forEach(function(c){ var m=c.source==='會員'; out.push({dot:m?'#6FB58C':'#7FA9C4',title:m?'新會員加入':'過路客完成測驗',body:(c.admin_alias||c.name||(m?'新會員':'過路客'))+(c.result_type?'　·　'+c.result_type:''),ts:c.created_at,link:'admin.html'}); });
        G.forEach(function(g){ if(g.pending) out.push({dot:'#D8A85A',title:'新引路人申請',body:g.name||'（未具名）',ts:g.created_at,link:'admin.html'}); });
        T.forEach(function(t){ if(t.deleted) return;
          if(t.status==='已取消' && t.cancelled_at && /會員自行取消/.test(String(t.notes||''))){ var rf=(/應退 \$(\d+)/.exec(String(t.notes||''))||[])[1]; out.push({dot:'#E08A8A',title:'會員取消預約',body:cn(t.customer_id,t)+'　·　'+gn(t.guide_id)+'　·　'+wall(t.appointment_at)+(rf?'　·　應退 $'+Number(rf).toLocaleString():''),ts:t.cancelled_at,link:'admin.html'}); return; }
          if(t.status==='已預約' && !/-C$/.test(String(t.order_ref||''))){ var shop=/^商品：/.test(String(t.service||'')); out.push({dot:'#B49BDD',title:shop?'新商品訂單':'新預約',body:cn(t.customer_id,t)+'　·　'+(shop?String(t.service).replace(/^商品：/,''):gn(t.guide_id)+'　·　'+wall(t.appointment_at))+'　·　$'+Number(t.amount||0).toLocaleString(),ts:t.created_at,link:'admin.html'}); }
        });
        out.sort(function(a,b){ return new Date(b.ts||0)-new Date(a.ts||0); });
        return out.slice(0,40);
      });
    }
    // 會員：24 小時內的預約置頂提醒（不算未讀）
    // 會員：系統自動提醒（SQL：my_reminders → 明天的預約、還沒付款、該約下一堂）；還沒跑 SQL 時退回舊的「24 小時內預約」
    function reminders(){ if(isAdmin) return Promise.resolve([]); return rpc('my_reminders').then(function(d){ if(Array.isArray(d)) return d.map(function(x){ return {title:x.title,body:x.body,link:x.link||'orders.html'}; }); return remindersOld(); }); }
    function remindersOld(){ return rpc('my_account').then(function(d){ var out=[], now=Date.now(); ((d&&d.orders)||[]).forEach(function(o){ if(o.status!=='已預約' || !o.appointment_at || /^商品：/.test(String(o.service||''))) return; var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(o.appointment_at); if(!m) return; var t=new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5]).getTime(); if(t>now && t-now<=86400e3) out.push({title:'提醒：'+(new Date(t).getDate()===new Date().getDate()?'今天':'明天')+' '+m[4]+':'+m[5]+' 有預約',body:(o.guide_name||'引路人')+'　'+(o.service||''),link:'orders.html'}); }); return out; }); }
    var load=isAdmin?loadAdmin:loadMember;
    function draw(pins,prev){ var h='<div class="rw-nh"><span>'+(isAdmin?'後台通知':'我的通知')+'</span>'+(isAdmin?'<a href="admin.html">到後台 ›</a>':'')+'</div>';
      h+=(pins||[]).map(function(x){ return '<a class="rw-ni pin" href="'+esc(x.link)+'"><div class="t"><span>'+esc(x.title)+'</span></div><div class="b">'+esc(x.body)+'</div></a>'; }).join('');
      h+=LIST.length?LIST.map(function(x){ var nw=!prev || new Date(x.ts)>new Date(prev); return '<a class="rw-ni'+(nw?' new':'')+'" href="'+esc(x.link)+'"><div class="t"><span>'+(x.dot?'<i style="background:'+x.dot+'"></i>':'')+esc(x.title)+'</span><small>'+ago(x.ts)+'</small></div>'+(x.body?'<div class="b">'+esc(x.body)+'</div>':'')+'</a>'; }).join(''):((pins&&pins.length)?'':'<div class="rw-nempty">'+(isAdmin?'目前沒有新通知':'目前沒有通知<br>預約、改期、取消、儲值都會在這裡通知你')+'</div>');
      panel.innerHTML=h; }
    function refresh(){ rwWithSupa(function(){ load().then(function(l){ LIST=l||[]; badge(); }); }); }
    document.getElementById('rw-bell').onclick=function(e){ e.stopPropagation();
      if(panel.classList.toggle('on')){ var prev=seen(); try{ localStorage.setItem(KEY,new Date().toISOString()); }catch(x){} draw([],prev); badge();
        rwWithSupa(function(){ Promise.all([load(),reminders()]).then(function(r){ LIST=r[0]||LIST; draw(r[1],prev); badge(); }); }); } };
    panel.addEventListener('click',function(e){ e.stopPropagation(); });
    document.addEventListener('click',function(){ panel.classList.remove('on'); });
    refresh(); setInterval(refresh,60000);
  }catch(e){}
});
