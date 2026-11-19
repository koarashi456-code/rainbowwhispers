/* 彩之語：引路人開放時段（可以分地點）
   共用在「引路人後台 → 我的開放時間」(account.html) 和「我的後台 → 引路人明細」(admin.html)。
   時段的地點存在 guide_slots.places（text[]）：'線上'、地區（例：新北市三重區）、'實體'；空的＝全部地點。 */
(function(){
var WD=['日','一','二','三','四','五','六'];
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function p2(n){ return (n<10?'0':'')+n; }
function wpart(s){ var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s||'')); return m?{y:+m[1],mo:+m[2],d:+m[3],h:+m[4],mi:+m[5]}:null; }
function dayKey(p){ return p.y+'-'+p2(p.mo)+'-'+p2(p.d); }
function dayLabel(k){ var a=k.split('-'), d=new Date(+a[0],a[1]-1,+a[2]); return (+a[1])+'/'+(+a[2])+'（'+WD[d.getDay()]+'）'; }
function today(){ var t=new Date(); return t.getFullYear()+'-'+p2(t.getMonth()+1)+'-'+p2(t.getDate()); }
// 「新北市三重區」→「三重」；「臺北市」→「臺北市」
function short(v){
  v=String(v||''); if(v==='線上') return '線上'; if(v==='實體') return '實體';
  var m=/^(.{2,3}?[縣市])(.+)$/.exec(v); var d=m?m[2]:v;
  return (d.length>=3 && /區$/.test(d)) ? d.slice(0,-1) : d;
}
// guide_places 的結果（或後台自己算的）→ 選項清單
function placesFrom(d){
  if(!d) return [];
  var out=[];
  if(d.online) out.push({v:'線上', label:'線上視訊'});
  (d.areas||[]).forEach(function(a){ a=String(a||'').trim(); if(a && !out.some(function(x){ return x.v===a; })) out.push({v:a, label:a}); });
  if(d.offline && out.every(function(x){ return x.v==='線上'; })) out.push({v:'實體', label:'實體見面'});
  return out;
}
// 這個時段能不能用在這個地點（沒設地點＝全部地點都可以）
function fits(places,v){ return !places || !places.length || !v || places.indexOf(v)>=0; }
var CLS=['pt-a','pt-b','pt-c','pt-d','pt-e'];
function tagHtml(places,all){
  if(!places || !places.length) return '<span class="ptag pt-all">全部地點</span>';
  return places.map(function(v){ var i=0, k=0; (all||[]).forEach(function(x){ if(x.v==='線上') return; if(x.v===v) i=k; k++; });
    return '<span class="ptag '+(v==='線上'?'pt-o':CLS[i%CLS.length])+'" title="'+esc(v)+'">'+esc(short(v))+'</span>'; }).join('');
}
var CSS='.rs-sel{width:100%;box-sizing:border-box;font:inherit;font-size:14px;color:var(--ink);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:12px;padding:9px 12px;outline:none}'+
  '.rs-lab2{font-size:12.5px;color:var(--soft);margin:16px 2px 8px}.rs-lab2:first-child{margin-top:0}.rs-lab2 small{font-size:12.5px;color:#A9967E;margin-left:4px}'+
  '.rs-plc{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.rs-plc button{font:inherit;font-size:14px;color:var(--ink);background:#fff;border:1.5px solid #EFE3CE;border-radius:999px;min-height:38px;padding:0 14px;cursor:pointer}'+
  '.rs-plc button.on{background:#E9F3EC;border-color:#8CC49A;color:#2F6B4C;font-weight:500}'+
  '.rs-tm{display:grid;grid-template-columns:repeat(auto-fill,minmax(58px,1fr));gap:6px}'+
  '.rs-tm button,.rs-tm span{font:inherit;font-size:14px;color:var(--ink);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:12px;min-height:40px;padding:0 4px;cursor:pointer;user-select:none;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}'+
  '.rs-tm button.on{background:var(--rainbow);color:#4A3A2A;border-color:transparent;font-weight:600}.rs-tm span.has{background:transparent;border-style:dashed;color:#B5A88E;cursor:default}'+
  '.rs-tm span.has i{font-style:normal;font-size:11px;margin-left:3px;color:#A9967E}.rs-plc button .c{display:inline-block;min-width:18px;font-size:12px;font-weight:600;background:var(--rainbow);color:#4A3A2A;border-radius:999px;padding:0 6px;margin-left:5px}'+
  '.rs-sum{font-size:12.5px;color:var(--brush)}'+
  '.rs-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}'+
  '.rs-pill{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--ink);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;padding:6px 10px 6px 12px}'+
  '.rs-pill.bk{background:#F3EFE6;color:#8E8065}.rs-pill .rm{font:inherit;color:#C0506A;font-size:18px;line-height:1;background:none;border:0;padding:0 2px;margin:-6px -4px -6px 0;min-width:28px;min-height:28px;cursor:pointer}.rs-pill .bkt{font-size:12px;color:#8E8065;background:#E7DEC9;border-radius:999px;padding:1px 8px}'+
  '.ptag{font-size:11.5px;border-radius:999px;padding:1px 7px;white-space:nowrap}'+
  '.pt-a{background:#E4F2E7;color:#3F7A5E}.pt-b{background:#EAE4F7;color:#6E4F9E}.pt-c{background:#FBE7CC;color:#A5643A}.pt-d{background:#F6E1E8;color:#A4506E}.pt-e{background:#E6EDE0;color:#5E7448}.pt-o{background:#E3EEF6;color:#4F7392}.pt-all{background:#F1EBDD;color:#8A7659}'+
  '.rs-go{font:inherit;font-size:14px;font-weight:500;color:#4A3A2A;background:var(--rainbow);border:0;border-radius:999px;min-height:42px;padding:0 20px;cursor:pointer}.rs-go:disabled{opacity:.5;cursor:default}'+
  '.rs-cal{background:#fff;border:1.5px solid #EFE3CE;border-radius:14px;padding:10px 10px 12px}'+
  '.rs-cal-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.rs-cal-h span{font-family:"Noto Serif TC",serif;font-size:16px;font-weight:600;color:var(--brush)}'+
  '.rs-cal-h button{font:inherit;font-size:20px;line-height:1;color:var(--brush);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;width:34px;height:34px;cursor:pointer}.rs-cal-h button:disabled{opacity:.35;cursor:default}'+
  '.rs-cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.rs-cal-w span{font-size:12.5px;color:var(--soft);text-align:center;padding:2px 0 4px}'+
  '.rs-cd{font:inherit;position:relative;aspect-ratio:1/1;min-height:36px;border:1.5px solid transparent;border-radius:10px;background:#FBF6EC;color:var(--ink);font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:0;cursor:pointer}'+
  '.rs-cd:disabled{background:transparent;color:#CFC3B0;cursor:default}.rs-cd.today{border-color:#E7C9A6}.rs-cd.sel{background:var(--rainbow);color:#4A3A2A;font-weight:600}'+
  '.rs-cd .n{font-size:11px;color:#3F7A5E;line-height:1;white-space:nowrap}.rs-cd.sel .n{color:#4A3A2A}'+
  '.rs-picked{font-size:13px;color:var(--brush);font-weight:500;margin-top:10px}'+
  '.rs-fold{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;font:inherit;text-align:left;background:#fff;border:1.5px solid #EFE3CE;border-radius:14px;padding:10px 12px;cursor:pointer;color:inherit;margin-top:8px}.rs-fold:first-child{margin-top:0}'+
  '.rs-fic{flex:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;background:#E4F2E7}.rs-fic.b{background:#FBE7CC}'+
  '.rs-fm{flex:1;min-width:0}.rs-fm b{display:block;font-size:14.5px;color:var(--brush)}.rs-fm small{display:block;font-size:12px;color:var(--soft);margin-top:2px}'+
  '.rs-fgo{flex:none;font-size:12.5px;color:var(--brush);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;padding:5px 11px;white-space:nowrap}'+
  '.rs-fold.open{border-bottom-left-radius:0;border-bottom-right-radius:0}'+
  '.rs-fbody{background:#fff;border:1.5px solid #EFE3CE;border-top:0;border-radius:0 0 14px 14px;padding:10px 12px 12px}'+
  '.rs-top{font-size:13px;color:var(--soft);margin:0 2px 10px}.rs-top b{color:var(--brush)}'+
  '.rs-day{margin-top:12px;padding-top:12px;border-top:1px dashed #E6D7BF;max-width:440px;box-sizing:border-box}'+
  '.rs-day-h{font-size:16px;color:var(--brush);font-weight:600;display:flex;align-items:center;gap:8px}.rs-tdy{font-size:12px;font-weight:500;color:#A5643A;background:#FBE7CC;border-radius:999px;padding:1px 8px}'+
  '.rs-tg{font-size:12.5px;color:var(--soft);margin:12px 2px 6px}'+
  '.rs-add{font:inherit;font-size:14px;font-weight:500;color:var(--brush);background:#fff;border:1.5px dashed #D9C7A8;border-radius:999px;min-height:42px;padding:0 18px;margin-top:12px;cursor:pointer}'+
  '.rs-acts{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px}.rs-msg{font-size:12.5px;color:var(--soft)}'+
  '.rs-cancel{font:inherit;font-size:14px;color:var(--soft);background:none;border:0;min-height:42px;padding:0 10px;cursor:pointer}'+
  '.rs-note{font-size:12.5px;color:var(--soft);margin-top:12px;line-height:1.7}.rs-empty{font-size:12.5px;color:var(--soft);margin-top:4px}';
