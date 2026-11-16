(function(){ /* organization comes from the sign-in link issued by the Super Admin Portal */
  var KNOWN={globaltech:'GlobalTech Solutions',xccelera:'Xccelera AI',northwind:'Northwind Logistics',helixpharma:'Helix Pharma',orbit:'Orbit Retail',kestrel:'Kestrel Financial',atlas:'Atlas Manufacturing',xyz:'XYZ Company'};
  function title(s){ return s.replace(/[-_]+/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}).replace(/\b(Xyz|Abc|Ai|Llc|Inc)\b/g,function(w){return w==='Llc'||w==='Inc'?w:w.toUpperCase();}); }
  var slug=null;
  try{
    var q=new URLSearchParams(location.search), hq=new URLSearchParams((location.hash||'').replace(/^#/,''));
    slug=q.get('org')||hq.get('org');
    if(!slug){ var m=/^([a-z0-9-]+)\.xccelera\.ai$/i.exec(location.hostname||''); if(m && m[1]!=='www' && m[1]!=='app') slug=m[1]; }
  }catch(e){}
  slug=(slug||'globaltech').toLowerCase().replace(/[^a-z0-9-]/g,'');
  var name=KNOWN[slug]||title(slug);
  window.XC_ORG={slug:slug,name:name,url:'https://'+slug+'.xccelera.ai'};
  /* organization logo: ?logo=<image url> overrides; known orgs have a logo; others get a monogram */
  var LOGOS={globaltech:'<svg viewBox="0 0 40 40"><defs><linearGradient id="gtg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs><rect width="40" height="40" rx="10" fill="url(#gtg)"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#fff" stroke-width="2.2"/><ellipse cx="20" cy="20" rx="4.6" ry="10.5" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M9.8 16.5h20.4M9.8 23.5h20.4" stroke="#fff" stroke-width="1.8"/></svg>'};
  var logoUrl=null; try{ var lq=new URLSearchParams(location.search).get('logo'); if(lq&&/^(https?:|data:image\/)/.test(lq)) logoUrl=lq; }catch(e){}
  function mono(){ var hue=0; for(var i=0;i<slug.length;i++) hue=(hue*31+slug.charCodeAt(i))%360; var ini=name.split(/\s+/).map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
    return '<svg viewBox="0 0 40 40"><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl('+hue+',70%,50%)"/><stop offset="1" stop-color="hsl('+((hue+40)%360)+',70%,38%)"/></linearGradient></defs><rect width="40" height="40" rx="10" fill="url(#mg)"/><text x="20" y="25.5" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">'+ini+'</text></svg>'; }
  var logoHTML = logoUrl ? '<img alt="" src="'+logoUrl.replace(/"/g,'%22')+'">' : (LOGOS[slug]||mono());
  window.XC_ORG.logo=logoHTML;
  document.querySelectorAll('.lg-org-logo').forEach(function(e,i){ e.innerHTML=logoHTML.replace(/id="(gtg|mg)"/g,'id="$1'+i+'"').replace(/url\(#(gtg|mg)\)/g,'url(#$1'+i+')'); });
  document.querySelectorAll('.lg-org-name').forEach(function(e){ e.textContent=name; });
  document.querySelectorAll('.lg-org-url').forEach(function(e){ e.textContent=slug+'.xccelera.ai'; });
  ['enterprise','studio'].forEach(function(p){
    var i=document.getElementById('lg-org-'+p); if(i) i.value=name;
  });
  document.querySelectorAll('.lg-url-t').forEach(function(t){ t.textContent=slug+'.xccelera.ai'; });
})();