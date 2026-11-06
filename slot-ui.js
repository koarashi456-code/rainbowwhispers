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
  '.rs-lab2{font-size:12.5px;color:var(--soft);margin:16px 2px 8px}.rs-lab2:first-child{margin-top:0}.rs-lab2 small{font-size:11.5px;color:#A9967E;margin-left:4px}'+
  '.rs-plc{display:flex;flex-wrap:wrap;gap:7px}.rs-plc button{font:inherit;font-size:13px;color:var(--ink);background:#fff;border:1.5px solid #EFE3CE;border-radius:999px;padding:7px 13px;cursor:pointer}'+
  '.rs-plc button.on{background:#E9F3EC;border-color:#8CC49A;color:#2F6B4C;font-weight:500}'+
  '.rs-tm{display:flex;flex-wrap:wrap;gap:7px}.rs-tm span{font-size:13px;color:var(--ink);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;padding:7px 12px;cursor:pointer;user-select:none}'+
  '.rs-tm span.on{background:var(--rainbow);color:#4A3A2A;border-color:transparent;font-weight:500}.rs-tm span.has{background:#F3EFE6;color:#B5A88E;cursor:default}'+
  '.rs-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}'+
  '.rs-pill{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--ink);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;padding:6px 10px 6px 12px}'+
  '.rs-pill.bk{background:#F3EFE6;color:#8E8065}.rs-pill .rm{color:#C0506A;font-size:15px;cursor:pointer;line-height:1}.rs-pill .bkt{font-size:11px;color:#8E8065;background:#E7DEC9;border-radius:999px;padding:1px 8px}'+
  '.ptag{font-size:10.5px;border-radius:999px;padding:1px 7px;white-space:nowrap}'+
  '.pt-a{background:#E4F2E7;color:#3F7A5E}.pt-b{background:#EAE4F7;color:#6E4F9E}.pt-c{background:#FBE7CC;color:#A5643A}.pt-d{background:#F6E1E8;color:#A4506E}.pt-e{background:#E6EDE0;color:#5E7448}.pt-o{background:#E3EEF6;color:#4F7392}.pt-all{background:#F1EBDD;color:#8A7659}'+
  '.rs-go{font:inherit;font-size:13px;color:#4A3A2A;background:var(--rainbow);border:0;border-radius:999px;padding:8px 18px;cursor:pointer}.rs-go:disabled{opacity:.6}'+
  '.rs-note{font-size:11.5px;color:var(--soft);margin-top:12px;line-height:1.7}.rs-empty{font-size:12.5px;color:var(--soft);margin-top:4px}';
function css(){ if(document.getElementById('rs-css')) return; var s=document.createElement('style'); s.id='rs-css'; s.textContent=CSS; document.head.appendChild(s); }

/* 排時段畫面。api：
   load()        → Promise<{rows:[{id,slot_at,taken,places}], editable}>
   places()      → Promise<[{v,label}]>
   add(slots,places) → Promise<新增幾個>
   del(id)       → Promise
   changed()     （選用）新增／刪除後呼叫 */
