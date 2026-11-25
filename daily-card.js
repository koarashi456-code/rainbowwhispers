/* 彩之語：每日一抽（會員專屬）
   底部分頁列「每日一抽」、電腦版 ☰ 選單、網址 #draw 都會打開。
   會員每天可以抽一張彩虹卡：先攤開一排蓋著的卡讓他選一張，再翻開；同一天再打開看到的是同一張（記在這台裝置），明天可以再抽。
   沒登入：顯示「會員專屬」，請他登入／註冊。
   卡片文字是彩之語自己寫的（7 色 × 6 張），要換成自己的卡，改下面的 CARDS 就好。 */
(function(){
  if(window.RWDaily) return;
  var COLORS=[
    {n:'紅',k:'勇氣',c:'#EE9E86',d:'#B4583E',bg:'#FBE1D8'},
    {n:'橙',k:'喜悅',c:'#F3B07C',d:'#B06A2C',bg:'#FCE6D2'},
    {n:'黃',k:'自信',c:'#F2C56E',d:'#9A7420',bg:'#FBEFCF'},
    {n:'綠',k:'成長',c:'#9FD49A',d:'#3F7A5E',bg:'#E1F2DD'},
    {n:'藍',k:'平靜',c:'#86C9DA',d:'#3C7C8E',bg:'#DAEFF5'},
    {n:'靛',k:'洞察',c:'#8FA6DE',d:'#4A5E9E',bg:'#DFE6F7'},
    {n:'紫',k:'連結',c:'#B0A2E4',d:'#6E4F9E',bg:'#E9E3F9'}
  ];
  var CARDS=[
    [0,'我可以為自己站出來','今天有話就直接說，不用一直忍著。'],
    [0,'害怕也沒關係，我還是可以往前一小步','一直拖著的事，先做五分鐘就好。'],
    [0,'我有權利說「不」','不想做的事，今天試著說「不用了，謝謝」。'],
    [0,'我的感受是真的，值得被聽見','用一句話寫下你現在的心情。'],
    [0,'跌倒過的地方，也長出了力量','想想以前那些難關，你不是都走過來了嗎？'],
    [0,'我可以先照顧好自己','今天對自己好一點，買杯喜歡的飲料也可以。'],
    [1,'我允許自己好好開心','今天哪一刻讓你笑了？記下來。'],
    [1,'生活裡藏著很多小小的美好','看到可愛的東西，就拍下來。'],
    [1,'我可以玩，也可以休息','給自己十分鐘，發呆也沒關係。'],
    [1,'我的創意值得被看見','隨便畫一畫、寫一寫，不用好看。'],
    [1,'和喜歡的人在一起，就是充電','傳個訊息給你喜歡的人，跟他說聲嗨。'],
    [1,'輕鬆一點，事情也會往前','今天少逼自己一件事。'],
    [2,'我已經做得很好了','想想這週你做完了哪些事，給自己按個讚。'],
    [2,'我不需要和別人比較','今天不跟別人比，只跟昨天的自己比。'],
    [2,'我的想法有價值','聊天的時候，說說你自己的想法。'],
    [2,'我值得被好好對待','想想看，跟誰在一起時你覺得最舒服。'],
    [2,'我相信自己的選擇','想一個你覺得「還好當初這樣選」的決定。'],
    [2,'我本來的樣子就很好','照鏡子時，對自己說聲「辛苦了」。'],
    [3,'慢慢來，也是在前進','今天只要比昨天多做一點點就好。'],
    [3,'每一次經驗都在教我一些事','最近不順的事，讓你學到了什麼？'],
    [3,'我隨時可以重新開始','有件一直放不下的事，今天先不去想它。'],
    [3,'我正在長成自己喜歡的樣子','想一個想養成的小習慣，今天先做一次。'],
    [3,'改變需要時間，我願意等','事情慢一點沒關係，對自己有耐心一點。'],
    [3,'我身邊有支持我的力量','想想誰在你難過時陪過你，跟他說聲謝謝。'],
    [4,'深呼吸，此刻的我很安全','慢慢吸一口氣，再慢慢吐出來，做三次。'],
    [4,'不是每件事都要現在解決','把擔心的事寫在紙上，先放著不管它。'],
    [4,'我可以溫柔地對待自己','像安慰好朋友那樣，溫柔地跟自己說話。'],
    [4,'安靜下來，答案會慢慢浮現','放下手機五分鐘，看看窗外。'],
    [4,'我接納此刻的自己','停下來感覺一下：身體哪裡累了？'],
    [4,'休息不是偷懶，是在充電','今晚早點睡，好好休息。'],
    [5,'我的直覺在告訴我一些事','要做決定的時候，先聽聽心裡的第一個感覺。'],
    [5,'我看見了過去沒看見的','卡住的事，換個角度再想一次。'],
    [5,'情緒是訊息，不是敵人','心情不好的時候，問問自己：我現在需要什麼？'],
    [5,'我知道自己真正需要什麼','寫下你現在最想要的一件事。'],
    [5,'答案常常比我想的簡單','大問題先別煩，想想今天可以先做哪一小步。'],
    [5,'我可以相信自己的判斷','想想有哪一次，你的直覺很準。'],
    [6,'我不是一個人','找一個人聊聊你今天過得怎麼樣。'],
    [6,'愛可以從我開始流動','今天跟一個人說聲謝謝。'],
    [6,'我和世界溫柔地連在一起','出門走走，抬頭看看天空。'],
    [6,'被理解的感覺，我也可以給別人','今天好好聽一個人把話說完，不急著插話。'],
    [6,'我願意打開心，也懂得保護自己','想想跟誰在一起很自在，跟誰需要保持一點距離。'],
    [6,'一切都會在對的時間發生','遇到不如意的事，試著跟自己說：「沒關係，就這樣吧。」']
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
  // 今天抽過的卡（沒抽過＝null）；抽卡＝從整副裡隨機一張（盡量不跟上次同一張），記下來
  function saved(){ var st=null; try{ st=JSON.parse(localStorage.getItem('rw_daily_'+who())||'null'); }catch(e){} return st; }
  function todays(){ var st=saved(); return (st && st.d===today() && st.i>=0 && st.i<CARDS.length)?st.i:null; }
  function draw(){ var st=saved(), last=st?st.i:-1, i; do{ i=Math.floor(Math.random()*CARDS.length); }while(CARDS.length>1 && i===last);
    try{ localStorage.setItem('rw_daily_'+who(),JSON.stringify({d:today(),i:i})); }catch(e){} return i; }
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
    '.dc-front{transform:rotateY(180deg);background:radial-gradient(120% 70% at 15% 0%,rgba(255,253,248,.5),rgba(255,253,248,0) 65%),var(--bg,#FFFDF8);border:1px solid var(--c,#EFE3CE);display:flex;flex-direction:column;padding:22px 22px 20px}'+
    '.dc-band{position:absolute;left:0;right:0;top:0;height:8px;background:var(--c)}'+
    '.dc-tag{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--d)}.dc-tag i{width:10px;height:10px;border-radius:50%;background:var(--c)}'+
    '.dc-no{margin-left:auto;font-size:11.5px;font-weight:400;color:#9A8670;font-variant-numeric:tabular-nums}'+
    '.dc-art{position:absolute;right:-30%;bottom:-22%;width:78%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,transparent 52%,var(--c) 53%,var(--c) 70%,transparent 71%);opacity:.3}'+
    '.dc-say{position:relative;flex:1;display:flex;align-items:center;font-family:"Noto Serif TC",serif;font-size:clamp(19px,6.4vw,24px);line-height:1.5;font-weight:600;color:#4A3A2A}'+
    '.dc-try{position:relative;font-size:13.5px;line-height:1.6;color:#5E4B37;border-top:1px dashed var(--c,#E6D7BF);padding-top:10px}.dc-try b{display:block;font-size:11.5px;color:#8C7963;font-weight:500;margin-bottom:2px}'+
    '.dc-lock{position:absolute;inset:0;margin:auto;z-index:1;width:44px;height:44px;border-radius:50%;background:#FBF6EC;border:1px solid #EFE3CE;display:flex;align-items:center;justify-content:center}'+
    '.dc-lock svg{width:20px;height:20px;fill:none;stroke:#8C7963;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
    '.dc-note{color:#4A3A2A;font-size:13.5px;text-align:center;line-height:1.7;min-height:1.7em}'+
    '.dc-btns{display:flex;flex-direction:column;align-items:center;gap:6px;width:100%}'+
    '.dc-ok{font:inherit;font-size:15.5px;font-weight:600;color:#FFFDF8;background:#6B4A33;box-shadow:0 8px 20px -10px rgba(74,58,42,.6);border:0;border-radius:999px;min-height:48px;padding:0 34px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;min-width:200px;box-sizing:border-box}'+
    '.dc-link{font:inherit;font-size:13.5px;color:#5E4B37;background:none;border:0;min-height:44px;padding:0 10px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}'+
    '.dc-ok:active,.dc-link:active,.dc-x:active{opacity:.7}'+
    '.dc-ok:focus-visible,.dc-link:focus-visible,.dc-x:focus-visible{outline:2px solid #6B4A33;outline-offset:3px}'+
    /* 選卡：一排蓋著的卡攤成扇形，點一張 */
    '.dc-ask{color:#4A3A2A;text-align:center;font-size:14px;line-height:1.7}.dc-ask b{display:block;font-family:"Noto Serif TC",serif;font-size:19px;font-weight:600;margin-bottom:2px}'+
    '.dc-fan{position:relative;width:min(340px,92vw);height:205px;margin:0}'+
    '.dc-mini{position:absolute;left:50%;bottom:16px;width:min(88px,24vw);aspect-ratio:5/7;margin:0;padding:0;transform:translateX(-50%) rotate(0deg);transform-origin:50% 210%;border-radius:12px;background:#FFFDF8;border:1px solid #EFE3CE;box-shadow:0 10px 20px -12px rgba(74,58,42,.55);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .65s cubic-bezier(.2,.7,.2,1),opacity .35s,box-shadow .2s;-webkit-tap-highlight-color:transparent}'+
    '.dc-mini::before{content:"";position:absolute;inset:5px;border-radius:8px;border:1px solid #EFE3CE}'+
    '.dc-mini i{position:relative;width:46%;aspect-ratio:1;border-radius:50%;background:conic-gradient(from 200deg,#EE9E86,#F3B07C,#F2C56E,#9FD49A,#86C9DA,#8FA6DE,#B0A2E4,#EE9E86);display:flex;align-items:center;justify-content:center}'+
    '.dc-mini i::after{content:"";width:60%;aspect-ratio:1;border-radius:50%;background:#FFFDF8}'+
    '.dc-fan.open .dc-mini{transform:translateX(-50%) rotate(var(--a))}'+
    '.dc-fan.ready .dc-mini{transition:transform .22s cubic-bezier(.2,.8,.3,1.2),box-shadow .22s,opacity .35s}'+
    '.dc-fan.open:not(.chosen) .dc-mini:hover,.dc-fan.open:not(.chosen) .dc-mini:focus-visible,.dc-fan.open:not(.chosen) .dc-mini:active{z-index:30!important;transform:translateX(-50%) rotate(var(--a)) translateY(-30px) scale(1.1);box-shadow:0 0 0 2px #FFFDF8,0 14px 28px -10px rgba(74,58,42,.5),0 0 22px 4px rgba(176,162,228,.55);outline:none}'+
    '.dc-fan.open:not(.chosen) .dc-mini:hover i,.dc-fan.open:not(.chosen) .dc-mini:active i{animation:dcSpin 1.6s linear infinite}'+
    '@keyframes dcSpin{to{transform:rotate(360deg)}}'+
    '.dc-fan.chosen .dc-mini{opacity:.18;pointer-events:none}'+
    '.dc-fan.chosen .dc-mini.pick{opacity:1;z-index:20;transform:translateX(-50%) rotate(0deg) translateY(-46px) scale(1.15);box-shadow:0 0 0 3px #FFFDF8,0 0 26px 6px rgba(176,162,228,.65)}'+
    '@media (prefers-reduced-motion:reduce){.dc-card,.dc-mini,.dc-fan.ready .dc-mini{transition:none}.dc-mini i{animation:none!important}}';
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
      var got=todays();
      if(got===null){   // 還沒抽：先攤開一排蓋著的卡，讓他自己選一張
        var N=9, A=58, fan='';
        for(var k=0;k<N;k++){ var ang=(-A/2+A*k/(N-1)).toFixed(1); fan+='<button type="button" class="dc-mini" style="--a:'+ang+'deg;z-index:'+(k+1)+'" aria-label="選第 '+(k+1)+' 張"><i></i></button>'; }
        mask.innerHTML='<div class="dc-wrap">'+head+
          '<div class="dc-ask"><b>今天想聽聽什麼？</b>深呼吸，想著此刻的自己，<br>憑直覺選一張。</div>'+
          '<div class="dc-fan" role="group" aria-label="選一張卡">'+fan+'</div>'+
          '<div class="dc-btns"><button type="button" class="dc-link" data-dc-x>先不要</button></div></div>';
        var fanEl=mask.querySelector('.dc-fan');
        setTimeout(function(){ fanEl.classList.add('open'); },60);   // 洗好的牌攤開
        setTimeout(function(){ fanEl.classList.add('ready'); },760);   // 攤開後：滑鼠移過去（手機按住）卡片馬上浮起來
        fanEl.addEventListener('click',function(e){ var b=e.target.closest('.dc-mini'); if(!b || fanEl.classList.contains('chosen')) return;
          fanEl.classList.add('chosen'); b.classList.add('pick');
          var i=draw(); setTimeout(function(){ reveal(i,true); },700); });
      } else reveal(got,false);
    }
    mask.hidden=false; document.body.style.overflow='hidden'; document.addEventListener('keydown',onKey);
    var f=mask.querySelector('.dc-ok')||mask.querySelector('.dc-mini'); if(f) setTimeout(function(){ try{ f.focus({preventScroll:true}); }catch(e){} },50);
  }
  // 翻開這張卡（剛選的：先蓋著再翻；今天已經抽過：直接是翻開的）
  function reveal(i,fresh){
    var c=CARDS[i], col=COLORS[c[0]], d=new Date(), dl=(d.getMonth()+1)+'/'+d.getDate()+'（'+WD.charAt(d.getDay())+'）';
    var head='<div class="dc-top"><b>每日一抽<small>'+dl+'</small></b><button type="button" class="dc-x" data-dc-x aria-label="關閉">×</button></div>';
    mask.innerHTML='<div class="dc-wrap">'+head+'<div class="dc-stage"><div class="dc-card'+(fresh?'':' up')+'" aria-live="polite">'+backFace(false)+
        '<div class="dc-face dc-front" style="--c:'+col.c+';--d:'+col.d+';--bg:'+col.bg+'"><span class="dc-band"></span><span class="dc-art" aria-hidden="true"></span>'+
          '<div class="dc-tag"><i></i>'+col.n+'・'+col.k+'<span class="dc-no">No.'+p2(i+1)+'</span></div>'+
          '<div class="dc-say">'+esc(c[1])+'</div>'+
          '<div class="dc-try"><b>今天試試</b>'+esc(c[2])+'</div></div>'+
      '</div></div>'+
      '<div class="dc-note">'+(fresh?'翻開你選的這張…':'今天已經抽過囉，這是你今天的卡。<br>明天再來抽一張。')+'</div>'+
      '<div class="dc-btns"><button type="button" class="dc-ok" data-dc-x>收下這張卡</button><a class="dc-link" href="booking.html#pick">想聊聊這張卡？找引路人</a></div></div>';
    if(fresh){ var card=mask.querySelector('.dc-card'), note=mask.querySelector('.dc-note');
      setTimeout(function(){ card.classList.add('up'); },350);
      setTimeout(function(){ note.innerHTML='這是你今天選到的卡。<br>明天可以再抽一張。'; },1100); }
    var f=mask.querySelector('.dc-ok'); if(f) setTimeout(function(){ try{ f.focus({preventScroll:true}); }catch(e){} },50);
  }
  window.RWDaily={open:open, close:close, cards:CARDS, colors:COLORS};
})();
