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
  '.rs-cal{background:#fff;border:1.5px solid #EFE3CE;border-radius:14px;padding:10px 10px 12px}'+
  '.rs-cal-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.rs-cal-h span{font-family:"Noto Serif TC",serif;font-size:16px;font-weight:600;color:var(--brush)}'+
  '.rs-cal-h button{font:inherit;font-size:20px;line-height:1;color:var(--brush);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;width:34px;height:34px;cursor:pointer}.rs-cal-h button:disabled{opacity:.35;cursor:default}'+
  '.rs-cal-g{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.rs-cal-w span{font-size:11.5px;color:var(--soft);text-align:center;padding:2px 0 4px}'+
  '.rs-cd{font:inherit;position:relative;aspect-ratio:1/1;min-height:36px;border:1.5px solid transparent;border-radius:10px;background:#FBF6EC;color:var(--ink);font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:0;cursor:pointer}'+
  '.rs-cd:disabled{background:transparent;color:#CFC3B0;cursor:default}.rs-cd.today{border-color:#E7C9A6}.rs-cd.sel{background:var(--rainbow);color:#4A3A2A;font-weight:600}'+
  '.rs-cd .n{font-size:9.5px;color:#3F7A5E;line-height:1;white-space:nowrap}.rs-cd.sel .n{color:#4A3A2A}'+
  '.rs-picked{font-size:13px;color:var(--brush);font-weight:500;margin-top:10px}'+
  '.rs-fold{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;font:inherit;text-align:left;background:#fff;border:1.5px solid #EFE3CE;border-radius:14px;padding:10px 12px;cursor:pointer;color:inherit;margin-top:8px}.rs-fold:first-child{margin-top:0}'+
  '.rs-fic{flex:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;background:#E4F2E7}.rs-fic.b{background:#FBE7CC}'+
  '.rs-fm{flex:1;min-width:0}.rs-fm b{display:block;font-size:14.5px;color:var(--brush)}.rs-fm small{display:block;font-size:12px;color:var(--soft);margin-top:2px}'+
  '.rs-fgo{flex:none;font-size:12.5px;color:var(--brush);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;padding:5px 11px;white-space:nowrap}'+
  '.rs-fold.open{border-bottom-left-radius:0;border-bottom-right-radius:0}'+
  '.rs-fbody{background:#fff;border:1.5px solid #EFE3CE;border-top:0;border-radius:0 0 14px 14px;padding:10px 12px 12px}'+
  '.rs-day{margin-top:12px;padding-top:10px;border-top:1px dashed #EFE3CE}.rs-day-h{font-size:15px;color:var(--brush);font-weight:600}'+
  '.rs-note{font-size:11.5px;color:var(--soft);margin-top:12px;line-height:1.7}.rs-empty{font-size:12.5px;color:var(--soft);margin-top:4px}';
function css(){ if(document.getElementById('rs-css')) return; var s=document.createElement('style'); s.id='rs-css'; s.textContent=CSS; document.head.appendChild(s); }

/* 排時段畫面。api：
   load()        → Promise<{rows:[{id,slot_at,taken,places}], editable}>
   places()      → Promise<[{v,label}]>
   add(slots,places) → Promise<新增幾個>
   del(id)       → Promise
   changed()     （選用）新增／刪除後呼叫
   openAdd       （選用）true＝「可預約時間」一開始就打開 */
