(function(){
  var KEY='cnch_cookie_ack';
  var banner=document.getElementById('cnchCookieBanner');
  if(!banner)return;
  var akkoord=null;
  try{akkoord=localStorage.getItem(KEY);}catch(e){}
  if(akkoord==='1')return;
  banner.style.display='block';
  document.getElementById('cnchCookieOk').addEventListener('click',function(){
    try{localStorage.setItem(KEY,'1');}catch(e){}
    banner.remove();
  });
})();