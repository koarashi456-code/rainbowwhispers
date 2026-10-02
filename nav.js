/* 共用導覽：登入後把「會員」改成顯示登入帳號；手機漢堡選單把會員排到最上面。
   純讀 localStorage 的 Supabase session，不需載 supabase-js，可在每頁用。 */
(function(){
  try{
    var link=document.querySelector('.rw-links a[href="account.html"]');
    if(!link) return;
    link.classList.add('rw-mem');   // 搭配 style.css 的 @media：手機排到最上面

    // 找 Supabase 的登入 token（key 形如 sb-<ref>-auth-token）
    var raw=null;
    try{ raw=localStorage.getItem('sb-awqvsddsizqzttzzalps-auth-token'); }catch(e){}
    if(!raw){
      try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(/^sb-.*-auth-token$/.test(k)){ raw=localStorage.getItem(k); break; } } }catch(e){}
    }
    if(!raw) return;

    var o; try{ o=JSON.parse(raw); }catch(e){ return; }
    var sess = o && (o.currentSession || o);
    var user = (sess && sess.user) || (o && o.user) || null;
    var at = (sess && sess.access_token) || (o && o.access_token) || (Array.isArray(o)&&o[0]) || null;
    if(!user && at){
      try{
        var payload=at.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
        var p=JSON.parse(decodeURIComponent(escape(atob(payload))));
        user={email:p.email, user_metadata:p.user_metadata||{}};
      }catch(e){}
    }
    if(!user) return;

    var name=(user.user_metadata&&user.user_metadata.name)||'';
    var txt=name||user.email||'';
    if(!txt) return;
    if(txt.length>16) txt=txt.slice(0,15)+'…';
    link.textContent=txt;
    link.title=user.email||txt;
  }catch(e){}
})();
