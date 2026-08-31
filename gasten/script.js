(function(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var stepEls = document.querySelectorAll('.programma-list .reveal');
  stepEls.forEach(function(el, i){ el.style.transitionDelay = (i * 0.06) + 's'; });

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
})();

(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wrap = document.getElementById('badgesSliderWrap');
  var viewport = document.getElementById('badgesViewport');
  var track = document.getElementById('badgesTrack');
  var prevBtn = document.getElementById('badgesPrev');
  var nextBtn = document.getElementById('badgesNext');
  if(!wrap || !viewport || !track) return;

  var cards = track.querySelectorAll('.badge-card');

  /* Intro: hele strip rustig infaden zodra hij in beeld komt */
  if(typeof gsap === 'undefined'){
    wrap.style.opacity = 1;
    wrap.style.transform = 'none';
  } else {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(wrap, {
      opacity: 1, y: 0, duration: .7, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 85%', once: true }
    });
    cards.forEach(function(card){
      var icon = card.querySelector('.badge-icon');
      card.addEventListener('mouseenter', function(){
        gsap.to(card, { y: -8, duration: .35, ease: 'power2.out' });
        if(icon) gsap.to(icon, { scale: 1.15, rotate: 6, duration: .35, ease: 'back.out(2)' });
      });
      card.addEventListener('mouseleave', function(){
        gsap.to(card, { y: 0, duration: .35, ease: 'power2.out' });
        if(icon) gsap.to(icon, { scale: 1, rotate: 0, duration: .35, ease: 'power2.out' });
      });
    });
  }

  /* Continu doorlopende slider, pauzeert bij hover/aanraking/focus, met handmatige pijltjes */
  var singleSetWidth = 0;
  function measure(){ singleSetWidth = track.scrollWidth / 2; }
  measure();
  window.addEventListener('resize', measure);

  var paused = false;
  var speed = 0.45;

  function tick(){
    if(!paused && !reduceMotion && singleSetWidth > 0){
      viewport.scrollLeft += speed;
      if(viewport.scrollLeft >= singleSetWidth){ viewport.scrollLeft -= singleSetWidth; }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  ['mouseenter','touchstart','focusin'].forEach(function(ev){
    viewport.addEventListener(ev, function(){ paused = true; }, { passive: true });
  });
  ['mouseleave','touchend','focusout'].forEach(function(ev){
    viewport.addEventListener(ev, function(){ paused = false; }, { passive: true });
  });

  var resumeTimer = null;
  function pauseThenResume(){
    paused = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(function(){ paused = false; }, 2800);
  }

  function step(dir){
    var first = track.querySelector('.badge-card');
    var cardWidth = first ? (first.getBoundingClientRect().width + 18) : 278;
    if(dir < 0 && viewport.scrollLeft < cardWidth){
      viewport.scrollLeft += singleSetWidth;
    }
    viewport.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    pauseThenResume();
  }

  if(prevBtn) prevBtn.addEventListener('click', function(){ step(-1); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ step(1); });
})();