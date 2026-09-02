(function(){
  var btn=document.getElementById('navToggle');
  var nav=document.getElementById('siteNav');
  if(!btn||!nav)return;
  btn.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click',function(){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('click',function(e){
    if(!nav.classList.contains('open'))return;
    if(nav.contains(e.target)||btn.contains(e.target))return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  });
})();

(function(){
  /* Scroll-reveal zonder externe library (GSAP wordt geblokkeerd in de Stroomlijn-omgeving,
     dit geeft hetzelfde soort polish met pure CSS + IntersectionObserver). */
  var els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

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