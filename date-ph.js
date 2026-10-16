/* 全站日期欄位：還沒選日期時，顯示統一的英文提示「yyyy/mm/dd」
   （瀏覽器原生會依電腦語言顯示成「yyyy/月/dd」，網頁無法直接改，所以空白時改用自己的提示） */
(function(){
  var PH='yyyy/mm/dd';
  function svg(px,color){
    var s='<svg xmlns="http://www.w3.org/2000/svg" width="200" height="'+Math.ceil(px*1.6)+'"><text x="0" y="50%" dominant-baseline="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans TC,sans-serif" font-size="'+px+'" fill="'+color+'">'+PH+'</text></svg>';
    return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")';
  }
  function setup(el){
    if(el._rwph) return; el._rwph=true;
    var cs=getComputedStyle(el), px=parseFloat(cs.fontSize)||15;
    el._rwbg=svg(px,'#A9967E');
    el._rwpos='left '+(parseFloat(cs.paddingLeft)||10)+'px center';
    el.addEventListener('keydown',function(){ el._rwtyping=true; sync(el); });
    el.addEventListener('blur',function(){ el._rwtyping=false; sync(el); });
    el.addEventListener('click',function(){ if(!el.value && el.showPicker){ try{ el.showPicker(); }catch(e){} } });
    ['change','input'].forEach(function(ev){ el.addEventListener(ev,function(){ sync(el); }); });
  }
  function sync(el){
    var empty=!el.value && !el._rwtyping;
    if(empty){
      el.classList.add('rw-dph');
      el.style.backgroundImage=el._rwbg; el.style.backgroundRepeat='no-repeat'; el.style.backgroundPosition=el._rwpos;
    } else if(el.classList.contains('rw-dph')){
      el.classList.remove('rw-dph'); el.style.backgroundImage='';
    }
  }
  var css=document.createElement('style');
  css.textContent='input.rw-dph::-webkit-datetime-edit{color:transparent;opacity:0}input.rw-dph{color:transparent}'+
    'input.rw-dph::-webkit-datetime-edit-year-field:focus,input.rw-dph::-webkit-datetime-edit-month-field:focus,input.rw-dph::-webkit-datetime-edit-day-field:focus{background:transparent!important;color:transparent!important}';
  document.head.appendChild(css);
  function scan(){ var list=document.querySelectorAll('input[type="date"]'); for(var i=0;i<list.length;i++){ setup(list[i]); sync(list[i]); } }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scan); else scan();
  setInterval(scan,500);  // 程式動態新增或填入日期的欄位也跟著更新
})();
