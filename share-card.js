/* 彩之語：測驗結果分享圖卡（1080×1350，IG 貼文／限時動態、LINE 都適用）
   RWShare.open({test, kicker, title, sub, desc, pill, accent, big, url, text})
   - big：圓圈中間要放的大字（生命靈數的數字）；沒給就畫星星
   - url：分享出去的測驗網址；text：傳 LINE 的文字 */
(function(){
var W=1080, H=1350, OG_VER=2;
var SERIF='"Noto Serif TC","Songti TC","PMingLiU",serif', SANS='"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
var RAINBOW=['#F6C9B9','#F8DEAC','#CAE6C4','#BCE0E7','#D4CBED','#F1CCDB','#F6C9B9'];
function rainbowFill(ctx,cx,cy,x0,x1){
  if(ctx.createConicGradient){ var g=ctx.createConicGradient(-Math.PI/2+0.6,cx,cy); RAINBOW.forEach(function(c,i){ g.addColorStop(i/(RAINBOW.length-1),c); }); return g; }
  var l=ctx.createLinearGradient(x0,cy,x1,cy); RAINBOW.forEach(function(c,i){ l.addColorStop(i/(RAINBOW.length-1),c); }); return l;
}
// 一個字一個字量寬度換行（中文沒有空白）
function wrap(ctx,text,maxW,maxLines){
  var lines=[], cur='';
  String(text||'').split('').forEach(function(ch){ if(ch==='\n'){ lines.push(cur); cur=''; return; } if(ctx.measureText(cur+ch).width>maxW && cur){ lines.push(cur); cur=ch; } else cur+=ch; });
  if(cur) lines.push(cur);
  // 行首不要是標點
  for(var i=1;i<lines.length;i++){ while(/^[，。、；：！？」』）〉》,.!?]/.test(lines[i]) && lines[i-1].length>1){ lines[i]=lines[i-1].slice(-1)+lines[i]; lines[i-1]=lines[i-1].slice(0,-1); } }
  if(maxLines && lines.length>maxLines){ lines=lines.slice(0,maxLines); lines[maxLines-1]=lines[maxLines-1].replace(/.$/,'…'); }
  return lines;
}
function spaced(ctx,text,x,y,gap){ // 置中、加字距
  var chars=String(text).split(''), w=chars.reduce(function(a,c){ return a+ctx.measureText(c).width+gap; },-gap), cx=x-w/2;
  ctx.textAlign='left'; chars.forEach(function(c){ ctx.fillText(c,cx,y); cx+=ctx.measureText(c).width+gap; }); ctx.textAlign='center';
}
function star(ctx,cx,cy,s,color){
  ctx.save(); ctx.translate(cx,cy); ctx.scale(s/24,s/24); ctx.translate(-12,-12);
  ctx.strokeStyle=color; ctx.lineWidth=1.5; ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.stroke(new Path2D('M12 5.5c.5 4 2.5 6 6.5 6.5-4 .5-6 2.5-6.5 6.5-.5-4-2.5-6-6.5-6.5 4-.5 6-2.5 6.5-6.5Z'));
  ctx.restore();
}
async function draw(o){
  var all=[o.test,o.kicker,o.title,o.sub,o.desc,o.pill,o.big,'彩之語RAINBOW WHISPER測驗結果分享'].join('');
  try{ await Promise.all([document.fonts.load('600 96px "Noto Serif TC"',all),document.fonts.load('400 34px "Noto Sans TC"',all),document.fonts.load('500 30px "Noto Sans TC"',all)]); }catch(e){}
  var cv=document.createElement('canvas'); cv.width=W; cv.height=H; var ctx=cv.getContext('2d');
  // 背景：奶油色＋淡淡的彩虹光暈
  ctx.fillStyle='#FAF4E6'; ctx.fillRect(0,0,W,H);
  [[120,120,'rgba(246,201,185,.55)'],[980,260,'rgba(212,203,237,.5)'],[120,1220,'rgba(202,230,196,.5)'],[960,1240,'rgba(241,204,219,.5)']].forEach(function(b){ var g=ctx.createRadialGradient(b[0],b[1],0,b[0],b[1],420); g.addColorStop(0,b[2]); g.addColorStop(1,'rgba(250,244,230,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); });
  // 卡片
  ctx.save(); ctx.shadowColor='rgba(120,90,60,.18)'; ctx.shadowBlur=40; ctx.shadowOffsetY=14; rr(ctx,70,70,940,1210,52); ctx.fillStyle='#FFFDF8'; ctx.fill(); ctx.restore();
  rr(ctx,70,70,940,1210,52); ctx.lineWidth=3; ctx.strokeStyle='#ECDFC6'; ctx.stroke();
  ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  // 品牌
  ctx.fillStyle='#6B4A33'; ctx.font='700 46px '+SERIF; spaced(ctx,'彩之語',540,172,10);
  ctx.fillStyle='#A78C6E'; ctx.font='400 18px '+SANS; spaced(ctx,'RAINBOW WHISPER',540,208,7);
  // 彩虹圓圈
  var cx=540, cy=372;
  ctx.beginPath(); ctx.arc(cx,cy,112,0,Math.PI*2); ctx.fillStyle=rainbowFill(ctx,cx,cy,cx-112,cx+112); ctx.fill();
  ctx.beginPath(); ctx.arc(cx,cy,84,0,Math.PI*2); ctx.fillStyle='#FFFDF8'; ctx.fill();
  if(o.big!=null && o.big!==''){ ctx.fillStyle=o.accent||'#B5713F'; ctx.font='600 92px '+SERIF; ctx.textBaseline='middle'; ctx.fillText(String(o.big),cx,cy+4); ctx.textBaseline='alphabetic'; }
  else star(ctx,cx,cy,74,o.accent||'#B5713F');
  // 測驗名稱
  ctx.fillStyle='#B5713F'; ctx.font='500 30px '+SANS; spaced(ctx,o.kicker||o.test||'',540,560,6);
  // 結果
  ctx.fillStyle='#6B4A33'; var tf=96; ctx.font='600 '+tf+'px '+SERIF; while(ctx.measureText(o.title||'').width>820 && tf>56){ tf-=4; ctx.font='600 '+tf+'px '+SERIF; }
  ctx.fillText(o.title||'',540,672);
  var y=672;
  if(o.sub){ ctx.fillStyle=o.subColor||'#B09A7C'; ctx.font='500 32px '+SANS; y+=62; spaced(ctx,o.sub,540,y,/[A-Z]/.test(o.sub)?5:2); }
  // 彩虹細線
  y+=46; var lg=ctx.createLinearGradient(480,0,600,0); lg.addColorStop(0,'#EE9E86'); lg.addColorStop(.5,'#9FD49A'); lg.addColorStop(1,'#B0A2E4'); rr(ctx,480,y,120,6,3); ctx.fillStyle=lg; ctx.fill();
  // 描述
  ctx.fillStyle='#5A4632'; ctx.font='400 35px '+SANS; y+=78;
  var lines=wrap(ctx,o.desc||'',780,o.pill?4:5); lines.forEach(function(l){ ctx.fillText(l,540,y); y+=60; });
  // 方向
  if(o.pill){
    ctx.font='500 32px '+SANS; var pw=Math.min(860,ctx.measureText(o.pill).width+80), py=Math.max(y+30,1090);
    rr(ctx,540-pw/2,py-50,pw,74,37); ctx.fillStyle='#F4EAD4'; ctx.fill(); ctx.fillStyle='#6B4A33'; ctx.fillText(o.pill,540,py);
  }
  // 底部
  ctx.fillStyle='#B09A7C'; ctx.font='400 22px '+SANS; ctx.fillText(String(o.url||'').replace(/^https?:\/\//,'').replace(/\/$/,''),540,1222);
  return cv;
}
var CSS='.rws-mask{position:fixed;inset:0;z-index:300;background:rgba(60,45,30,.45);display:flex;align-items:center;justify-content:center;padding:16px}'+
  '.rws-box{background:#FFFDF8;border-radius:22px;width:100%;max-width:380px;max-height:calc(100vh - 32px);overflow-y:auto;padding:16px 16px 14px;text-align:center;box-shadow:0 20px 50px -20px rgba(60,40,20,.5)}'+
  '.rws-h{font-family:"Noto Serif TC",serif;font-size:17px;color:#6B4A33;font-weight:600;margin:2px 0 10px}'+
  '.rws-img{display:block;width:100%;max-width:300px;margin:0 auto;border-radius:14px;border:1px solid #ECDFC6;background:#FAF4E6;aspect-ratio:4/5;object-fit:contain}'+
  '.rws-tip{font-size:12px;color:#8A7659;margin:8px 0 2px;line-height:1.6}'+
  '.rws-btn{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:15px;font-weight:500;border-radius:999px;padding:12px;margin-top:9px;cursor:pointer;text-decoration:none;border:0}'+
  '.rws-main{background:linear-gradient(95deg,#EE9E86,#F2C56E,#9FD49A,#86C9DA,#B0A2E4);color:#4A3A2A}'+
  '.rws-line{background:#06C755;color:#fff}'+
  '.rws-ig{background:linear-gradient(95deg,#F9CE34,#EE2A7B 55%,#6228D7);color:#fff}'+
  '.rws-ghost{background:#fff;border:1.5px solid #ECDFC6;color:#6B4A33}'+
  '.rws-close{font:inherit;font-size:13px;color:#8A7659;background:none;border:0;margin-top:10px;cursor:pointer;text-decoration:underline}';
function css(){ if(document.getElementById('rws-css')) return; var s=document.createElement('style'); s.id='rws-css'; s.textContent=CSS; document.head.appendChild(s); }
function toBlob(cv){ return new Promise(function(res){ if(cv.toBlob) cv.toBlob(function(b){ res(b); },'image/png'); else res(null); }); }
function download(url,name){ var a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }

async function open(o){
  css();
  // 網址加版本號：換了預覽圖（og.png）後，LINE 會當成新網址重新抓預覽
  var url=String(o.url||location.href); if(url.indexOf('?')<0) url+='?v='+OG_VER;
  var text=o.text||('我做了彩之語的'+(o.test||'測驗')+'！'), name='彩之語-'+(o.test||'測驗結果')+'.png';
  var mask=document.createElement('div'); mask.className='rws-mask';
  mask.innerHTML='<div class="rws-box" role="dialog" aria-label="分享測驗結果"><div class="rws-h">分享我的測驗結果</div><img class="rws-img" alt="測驗結果圖卡"><div class="rws-tip">圖卡製作中…</div><div data-btns></div><button type="button" class="rws-close">關閉</button></div>';
  document.body.appendChild(mask);
  function close(){ mask.remove(); }
  mask.addEventListener('click',function(e){ if(e.target===mask) close(); });
  mask.querySelector('.rws-close').onclick=close;
  var cv=await draw(o), blob=await toBlob(cv), dataUrl=cv.toDataURL('image/png');
  var img=mask.querySelector('.rws-img'); img.src=dataUrl;
  var file=null; try{ if(blob) file=new File([blob],name,{type:'image/png'}); }catch(e){}
  var canFile=!!(file && navigator.canShare && navigator.canShare({files:[file]}));
  var lineHref='https://line.me/R/msg/text/?'+encodeURIComponent(text+'\n'+url);
  var tip=mask.querySelector('.rws-tip');
  tip.textContent=canFile?'按「分享圖卡」可以直接傳到 LINE、IG 限時動態或貼文':'手機長按圖卡就能存到相簿，再到 IG 限時動態／貼文選這張圖分享';
  var b=mask.querySelector('[data-btns]');
  b.innerHTML=(canFile?'<button type="button" class="rws-btn rws-main" data-sh>分享圖卡（LINE・IG）</button>':'')+
    '<a class="rws-btn rws-line" href="'+esc(lineHref)+'" target="_blank" rel="noopener">傳給 LINE 好友</a>'+
    '<button type="button" class="rws-btn rws-ig" data-ig>存圖卡，分享到 IG</button>'+
    '<button type="button" class="rws-btn rws-ghost" data-cp>複製測驗連結</button>';
  var sh=b.querySelector('[data-sh]');
  if(sh) sh.onclick=function(){ navigator.share({files:[file],text:text+' '+url}).catch(function(){}); if(o.onShare) o.onShare('share'); };
  b.querySelector('.rws-line').addEventListener('click',function(){ if(o.onShare) o.onShare('line'); });
  b.querySelector('[data-ig]').onclick=function(){
    if(canFile){ navigator.share({files:[file]}).catch(function(){}); }
    else { download(blob?URL.createObjectURL(blob):dataUrl,name); tip.textContent='圖卡已存好！打開 IG → 限時動態或貼文 → 選這張圖就能分享（沒存到的話，長按上面的圖卡儲存）'; }
    if(o.onShare) o.onShare('ig');
  };
  b.querySelector('[data-cp]').onclick=function(){ var btn=this; function ok(){ btn.textContent='已複製連結 ✓'; setTimeout(function(){ btn.textContent='複製測驗連結'; },1600); }
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok,function(){ prompt('複製這個連結',url); }); else prompt('複製這個連結',url); };
}
window.RWShare={open:open, draw:draw};
})();
