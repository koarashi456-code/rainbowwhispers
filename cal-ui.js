/* 彩之語共用小月曆（跟引路人後台「我的行程」同一個樣子）
   RWCal.mount(el, {
     days:  {'2026-11-19': {n:3, dot:'op', off:false}},  // 有列出來的日子才能點；n＝右上角小數字；dot：op 綠點、bk 咖啡點
     sel:   '2026-11-19',          // 選中的日子（彩虹底）
     state: {ym:'2026-11'},        // 呼叫的人保留這個物件，重畫時月份才不會跳回去
     onPick: function(k){},        // 點了某一天
     legend: [['op','可預約'],['bk','已被預約']],  // 下面的小說明（可省略）
     plain:  true,                 // 放在已經有框的地方：不要外框
     from:   '2026-11-19',         // （選用）這天以後每一天都能點（排時段用）；之前的日子是灰的
     ahead:  6                     // （選用）配合 from：可以往後翻幾個月
   })
   用在：預約頁選日期（guide.html）、改期選日期（orders.html）、已開放時段看哪一天（slot-ui.js） */
(function(){
  var WD=['日','一','二','三','四','五','六'];
  function p2(n){ return (n<10?'0':'')+n; }
  function todayKey(){ var d=new Date(); return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate()); }
  function ymOf(k){ return String(k).slice(0,7); }
  function shift(ym,d){ var y=+ym.slice(0,4), m=+ym.slice(5,7)+d; while(m<1){ m+=12; y--; } while(m>12){ m-=12; y++; } return y+'-'+p2(m); }
  var CSS='.rwc{max-width:440px;box-sizing:border-box;background:#FFFDF8;border:1.5px solid #EFE3CE;border-radius:16px;padding:10px 10px 12px}'+
    '.rwc-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}'+
    '.rwc-h span{font-family:"Noto Serif TC",serif;font-size:16px;font-weight:600;color:var(--brush,#6B4F35)}'+
    '.rwc-nav{font:inherit;font-size:20px;line-height:1;color:var(--brush,#6B4F35);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:999px;width:40px;height:40px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}'+
    '.rwc-nav:disabled{opacity:.3;cursor:default}'+
    '.rwc.plain{background:transparent;border:0;padding:0}'+
    '.rwc-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}'+
    '.rwc-w span{font-size:12px;color:var(--soft,#76624C);text-align:center;padding:2px 0 4px}'+
    '.rwc-d{font:inherit;position:relative;aspect-ratio:1/1;min-height:36px;min-width:0;border:1.5px solid transparent;border-radius:10px;background:transparent;color:#C9BBA4;font-size:13.5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:0;box-sizing:border-box}'+
    '.rwc-d.on{background:#FBF6EC;color:var(--ink,#4A3A2A);cursor:pointer}'+
    '.rwc-d.on:active{opacity:.72}'+
    '.rwc-d.today{border-color:#E7C9A6}'+
    '.rwc-d.sel{background:var(--rainbow,linear-gradient(90deg,#EE9E86,#F2C56E,#9FD49A,#86C9DA,#B0A2E4));color:#4A3A2A;font-weight:600}'+
    '.rwc-d.blank{background:transparent}'+
    '.rwc-d .cnt{position:absolute;top:2px;right:4px;font-size:10px;line-height:1.2;color:#4F8E6E;font-weight:600}'+
    '.rwc-d .cnt.bk{color:#A5643A}'+
    '.rwc-d .dots{display:flex;gap:3px;height:6px}'+
    '.rwc-d .dots i,.rwc-lg i{display:inline-block;width:6px;height:6px;border-radius:50%}'+
    '.rwc .op{background:#8CC79A}.rwc .bk{background:#B5713F}.rwc .full{background:#D9CDBB}'+
    '.rwc-lg{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;font-size:12px;color:var(--soft,#76624C);margin-top:10px}'+
    '.rwc-lg i{margin-right:4px;vertical-align:1px}';
  function css(){ if(document.getElementById('rwc-css')) return; var s=document.createElement('style'); s.id='rwc-css'; s.textContent=CSS; document.head.appendChild(s); }
  function mount(el,o){
    if(!el) return; css();
    var days=o.days||{}, keys=Object.keys(days).sort(), st=o.state||(o.state={});
    var minYm=keys.length?ymOf(keys[0]):ymOf(todayKey()), maxYm=keys.length?ymOf(keys[keys.length-1]):minYm;
    if(o.from){ minYm=ymOf(o.from); var far=shift(minYm,o.ahead||6); if(far>maxYm) maxYm=far; }
    if(!st.ym) st.ym=o.sel?ymOf(o.sel):minYm;
    if(st.ym<minYm) st.ym=minYm; if(st.ym>maxYm) st.ym=maxYm;
    var y=+st.ym.slice(0,4), m=+st.ym.slice(5,7), first=new Date(y,m-1,1).getDay(), nd=new Date(y,m,0).getDate(), tk=todayKey();
    var h='<div class="rwc'+(o.plain?' plain':'')+'"><div class="rwc-h"><button type="button" class="rwc-nav" data-rwc-m="-1" aria-label="上個月"'+(st.ym<=minYm?' disabled':'')+'>‹</button>'+
      '<span>'+y+' 年 '+m+' 月</span><button type="button" class="rwc-nav" data-rwc-m="1" aria-label="下個月"'+(st.ym>=maxYm?' disabled':'')+'>›</button></div>'+
      '<div class="rwc-g rwc-w">'+WD.map(function(w){ return '<span>'+w+'</span>'; }).join('')+'</div><div class="rwc-g">';
    for(var i=0;i<first;i++) h+='<span class="rwc-d blank"></span>';
    for(var d=1;d<=nd;d++){
      var k=st.ym+'-'+p2(d), x=days[k], can=o.from?(k>=o.from && !(x && x.off)):!!(x && !x.off);
      var inner=(x && x.n?'<span class="cnt'+(x.cntBk?' bk':'')+'">'+x.n+'</span>':'')+d+'<span class="dots">'+(x && x.dot?'<i class="'+x.dot+'"></i>':'')+(x && x.dot2?'<i class="'+x.dot2+'"></i>':'')+'</span>';
      var cls='rwc-d'+(can?' on':'')+(k===tk?' today':'')+(k===o.sel?' sel':'');
      h+=can?'<button type="button" class="'+cls+'" data-rwc-d="'+k+'" aria-label="'+m+' 月 '+d+' 日'+(x && x.label?'，'+x.label:'')+'"'+(k===o.sel?' aria-pressed="true"':'')+'>'+inner+'</button>'
            :'<span class="'+cls+'"'+(x && x.label?' title="'+x.label+'"':'')+'>'+inner+'</span>';
    }
    h+='</div>';
    if(o.legend && o.legend.length) h+='<div class="rwc-lg">'+o.legend.map(function(l){ return '<span><i class="'+l[0]+'"></i>'+l[1]+'</span>'; }).join('')+'</div>';
    h+='</div>';
    el.innerHTML=h;
    Array.prototype.forEach.call(el.querySelectorAll('[data-rwc-m]'),function(b){ b.onclick=function(){ st.ym=shift(st.ym,+b.getAttribute('data-rwc-m')); mount(el,o); }; });
    Array.prototype.forEach.call(el.querySelectorAll('[data-rwc-d]'),function(b){ b.onclick=function(){ if(o.onPick) o.onPick(b.getAttribute('data-rwc-d')); }; });
  }
  window.RWCal={mount:mount, todayKey:todayKey};
})();
