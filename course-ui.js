/* 彩之語：套裝課程卡（會員中心「我的課程」、引路人後台客戶明細、我的後台客戶明細共用）
   資料來自 SQL：my_packages()／my_guide_packages()／admin_packages() → 每個課程
   {id,label,total,used,booked,transferred,remaining,guide_id,guide_name,customer_name,from_name,created_at,price,sessions:[{kind,at,status,by,note}]}
   規定：無使用期限；購買 7 天內全額退費，之後退費退還沒上過的堂數金額並酌收 10% 違約金；可轉讓（由官方辦理）
   退費：refund_status（申請中／已退費）、refund_amount、refund_fee；SQL：package_refund_quote、request_package_refund、cancel_package_refund、admin_complete_refund */
(function(){
var WD=['日','一','二','三','四','五','六'];
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function p2(n){ return (n<10?'0':'')+n; }
function wpart(s){ var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s||'')); return m?{y:+m[1],mo:+m[2],d:+m[3],h:+m[4],mi:+m[5]}:null; }
function when(s){ var p=wpart(s); if(!p) return '—'; return p.mo+'/'+p.d+'（'+WD[new Date(p.y,p.mo-1,p.d).getDay()]+'）'+p2(p.h)+':'+p2(p.mi); }
function dayw(s){ var p=wpart(s); return p?p.mo+'/'+p.d+'（'+WD[new Date(p.y,p.mo-1,p.d).getDay()]+'）':'—'; }
function day(s){ var d=new Date(s); return isNaN(d)?'':(d.getMonth()+1)+'/'+d.getDate(); }
function ymd(s){ var d=new Date(s); return isNaN(d)?'':d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate(); }
function money(n){ return '$'+Number(n||0).toLocaleString(); }
var CSS='.pkc{background:#fff;border:1.5px solid #EFE3CE;border-radius:16px;padding:12px 14px;margin-bottom:10px;text-align:left}'+
  '.pkc-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.pkc-h b{font-size:15px;color:var(--brush)}.pkc-h span{font-size:12.5px;color:var(--soft);text-align:right}'+
  '.pkc-bar{height:10px;border-radius:999px;background:#F1E7D6;overflow:hidden;margin:9px 0 6px;display:flex}.pkc-bar i{display:block;height:100%}'+
  '.pkc-bar .u{background:var(--rainbow)}.pkc-bar .b{background:#F2CF9E}.pkc-bar .x{background:#D8CFC2}'+
  '.pkc-n{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--ink)}.pkc-n b{color:var(--brush)}'+
  '.pkc-dots{display:flex;gap:5px;margin-top:8px;flex-wrap:wrap}'+
  '.pkc-dots span{width:22px;height:22px;border-radius:50%;border:1.5px solid #E4D7C2;font-size:11px;display:flex;align-items:center;justify-content:center;color:#B8A88E;background:#fff;box-sizing:border-box}'+
  '.pkc-dots span.u{background:#7FBF93;border-color:#7FBF93;color:#fff}.pkc-dots span.b{background:#FBE7CC;border-color:#E9C79A;color:#A5643A}.pkc-dots span.x{background:#EEE8DF;border-color:#E0D7CA;color:#B5AA98;text-decoration:line-through}'+
  '.pkc-ses{margin-top:8px;border-top:1px dashed #EFE3CE}'+
  '.pkc-ses div{display:flex;align-items:center;gap:10px;font-size:13px;padding:6px 0;border-bottom:1px dashed #EFE3CE}'+
  '.pkc-ses .k{flex:none;width:44px;color:var(--soft)}.pkc-ses .w{flex:1;min-width:0;text-align:left;color:var(--ink)}'+
  '.pkc-ses .st{flex:none;font-size:11px;border-radius:999px;padding:1px 8px;white-space:nowrap}'+
  '.pkc-st-d{background:#D8ECDF;color:#3F7A5E}.pkc-st-b{background:#FBE7CC;color:#A5643A}.pkc-st-m{background:#EAD9F2;color:#6E4F9E}.pkc-st-n{background:#F6DDE3;color:#B4566E}.pkc-st-x{background:#EEE8DF;color:#8A7D6A}'+
  '.pkc-more{font:inherit;font-size:12.5px;color:var(--brush);background:none;border:0;text-decoration:underline;cursor:pointer;padding:6px 0 0}'+
  '.pkc-btns{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}.pkc-btns>*{flex:1;min-width:110px;font:inherit;font-size:13px;border-radius:999px;padding:8px 6px;border:1.5px solid var(--line);background:#fff;color:var(--brush);cursor:pointer;text-align:center;text-decoration:none;box-sizing:border-box}'+
  '.pkc-btns .pkc-go{background:var(--rainbow);border-color:transparent;color:#4A3A2A;font-weight:500}.pkc-btns>*:disabled{opacity:.5;cursor:default}'+
  '.pkc-use{display:none;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap}.pkc-use.on{display:flex}'+
  '.pkc-use input{font:inherit;font-size:13.5px;color:var(--ink);background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:10px;padding:6px 9px}'+
  '.pkc-use button{font:inherit;font-size:13px;border-radius:999px;padding:7px 14px;border:0;background:var(--rainbow);color:#4A3A2A;cursor:pointer}'+
  '.pkc-rule{font-size:11.5px;color:var(--soft);background:#FBF6EC;border-radius:10px;padding:7px 10px;margin-top:10px;line-height:1.7}.pkc-rule b{color:var(--brush);font-weight:500}'+
  '.pkc-link{display:block;text-align:center;font-size:12.5px;color:var(--brush);text-decoration:underline;margin-top:10px}'+
  '.pkc-msg{font-size:12px;margin-top:6px;min-height:0}'+
  '.pkc-rf{margin-top:10px;background:#FBEDE9;color:#A5543F;border-radius:10px;padding:8px 11px;font-size:13px;line-height:1.6}.pkc-rf small{color:#B98575;font-size:11.5px}.pkc-rf.done{background:#EEE8DF;color:#7A6B57}'+
  '.pkc-btns .pkc-warn{color:#B4566E;border-color:#F0D5DC}'+
  '.pkr-mask{position:fixed;inset:0;background:rgba(60,45,30,.38);display:flex;align-items:flex-end;justify-content:center;z-index:120}'+
  '.pkr-box{background:var(--card,#FFFDF8);width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:14px 16px 20px;max-height:88vh;overflow:auto;text-align:left;box-sizing:border-box}'+
  '@media(min-width:600px){.pkr-mask{align-items:center}.pkr-box{border-radius:20px}}'+
  '.pkr-top{display:flex;justify-content:space-between;align-items:center}.pkr-top b{font-family:"Noto Serif TC",serif;font-size:17px;color:var(--brush)}'+
  '.pkr-x{border:0;background:none;font-size:24px;line-height:1;color:var(--soft);cursor:pointer}'+
  '.pkr-kv{display:flex;justify-content:space-between;gap:14px;font-size:13.5px;padding:5px 0;border-bottom:1px dashed #EFE3CE}.pkr-kv span:first-child{color:var(--soft);flex:none}.pkr-kv span:last-child{text-align:right}'+
  '.pkr-kv.tot span:last-child{font-weight:700;color:var(--brush)}'+
  '.pkr-tag{display:inline-block;font-size:11.5px;border-radius:999px;padding:1px 9px;margin:4px 0 6px;background:#E4F2E7;color:#3F7A5E}.pkr-tag.no{background:#F6E6DF;color:#B4614A}'+
  '.pkr-in{width:100%;box-sizing:border-box;font:inherit;font-size:14px;color:var(--ink);background:#fff;border:1.5px solid #EFE3CE;border-radius:10px;padding:8px 10px;margin-top:4px}'+
  '.pkr-note{font-size:12px;color:var(--soft);margin-top:8px;line-height:1.7}.pkr-err{font-size:12.5px;color:#C0506A;min-height:1.2em;margin-top:6px}'+
  '.pkr-btns{display:flex;gap:8px;margin-top:8px}.pkr-btns button{flex:1;font:inherit;font-size:14px;border-radius:999px;padding:9px 0;border:1.5px solid var(--line);background:#fff;color:var(--brush);cursor:pointer}.pkr-btns .go{color:#B4566E;border-color:#F0D5DC}.pkr-btns button:disabled{opacity:.5}';
