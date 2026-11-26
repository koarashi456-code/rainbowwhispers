/* 彩之語：私訊（會員 ↔ 預約過的引路人）
   會員：右上角 💬（nav.js）或網址 #chat、#chat=<引路人 id>；引路人：後台「私訊」或網址 #gchat
   資料：SQL my_chat_threads／my_chat_messages／send_my_chat（會員）、guide_chat_threads／guide_chat_messages／guide_send_chat（引路人）
   打開對話就算已讀；開著的時候每幾秒看一次有沒有新訊息 */
(function(){
  if(window.RWChat) return;
  var WD='日一二三四五六';
  function p2(n){ return (n<10?'0':'')+n; }
  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
  function tok(){ return window.rwMemberToken?window.rwMemberToken():null; }
  function rpc(name,args){
    return new Promise(function(res,rej){
      var go=function(){ fetch(window.SUPA.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:window.SUPA.key,Authorization:'Bearer '+(tok()||window.SUPA.key),'Content-Type':'application/json'},body:JSON.stringify(args||{})})
        .then(function(r){ return r.text().then(function(t){ var d=null; try{ d=t?JSON.parse(t):null; }catch(e){} if(!r.ok){ var m=(d&&(d.message||d.hint))||'連線失敗'; if(/could not find the function/i.test(m)) m='私訊功能還沒開通（請官方更新系統）'; rej(new Error(m)); } else res(d); }); })
        .catch(function(){ rej(new Error('連線失敗，請稍後再試')); }); };
      if(window.SUPA) go(); else if(window.rwWithSupa) rwWithSupa(go); else rej(new Error('連線失敗'));
    });
  }
  function hm(s){ var d=new Date(s); return isNaN(d)?'':p2(d.getHours())+':'+p2(d.getMinutes()); }
  function dayLabel(s){ var d=new Date(s); if(isNaN(d)) return ''; var t=new Date(), y=new Date(t.getFullYear(),t.getMonth(),t.getDate()-1);
    if(d.toDateString()===t.toDateString()) return '今天'; if(d.toDateString()===y.toDateString()) return '昨天';
    return (d.getMonth()+1)+'/'+d.getDate()+'（'+WD.charAt(d.getDay())+'）'; }
  function when(s){ if(!s) return ''; var d=new Date(s), t=new Date(); if(d.toDateString()===t.toDateString()) return hm(s); return (d.getMonth()+1)+'/'+d.getDate(); }
  var CSS='.ch-mask{position:fixed;inset:0;z-index:420;background:rgba(52,38,26,.35)}.ch-mask[hidden]{display:none}'+
    '.ch-box{position:absolute;inset:0;background:#FAF4EA;display:flex;flex-direction:column;font-family:"Noto Sans TC",sans-serif;color:#4A3A2A}'+
    '@media(min-width:700px){.ch-mask{background:rgba(52,38,26,.18)}.ch-box{inset:auto 20px 20px auto;width:390px;height:min(640px,calc(100vh - 40px));border-radius:20px;box-shadow:0 20px 50px -20px rgba(40,25,10,.5);overflow:hidden}}'+
    '.ch-h{flex:none;display:flex;align-items:center;gap:6px;padding:calc(6px + env(safe-area-inset-top)) 6px 6px 10px;background:#FFFDF8;border-bottom:1px solid #EFE3CE;min-height:56px;box-sizing:border-box}'+
    '.ch-back{font:inherit;font-size:15px;font-weight:500;color:#6B4A33;background:none;border:0;min-height:44px;padding:0 6px;cursor:pointer}'+
    '.ch-t{flex:1;min-width:0;font-family:"Noto Serif TC",serif;font-size:17px;font-weight:600;color:#6B4A33;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.ch-t small{display:block;font-family:"Noto Sans TC",sans-serif;font-size:11.5px;font-weight:400;color:#8C7963}'+
    'a.ch-t{display:block;text-decoration:none;padding:4px 0;border-radius:8px;-webkit-tap-highlight-color:transparent}a.ch-t:active{opacity:.6}a.ch-t:hover small{text-decoration:underline}'+
    '.ch-x{flex:none;width:44px;height:44px;border:0;background:none;font-size:24px;line-height:1;color:#8C7963;border-radius:50%;cursor:pointer}'+
    '.ch-body{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch}'+
    '.ch-list{background:#fff;margin:12px;border:1px solid #EFE3CE;border-radius:14px;overflow:hidden}'+
    '.ch-row{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;font:inherit;text-align:left;background:none;border:0;border-bottom:1px solid #F1E7D6;padding:10px 12px;min-height:64px;cursor:pointer;color:inherit}'+
    '.ch-row:last-child{border-bottom:0}.ch-row:active{background:#FBF6EC}'+
    '.ch-av{flex:none;position:relative;width:44px;height:44px;border-radius:50%;background:conic-gradient(from 200deg,#F6C9B9,#F8DEAC,#CAE6C4,#BCE0E7,#D4CBED,#F6C9B9);display:flex;align-items:center;justify-content:center}'+
    '.ch-av span{position:relative;width:36px;height:36px;border-radius:50%;background:#FFFDF8;overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:"Noto Serif TC",serif;font-weight:600;color:#6B4A33;font-size:15px}'+
    '.ch-av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}'+
    '.ch-m{flex:1;min-width:0}.ch-m b{display:flex;justify-content:space-between;gap:8px;font-size:15px;font-weight:600;color:#6B4A33}.ch-m b small{font-size:11.5px;font-weight:400;color:#8C7963;flex:none}'+
    '.ch-m span{display:block;font-size:13px;color:#76624C;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}'+
    '.ch-row.unread .ch-m span{color:#4A3A2A;font-weight:600}'+
    '.ch-n{flex:none;min-width:20px;height:20px;border-radius:999px;background:#D4694E;color:#fff;font-size:11.5px;line-height:20px;text-align:center;padding:0 6px;box-sizing:border-box}'+
    '.ch-empty{padding:40px 24px;text-align:center;font-size:14px;line-height:1.8;color:#76624C}.ch-empty a{color:#6B4A33;font-weight:600}'+
    '.ch-msgs{padding:12px 12px 6px;display:flex;flex-direction:column;gap:4px}'+
    '.ch-day{align-self:center;font-size:11.5px;color:#8C7963;background:#F1E9DC;border-radius:999px;padding:2px 10px;margin:8px 0 4px}'+
    '.ch-b{max-width:78%;padding:8px 12px;border-radius:16px;font-size:14.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word}'+
    '.ch-b.me{align-self:flex-end;background:#6B4A33;color:#FFFDF8;border-bottom-right-radius:5px}'+
    '.ch-b.them{align-self:flex-start;background:#fff;border:1px solid #EFE3CE;border-bottom-left-radius:5px}'+
    '.ch-tm{font-size:10.5px;color:#8C7963;margin:0 4px 4px}.ch-tm.me{align-self:flex-end}.ch-tm.them{align-self:flex-start}'+
    '.ch-in{flex:none;display:flex;align-items:flex-end;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:#FFFDF8;border-top:1px solid #EFE3CE}'+
    '.ch-in textarea{flex:1;min-width:0;font:inherit;font-size:16px;line-height:1.45;color:#4A3A2A;background:#F1E9DC;border:0;border-radius:18px;padding:9px 14px;resize:none;max-height:120px;outline:none;box-sizing:border-box}'+
    '.ch-in textarea:focus{box-shadow:0 0 0 2px #E2CFEE}'+
    '.ch-send{flex:none;font:inherit;font-size:15px;font-weight:600;color:#FFFDF8;background:#6B4A33;border:0;border-radius:999px;min-height:42px;padding:0 18px;cursor:pointer}.ch-send:disabled{opacity:.45;cursor:default}'+
    '.ch-err{font-size:12.5px;color:#B4566E;padding:0 14px 6px;background:#FFFDF8}.ch-err:empty{display:none}'+
    '.ch-note{font-size:11.5px;color:#8C7963;text-align:center;padding:6px 16px 0}'+
    '.ch-back:active,.ch-x:active,.ch-send:active{opacity:.7}';
  var mask=null, box=null, S={role:'member', view:'list', id:'', name:'', n:-1, timer:null, last:null};
  function css(){ if(document.getElementById('ch-css')) return; var s=document.createElement('style'); s.id='ch-css'; s.textContent=CSS; document.head.appendChild(s); }
  function api(){ return S.role==='guide'
    ? {threads:'guide_chat_threads', msgs:function(id){ return rpc('guide_chat_messages',{p_member:id}); }, send:function(id,b){ return rpc('guide_send_chat',{p_member:id,p_body:b}); }}
    : {threads:'my_chat_threads', msgs:function(id){ return rpc('my_chat_messages',{p_guide:id}); }, send:function(id,b){ return rpc('send_my_chat',{p_guide:id,p_body:b}); }}; }
  function stop(){ if(S.timer){ clearInterval(S.timer); S.timer=null; } }
  function onKey(e){ if(e.key==='Escape'){ if(S.view==='thread' && !S.direct) list(); else close(); } }
  function close(){ stop(); if(mask) mask.hidden=true; document.body.style.overflow=''; document.removeEventListener('keydown',onKey);
    if(/^#g?chat/.test(location.hash) && history.replaceState) history.replaceState(null,'',location.pathname+location.search);
    if(window.rwChatBadge) window.rwChatBadge(); }
  // link：有的話名字可以點（會員看引路人 → 引路人介紹頁）
  function head(title,sub,back,link){ var t=esc(title)+(sub?'<small>'+esc(sub)+'</small>':'');
    return '<div class="ch-h">'+(back?'<button type="button" class="ch-back" data-ch-back>‹ 返回</button>':'<span style="width:6px"></span>')+
      (link?'<a class="ch-t" href="'+esc(link)+'" data-ch-prof>'+t+'</a>':'<div class="ch-t">'+t+'</div>')+
      '<button type="button" class="ch-x" data-ch-x aria-label="關閉">×</button></div>'; }
  function avatar(x){ var nm=S.role==='guide'?(x.name||'會員'):(x.guide_name||'引路人'), ini=Array.from(String(nm).trim()||'?')[0];
    var img=S.role==='guide'||!window.SUPA?'':'<img alt="" loading="lazy" src="'+esc(window.SUPA.url+'/storage/v1/object/public/guide-photos/'+encodeURIComponent(x.guide_id)+'.jpg')+'" onerror="this.remove()">';
    return '<span class="ch-av"><span>'+esc(ini)+img+'</span></span>'; }
  // 對話清單
  function list(){
    stop(); S.view='list'; S.direct=false;
    box.innerHTML=head('私訊',S.role==='guide'?'客人傳來的訊息':'跟你預約過的引路人聊聊',false)+'<div class="ch-body"><div class="ch-empty">載入中…</div></div>';
    var load=function(){ rpc(api().threads).then(function(L){ if(S.view!=='list') return; L=Array.isArray(L)?L:[]; var b=box.querySelector('.ch-body');
        if(!L.length){ b.innerHTML='<div class="ch-empty">'+(S.role==='guide'?'客人預約你以後，就可以在這裡私訊你。':'預約過引路人以後，<br>就可以在這裡私訊他。<br><br><a href="booking.html#pick">去預約引路人 ›</a>')+'</div>'; return; }
        b.innerHTML='<div class="ch-list">'+L.map(function(x){ var id=S.role==='guide'?x.member_uid:x.guide_id, nm=S.role==='guide'?(x.name||'會員'):(x.guide_name||'引路人'), un=Number(x.unread)||0;
          var pv=x.last_body?((x.last_sender===(S.role==='guide'?'guide':'member')?'你：':'')+x.last_body):'還沒有訊息，點進去打個招呼';
          return '<button type="button" class="ch-row'+(un?' unread':'')+'" data-ch-open="'+esc(id)+'" data-ch-name="'+esc(nm)+'">'+avatar(x)+'<span class="ch-m"><b>'+esc(nm)+'<small>'+esc(when(x.last_at))+'</small></b><span>'+esc(pv)+'</span></span>'+(un?'<span class="ch-n">'+(un>99?'99+':un)+'</span>':'')+'</button>'; }).join('')+'</div>';
      }).catch(function(e){ var b=box.querySelector('.ch-body'); if(b && S.view==='list') b.innerHTML='<div class="ch-empty">'+esc(e.message)+'</div>'; }); };
    load(); S.timer=setInterval(load,15000);
  }
  function drawMsgs(L,keepPos){
    var w=box.querySelector('.ch-body'); if(!w) return;
    var nearBottom=w.scrollHeight-w.scrollTop-w.clientHeight<80, h='', day='', me=S.role==='guide'?'guide':'member';
    if(!L.length) h='<div class="ch-empty">'+(S.role==='guide'?'還沒有訊息，可以先跟客人打聲招呼。':'有想問的都可以問，<br>引路人看到會回覆你。')+'</div>';
    L.forEach(function(m){ var d=dayLabel(m.created_at); if(d!==day){ day=d; h+='<div class="ch-day">'+esc(d)+'</div>'; }
      var c=m.sender===me?'me':'them'; h+='<div class="ch-b '+c+'">'+esc(m.body)+'</div><div class="ch-tm '+c+'">'+hm(m.created_at)+'</div>'; });
    w.innerHTML='<div class="ch-msgs">'+h+'</div>';
    if(!keepPos || nearBottom) w.scrollTop=w.scrollHeight;
  }
  // 跟一個人的對話
  function thread(id,name,direct){
    stop(); S.view='thread'; S.id=id; S.name=name||''; S.n=-1; S.direct=!!direct;
    var prof=S.role==='member'?'guide.html?id='+encodeURIComponent(id):'';   // 會員：點引路人名字看他的介紹
    box.innerHTML=head(S.name||(S.role==='guide'?'會員':'引路人'),S.role==='guide'?'客人':'引路人・看介紹 ›',!direct,prof)+
      '<div class="ch-body"><div class="ch-empty">載入中…</div></div><div class="ch-err" data-ch-err></div>'+
      '<form class="ch-in" data-ch-form><textarea rows="1" maxlength="1000" placeholder="輸入訊息…" aria-label="輸入訊息" data-ch-text></textarea><button type="submit" class="ch-send" data-ch-send disabled>傳送</button></form>';
    var ta=box.querySelector('[data-ch-text]'), sb=box.querySelector('[data-ch-send]'), er=box.querySelector('[data-ch-err]');
    function fit(){ ta.style.height='auto'; ta.style.height=Math.min(120,ta.scrollHeight)+'px'; sb.disabled=!ta.value.trim(); }
    ta.addEventListener('input',fit);
    ta.addEventListener('keydown',function(e){ if(e.key==='Enter' && !e.shiftKey && !e.isComposing && window.matchMedia('(min-width:700px)').matches){ e.preventDefault(); box.querySelector('[data-ch-form]').requestSubmit?box.querySelector('[data-ch-form]').requestSubmit():send(); } });   // 電腦：Enter 送出、Shift+Enter 換行
    box.querySelector('[data-ch-form]').onsubmit=function(e){ e.preventDefault(); send(); };
    var L=[];
    function load(first){ api().msgs(S.id).then(function(d){ if(S.view!=='thread') return; d=Array.isArray(d)?d:[]; if(d.length!==S.n || first){ S.n=d.length; L=d; drawMsgs(L,!first); if(window.rwChatBadge) window.rwChatBadge(); } }).catch(function(e){ er.textContent=e.message; }); }
    function send(){ var b=ta.value.trim(); if(!b) return; sb.disabled=true; er.textContent='';
      api().send(S.id,b).then(function(m){ ta.value=''; fit(); if(m){ L=L.concat([m]); S.n=L.length; drawMsgs(L,false); } ta.focus(); })
        .catch(function(e){ er.textContent=e.message; sb.disabled=false; }); }
    load(true); S.timer=setInterval(function(){ load(false); },6000);
    setTimeout(function(){ if(window.matchMedia('(min-width:700px)').matches) ta.focus(); },60);
  }
  // opt：{role:'member'|'guide', id:'對方 id', name:'對方名字'}
  function open(opt){
    opt=opt||{}; css(); S.role=opt.role==='guide'?'guide':'member';
    if(!tok()){ location.href='account.html?next='+encodeURIComponent(location.pathname.split('/').pop()+location.search+'#chat'); return; }
    if(!mask){ mask=document.createElement('div'); mask.className='ch-mask'; mask.hidden=true; mask.setAttribute('role','dialog'); mask.setAttribute('aria-modal','true'); mask.setAttribute('aria-label','私訊');
      box=document.createElement('div'); box.className='ch-box'; mask.appendChild(box); document.body.appendChild(mask);
      mask.addEventListener('click',function(e){ if(e.target===mask || e.target.closest('[data-ch-x]')){ close(); return; }
        if(e.target.closest('[data-ch-back]')){ list(); return; }
        var pf=e.target.closest('[data-ch-prof]'); if(pf){ close(); var u=new URL(pf.href,location.href); if(u.pathname===location.pathname && u.search===location.search){ e.preventDefault(); window.scrollTo(0,0); } return; }   // 已經在這位的介紹頁：關掉私訊就好
        var r=e.target.closest('[data-ch-open]'); if(r) thread(r.getAttribute('data-ch-open'),r.getAttribute('data-ch-name')); }); }
    mask.hidden=false; document.body.style.overflow='hidden'; document.addEventListener('keydown',onKey);
    if(opt.id){ thread(opt.id,opt.name||'',false); if(!opt.name){ rpc(api().threads).then(function(L){ (L||[]).forEach(function(x){ var id=S.role==='guide'?x.member_uid:x.guide_id; if(id===S.id && S.view==='thread'){ S.name=S.role==='guide'?x.name:x.guide_name; var t=box.querySelector('.ch-t'); if(t) t.firstChild.nodeValue=S.name; } }); }).catch(function(){}); } }
    else list();
  }
  window.RWChat={open:open, close:close};
})();
