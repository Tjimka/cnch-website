document.documentElement.classList.add('js');

(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero: direct zacht infaden na laden, geen scroll nodig.
  var hero = document.getElementById('hero-reveal');
  if(hero){
    if(reduceMotion){ hero.classList.add('is-visible'); }
    else { window.setTimeout(function(){ hero.classList.add('is-visible'); }, 120); }
  }

  var items = document.querySelectorAll('.reveal:not(#hero-reveal)');
  if(reduceMotion || typeof IntersectionObserver === 'undefined'){
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  var cardDelay = 0;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el = entry.target;
        var delay = el.classList.contains('board-card') ? (cardDelay % 4) * 90 : 0;
        if(el.classList.contains('board-card')) cardDelay++;
        window.setTimeout(function(){ el.classList.add('is-visible'); }, delay);
        observer.unobserve(el);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -8% 0px'});

  items.forEach(function(el){ observer.observe(el); });
})();