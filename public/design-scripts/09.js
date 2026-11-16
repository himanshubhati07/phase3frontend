/* ═══ Xccelera AI Platform Studio (36 screens) — hosted inside the Suite ═══
   Signing in to Platform Studio, switching to it from the Enterprise portal, or opening any Studio
   page from the Suite now lands in the new Studio. Agent tools (Orchestrator / engines) stay in the Suite. */
(function(){
  if(typeof gotoTop!=='function'||typeof SESSION==='undefined') return;
  const TOOL_VIEWS=['orchestrator','engine'];
  const MAP={dashboard:'home',projects:'projects','project-detail':'project','project-new':'project-setup',work:'backlog','knowledge-graph':'@graph',results:'testing',versions:'releases',resources:'knowledge','resource-editor':'knowledge',harness:'knowledge',config:'integrations',policy:'prefs?tab=help',help:'prefs?tab=help',profile:'prefs'};
  const GRAPH={dev:'kgraph',pm:'dgraph',cto:'ograph'};
  const el=document.getElementById('xc-studio-host'), frame=el&&el.querySelector('iframe'), back=document.getElementById('xc-studio-back');
  if(!el||!frame) return;
  let docking=false, docked=null, dock=null, dockHome=null;
  let loaded=false, isReady=false, queue=[], startedFor=null, cur=null, lastEnt=null, wasEnt=false;

  function studioRole(u){
    const r=userRoles(u).map(x=>(ROLE_DEF[x]&&ROLE_DEF[x].base)||x);
    const cu=userRoles(u).filter(x=>ROLE_DEF[x]&&ROLE_DEF[x].base), lbl=cu.length?cu.map(roleLabel).join(' + '):undefined;
    if(r.includes('cto')) return {role:'cto',label:lbl};
    if(r.includes('pm')) return {role:'pm',label:lbl};
    if(r.includes('developer')) return {role:'dev',label:lbl};
    if(r.includes('org-admin')) return {role:'cto',ro:true,label:'Organisation Admin · View Only'};
    return {role:'cto',ro:true,label:'Admin Viewer · View Only'};
  }
  function theme(){ return document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light'; }
  function load(){
    if(loaded) return; loaded=true;
    const src=document.getElementById('xc-studio-src');
    const bin=atob(src.textContent.trim()); const bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    frame.srcdoc=new TextDecoder('utf-8').decode(bytes);
  }
  function whenReady(fn){ if(isReady) fn(); else { queue.push(fn); load(); } }
  function screenFor(view){ let s=MAP[view]||'home'; if(s==='@graph') s=GRAPH[cur&&cur.role||'dev']; return s; }
  function setOpen(on){
    el.hidden=!on; document.documentElement.classList.toggle('xc-studio-on',on);
    if(back) back.hidden = on || !(SESSION.user&&SESSION.portal==='studio');
  }
  function show(view){
    setOpen(true);
    whenReady(()=>{
      const u=SESSION.user; if(!u) return;
      const key=u.email+'|'+userRoles(u).join(',');
      const w=frame.contentWindow;
      if(startedFor!==key){
        startedFor=key; cur=studioRole(u);
        const sc=screenFor(view||'dashboard');
        w.xcEmbedStart({role:cur.role,ro:!!cur.ro,label:cur.label||null,name:u.name,email:u.email,
          canEnt:canEnterPortal(u,'enterprise'),tools:currentViews().has('engine'),theme:theme(),
          screen:sc,msg:wasEnt?'Opened Platform Studio — use Switch to Enterprise Admin in the header to return':'Signed in to Xccelera Platform Studio as '+u.name});
      } else if(view){ w.xcEmbedGo(screenFor(view)); if(wasEnt&&w.toast) w.toast('Opened Platform Studio — use Switch to Enterprise Admin in the header to return','layers'); }
      try{ w.focus(); }catch(e){}
    });
  }
  function hide(){ setOpen(false); }

  /* every Suite navigation passes through gotoTop — Studio pages go to the new Studio */
  const _goto=gotoTop;
  gotoTop=function(view){
    if(SESSION.user&&SESSION.portal==='studio'){
      if(docking&&view==='engine'){ _goto(view); return; }
      if(!TOOL_VIEWS.includes(view)||!currentViews().has(view)){ show(view); return; }
      setOpen(false); _goto(view); if(back) back.hidden=false; return;
    }
    setOpen(false); if(back) back.hidden=true; if(SESSION.user&&SESSION.portal==='enterprise'){ wasEnt=true; lastEnt=view; } _goto(view);
  };
  const _signOut=signOut;
  signOut=function(){ if(window.xcStudioHost) xcStudioHost.undock(); setOpen(false); if(back) back.hidden=true; startedFor=null; lastEnt=null; wasEnt=false; _signOut(); };

  window.xcStudioHost={
    ready(){ isReady=true; const q=queue; queue=[]; q.forEach(f=>f()); },
    theme(t){ if(t!==theme()) xcSetTheme(t,true); },
    signOut(){ signOut(); },
    toEnterprise(){ if(SESSION.user&&canEnterPortal(SESSION.user,'enterprise')){ const back=lastEnt; enterPortal('enterprise',true); if(back&&back!=='dashboard') gotoTop(back); } },
    /* role-based access to Platform Studio agents and cognitive tools (set in Users & Roles → Role Management) */
    access(){ return window.xcRoleAccess&&SESSION.user?xcRoleAccess.user(SESSION.user):null; },
    roles(){ return window.xcRoleAccess?xcRoleAccess.roles():null; },
    roleLabel(){ return SESSION.user?userRoles(SESSION.user).map(roleLabel).join(' + '):''; },
    toolMatrix(){ return window.xcRoleAccess?xcRoleAccess.toolMatrix():null; },
    saveToolMatrix(m){ if(window.xcRoleAccess) xcRoleAccess.saveToolMatrix(m,SESSION.user&&SESSION.user.name); },
    tools(){ return SUITE_TOOLS.map(t=>({id:t.id,name:t.name,description:t.description,status:t.status,tag:t.tag,instances:t.instances,successRate:t.successRate,latency:t.latency})); },
    /* engines open inside the Studio page: the engine view is docked into the Studio content area */
    openTool(id){
      if(!id){ setOpen(false); if(back) back.hidden=false; _goto('orchestrator'); return; }
      docking=true; try{ openEngine(id); }finally{ docking=false; }
      const v=document.getElementById('view-engine'); if(!v) return;
      if(!dock){ dock=document.createElement('div'); dock.id='xc-engine-dock'; dock.hidden=true; document.body.appendChild(dock); }
      if(!dockHome) dockHome={parent:v.parentNode,next:v.nextSibling};
      if(v.parentNode!==dock) dock.appendChild(v); v.hidden=false; dock.scrollTop=0; docked=id;
      const bb=v.querySelector('#engine-back'); if(bb){ bb.innerHTML=bb.innerHTML.replace('Back to Suite','Back to Cognitive Tools'); bb.onclick=()=>{ try{ frame.contentWindow.xcEmbedGo('cognitive-tools'); }catch(e){} }; }
      setOpen(true); if(back) back.hidden=true;
      try{ frame.contentWindow.xcEmbedGo('cognitive-run?id='+id); }catch(e){}
    },
    dock(r){ if(!dock||!docked) return; Object.assign(dock.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'}); dock.hidden=false; },
    undock(){ if(!dock) return; dock.hidden=true; docked=null; const v=document.getElementById('view-engine'); if(v&&dockHome&&v.parentNode===dock){ dockHome.parent.insertBefore(v,dockHome.next); v.hidden=true; } },
    open(view){ show(view||null); }
  };
  if(back) back.addEventListener('click',()=>show(null));
  /* keep the theme in step both ways */
  new MutationObserver(()=>{ if(isReady) try{ frame.contentWindow.xcEmbedTheme(theme()); }catch(e){} })
    .observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  /* load the Studio quietly in the background so the first sign-in is instant */
  const idle=window.requestIdleCallback||(f=>setTimeout(f,1200));
  idle(()=>load());
})();