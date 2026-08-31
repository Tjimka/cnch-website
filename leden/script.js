const SHEET_URL = "https://app.stroomlijn.nu/api/public/landing-pages/6272/sheet-data";

function esc(s){ const d=document.createElement("div"); d.textContent = s||""; return d.innerHTML; }

function getField(row, candidates){
  for(const key of Object.keys(row)){
    const k = key.toLowerCase().replace(/[\s_]/g,"");
    for(const c of candidates){ if(k === c) return row[key]; }
  }
  return "";
}

function initials(name){
  return (name||"").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
}

function telHref(phone){
  return "tel:" + (phone||"").replace(/[^\d+]/g,"");
}

let allMembers = [];

function renderCard(m){
  const card = document.createElement("div");
  card.className = "card";

  const banner = document.createElement("div");
  banner.className = "card-banner";
  if(m.logo){
    const logoImg = document.createElement("img");
    logoImg.src = m.logo;
    logoImg.alt = m.bedrijf;
    logoImg.loading = "lazy";
    logoImg.addEventListener("error", function(){ this.remove(); });
    banner.appendChild(logoImg);
  }
  card.appendChild(banner);

  const portraitWrap = document.createElement("div");
  portraitWrap.className = "card-portrait-wrap";
  if(m.foto){
    const portraitImg = document.createElement("img");
    portraitImg.src = m.foto;
    portraitImg.alt = m.contact;
    portraitImg.loading = "lazy";
    portraitImg.addEventListener("error", function(){
      portraitWrap.innerHTML = "";
      const fb = document.createElement("div");
      fb.className = "card-portrait-fallback";
      fb.textContent = initials(m.contact || m.bedrijf);
      portraitWrap.appendChild(fb);
    });
    portraitWrap.appendChild(portraitImg);
  } else {
    const fb = document.createElement("div");
    fb.className = "card-portrait-fallback";
    fb.textContent = initials(m.contact || m.bedrijf);
    portraitWrap.appendChild(fb);
  }
  card.appendChild(portraitWrap);

  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <div class="card-name">${esc(m.bedrijf) || "Onbekend bedrijf"}</div>
    <div class="card-contact">${esc(m.contact)}</div>
    <div class="card-actions">
      ${m.telefoon ? `<a class="card-btn phone" href="${telHref(m.telefoon)}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        ${esc(m.telefoon)}</a>` : ""}
      ${m.website ? `<a class="card-btn site" href="${esc(m.website)}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Bekijk website</a>` : ""}
      ${m.email ? `<a class="card-btn mail" href="mailto:${esc(m.email)}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" fill="none"/><path d="M22 6l-10 7L2 6"/><path d="M2 6h20v12H2z"/></svg>
        Mail mij</a>` : ""}
    </div>`;
  card.appendChild(body);

  return card;
}

function renderGrid(members){
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  count.textContent = members.length + (members.length === 1 ? " lid" : " leden");
  grid.innerHTML = "";
  if(members.length === 0){
    grid.innerHTML = '<div class="empty">Geen leden gevonden.</div>';
    return;
  }
  members.forEach(m => grid.appendChild(renderCard(m)));
}

async function loadMembers(){
  const grid = document.getElementById("grid");
  try{
    const resp = await fetch(SHEET_URL, {cache:"no-store"});
    if(!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    const rows = Array.isArray(data) ? data : (Array.isArray(data.rows) ? data.rows : (Array.isArray(data.data) ? data.data : []));
    allMembers = rows.map(r => ({
      bedrijf: getField(r, ["bedrijfsnaam","bedrijf","company"]),
      contact: getField(r, ["contactpersoon","naam","name"]),
      telefoon: getField(r, ["telefoon","phone","tel"]),
      website: getField(r, ["website","site","url"]),
      email: getField(r, ["email","mail","emailadres"]),
      foto: getField(r, ["foto","photo","portret"]),
      logo: getField(r, ["logo"])
    })).filter(m => m.bedrijf || m.contact);
    renderGrid(allMembers);
  }catch(err){
    grid.innerHTML = '<div class="error">Kon de ledenlijst niet laden. (' + esc(err.message) + ')</div>';
  }
}

document.getElementById("search").addEventListener("input", (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderGrid(allMembers); return; }
  const filtered = allMembers.filter(m =>
    (m.bedrijf||"").toLowerCase().includes(q) || (m.contact||"").toLowerCase().includes(q)
  );
  renderGrid(filtered);
});

loadMembers();