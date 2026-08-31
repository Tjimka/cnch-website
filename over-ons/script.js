(function(){
  const track = document.getElementById("sliderTrack");
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  let current = 0;
  let autoplayTimer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i){
    current = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[current].offsetLeft, behavior: "smooth" });
    dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
  }

  prevBtn.addEventListener("click", () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener("click", () => { goTo(current + 1); resetAutoplay(); });

  function startAutoplay(){ autoplayTimer = setInterval(() => goTo(current + 1), 4500); }
  function resetAutoplay(){ clearInterval(autoplayTimer); startAutoplay(); }
  startAutoplay();

  let scrollTimeout;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      let closest = 0, minDist = Infinity;
      slides.forEach((s, i) => {
        const dist = Math.abs(s.offsetLeft - track.scrollLeft);
        if(dist < minDist){ minDist = dist; closest = i; }
      });
      current = closest;
      dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
    }, 100);
  });
})();