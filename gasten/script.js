(function(){
  /* Herstelt de scroll-reveal die op deze pagina ontbrak: .reveal-elementen en de
     badges-kaarten bleven op opacity:0 staan omdat de bijbehorende IntersectionObserver
     nooit in script.js terecht is gekomen. */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal, #badgesSliderWrap');
  if(!targets.length) return;
  if(reduceMotion || !('IntersectionObserver' in window)){
    targets.forEach(function(t){ t.classList.add('is-visible'); t.style.opacity='1'; t.style.transform='none'; });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
  targets.forEach(function(t){ io.observe(t); });
})();
(function(){
  /* De pijltjes op de voordelen-slider hadden geen klik-handler. */
  var viewport = document.getElementById('badgesViewport');
  var prev = document.getElementById('badgesPrev');
  var next = document.getElementById('badgesNext');
  if(!viewport || !prev || !next) return;
  function scrollByCard(dir){
    var card = viewport.querySelector('.badge-card');
    var step = card ? (card.getBoundingClientRect().width + 18) : 280;
    viewport.scrollBy({left: dir*step, behavior:'smooth'});
  }
  prev.addEventListener('click', function(){ scrollByCard(-1); });
  next.addEventListener('click', function(){ scrollByCard(1); });
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