function editor(el,api){
  css();
  var t0=new Date(), S={rows:[], editable:true, all:[], date:today(), pick:[], view:'', times:{}, cy:t0.getFullYear(), cm:t0.getMonth()+1, openA:!!(api&&api.openAdd), openB:false};
  el.innerHTML='<div class="rs-empty">載入中…</div>';
  function msg(t,c){ var m=el.querySelector('[data-rs-msg]'); if(!m) return; m.textContent=t; m.style.color=c||'var(--soft)'; if(c==='#4F8E6E') setTimeout(function(){ if(m.textContent===t) m.textContent=''; },2200); }
  function byDay(){ var o={}; S.rows.forEach(function(s){ var p=wpart(s.slot_at); if(!p) return; var k=dayKey(p); (o[k]=o[k]||[]).push({id:s.id, t:p2(p.h)+':'+p2(p.mi), taken:!!s.taken, places:s.places||null}); });
    Object.keys(o).forEach(function(k){ o[k].sort(function(a,b){ return a.t<b.t?-1:1; }); }); return o; }
  function draw(){
    var B=byDay(), days=Object.keys(B).sort(), t0=today();
    if(!S.view || !B[S.view]) S.view=days[0]||'';
    var h='';
    var tkAll=S.rows.filter(function(s){ return s.taken; }).length, nowK=today()+'T'+p2(new Date().getHours())+':'+p2(new Date().getMinutes());
    var nextS=S.rows.filter(function(s){ return !s.taken; }).map(function(s){ var p=wpart(s.slot_at); return p?dayKey(p)+'T'+p2(p.h)+':'+p2(p.mi):''; }).filter(function(k){ return k && k>=nowK; }).sort()[0];
    // ① 可預約時間：打開是日曆，點日子後在下面選地點和時段
    if(S.editable){
      h+='<button type="button" class="rs-fold'+(S.openA?' open':'')+'" data-rs-fa><span class="rs-fic">📅</span><span class="rs-fm"><b>可預約時間</b><small>'+(S.openA?'點日曆上的日子，下面選時段':'點開日曆，選日子新增時段')+'</small></span><span class="rs-fgo">'+(S.openA?'收起 ▴':'打開日曆 ▾')+'</span></button>';
      if(S.openA){
        var tk0=today(), tn=new Date(), first=new Date(S.cy,S.cm-1,1).getDay(), nd=new Date(S.cy,S.cm,0).getDate();
        var atFirst=(S.cy<tn.getFullYear()) || (S.cy===tn.getFullYear() && S.cm<=tn.getMonth()+1);
        h+='<div class="rs-fbody"><div class="rs-cal">'+
          '<div class="rs-cal-h"><button type="button" data-rs-m="-1" aria-label="上個月"'+(atFirst?' disabled':'')+'>‹</button><span>'+S.cy+' 年 '+S.cm+' 月</span><button type="button" data-rs-m="1" aria-label="下個月">›</button></div>'+
          '<div class="rs-cal-g rs-cal-w">'+WD.map(function(w){ return '<span>'+w+'</span>'; }).join('')+'</div><div class="rs-cal-g">';
        for(var i=0;i<first;i++) h+='<span></span>';
        for(var dd=1;dd<=nd;dd++){ var k=S.cy+'-'+p2(S.cm)+'-'+p2(dd), n=(B[k]||[]).length, past=k<tk0;
          h+='<button type="button" class="rs-cd'+(k===tk0?' today':'')+(k===S.date?' sel':'')+'"'+(past?' disabled':' data-rs-d="'+k+'"')+'>'+dd+(n?'<span class="n">'+n+' 個</span>':'')+'</button>'; }
        h+='</div></div>';
        if(S.date){
          var D=B[S.date]||[];
          h+='<div class="rs-day"><div class="rs-day-h">'+dayLabel(S.date)+(S.date===tk0?' 今天':'')+'</div>';
          if(D.length){
            h+='<div class="rs-lab2">這天已經開了</div><div class="rs-row" style="margin-top:0">'+D.map(function(x){
              return x.taken ? '<span class="rs-pill bk">'+x.t+' '+tagHtml(x.places,S.all)+'<span class="bkt">已被預約</span></span>'
                             : '<span class="rs-pill">'+x.t+' '+tagHtml(x.places,S.all)+(x.id?'<span class="rm" data-rs-rm="'+esc(x.id)+'" title="刪除這個時段">&times;</span>':'')+'</span>'; }).join('')+'</div>';
          }
          if(S.all.length>1){
            h+='<div class="rs-lab2">這些時段可以約哪裡？<small>可以複選；都不選＝全部地點</small></div><div class="rs-plc">'+
              S.all.map(function(x){ var on=S.pick.indexOf(x.v)>=0; return '<button type="button" data-rs-pl="'+esc(x.v)+'" class="'+(on?'on':'')+'">'+(on?'✓ ':'')+esc(x.label)+'</button>'; }).join('')+'</div>';
          }
          h+='<div class="rs-lab2">要開哪些時段？<small>點選，可以複選；灰色＝已經開了</small></div><div class="rs-tm">';
          var have={}; D.forEach(function(x){ have[x.t]=true; });
          for(var hh=8;hh<23;hh++){ for(var mm=0;mm<60;mm+=30){ var v=p2(hh)+':'+p2(mm); h+=have[v]?'<span class="has">'+v+'</span>':'<span data-rs-t="'+v+'" class="'+(S.times[v]?'on':'')+'">'+v+'</span>'; } }
          var nPick=Object.keys(S.times).length;
          h+='</div><div style="display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap"><button type="button" class="rs-go" data-rs-add>'+(nPick?'新增 '+nPick+' 個時段':'新增時段')+'</button><span data-rs-msg style="font-size:12px"></span></div></div>';
        }
        h+='</div>';
      }
    }
    // ② 已開放時段：另外一塊，要看再打開
    h+='<button type="button" class="rs-fold'+(S.openB?' open':'')+'" data-rs-fb><span class="rs-fic b">🕒</span><span class="rs-fm"><b>已開放時段</b><small>'+
      (S.rows.length?'可約 '+(S.rows.length-tkAll)+' 個・已被預約 '+tkAll+' 個'+(nextS?'・最近 '+dayLabel(nextS.slice(0,10))+nextS.slice(11):''):'還沒排開放時段')+'</small></span><span class="rs-fgo">'+(S.openB?'收起 ▴':'查看 ▾')+'</span></button>';
    if(S.openB){
      h+='<div class="rs-fbody">';
      if(!days.length){ h+='<div class="rs-empty" style="margin:0">還沒排開放時段。排了之後客人才能從這些時間預約。</div>'; }
      else{
        h+='<select class="rs-sel" data-rs-view>'+days.map(function(k){ var L=B[k], b=L.filter(function(s){ return s.taken; }).length, pl=[];
            L.forEach(function(s){ (s.places&&s.places.length?s.places.map(short):['全部地點']).forEach(function(x){ if(pl.indexOf(x)<0) pl.push(x); }); });
            return '<option value="'+k+'"'+(k===S.view?' selected':'')+'>'+dayLabel(k)+'・'+L.length+' 個時段（'+esc(pl.join('、'))+'）'+(b?'・'+b+' 個已被預約':'')+'</option>'; }).join('')+'</select>';
        h+='<div class="rs-row">'+B[S.view].map(function(s){
          return s.taken ? '<span class="rs-pill bk">'+s.t+' '+tagHtml(s.places,S.all)+'<span class="bkt">已被預約</span></span>'
                         : '<span class="rs-pill">'+s.t+' '+tagHtml(s.places,S.all)+(S.editable&&s.id?'<span class="rm" data-rs-rm="'+esc(s.id)+'" title="刪除這個時段">&times;</span>':'')+'</span>'; }).join('')+'</div>';
        h+='<div class="rs-note" style="margin-top:8px">下拉選一天看那天的時段；按 × 刪除（已被預約的不能刪）</div>';
      }
      h+='</div>';
    }
    h+='<div class="rs-note">'+(S.all.length>1?'・時段後面的小標籤是地點；同一個時段可以同時開好幾個地點（例如三重＋線上）<br>・以前排好的時段顯示「全部地點」，客人選哪個地點都能約<br>・一個時段被約走，其他地點也會一起變成已被預約<br>':'')+
      '・客人預約時只能從這裡開放的時段挑'+(S.editable?'':'<br><span style="color:#B07A2E">⚠️ 目前只能檢視（請先在 Supabase 執行時段的 SQL）</span>')+'</div>';
    el.innerHTML=h;
    var fa=el.querySelector('[data-rs-fa]'); if(fa) fa.onclick=function(){ S.openA=!S.openA; draw(); };
    var fb=el.querySelector('[data-rs-fb]'); if(fb) fb.onclick=function(){ S.openB=!S.openB; draw(); };
    el.querySelectorAll('[data-rs-d]').forEach(function(b){ b.onclick=function(){ S.date=b.getAttribute('data-rs-d'); S.times={}; draw(); }; });
    el.querySelectorAll('[data-rs-m]').forEach(function(b){ b.onclick=function(){ S.cm+=+b.getAttribute('data-rs-m'); if(S.cm<1){ S.cm=12; S.cy--; } if(S.cm>12){ S.cm=1; S.cy++; } draw(); }; });
    var vs=el.querySelector('[data-rs-view]'); if(vs) vs.onchange=function(){ S.view=vs.value; draw(); };
    el.querySelectorAll('[data-rs-pl]').forEach(function(b){ b.onclick=function(){ var v=b.getAttribute('data-rs-pl'), i=S.pick.indexOf(v); if(i>=0) S.pick.splice(i,1); else S.pick.push(v); draw(); }; });
    el.querySelectorAll('[data-rs-t]').forEach(function(c){ c.onclick=function(){ var v=c.getAttribute('data-rs-t'); if(S.times[v]) delete S.times[v]; else S.times[v]=true; c.classList.toggle('on',!!S.times[v]); var ab2=el.querySelector('[data-rs-add]'), n2=Object.keys(S.times).length; if(ab2) ab2.textContent=n2?'新增 '+n2+' 個時段':'新增時段'; }; });
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