function editor(el,api){
  css();
  var S={rows:[], editable:true, all:[], date:today(), pick:[], view:'', times:{}};
  el.innerHTML='<div class="rs-empty">載入中…</div>';
  function msg(t,c){ var m=el.querySelector('[data-rs-msg]'); if(!m) return; m.textContent=t; m.style.color=c||'var(--soft)'; if(c==='#4F8E6E') setTimeout(function(){ if(m.textContent===t) m.textContent=''; },2200); }
  function byDay(){ var o={}; S.rows.forEach(function(s){ var p=wpart(s.slot_at); if(!p) return; var k=dayKey(p); (o[k]=o[k]||[]).push({id:s.id, t:p2(p.h)+':'+p2(p.mi), taken:!!s.taken, places:s.places||null}); });
    Object.keys(o).forEach(function(k){ o[k].sort(function(a,b){ return a.t<b.t?-1:1; }); }); return o; }
  function draw(){
    var B=byDay(), days=Object.keys(B).sort(), t0=today();
    if(!S.view || !B[S.view]) S.view=days[0]||'';
    var h='';
    if(S.editable){
      // 選日期：今天起 60 天
      h+='<div class="rs-lab2">選日期</div><select class="rs-sel" data-rs-date>';
      var d0=new Date(); for(var i=0;i<60;i++){ var d=new Date(d0.getFullYear(),d0.getMonth(),d0.getDate()+i), k=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate()), n=(B[k]||[]).length;
        h+='<option value="'+k+'"'+(k===S.date?' selected':'')+'>'+dayLabel(k)+(i===0?' 今天':'')+(n?'・已開 '+n+' 個時段':'')+'</option>'; }
      h+='</select>';
      if(S.all.length>1){
        h+='<div class="rs-lab2">這些時段可以約哪裡？<small>可以複選；都不選＝全部地點</small></div><div class="rs-plc">'+
          S.all.map(function(x){ var on=S.pick.indexOf(x.v)>=0; return '<button type="button" data-rs-pl="'+esc(x.v)+'" class="'+(on?'on':'')+'">'+(on?'✓ ':'')+esc(x.label)+'</button>'; }).join('')+'</div>';
      }
      h+='<div class="rs-lab2">這天開放哪些時段<small>點選，半小時一格；灰色＝已經開了</small></div><div class="rs-tm">';
      var have={}; (B[S.date]||[]).forEach(function(s){ have[s.t]=true; });
      for(var hh=8;hh<23;hh++){ for(var mm=0;mm<60;mm+=30){ var v=p2(hh)+':'+p2(mm); h+=have[v]?'<span class="has">'+v+'</span>':'<span data-rs-t="'+v+'" class="'+(S.times[v]?'on':'')+'">'+v+'</span>'; } }
      h+='</div><div style="display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap"><button type="button" class="rs-go" data-rs-add>新增時段</button><span data-rs-msg style="font-size:12px"></span></div>';
    }
    // 已開放時段：下拉選一天
    var tk=S.rows.filter(function(s){ return s.taken; }).length;
    h+='<div class="rs-lab2">已開放時段'+(S.rows.length?'<small>可約 '+(S.rows.length-tk)+' 個・已被預約 '+tk+' 個</small>':'')+'</div>';
    if(!days.length){ h+='<div class="rs-empty">還沒排開放時段。排了之後客人才能從這些時間預約。</div>'; }
    else{
      h+='<select class="rs-sel" data-rs-view>'+days.map(function(k){ var L=B[k], b=L.filter(function(s){ return s.taken; }).length, pl=[];
          L.forEach(function(s){ (s.places&&s.places.length?s.places.map(short):['全部地點']).forEach(function(x){ if(pl.indexOf(x)<0) pl.push(x); }); });
          return '<option value="'+k+'"'+(k===S.view?' selected':'')+'>'+dayLabel(k)+'・'+L.length+' 個時段（'+esc(pl.join('、'))+'）'+(b?'・'+b+' 個已被預約':'')+'</option>'; }).join('')+'</select>';
      h+='<div class="rs-row">'+B[S.view].map(function(s){
        return s.taken ? '<span class="rs-pill bk">'+s.t+' '+tagHtml(s.places,S.all)+'<span class="bkt">已被預約</span></span>'
                       : '<span class="rs-pill">'+s.t+' '+tagHtml(s.places,S.all)+(S.editable&&s.id?'<span class="rm" data-rs-rm="'+esc(s.id)+'" title="刪除這個時段">&times;</span>':'')+'</span>'; }).join('')+'</div>';
    }
    h+='<div class="rs-note">'+(S.all.length>1?'・時段後面的小標籤是地點；同一個時段可以同時開好幾個地點（例如三重＋線上）<br>・以前排好的時段顯示「全部地點」，客人選哪個地點都能約<br>・一個時段被約走，其他地點也會一起變成已被預約<br>':'')+
      '・客人預約時只能從這裡開放的時段挑'+(S.editable?'':'<br><span style="color:#B07A2E">⚠️ 目前只能檢視（請先在 Supabase 執行時段的 SQL）</span>')+'</div>';
    el.innerHTML=h;
    var ds=el.querySelector('[data-rs-date]'); if(ds) ds.onchange=function(){ S.date=ds.value; S.times={}; draw(); };
    var vs=el.querySelector('[data-rs-view]'); if(vs) vs.onchange=function(){ S.view=vs.value; draw(); };
    el.querySelectorAll('[data-rs-pl]').forEach(function(b){ b.onclick=function(){ var v=b.getAttribute('data-rs-pl'), i=S.pick.indexOf(v); if(i>=0) S.pick.splice(i,1); else S.pick.push(v); draw(); }; });
    el.querySelectorAll('[data-rs-t]').forEach(function(c){ c.onclick=function(){ var v=c.getAttribute('data-rs-t'); if(S.times[v]) delete S.times[v]; else S.times[v]=true; c.classList.toggle('on',!!S.times[v]); }; });
    el.querySelectorAll('[data-rs-rm]').forEach(function(x){ x.onclick=async function(){
      if(!confirm('刪除這個開放時段？')) return;
      try{ await api.del(x.getAttribute('data-rs-rm')); await reload(); if(api.changed) api.changed(); }catch(e){ alert('刪除失敗：'+((e&&e.message)||'')); } }; });
    var ab=el.querySelector('[data-rs-add]'); if(ab) ab.onclick=async function(){
      var picked=Object.keys(S.times).sort();
      if(!S.date){ msg('請先選日期','#C0506A'); return; }
      if(!picked.length){ msg('請點選要開放的時段','#C0506A'); return; }
      ab.disabled=true; msg('新增中…');
      try{ var n=await api.add(picked.map(function(t){ return S.date+'T'+t; }), S.pick.slice());
        S.times={}; S.view=S.date; await reload(); msg('已新增 '+(n||0)+' 個時段','#4F8E6E'); if(api.changed) api.changed(); }
      catch(e){ ab.disabled=false; msg('新增失敗：'+((e&&e.message)||''),'#C0506A'); }
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