function css(){ if(document.getElementById('pkc-css')) return; var s=document.createElement('style'); s.id='pkc-css'; s.textContent=CSS; document.head.appendChild(s); }
// 每一堂：網站預約（看訂單狀態）、手動記錄、轉讓
function sesRows(pk,mode){
  var n=0, rows=(pk.sessions||[]).map(function(s){
    if(s.kind==='transfer') return '<div><span class="k">轉讓</span><span class="w">'+esc(s.note||('轉讓 '+(s.delta||0)+' 堂'))+'</span><span class="st pkc-st-x">'+esc(day(s.at))+'</span></div>';
    n++;
    var st, c;
    if(s.kind==='manual'){ st=s.by==='admin'?'官方記錄':(mode==='guide'?'你手動記錄':'引路人記錄'); c='m'; }
    else if(s.status==='已預約'){ st='已預約'; c='b'; }
    else if(s.status==='未出席'){ st='未出席'; c='n'; }
    else { st='已上課'; c='d'; }
    return '<div><span class="k">第 '+n+' 堂</span><span class="w">'+(s.kind==='manual'?dayw(s.at):when(s.at))+(s.note&&s.kind==='manual'?'　<small style="color:var(--soft)">'+esc(s.note)+'</small>':'')+'</span><span class="st pkc-st-'+c+'">'+st+'</span></div>';
  });
  return rows;
}
// mode：member（我的課程）／guide（引路人後台）／admin（我的後台）
function card(pk,mode){
  css();
  var total=+pk.total||0, used=+pk.used||0, bk=+pk.booked||0, tr=+pk.transferred||0, rem=+pk.remaining||0;
  var pct=function(x){ return total?Math.max(0,Math.min(100,x*100/total)):0; };
  var right=mode==='member'?esc(pk.guide_name||''):(pk.from_name?'由 '+esc(pk.from_name)+' 轉讓':(ymd(pk.created_at)+' 購買'+(pk.price?' '+money(pk.price):'')));
  if(mode==='member' && pk.from_name) right=esc(pk.guide_name||'')+'<br><small>由 '+esc(pk.from_name)+' 轉讓</small>';
  var h='<div class="pkc" data-pkid="'+esc(pk.id)+'"><div class="pkc-h"><b>'+esc(pk.label||'套裝課程')+'</b><span>'+right+'</span></div>'+
    '<div class="pkc-bar"><i class="u" style="width:'+pct(used)+'%"></i><i class="b" style="width:'+pct(bk)+'%"></i><i class="x" style="width:'+pct(tr)+'%"></i></div>'+
    '<div class="pkc-n"><span>已上 <b>'+used+'</b> 堂'+(bk?'・已預約 '+bk+' 堂':'')+(tr?'・轉出 '+tr+' 堂':'')+'</span><span>剩 <b>'+rem+'</b> 堂'+(mode==='member'&&!pk.refund_status?'可約':'')+'</span></div>';
  if(total<=30){ h+='<div class="pkc-dots">'; for(var i=0;i<total;i++){ var c=i<used?'u':i<used+bk?'b':i<used+bk+tr?'x':''; h+='<span class="'+c+'">'+(i+1)+'</span>'; } h+='</div>'; }
  var rs=pk.refund_status||'';
  if(rs==='申請中') h+='<div class="pkc-rf">退費申請中・可退 <b>'+money(pk.refund_amount)+'</b>'+(Number(pk.refund_fee)>0?'（違約金 '+money(pk.refund_fee)+'）':'')+'<br><small>'+(mode==='member'?'彩之語會在 3～5 個工作天內處理退款':'等彩之語處理退款')+(mode==='admin'&&pk.refund_account?'・退款帳戶：'+esc(pk.refund_account):'')+'</small></div>';
  else if(rs==='已退費') h+='<div class="pkc-rf done">已退費 '+money(pk.refund_amount)+(pk.refunded_at?'（'+ymd(pk.refunded_at)+'）':'')+'・課程已結束</div>';
  var rows=sesRows(pk,mode);
  if(rows.length){
    var show=mode==='member'?rows:rows.slice(-3);
    h+='<div class="pkc-ses">'+show.join('')+'</div>';
    if(show.length<rows.length) h+='<button type="button" class="pkc-more" data-pk-all>看全部 '+rows.length+' 筆紀錄</button><div class="pkc-ses" data-pk-allbox style="display:none">'+rows.join('')+'</div>';
  }
  if(mode==='member'){
    if(rs==='申請中') h+='<div class="pkc-btns"><button type="button" data-pk-rfcancel>取消退費申請</button></div><div class="pkc-msg" data-pk-msg></div>';
    else if(!rs){
      h+='<div class="pkc-btns">'+(rem>0?'<a class="pkc-go" href="guide.html?id='+encodeURIComponent(pk.guide_id||'')+'&pkg='+encodeURIComponent(pk.id)+'">用堂數預約下一堂 ›</a><button type="button" class="pkc-warn" data-pk-refund>申請退費</button>':'<span style="border:0;color:var(--soft)">堂數已經用完了</span>')+'</div><div class="pkc-msg" data-pk-msg></div>'+
        '<div class="pkc-rule"><b>無使用期限</b>・購買 7 天內可<b>全額退費</b>，之後退費酌收 10%・可以<b>轉讓</b>給親友</div>'+
        (rem>0?'<a class="pkc-link" href="https://lin.ee/t0NBjud0" target="_blank" rel="noopener">想轉讓給朋友？加官方 LINE 告訴我們對方的會員信箱 ›</a>':'');
    }
  } else {
    var lock=!!rs;
    h+='<div class="pkc-btns"><button type="button" class="pkc-go" data-pk-use'+(rem>0&&!lock?'':' disabled')+'>＋ 記錄一堂</button><button type="button" data-pk-ret'+(lock?' disabled':'')+'>退回一堂</button>'+(mode==='admin'?'<button type="button" data-pk-xfer'+(rem>0&&!lock?'':' disabled')+'>轉讓</button>':'')+'</div>'+
      (mode==='admin'&&rs==='申請中'?'<div class="pkc-btns"><button type="button" class="pkc-warn" data-pk-rfdone>錢退好了，按這裡完成退費</button></div>':'')+
      '<div class="pkc-use" data-pk-usebox><span style="font-size:12.5px;color:var(--soft)">上課日期</span><input type="date" data-pk-date><button type="button" data-pk-ok>確認扣 1 堂</button></div>'+
      '<div class="pkc-msg" data-pk-msg></div>'+
      '<div class="pkc-rule"><b>無使用期限</b>・7 天內全額退費，之後退費酌收 10%・可轉讓'+(mode==='guide'?'（轉讓、退費由彩之語官方處理）':'')+'</div>';
  }
  return h+'</div>';
}
// 綁「記錄一堂／退回一堂／看全部」；api.adjust(id,delta,at) → Promise；api.done() 重新整理；api.transfer(pk) 我的後台
function bind(box,list,api){
  if(!box) return;
  box.querySelectorAll('.pkc[data-pkid]').forEach(function(el){
    var id=el.getAttribute('data-pkid'), pk=(list||[]).filter(function(x){ return String(x.id)===id; })[0];
    var msg=el.querySelector('[data-pk-msg]');
    function say(t,c){ if(msg){ msg.textContent=t; msg.style.color=c||'var(--soft)'; } }
    var all=el.querySelector('[data-pk-all]'); if(all) all.onclick=function(){ var b=el.querySelector('[data-pk-allbox]'); var on=b.style.display==='none'; b.style.display=on?'block':'none'; var s=el.querySelector('.pkc-ses'); if(s && s!==b) s.style.display=on?'none':''; all.textContent=on?'收起':'看全部紀錄'; };
    var use=el.querySelector('[data-pk-use]'), ub=el.querySelector('[data-pk-usebox]'), dt=el.querySelector('[data-pk-date]');
    if(use) use.onclick=function(){ ub.classList.toggle('on'); if(dt && !dt.value){ var t=new Date(); dt.value=t.getFullYear()+'-'+p2(t.getMonth()+1)+'-'+p2(t.getDate()); } };
    var ok=el.querySelector('[data-pk-ok]'); if(ok) ok.onclick=async function(){
      if(!dt.value){ say('請選上課日期','#C0506A'); return; }
      ok.disabled=true; say('記錄中…');
      try{ await api.adjust(id,1,dt.value+'T12:00:00'); if(api.done) api.done(); }catch(e){ ok.disabled=false; say('記錄失敗：'+((e&&e.message)||''),'#C0506A'); }
    };
    var ret=el.querySelector('[data-pk-ret]'); if(ret) ret.onclick=async function(){
      if(!confirm('退回最近一次「手動記錄」的那一堂？\n（客人在網站預約的那堂，請取消那筆預約）')) return;
      ret.disabled=true; say('處理中…');
      try{ await api.adjust(id,-1,null); if(api.done) api.done(); }catch(e){ ret.disabled=false; say(((e&&e.message)||'退回失敗'),'#C0506A'); }
    };
    var xf=el.querySelector('[data-pk-xfer]'); if(xf && api.transfer) xf.onclick=function(){ api.transfer(pk||{id:id}); };
    var rf=el.querySelector('[data-pk-refund]'); if(rf && api.refund) rf.onclick=function(){ api.refund(pk||{id:id}); };
    var rc=el.querySelector('[data-pk-rfcancel]'); if(rc && api.refundCancel) rc.onclick=async function(){
      if(!confirm('取消這次的退費申請？課程會恢復可以預約。')) return;
      rc.disabled=true; say('處理中…');
      try{ await api.refundCancel(id); if(api.done) api.done(); }catch(e){ rc.disabled=false; say(((e&&e.message)||'取消失敗'),'#C0506A'); }
    };
    var rd=el.querySelector('[data-pk-rfdone]'); if(rd && api.refundDone) rd.onclick=async function(){
      if(!confirm('確定已經把 '+money(pk&&pk.refund_amount)+' 退給客人了？\n按下後課程結束，剩下的堂數不能再用。')) return;
      rd.disabled=true; say('處理中…');
      try{ await api.refundDone(id); if(api.done) api.done(); }catch(e){ rd.disabled=false; say(((e&&e.message)||'處理失敗'),'#C0506A'); }
    };
  });
}
// 會員申請退費的試算畫面：q 來自 package_refund_quote；submit(account) 回傳 Promise
function refundSheet(q,submit){
  css();
  var old=document.getElementById('pkr-mask'); if(old) old.remove();
  var m=document.createElement('div'); m.className='pkr-mask'; m.id='pkr-mask';
  var kv=function(k,v,c){ return '<div class="pkr-kv'+(c?' '+c:'')+'"><span>'+k+'</span><span>'+v+'</span></div>'; };
  var h='<div class="pkr-box" role="dialog" aria-label="申請課程退費"><div class="pkr-top"><b>申請課程退費</b><button type="button" class="pkr-x" aria-label="關閉">×</button></div>';
  h+=q.in7?'<span class="pkr-tag">購買 7 天內（還剩 '+q.days_left+' 天）：不收違約金</span>':'<span class="pkr-tag no">購買已超過 7 天：酌收 10% 違約金</span>';
  h+=kv('課程',esc(q.label||'套裝課程'))+kv('已付金額',money(q.price)+'（共 '+q.total+' 堂，每堂 '+money(q.per)+'）')+kv('已使用',q.used?q.used+' 堂':'還沒上課')+
     kv('沒上過的 '+q.remaining+' 堂',money(q.unused))+kv('違約金',q.fee?'<span style="color:#B4566E">10%　−'+money(q.fee)+'</span>':'$0（7 天內免收）')+kv('可退金額',money(q.refund),'tot');
  if(!q.can){ h+='<div class="pkr-err" style="margin-top:10px">'+esc(q.reason||'目前不能申請退費')+'</div><div class="pkr-btns"><button type="button" data-pkr-no>知道了</button></div></div>'; }
  else {
    h+=(q.need_account?'<div class="pkr-note" style="margin-top:10px;color:var(--ink)">退款帳戶（銀行代碼＋帳號）</div><input class="pkr-in" data-pkr-acct maxlength="80" placeholder="例：822 1234567890">':'<div class="pkr-note">退款會退回'+(q.method==='儲值'?'你的儲值餘額':'原本付款的信用卡')+'。</div>')+
      '<div class="pkr-note">送出後由彩之語官方處理，約 3～5 個工作天退款。退費後這個課程就結束，剩下的堂數不能再用。</div><div class="pkr-err" data-pkr-err></div>'+
      '<div class="pkr-btns"><button type="button" data-pkr-no>先不要</button><button type="button" class="go" data-pkr-go>確定申請退費</button></div></div>';
  }
  m.innerHTML=h; document.body.appendChild(m);
  function close(){ m.remove(); }
  m.addEventListener('click',function(e){ if(e.target===m) close(); });
  m.querySelector('.pkr-x').onclick=close; var no=m.querySelector('[data-pkr-no]'); if(no) no.onclick=close;
  var go=m.querySelector('[data-pkr-go]'); if(go) go.onclick=async function(){
    var ai=m.querySelector('[data-pkr-acct]'), er=m.querySelector('[data-pkr-err]'), acct=ai?ai.value.trim():'';
    if(ai && !acct){ er.textContent='請填退款帳戶'; ai.style.borderColor='#C0506A'; return; }
    go.disabled=true; er.textContent='送出中…'; er.style.color='var(--soft)';
    try{ await submit(acct); close(); }catch(e){ go.disabled=false; er.style.color='#C0506A'; er.textContent=(e&&e.message)||'送出失敗'; }
  };
  return {close:close};
}
window.RWCourse={card:card, bind:bind, css:css, refundSheet:refundSheet};
})();
