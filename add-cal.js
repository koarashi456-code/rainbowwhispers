/* 彩之語：預約「加入行事曆」＋地址「開地圖導航」（我的訂單、預約完成頁、引路人後台共用）
   - 加入行事曆：iPhone／電腦 → 行事曆檔（.ics，打開就能加到手機行事曆，前 1 小時提醒）；Android → Google 行事曆
     另外都附一個「用 Google 行事曆」的小連結（LINE 裡開網頁、檔案打不開時用）
   - 開地圖：iPhone → Apple 地圖，其他 → Google 地圖（有裝 App 會直接開 App）
   預約時間：資料庫存的是台灣的「牆上時間」（17:00 就存 17:00），所以一律當台北時間 */
(function(){
  if(window.RWAddCal) return;
  var UA=navigator.userAgent||'';
  var IOS=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1), ANDROID=/Android/i.test(UA);
  var SITE='https://koarashi456-code.github.io/rainbowwhispers/';
  function p2(n){ return (n<10?'0':'')+n; }
  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
  function wp(s){ var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s||'')); return m?{y:+m[1],mo:+m[2],d:+m[3],h:+m[4],mi:+m[5]}:null; }
  // 方案上寫的時長：「1小時」「1.5 小時」「90分鐘」；看不出來就 1 小時
  function mins(svc){ var s=String(svc||''), m=/([\d.]+)\s*小時/.exec(s); if(m) return Math.max(15,Math.round(Number(m[1])*60)); m=/(\d+)\s*分鐘/.exec(s); if(m) return Math.max(15,+m[1]); return 60; }
  function stamp(p,add){ var d=new Date(Date.UTC(p.y,p.mo-1,p.d,p.h,p.mi+(add||0))); return d.getUTCFullYear()+p2(d.getUTCMonth()+1)+p2(d.getUTCDate())+'T'+p2(d.getUTCHours())+p2(d.getUTCMinutes())+'00'; }
  function ie(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/([,;])/g,'\\$1'); }
  // o = {when, svc, title, place, ref, note}
  function ics(o){
    var p=wp(o.when); if(!p) return '';
    var n=mins(o.svc), now=new Date(), ts=now.getUTCFullYear()+p2(now.getUTCMonth()+1)+p2(now.getUTCDate())+'T'+p2(now.getUTCHours())+p2(now.getUTCMinutes())+p2(now.getUTCSeconds())+'Z';
    var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Rainbow Whisper//彩之語//ZH','CALSCALE:GREGORIAN','METHOD:PUBLISH',
      'BEGIN:VTIMEZONE','TZID:Asia/Taipei','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0800','TZOFFSETTO:+0800','TZNAME:CST','END:STANDARD','END:VTIMEZONE',
      'BEGIN:VEVENT','UID:'+ie((o.ref||('rw'+stamp(p)))+'@rainbowwhisper'),'DTSTAMP:'+ts,
      'DTSTART;TZID=Asia/Taipei:'+stamp(p),'DTEND;TZID=Asia/Taipei:'+stamp(p,n),
      'SUMMARY:'+ie(o.title||'彩之語預約')];
    if(o.place) L.push('LOCATION:'+ie(o.place));
    L.push('DESCRIPTION:'+ie([o.note||'', o.ref?'訂單編號 '+o.ref:'', '看訂單：'+SITE+(o.link||'orders.html')].filter(Boolean).join('\n')));
    L.push('BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:'+ie(o.title||'彩之語預約'),'END:VALARM','END:VEVENT','END:VCALENDAR');
    return L.join('\r\n');
  }
  function gcal(o){
    var p=wp(o.when); if(!p) return '';
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(o.title||'彩之語預約')+
      '&dates='+stamp(p)+'/'+stamp(p,mins(o.svc))+'&ctz=Asia/Taipei'+
      '&details='+encodeURIComponent([o.note||'', o.ref?'訂單編號 '+o.ref:'', '看訂單：'+SITE+(o.link||'orders.html')].filter(Boolean).join('\n'))+
      (o.place?'&location='+encodeURIComponent(o.place):'');
  }
  function add(o){
    if(ANDROID){ window.open(gcal(o),'_blank','noopener'); return; }
    var txt=ics(o); if(!txt) return;
    if(IOS){ location.href='data:text/calendar;charset=utf-8,'+encodeURIComponent(txt); return; }   // iPhone：直接跳出「加入行事曆」
    var url=URL.createObjectURL(new Blob([txt],{type:'text/calendar;charset=utf-8'})), a=document.createElement('a');
    a.href=url; a.download='彩之語預約.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(url); },2000);
  }
  var CSS='.rwcal{display:flex;align-items:center;flex-wrap:wrap;gap:4px 12px;margin-top:12px}'+
    '.rwcal-btn{font:inherit;font-size:14px;font-weight:500;color:var(--brush,#6B4A33);background:#fff;border:1.5px solid #E2CDB0;border-radius:999px;min-height:42px;padding:0 16px;display:inline-flex;align-items:center;gap:6px;cursor:pointer}'+
    '.rwcal-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
    '.rwcal-btn:active{opacity:.7}'+
    '.rwcal-g{font-size:12.5px;color:var(--soft,#76624C);text-decoration:underline;text-underline-offset:3px;min-height:36px;display:inline-flex;align-items:center}';
  function css(){ if(document.getElementById('rwcal-css')) return; var s=document.createElement('style'); s.id='rwcal-css'; s.textContent=CSS; document.head.appendChild(s); }
  var STORE={}, SEQ=0;
  // 回傳按鍵的 HTML（沒有預約時間就回空字串）；畫到頁面上之後呼叫 bind(容器)
  function html(o){
    if(!o || !wp(o.when)) return ''; css();
    var k='c'+(++SEQ); STORE[k]=o;
    return '<div class="rwcal"><button type="button" class="rwcal-btn" data-rwcal="'+k+'"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M12 13v4M10 15h4"/></svg>加入行事曆</button>'+
      (ANDROID?'':'<a class="rwcal-g" href="'+esc(gcal(o))+'" target="_blank" rel="noopener">用 Google 行事曆</a>')+'</div>';
  }
  function bind(root){ (root||document).querySelectorAll('[data-rwcal]').forEach(function(b){ b.onclick=function(){ var o=STORE[b.getAttribute('data-rwcal')]; if(o) add(o); }; }); }
  // 地址 → 手機地圖
  function mapUrl(addr){ addr=String(addr||'').trim(); return IOS?'https://maps.apple.com/?q='+encodeURIComponent(addr):'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(addr); }
  window.RWAddCal={html:html, bind:bind, add:add, ics:ics, gcal:gcal, mapUrl:mapUrl, mins:mins, isIOS:IOS};
})();
