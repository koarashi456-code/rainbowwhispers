/* 彩之語：每日一抽（會員專屬）
   底部分頁列「每日一抽」、電腦版 ☰ 選單、網址 #draw 都會打開。
   會員每天可以抽一張彩虹卡；同一天再打開看到的是同一張（記在這台裝置），明天可以再抽。
   沒登入：顯示「會員專屬」，請他登入／註冊。
   卡片文字是彩之語自己寫的（7 色 × 6 張），要換成自己的卡，改下面的 CARDS 就好。 */
(function(){
  if(window.RWDaily) return;
  var COLORS=[
    {n:'紅',k:'勇氣',c:'#EE9E86',d:'#B4583E'},
    {n:'橙',k:'喜悅',c:'#F3B07C',d:'#B06A2C'},
    {n:'黃',k:'自信',c:'#F2C56E',d:'#9A7420'},
    {n:'綠',k:'成長',c:'#9FD49A',d:'#3F7A5E'},
    {n:'藍',k:'平靜',c:'#86C9DA',d:'#3C7C8E'},
    {n:'靛',k:'洞察',c:'#8FA6DE',d:'#4A5E9E'},
    {n:'紫',k:'連結',c:'#B0A2E4',d:'#6E4F9E'}
  ];
  var CARDS=[
    [0,'我可以為自己站出來','今天，說出一個你真正的想法。'],
    [0,'害怕也沒關係，我還是可以往前一小步','挑一件小事，先做五分鐘。'],
    [0,'我有權利說「不」','想一想：最近哪件事，其實你想拒絕？'],
    [0,'我的感受是真的，值得被聽見','把此刻的心情寫成一句話。'],
    [0,'跌倒過的地方，也長出了力量','回想一次你撐過來的時候。'],
    [0,'我可以先照顧好自己','今天替自己做一件小小的好事。'],
    [1,'我允許自己好好開心','留意今天讓你笑出來的那一刻。'],
    [1,'生活裡藏著很多小小的美好','拍下一樣讓你覺得可愛的東西。'],
    [1,'我可以玩，也可以休息','給自己十分鐘，什麼都不用做。'],
    [1,'我的創意值得被看見','隨手畫點什麼、寫點什麼都好。'],
    [1,'和喜歡的人在一起，就是充電','傳個訊息給一個讓你安心的人。'],
    [1,'輕鬆一點，事情也會往前','今天少要求自己一件事。'],
    [2,'我已經做得很好了','數一數，這週你完成了哪些事？'],
    [2,'我不需要和別人比較','今天只和昨天的自己比。'],
    [2,'我的想法有價值','在一次聊天裡，說出你的看法。'],
    [2,'我值得被好好對待','留意一下，誰讓你感覺被尊重。'],
    [2,'我相信自己的選擇','想一個你做對了的決定。'],
    [2,'我本來的樣子就很好','對鏡子裡的自己說一聲謝謝。'],
    [3,'慢慢來，也是在前進','今天只要比昨天多一點點。'],
    [3,'每一次經驗都在教我一些事','最近一件不順的事，教了你什麼？'],
    [3,'我隨時可以重新開始','挑一件想放下的事，今天先放下。'],
    [3,'我正在長成自己喜歡的樣子','寫下一個你想培養的小習慣。'],
    [3,'改變需要時間，我願意等','對自己多一點耐心。'],
    [3,'我身邊有支持我的力量','想想誰曾經在你需要時陪著你。'],
    [4,'深呼吸，此刻的我很安全','慢慢吸氣四秒、吐氣六秒，做三次。'],
    [4,'不是每件事都要現在解決','把擔心的事寫下來，先放在紙上。'],
    [4,'我可以溫柔地對待自己','今天用對朋友說話的語氣，對自己說話。'],
    [4,'安靜下來，答案會慢慢浮現','找五分鐘，不滑手機、不看螢幕。'],
    [4,'我接納此刻的自己','不評價，只是感覺一下現在的身體。'],
    [4,'休息不是偷懶，是在充電','今晚早一點睡。'],
    [5,'我的直覺在告訴我一些事','安靜一下，聽聽心裡第一個聲音。'],
    [5,'我看見了過去沒看見的','換個角度，再看一次困擾你的事。'],
    [5,'情緒是訊息，不是敵人','問問自己：這個感受想提醒我什麼？'],
    [5,'我知道自己真正需要什麼','寫下此刻最想要的一件事。'],
    [5,'答案常常比我想的簡單','把問題縮小成今天能做的一步。'],
    [5,'我可以相信自己的判斷','回想一次你的直覺是對的時候。'],
    [6,'我不是一個人','跟一個人分享你今天的心情。'],
    [6,'愛可以從我開始流動','今天對一個人說聲謝謝。'],
    [6,'我和世界溫柔地連在一起','出門走走，留意天空的顏色。'],
    [6,'被理解的感覺，我也可以給別人','好好聽一個人把話說完。'],
    [6,'我願意打開心，也懂得保護自己','想想你想靠近、也想留點距離的人。'],
    [6,'一切都會在對的時間發生','對今天發生的一件事，說聲「好的」。']
  ];
  var WD='日一二三四五六';
  function p2(n){ return (n<10?'0':'')+n; }
  function today(){ var d=new Date(); return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate()); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  // 會員是誰（每個會員各自一天一張）
  function who(){
    try{
      var raw=localStorage.getItem('sb-awqvsddsizqzttzzalps-auth-token');
      if(!raw){ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(/^sb-.*-auth-token$/.test(k)){ raw=localStorage.getItem(k); break; } } }
      var o=JSON.parse(raw||'null'), s=o&&(o.currentSession||o), u=(s&&s.user)||(o&&o.user);
      if(u && (u.id||u.email)) return String(u.id||u.email);
      var at=s&&s.access_token; if(at && at.split('.').length===3){ var p=JSON.parse(decodeURIComponent(escape(atob(at.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))))); if(p.sub) return p.sub; }
    }catch(e){}
    return 'me';
  }
  function isMember(){ return !!(window.rwMemberToken && window.rwMemberToken()); }
  // 今天的卡：抽過就沿用；沒抽過就隨機抽一張（盡量不跟昨天同一張）
  function todays(){
    var key='rw_daily_'+who(), st=null, t=today(), fresh=false;
    try{ st=JSON.parse(localStorage.getItem(key)||'null'); }catch(e){}
    if(!st || st.d!==t || !(st.i>=0 && st.i<CARDS.length)){
      var i, last=st?st.i:-1; do{ i=Math.floor(Math.random()*CARDS.length); }while(CARDS.length>1 && i===last);
      st={d:t,i:i}; fresh=true; try{ localStorage.setItem(key,JSON.stringify(st)); }catch(e){}
    }
    return {i:st.i, fresh:fresh};
  }
  var CSS='.dc-mask{position:fixed;inset:0;z-index:400;background:linear-gradient(160deg,rgba(248,217,203,.97),rgba(248,232,196,.97) 25%,rgba(218,238,214,.97) 50%,rgba(214,232,242,.97) 75%,rgba(229,222,247,.97));-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;-webkit-tap-highlight-color:transparent}'+
    '.dc-mask[hidden]{display:none}'+
    '.dc-wrap{width:100%;max-width:340px;display:flex;flex-direction:column;align-items:center;gap:12px;font-family:"Noto Sans TC",sans-serif}'+
    '.dc-top{align-self:stretch;display:flex;align-items:center;justify-content:space-between;color:#4A3A2A}'+
    '.dc-top b{font-family:"Noto Serif TC",serif;font-size:18px;font-weight:600;letter-spacing:.04em}.dc-top small{font-size:12.5px;opacity:.9;margin-left:8px;font-family:"Noto Sans TC",sans-serif;font-weight:400;letter-spacing:0}'+
    '.dc-x{width:44px;height:44px;border:0;background:rgba(255,253,248,.7);color:#6B4F35;border-radius:50%;font-size:24px;line-height:1;cursor:pointer;margin-right:-4px}'+
    '.dc-stage{width:min(290px,76vw,calc((100vh - 290px)*.714));width:min(290px,76vw,calc((100dvh - 290px)*.714));min-width:180px;aspect-ratio:5/7;perspective:1200px}'+
    '.dc-card{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.7,.2,1)}'+
    '.dc-card.up{transform:rotateY(180deg)}'+
    '.dc-face{position:absolute;inset:0;border-radius:22px;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden;box-shadow:0 18px 40px -16px rgba(40,25,10,.55);box-sizing:border-box}'+
    '.dc-back{background:#FFFDF8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;border:1px solid #EFE3CE}'+
    '.dc-back::before{content:"";position:absolute;inset:10px;border-radius:16px;border:1.5px solid #EFE3CE}'+
    '.dc-ring{position:relative;width:46%;aspect-ratio:1;border-radius:50%;background:conic-gradient(from 200deg,#EE9E86,#F3B07C,#F2C56E,#9FD49A,#86C9DA,#8FA6DE,#B0A2E4,#EE9E86);display:flex;align-items:center;justify-content:center}'+
    '.dc-ring::after{content:"";width:62%;aspect-ratio:1;border-radius:50%;background:#FFFDF8}'+
    '.dc-brand{font-family:"Noto Serif TC",serif;font-size:17px;color:#6B4F35;letter-spacing:.2em}'+
    '.dc-front{transform:rotateY(180deg);background:#FFFDF8;border:1px solid #EFE3CE;display:flex;flex-direction:column;padding:22px 22px 20px}'+
    '.dc-band{position:absolute;left:0;right:0;top:0;height:8px;background:var(--c)}'+
    '.dc-tag{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--d)}.dc-tag i{width:10px;height:10px;border-radius:50%;background:var(--c)}'+
    '.dc-no{margin-left:auto;font-size:11.5px;font-weight:400;color:#9A8670;font-variant-numeric:tabular-nums}'+
    '.dc-art{position:absolute;right:-30%;bottom:-22%;width:78%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,transparent 52%,var(--c) 53%,var(--c) 70%,transparent 71%);opacity:.22}'+
    '.dc-say{position:relative;flex:1;display:flex;align-items:center;font-family:"Noto Serif TC",serif;font-size:clamp(19px,6.4vw,24px);line-height:1.5;font-weight:600;color:#4A3A2A}'+
    '.dc-try{position:relative;font-size:13.5px;line-height:1.6;color:#5E4B37;border-top:1px dashed #E6D7BF;padding-top:10px}.dc-try b{display:block;font-size:11.5px;color:#8C7963;font-weight:500;margin-bottom:2px}'+
    '.dc-lock{position:absolute;inset:0;margin:auto;z-index:1;width:44px;height:44px;border-radius:50%;background:#FBF6EC;border:1px solid #EFE3CE;display:flex;align-items:center;justify-content:center}'+
    '.dc-lock svg{width:20px;height:20px;fill:none;stroke:#8C7963;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
    '.dc-note{color:#4A3A2A;font-size:13.5px;text-align:center;line-height:1.7;min-height:1.7em}'+
    '.dc-btns{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%}'+
    '.dc-ok{font:inherit;font-size:15.5px;font-weight:600;color:#FFFDF8;background:#6B4A33;box-shadow:0 8px 20px -10px rgba(74,58,42,.6);border:0;border-radius:999px;min-height:48px;padding:0 34px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;min-width:200px;box-sizing:border-box}'+
    '.dc-link{font:inherit;font-size:13.5px;color:#5E4B37;background:none;border:0;min-height:44px;padding:0 10px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}'+
    '.dc-ok:active,.dc-link:active,.dc-x:active{opacity:.7}'+
    '.dc-ok:focus-visible,.dc-link:focus-visible,.dc-x:focus-visible{outline:2px solid #6B4A33;outline-offset:3px}'+
    '@media (prefers-reduced-motion:reduce){.dc-card{transition:none}}';
  var mask=null, lastFocus=null;
  function css(){ if(document.getElementById('dc-css')) return; var s=document.createElement('style'); s.id='dc-css'; s.textContent=CSS; document.head.appendChild(s); }
  function onKey(e){ if(e.key==='Escape') close(); }
  function close(){
    if(!mask || mask.hidden) return;
    mask.hidden=true; document.body.style.overflow=''; document.removeEventListener('keydown',onKey);
    if(location.hash==='#draw' && history.replaceState) history.replaceState(null,'',location.pathname+location.search);
    if(lastFocus && lastFocus.focus) try{ lastFocus.focus(); }catch(e){}
  }
  function backFace(lock){
    return '<div class="dc-face dc-back"><span class="dc-ring" aria-hidden="true">'+(lock?'<span class="dc-lock"><svg viewBox="0 0 24 24"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg></span>':'')+'</span><span class="dc-brand">彩之語</span></div>';
  }
  function open(){
    css(); lastFocus=document.activeElement;
    if(!mask){ mask=document.createElement('div'); mask.className='dc-mask'; mask.hidden=true; mask.setAttribute('role','dialog'); mask.setAttribute('aria-modal','true'); mask.setAttribute('aria-label','每日一抽');
      mask.addEventListener('click',function(e){ if(e.target===mask || e.target.closest('[data-dc-x]')) close(); });
      document.body.appendChild(mask); }
    var d=new Date(), dl=(d.getMonth()+1)+'/'+d.getDate()+'（'+WD.charAt(d.getDay())+'）';
    var head='<div class="dc-top"><b>每日一抽<small>'+dl+'</small></b><button type="button" class="dc-x" data-dc-x aria-label="關閉">×</button></div>';
    if(!isMember()){
      mask.innerHTML='<div class="dc-wrap">'+head+'<div class="dc-stage"><div class="dc-card">'+backFace(true)+'</div></div>'+
        '<div class="dc-note"><b>每日一抽是會員專屬</b><br>登入後，每天都能抽一張彩虹卡，<br>聽聽今天想對你說的話。</div>'+
        '<div class="dc-btns"><a class="dc-ok" href="account.html">登入／註冊</a><button type="button" class="dc-link" data-dc-x>先逛逛</button></div></div>';
    } else {
      var r=todays(), c=CARDS[r.i], col=COLORS[c[0]];
      mask.innerHTML='<div class="dc-wrap">'+head+'<div class="dc-stage"><div class="dc-card'+(r.fresh?'':' up')+'" aria-live="polite">'+backFace(false)+
          '<div class="dc-face dc-front" style="--c:'+col.c+';--d:'+col.d+'"><span class="dc-band"></span><span class="dc-art" aria-hidden="true"></span>'+
            '<div class="dc-tag"><i></i>'+col.n+'・'+col.k+'<span class="dc-no">No.'+p2(r.i+1)+'</span></div>'+
            '<div class="dc-say">'+esc(c[1])+'</div>'+
            '<div class="dc-try"><b>今天試試</b>'+esc(c[2])+'</div></div>'+
        '</div></div>'+
        '<div class="dc-note">'+(r.fresh?'翻開今天的彩虹卡…':'今天已經抽過囉，這是你今天的卡。<br>明天再來抽一張。')+'</div>'+
        '<div class="dc-btns"><button type="button" class="dc-ok" data-dc-x>收下這張卡</button><a class="dc-link" href="booking.html#pick">想聊聊這張卡？找引路人</a></div></div>';
      if(r.fresh){ var card=mask.querySelector('.dc-card'), note=mask.querySelector('.dc-note');
        setTimeout(function(){ card.classList.add('up'); },450);
        setTimeout(function(){ note.innerHTML='這是你今天的卡。<br>明天可以再抽一張。'; },1200); }
    }
    mask.hidden=false; document.body.style.overflow='hidden'; document.addEventListener('keydown',onKey);
    var f=mask.querySelector('.dc-ok'); if(f) setTimeout(function(){ try{ f.focus({preventScroll:true}); }catch(e){} },50);
  }
  window.RWDaily={open:open, close:close, cards:CARDS, colors:COLORS};
})();