function css(){ if(document.getElementById('rs-css')) return; var s=document.createElement('style'); s.id='rs-css'; s.textContent=CSS; document.head.appendChild(s); }

/* 排時段畫面。api：
   load()        → Promise<{rows:[{id,slot_at,taken,places}], editable}>
   places()      → Promise<[{v,label}]>
   add(slots,places) → Promise<新增幾個>
   del(id)       → Promise
   changed()     （選用）新增／刪除後呼叫
   open          （選用）true＝一開始就打開（平常收合，只看摘要）
   （一個月曆：點日子看那天的時段、刪除、加時段） */
function editor(el,api){
  css();
  var S={rows:[], editable:true, all:[], date:today(), pick:[], times:{}, tp:{}, tab:'', adding:false, vcal:{}, open:!!(api&&api.open)};
  // 有好幾個地點時：線上視訊和各地區「分開選時段」；S.tp = {地點: {時間:true}}，同一個時間只能給一個地點
  function multi(){ return S.all.length>1; }
  function cnt(v){ return Object.keys(S.tp[v]||{}).length; }
  function nPicked(){ return multi()?S.all.reduce(function(a,x){ return a+cnt(x.v); },0):Object.keys(S.times).length; }
  el.innerHTML='<div class="rs-empty">載入中…</div>';
  function msg(t,c){ var m=el.querySelector('[data-rs-msg]');
    if(!m){ var d=el.querySelector('.rs-day'); if(!d) return; m=document.createElement('div'); m.className='rs-msg'; m.setAttribute('data-rs-msg',''); m.style.marginTop='10px'; d.appendChild(m); }
    m.textContent=t; m.style.color=c||'var(--soft)'; if(c==='#4F8E6E') setTimeout(function(){ if(m.textContent===t) m.textContent=''; },2200); }
  function byDay(){ var o={}; S.rows.forEach(function(s){ var p=wpart(s.slot_at); if(!p) return; var k=dayKey(p); (o[k]=o[k]||[]).push({id:s.id, t:p2(p.h)+':'+p2(p.mi), taken:!!s.taken, places:s.places||null}); });
    Object.keys(o).forEach(function(k){ o[k].sort(function(a,b){ return a.t<b.t?-1:1; }); }); return o; }
  // 一個月曆就好：點日子 → 下面看這天開了哪些時段、可以刪；要加就按「＋ 加時段」
  function draw(){
    var B=byDay(), tk0=today();
    if(!S.date || S.date<tk0) S.date=tk0;
    var tkAll=S.rows.filter(function(s){ return s.taken; }).length, nowK=tk0+'T'+p2(new Date().getHours())+':'+p2(new Date().getMinutes());
    var nextS=S.rows.filter(function(s){ return !s.taken; }).map(function(s){ var p=wpart(s.slot_at); return p?dayKey(p)+'T'+p2(p.h)+':'+p2(p.mi):''; }).filter(function(k){ return k && k>=nowK; }).sort()[0];
    // 收合：平常只看摘要，點「修改」才打開月曆
    var sum=S.rows.length?'可約 '+(S.rows.length-tkAll)+' 個・已被預約 '+tkAll+' 個'+(nextS?'・最近 '+dayLabel(nextS.slice(0,10))+' '+nextS.slice(11):''):'還沒開任何時段';
    var h='<button type="button" class="rs-fold'+(S.open?' open':'')+'" data-rs-fold aria-expanded="'+S.open+'"><span class="rs-fic">📅</span><span class="rs-fm"><b>可預約時間</b><small>'+esc(sum)+'</small></span><span class="rs-fgo">'+(S.open?'收起 ▴':'修改 ▾')+'</span></button>';
    if(!S.open){ el.innerHTML=h; el.querySelector('[data-rs-fold]').onclick=function(){ S.open=true; draw(); }; return; }
    h+='<div class="rs-fbody"><div data-rs-cal></div>';
    // 選到的那一天
    var D=B[S.date]||[], have={}; D.forEach(function(x){ have[x.t]=true; });
    h+='<div class="rs-day"><div class="rs-day-h">'+dayLabel(S.date)+(S.date===tk0?'<span class="rs-tdy">今天</span>':'')+'</div>';
    if(D.length){
      h+='<div class="rs-row">'+D.map(function(x){
        return x.taken ? '<span class="rs-pill bk">'+x.t+' '+tagHtml(x.places,S.all)+'<span class="bkt">已被預約</span></span>'
                       : '<span class="rs-pill">'+x.t+' '+tagHtml(x.places,S.all)+(S.editable&&x.id?'<button type="button" class="rm" data-rs-rm="'+esc(x.id)+'" aria-label="刪除 '+x.t+' 這個時段">&times;</button>':'')+'</span>'; }).join('')+'</div>';
    } else h+='<div class="rs-empty">這天還沒開時段</div>';
    var adding=S.editable && (S.adding || !D.length);
    if(S.editable && !adding) h+='<button type="button" class="rs-add" data-rs-open>＋ 加時段</button>';
    if(adding){
      var mine, other={};
      if(multi()){
        if(!S.tab || !S.all.some(function(x){ return x.v===S.tab; })) S.tab=S.all[0].v;
        h+='<div class="rs-plc" role="tablist" aria-label="地點">'+S.all.map(function(x){ var c=cnt(x.v); return '<button type="button" role="tab" aria-selected="'+(x.v===S.tab)+'" data-rs-tab="'+esc(x.v)+'" class="'+(x.v===S.tab?'on':'')+'">'+esc(x.label)+(c?'<span class="c">'+c+'</span>':'')+'</button>'; }).join('')+'</div>';
        S.all.forEach(function(x){ if(x.v===S.tab) return; Object.keys(S.tp[x.v]||{}).forEach(function(t){ other[t]=x.v; }); });
        mine=S.tp[S.tab]||{};
      } else mine=S.times;
      [['上午',8,12],['下午',12,18],['晚上',18,23]].forEach(function(g){
        h+='<div class="rs-tg">'+g[0]+'</div><div class="rs-tm">';
        for(var hh=g[1];hh<g[2];hh++){ for(var mm=0;mm<60;mm+=30){ var v=p2(hh)+':'+p2(mm);
          h+=have[v]?'<span class="has">'+v+'</span>':other[v]?'<span class="has">'+v+'<i>'+esc(short(other[v]))+'</i></span>':'<button type="button" data-rs-t="'+v+'" class="'+(mine[v]?'on':'')+'" aria-pressed="'+(!!mine[v])+'">'+v+'</button>'; } }
        h+='</div>';
      });
      var nPick=nPicked(), sum=multi()?S.all.filter(function(x){ return cnt(x.v); }).map(function(x){ return esc(short(x.v))+' '+cnt(x.v)+' 個'; }).join('・'):'';
      h+='<div class="rs-acts"><button type="button" class="rs-go" data-rs-add'+(nPick?'':' disabled')+'>'+(nPick?'新增 '+nPick+' 個時段':'點上面的時間')+'</button>'+(D.length?'<button type="button" class="rs-cancel" data-rs-close>取消</button>':'')+'<span data-rs-msg class="rs-msg">'+(sum?'這次：'+sum:'')+'</span></div>';
    }
    h+='</div>';
    if(multi()) h+='<div class="rs-note">線上和各地區分開開時段，同一個時間只能給一個地點。</div>';
    if(!S.editable) h+='<div class="rs-note" style="color:#B07A2E">⚠️ 目前只能檢視（請先在 Supabase 執行時段的 SQL）</div>';
    h+='</div>';
    el.innerHTML=h;
    el.querySelector('[data-rs-fold]').onclick=function(){ S.open=false; draw(); };
    // 月曆：右上角數字＝那天開了幾個時段；綠點＝還開放、咖啡點＝有人預約了
    var dm={}; Object.keys(B).forEach(function(k){ var L=B[k], nb=L.filter(function(s){ return s.taken; }).length;
      dm[k]={n:L.length, dot:(L.length>nb?'op':''), dot2:(nb?'bk':''), label:L.length+' 個時段'+(nb?'，'+nb+' 個已被預約':'')}; });
    S.vcal=S.vcal||{};
    if(window.RWCal) RWCal.mount(el.querySelector('[data-rs-cal]'),{plain:true, days:dm, sel:S.date, state:S.vcal, from:tk0, ahead:6,
      legend:[['op','還開放'],['bk','有人預約了']], onPick:function(k){ if(k!==S.date){ S.date=k; S.times={}; S.tp={}; S.adding=false; } draw(); }});
    var op=el.querySelector('[data-rs-open]'); if(op) op.onclick=function(){ S.adding=true; draw(); };
    var cl=el.querySelector('[data-rs-close]'); if(cl) cl.onclick=function(){ S.adding=false; S.times={}; S.tp={}; draw(); };
    el.querySelectorAll('[data-rs-tab]').forEach(function(b){ b.onclick=function(){ S.tab=b.getAttribute('data-rs-tab'); draw(); }; });
    el.querySelectorAll('[data-rs-t]').forEach(function(c){ c.onclick=function(){ var v=c.getAttribute('data-rs-t');
      if(multi()){ var m=S.tp[S.tab]=S.tp[S.tab]||{}; if(m[v]) delete m[v]; else m[v]=true; }
      else { if(S.times[v]) delete S.times[v]; else S.times[v]=true; }
      draw(); }; });
    el.querySelectorAll('[data-rs-rm]').forEach(function(x){ x.onclick=async function(){
      if(!confirm('刪除這個開放時段？')) return;
      try{ await api.del(x.getAttribute('data-rs-rm')); await reload(); if(api.changed) api.changed(); }catch(e){ alert('刪除失敗：'+((e&&e.message)||'')); } }; });
    var ab=el.querySelector('[data-rs-add]'); if(ab) ab.onclick=async function(){
      // 每個地點各自一批（線上一批、三重一批…）；只有一個地點時照舊
      var groups=multi()?S.all.filter(function(x){ return cnt(x.v); }).map(function(x){ return {t:Object.keys(S.tp[x.v]).sort(), pl:[x.v]}; })
                        :[{t:Object.keys(S.times).sort(), pl:S.pick.slice()}].filter(function(g){ return g.t.length; });
      if(!groups.length){ msg('請點選要開放的時段','#C0506A'); return; }
      ab.disabled=true; msg('新增中…');
      var n=0, done=0;
      try{ for(var gi=0;gi<groups.length;gi++){ n+=Number(await api.add(groups[gi].t.map(function(t){ return S.date+'T'+t; }), groups[gi].pl))||0; done++; }
        S.times={}; S.tp={}; S.adding=false; await reload(); msg('已新增 '+n+' 個時段','#4F8E6E'); if(api.changed) api.changed(); }
      catch(e){ if(done){ S.tp={}; S.times={}; await reload(); } var ab3=el.querySelector('[data-rs-add]'); if(ab3) ab3.disabled=false; msg((done?'部分新增成功，':'')+'新增失敗：'+((e&&e.message)||''),'#C0506A'); }
    };
  }
  async function reload(){
    try{ var r=await api.load(); S.rows=(r&&r.rows)||[]; S.editable=!(r && r.editable===false); }catch(e){ el.innerHTML='<div class="rs-empty" style="color:#C0506A">讀取時段失敗：'+esc((e&&e.message)||'')+'</div>'; return; }
    draw();
  }
  (async function(){ try{ S.all=(await api.places())||[]; }catch(e){ S.all=[]; } S.pick=[]; await reload(); })();
  async function refreshPlaces(){ try{ S.all=(await api.places())||[]; }catch(e){ S.all=[]; } S.pick=S.pick.filter(function(v){ return S.all.some(function(x){ return x.v===v; }); }); draw(); }
  return {reload:reload, refreshPlaces:refreshPlaces};
}
window.RWSlots={editor:editor, placesFrom:placesFrom, fits:fits, short:short, tagHtml:tagHtml, wpart:wpart};
})();
