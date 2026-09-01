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