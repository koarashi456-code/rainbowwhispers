/* 彩之語：預約成功後給客人的「服務地址／線上視訊」區塊（預約完成頁、我的訂單共用）
   資料來自 SQL：my_booking_access(p_ref)，只有刷卡／儲值的訂單、下單會員本人拿得到 */
(function(){
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function safeUrl(u){ u=String(u||'').trim(); return /^https:\/\/[^\s"'<>]+$/i.test(u)?u:''; }
var PIN='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5713F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
var CAM='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5713F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>';
var CSS='.rwa-box{margin:14px 0 4px;text-align:left;background:#FBF6EC;border:1.5px solid #EFE3CE;border-radius:16px;padding:14px 16px}'+
  '.rwa-h{display:flex;align-items:center;gap:6px;font-size:13px;color:#B5713F;font-weight:500;margin-bottom:6px}'+
  '.rwa-a{font-size:16px;color:var(--ink);font-weight:500;line-height:1.6;word-break:break-word}'+
  '.rwa-s{font-size:12.5px;color:var(--soft);margin-top:6px;line-height:1.7}'+
  '.rwa-btns{display:flex;gap:8px;margin-top:12px}'+
  '.rwa-btns a,.rwa-btns button{flex:1;display:block;text-align:center;font:inherit;font-size:13.5px;border-radius:999px;padding:9px 0;border:1.5px solid var(--line);background:#fff;color:var(--brush);text-decoration:none;cursor:pointer}'+
  '.rwa-btns .go{background:#4285F4;border-color:#4285F4;color:#fff}';
function css(){ if(document.getElementById('rwa-css')) return; var s=document.createElement('style'); s.id='rwa-css'; s.textContent=CSS; document.head.appendChild(s); }
function appName(a){ return /zoom/i.test(a||'')?'Zoom':'Google Meet'; }

// 回傳 HTML；沒付款（匯款）或拿不到資料回傳空字串
function html(acc){
  if(!acc || !acc.paid) return '';
  css();
  var h='';
  if(acc.offline){
    if(acc.address){
      var map='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(acc.address);
      h+='<div class="rwa-box"><div class="rwa-h">'+PIN+'服務地址</div><div class="rwa-a">'+esc(acc.address)+'</div>'+
        '<div class="rwa-s">'+(acc.checkin_note?esc(acc.checkin_note)+'<br>':'')+'請在預約時間前 10 分鐘抵達。</div>'+
        '<div class="rwa-btns"><a class="go" href="'+esc(map)+'" target="_blank" rel="noopener">在 Google 地圖開啟</a><button type="button" data-rwa-copy="'+esc(acc.address)+'">複製地址</button></div></div>';
    } else if(!acc.online){
      h+='<div class="rwa-box"><div class="rwa-h">'+PIN+'服務地址</div><div class="rwa-s">引路人的地址還在整理中，我們會用 Email 或官方 LINE 通知你。</div></div>';
    }
  }
  if(acc.online){
    var link=safeUrl(acc.video_link), app=appName(acc.video_app);
    if(link){
      h+='<div class="rwa-box"><div class="rwa-h">'+CAM+'線上視訊（'+app+'）</div><div class="rwa-a">預約時間到了，點下面的按鈕進入視訊</div>'+
        '<div class="rwa-s">請提前準備安靜的空間和耳機，並先確認裝置能開啟 '+app+'。'+(acc.offline&&acc.address?'選實體的話照上面地址前往即可。':'')+'</div>'+
        '<div class="rwa-btns"><a class="go" href="'+esc(link)+'" target="_blank" rel="noopener">開啟 '+app+'</a><button type="button" data-rwa-copy="'+esc(link)+'">複製連結</button></div></div>';
    } else if(!(acc.offline && acc.address)){
      h+='<div class="rwa-box"><div class="rwa-h">'+CAM+'線上視訊</div><div class="rwa-s">引路人的視訊連結還在設定中，我們會用 Email 或官方 LINE 通知你。</div></div>';
    }
  }
  return h;
}
// Email 用的文字
function text(acc){
  if(!acc || !acc.paid) return '';
  var L=[];
  if(acc.offline && acc.address){ L.push('服務地址：'+acc.address); if(acc.checkin_note) L.push('報到提醒：'+acc.checkin_note); L.push('請在預約時間前 10 分鐘抵達。'); }
  var link=safeUrl(acc.video_link);
  if(acc.online && link) L.push('線上視訊（'+appName(acc.video_app)+'）：'+link+'（預約時間到了點連結進入）');
  return L.join('\n');
}
// 綁「複製」按鈕
function bind(box){
  if(!box) return;
  box.querySelectorAll('[data-rwa-copy]').forEach(function(b){ b.onclick=function(){ var v=b.getAttribute('data-rwa-copy'), t=b.textContent;
    function ok(){ b.textContent='已複製 ✓'; setTimeout(function(){ b.textContent=t; },1500); }
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(ok,function(){ prompt('複製',v); }); else prompt('複製',v); }; });
}
// 用訂單編號抓資料（db = supabase client）
async function load(db,ref){ try{ var r=await db.rpc('my_booking_access',{p_ref:ref}); return (!r.error && r.data)?r.data:null; }catch(e){ return null; } }
window.RWAccess={html:html, text:text, bind:bind, load:load};
})();
