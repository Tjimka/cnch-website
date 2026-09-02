/* LET OP: de GitHub-sync bundelt alle inline scripts van deze pagina naar script.js.
   Daarom staat de complete ledenlader hier in de pagina. Nooit vervangen door een los stukje. */
(function(){
  var SHEET_URL = "https://app.stroomlijn.nu/api/public/landing-pages/6272/sheet-data";

  function esc(s){ var d=document.createElement("div"); d.textContent = s||""; return d.innerHTML; }

  function getField(row, candidates){
    var keys = Object.keys(row);
    for(var i=0;i<keys.length;i++){
      var k = keys[i].toLowerCase().replace(/[\s_]/g,"");
      for(var j=0;j<candidates.length;j++){ if(k === candidates[j]) return row[keys[i]]; }
    }
    return "";
  }

  function initials(name){
    return (name||"").trim().split(/\s+/).slice(0,2).map(function(w){return w[0];}).join("").toUpperCase();
  }

  function telHref(phone){
    return "tel:" + (phone||"").replace(/[^\d+]/g,"");
  }

  var allMembers = [];

  function renderCard(m){
    var card = document.createElement("div");
    card.className = "card";

    var banner = document.createElement("div");
    banner.className = "card-banner";
    if(m.logo){
      var logoImg = document.createElement("img");
      logoImg.src = m.logo;
      logoImg.alt = m.bedrijf;
      logoImg.loading = "lazy";
      logoImg.addEventListener("error", function(){ this.remove(); });
      banner.appendChild(logoImg);
    }
    card.appendChild(banner);

    var portraitWrap = document.createElement("div");
    portraitWrap.className = "card-portrait-wrap";
    if(m.foto){
      var portraitImg = document.createElement("img");
      portraitImg.src = m.foto;
      portraitImg.alt = m.contact;
      portraitImg.loading = "lazy";
      portraitImg.addEventListener("error", function(){
        portraitWrap.innerHTML = "";
        var fb = document.createElement("div");
        fb.className = "card-portrait-fallback";
        fb.textContent = initials(m.contact || m.bedrijf);
        portraitWrap.appendChild(fb);
      });
      portraitWrap.appendChild(portraitImg);
    } else {
      var fb2 = document.createElement("div");
      fb2.className = "card-portrait-fallback";
      fb2.textContent = initials(m.contact || m.bedrijf);
      portraitWrap.appendChild(fb2);
    }
    card.appendChild(portraitWrap);

    var body = document.createElement("div");
    body.className = "card-body";
    var phoneBtn = m.telefoon ? '<a class="card-btn phone" href="' + telHref(m.telefoon) + '"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' + esc(m.telefoon) + '</a>' : "";
    var siteBtn = m.website ? '<a class="card-btn site" href="' + esc(m.website) + '" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>Bekijk website</a>' : "";
    var mailBtn = m.email ? '<a class="card-btn mail" href="mailto:' + esc(m.email) + '"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6l-10 7L2 6"/><path d="M2 6h20v12H2z"/></svg>Mail mij</a>' : "";
    body.innerHTML =
      '<div class="card-name">' + (esc(m.bedrijf) || "Onbekend bedrijf") + '</div>' +
      '<div class="card-contact">' + esc(m.contact) + '</div>' +
      '<div class="card-actions">' + phoneBtn + siteBtn + mailBtn + '</div>';
    card.appendChild(body);
    return card;
  }

  function renderGrid(members){
    var grid = document.getElementById("grid");
    var count = document.getElementById("count");
    count.textContent = members.length + (members.length === 1 ? " lid" : " leden");
    grid.innerHTML = "";
    if(members.length === 0){
      grid.innerHTML = '<div class="empty">Geen leden gevonden.</div>';
      return;
    }
    members.forEach(function(m){ grid.appendChild(renderCard(m)); });
    if(window.__cnchInitReveal) window.__cnchInitReveal();
  }

  function loadMembers(){
    var grid = document.getElementById("grid");
    fetch(SHEET_URL, {cache:"no-store"})
      .then(function(resp){ if(!resp.ok) throw new Error("HTTP " + resp.status); return resp.json(); })
      .then(function(data){
        var rows = Array.isArray(data) ? data : (Array.isArray(data.rows) ? data.rows : (Array.isArray(data.data) ? data.data : []));
        allMembers = rows.map(function(r){
          return {
            bedrijf: getField(r, ["bedrijfsnaam","bedrijf","company"]),
            contact: getField(r, ["contactpersoon","naam","name"]),
            telefoon: getField(r, ["telefoon","phone","tel"]),
            website: getField(r, ["website","site","url"]),
            email: getField(r, ["email","mail","emailadres"]),
            foto: getField(r, ["foto","photo","portret"]),
            logo: getField(r, ["logo"])
          };
        }).filter(function(m){ return m.bedrijf || m.contact; });
        renderGrid(allMembers);
      })
      .catch(function(err){
        grid.innerHTML = '<div class="error">Kon de ledenlijst niet laden. (' + esc(err.message) + ')</div>';
      });
  }

  var searchEl = document.getElementById("search");
  if(searchEl){
    searchEl.addEventListener("input", function(e){
      var q = e.target.value.trim().toLowerCase();
      if(!q){ renderGrid(allMembers); return; }
      var filtered = allMembers.filter(function(m){
        return (m.bedrijf||"").toLowerCase().indexOf(q) !== -1 || (m.contact||"").toLowerCase().indexOf(q) !== -1;
      });
      renderGrid(filtered);
    });
  }

  loadMembers();
})();

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
  function reveal(){
    var els=document.querySelectorAll('.reveal:not(.is-visible)');
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
    }, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});
    els.forEach(function(el){ io.observe(el); });
  }
  window.__cnchInitReveal = reveal;
  reveal();
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