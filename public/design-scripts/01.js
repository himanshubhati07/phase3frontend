var obStep = 1;
var gitMode = 'app';
var members = [];
var teams = [{name:'Platform Team', members:3, agents:2, projects:4}, {name:'Storefront Team', members:2, agents:2, projects:1}];
var currentAdmin = {name:'Priya Iyer', email:'priya.iyer@xccelera.ai', org:'xccelera-production'};
var currentOrgSlug = '';
var joiningOrgSlug = '';

function slugify(name){
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'org';
}

function slugToDisplayName(slug){
  return slug.split('-').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' ');
}

function orgUrlFor(slug){
  var base = 'xcore-onboarding.html';
  try{
    var path = window.location.pathname || '';
    var file = path.split('/').pop();
    if(file && file.indexOf('.html') !== -1) base = file;
  } catch(e){}
  return base + '#org/' + slug;
}

function setOrgHash(slug){
  try{
    history.replaceState(null, '', '#org/' + slug);
  } catch(e){
    try{ window.location.hash = 'org/' + slug; } catch(e2){}
  }
}

function copyLink(inputId){
  var el = document.getElementById(inputId);
  el.select();
  el.setSelectionRange(0, 99999);
  var ok = false;
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(el.value);
      ok = true;
    } else {
      ok = document.execCommand('copy');
    }
  } catch(e){ ok = false; }
  toast(ok ? 'Link copied' : 'Select and copy the link manually');
}

function detectJoinFromUrl(){
  var h = window.location.hash;
  var m = h.match(/^#org\/([a-z0-9-]+)/i);
  if(m){
    joiningOrgSlug = m[1];
    var name = slugToDisplayName(joiningOrgSlug);
    document.getElementById('authHeading').textContent = 'Sign in to ' + name;
    document.getElementById('authSub').textContent = 'TEAM SIGN-IN';
    document.getElementById('joinBanner').style.display = 'flex';
    document.getElementById('joinOrgName').textContent = name;
    document.getElementById('authTabs').style.display = 'none';
    document.getElementById('authSignup').style.display = 'none';
    document.getElementById('authSignin').style.display = 'block';
  }
}

function initials(name){
  var parts = name.trim().split(/\s+/);
  return ((parts[0]||'')[0]||'').toUpperCase() + ((parts[1]||'')[0]||'').toUpperCase();
}

function switchAuthTab(which){
  document.getElementById('authTabSignin').classList.toggle('active', which==='signin');
  document.getElementById('authTabSignup').classList.toggle('active', which==='signup');
  document.getElementById('authSignin').style.display = which==='signin' ? 'block' : 'none';
  document.getElementById('authSignup').style.display = which==='signup' ? 'block' : 'none';
}

function doLogin(){
  var email = document.getElementById('signinEmail').value.trim();
  var pass = document.getElementById('signinPassword').value.trim();
  if(!email || !pass){
    document.getElementById('signinErr').style.display = 'block';
    return;
  }
  document.getElementById('signinErr').style.display = 'none';

  if(joiningOrgSlug){
    currentOrgSlug = joiningOrgSlug;
    currentAdmin.name = email.split('@')[0].replace(/[.\-_]/g,' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
    currentAdmin.email = email;
    currentAdmin.org = slugToDisplayName(joiningOrgSlug);
    members = [
      {name:'Priya Iyer', email:'priya.iyer@xccelera.ai', role:'Admin', status:'Active', team:'General'},
      {name:currentAdmin.name, email:currentAdmin.email, role:'Member', status:'Active', team:'General'}
    ];
    teams = [{name:'General', members:2, agents:1, projects:1}];
  } else {
    currentOrgSlug = slugify('xccelera-production');
    currentAdmin.name = 'Priya Iyer';
    currentAdmin.email = email;
    currentAdmin.org = 'xccelera-production';
    members = [
      {name:'Priya Iyer', email:'priya.iyer@xccelera.ai', role:'Admin', status:'Active', team:'Platform Team'},
      {name:'Ananya Rao', email:'ananya.rao@xccelera.ai', role:'Member', status:'Active', team:'Platform Team'},
      {name:'Rahul Mehta', email:'rahul.mehta@xccelera.ai', role:'Member', status:'Active', team:'Storefront Team'},
      {name:'Kabir Shah', email:'kabir.shah@xccelera.ai', role:'Viewer', status:'Invited', team:'Storefront Team'}
    ];
    teams = [
      {name:'Platform Team', members:2, agents:2, projects:4},
      {name:'Storefront Team', members:2, agents:2, projects:1}
    ];
  }

  setOrgHash(currentOrgSlug);
  enterApp();
  document.getElementById('manageOrgTitle').textContent = currentAdmin.org;
  document.getElementById('mgGhOrg').textContent = 'xccelera-labs';
  document.getElementById('mgOrgLinkName').textContent = currentAdmin.org;
  document.getElementById('mgOrgLink').value = orgUrlFor(currentOrgSlug);
  renderMembers();
  renderTeams();
  renderStructure();
  document.getElementById('viewOnboard').style.display = 'none';
  document.getElementById('viewManage').style.display = 'block';
  toast('Signed in — showing team dashboard for '+currentAdmin.org);
}

function doSignup(){
  var name = document.getElementById('suName').value.trim();
  var email = document.getElementById('suEmail').value.trim();
  var org = document.getElementById('suOrg').value.trim();
  var pass = document.getElementById('suPassword').value;
  var pass2 = document.getElementById('suPassword2').value;
  var errEl = document.getElementById('signupErr');
  if(!name || !email || !org || !pass){
    errEl.textContent = 'Fill in your name, email, org name and a password';
    errEl.style.display = 'block';
    return;
  }
  if(pass !== pass2){
    errEl.textContent = 'Passwords do not match';
    errEl.style.display = 'block';
    return;
  }
  if(!document.getElementById('suTerms').checked){
    errEl.textContent = 'Please agree to the Terms of Service and Privacy Policy';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  currentAdmin.name = name;
  currentAdmin.email = email;
  currentAdmin.org = org;
  members = [];
  teams = [];

  enterApp();
  document.getElementById('orgName').value = org;
  document.getElementById('viewOnboard').style.display = 'block';
  document.getElementById('viewManage').style.display = 'none';
  obStepTo(1);
  toast('Account created — setting up '+org+' now');
}

function enterApp(){
  document.getElementById('view-auth').style.display = 'none';
  if(window._loginBgStop) window._loginBgStop();
  document.getElementById('appRoot').style.display = 'block';
  document.getElementById('topbarAvatar').textContent = initials(currentAdmin.name || 'PI');
}

function doLogout(){
  document.getElementById('appRoot').style.display = 'none';
  document.getElementById('view-auth').style.display = 'grid';
  if(window._loginBgStart) window._loginBgStart();
  document.getElementById('signinPassword').value = '';
  detectJoinFromUrl();
  toast('Signed out');
}

function renderStructure(){
  var wrap = document.getElementById('structureTree');

  var teamGroups = teams.map(function(t){
    var teamMembers = members.filter(function(m){ return m.team === t.name; });
    var memberLis = teamMembers.map(function(m){
      return '<li><div class="oc-member"><div class="avatar-sm role-'+m.role+'">'+initials(m.name)+'</div>'+
        '<div><div class="oc-mname">'+m.name+'</div><div class="oc-mrole">'+m.role+'</div></div></div></li>';
    }).join('');
    var childUl = memberLis ? '<ul>'+memberLis+'</ul>' : '<ul><li><div class="oc-member" style="opacity:.55;"><div class="oc-mname">No members yet</div></div></li></ul>';
    return '<li><div class="oc-team"><div class="oc-title">'+t.name+'</div><div class="oc-sub">'+teamMembers.length+' people</div></div>'+childUl+'</li>';
  }).join('');

  var unassigned = members.filter(function(m){ return !teams.some(function(t){ return t.name === m.team; }); });
  var unassignedBlock = '';
  if(unassigned.length){
    var uLis = unassigned.map(function(m){
      return '<li><div class="oc-member"><div class="avatar-sm role-'+m.role+'">'+initials(m.name)+'</div>'+
        '<div><div class="oc-mname">'+m.name+'</div><div class="oc-mrole">'+m.role+'</div></div></div></li>';
    }).join('');
    unassignedBlock = '<li><div class="oc-team" style="border-color:var(--raise-2);"><div class="oc-title" style="color:var(--ink-4);">Unassigned</div><div class="oc-sub">'+unassigned.length+' people</div></div><ul>'+uLis+'</ul></li>';
  }

  if(teams.length === 0 && unassigned.length === 0){
    wrap.innerHTML = '<div class="hint" style="text-align:center;padding:20px;">No teams yet — create one from the Teams tab.</div>';
    return;
  }

  wrap.innerHTML = '<div class="orgchart"><ul><li>'+
    '<div class="oc-root"><div class="oc-title">'+currentAdmin.org+'</div><div class="oc-sub">'+currentAdmin.name+' · Org admin</div></div>'+
    '<ul>'+teamGroups+unassignedBlock+'</ul>'+
    '</li></ul></div>';
}


function toast(msg){
  var t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(function(){ t.classList.remove('show'); }, 2600);
}

function addMemberRow(name, email){
  var wrap = document.getElementById('memberRows');
  var row = document.createElement('div');
  row.className = 'member-row';
  row.innerHTML = '<input type="text" placeholder="Full name" class="m-name" value="'+(name||'')+'">'+
    '<input type="email" placeholder="name@xccelera.ai" class="m-email" value="'+(email||'')+'">'+
    '<button class="icon-btn danger" onclick="this.parentElement.remove()"> SVG17 </button>';
  wrap.appendChild(row);
}

function pickGitMode(mode, el){
  document.getElementById('gitmode-app').classList.remove('sel');
  document.getElementById('gitmode-token').classList.remove('sel');
  el.classList.add('sel');
  el.querySelector('input').checked = true;
  gitMode = mode;
}

function buildRoleRows(){
  var wrap = document.getElementById('roleRows');
  wrap.innerHTML = '';
  var names = document.querySelectorAll('#memberRows .m-name');
  var emails = document.querySelectorAll('#memberRows .m-email');
  names.forEach(function(n, i){
    var nm = n.value.trim() || 'Unnamed';
    var em = emails[i].value.trim() || '—';
    var row = document.createElement('div');
    row.className = 'member-row';
    row.innerHTML = '<div style="flex:1;"><b style="font-size:13px;">'+nm+'</b><div style="font-size:11.5px;color:var(--ink-4);">'+em+'</div></div>'+
      '<select class="m-role"><option>Admin</option><option selected>Member</option><option>Viewer</option></select>';
    wrap.appendChild(row);
  });
  if(names.length === 0){
    wrap.innerHTML = '<div class="hint">No invites added yet — go back and add team members.</div>';
  }
}

function updateReview(){
  document.getElementById('revOrgName').textContent = document.getElementById('orgName').value || '—';
  document.getElementById('revOrgDomain').textContent = document.getElementById('orgDomain').value || '—';
  document.getElementById('revOrgSize').textContent = document.getElementById('orgSize').value;
  document.getElementById('revGitMode').textContent = gitMode === 'app' ? 'GitHub App' : 'Personal token';
  document.getElementById('revMemberCount').textContent = document.querySelectorAll('#memberRows .m-name').length;
  document.getElementById('revOrgLink').value = orgUrlFor(slugify(document.getElementById('orgName').value || 'org'));
}

function obStepTo(n){
  obStep = n;
  document.querySelectorAll('.stage-step').forEach(function(s, i){
    s.classList.remove('current','done');
    if(i+1 < n) s.classList.add('done');
    if(i+1 === n) s.classList.add('current');
  });
  for(var i=1;i<=5;i++){ document.getElementById('ob-'+i).style.display = (i===n) ? 'block' : 'none'; }
  document.getElementById('obPrevBtn').style.visibility = (n===1) ? 'hidden' : 'visible';
  document.getElementById('obNextBtn').textContent = (n===5) ? 'Create organization' : 'Continue';
  if(n===4) buildRoleRows();
  if(n===5) updateReview();
}

function obNext(){
  if(obStep === 3 && document.querySelectorAll('#memberRows .m-name').length === 0){
    toast('Add at least one team member first');
    return;
  }
  if(obStep === 5){ finishOnboarding(); return; }
  obStepTo(Math.min(obStep+1, 5));
}
function obPrev(){ obStepTo(Math.max(obStep-1, 1)); }

function finishOnboarding(){
  members = [{name: currentAdmin.name, email: currentAdmin.email, role:'Admin', status:'Active', team:'General'}];
  var names = document.querySelectorAll('#memberRows .m-name');
  var emails = document.querySelectorAll('#memberRows .m-email');
  var roles = document.querySelectorAll('#roleRows .m-role');
  names.forEach(function(n, i){
    members.push({
      name: n.value.trim() || 'Unnamed',
      email: emails[i].value.trim() || '—',
      role: roles[i] ? roles[i].value : 'Member',
      status: 'Invited',
      team: 'General'
    });
  });
  teams = [{name:'General', members: members.length, agents:0, projects:0}];
  var orgNameVal = document.getElementById('orgName').value || 'Organization';
  currentOrgSlug = slugify(orgNameVal);
  setOrgHash(currentOrgSlug);
  document.getElementById('manageOrgTitle').textContent = orgNameVal;
  document.getElementById('mgGhOrg').textContent = document.getElementById('ghOrg').value || '—';
  document.getElementById('mgOrgLinkName').textContent = orgNameVal;
  document.getElementById('mgOrgLink').value = orgUrlFor(currentOrgSlug);
  renderMembers();
  renderTeams();
  renderStructure();
  document.getElementById('viewOnboard').style.display = 'none';
  document.getElementById('viewManage').style.display = 'block';
  toast('Organization created — team sign-in link is ready to share');
}

function renderMembers(){
  var tb = document.getElementById('membersTbody');
  tb.innerHTML = '';
  if(members.length === 0){
    tb.innerHTML = '<tr><td colspan="5" style="color:var(--ink-4);text-align:center;padding:24px;">No members yet</td></tr>';
    updateStats();
    return;
  }
  members.forEach(function(m, i){
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><div class="name-cell"><div class="avatar-sm role-'+m.role+'">'+initials(m.name)+'</div><b>'+m.name+'</b></div></td>'+
      '<td style="color:var(--ink-4);">'+m.email+'</td>'+
      '<td><select onchange="members['+i+'].role=this.value;renderMembers();renderStructure();"><option'+(m.role==='Admin'?' selected':'')+'>Admin</option><option'+(m.role==='Member'?' selected':'')+'>Member</option><option'+(m.role==='Viewer'?' selected':'')+'>Viewer</option></select> <span class="role-chip role-'+m.role+'" style="margin-left:6px;">'+m.role+'</span></td>'+
      '<td><span class="badge '+(m.status==='Active'?'success':'warning')+'"><i></i>'+m.status+'</span></td>'+
      '<td><button class="icon-btn danger" onclick="removeMember('+i+')"> SVG18 </button></td>';
    tb.appendChild(tr);
  });
  updateStats();
}
function updateStats(){
  document.getElementById('statMembers').textContent = members.length;
  document.getElementById('statTeams').textContent = teams.length;
  document.getElementById('statAdmins').textContent = members.filter(function(m){return m.role==='Admin';}).length;
  document.getElementById('statPending').textContent = members.filter(function(m){return m.status==='Invited';}).length;
}
function removeMember(i){ members.splice(i,1); renderMembers(); renderStructure(); toast('Member removed'); }

function renderTeams(){
  var wrap = document.getElementById('teamsList');
  wrap.innerHTML = '';
  if(teams.length === 0){
    wrap.innerHTML = '<div class="hint" style="text-align:center;padding:16px;">No teams yet</div>';
    updateStats();
    return;
  }
  teams.forEach(function(t){
    var teamMembers = members.filter(function(m){ return m.team === t.name; });
    var row = document.createElement('div');
    row.className = 'team-row';
    row.innerHTML = '<div><div class="tr-name">'+t.name+'</div>'+
      '<div class="tr-meta">'+teamMembers.length+' member'+(teamMembers.length===1?'':'s')+' · '+t.agents+' agents · '+t.projects+' projects</div></div>'+
      '<button class="btn secondary sm" onclick="openManageTeam(\''+t.name.replace(/'/g,"\\'")+'\')">Manage</button>';
    wrap.appendChild(row);
  });
  updateStats();
}

function closeModal(id){ document.getElementById(id).classList.remove('open'); }

function renderMemberPicker(containerId, checkedTeamName){
  var wrap = document.getElementById(containerId);
  wrap.innerHTML = '';
  if(members.length === 0){
    wrap.innerHTML = '<div class="hint">No members yet — invite people from the Members tab first.</div>';
    return;
  }
  members.forEach(function(m, i){
    var row = document.createElement('label');
    row.className = 'member-pick-row';
    var checked = checkedTeamName && m.team === checkedTeamName;
    row.innerHTML = '<input type="checkbox" data-idx="'+i+'" '+(checked?'checked':'')+'>'+
      '<div class="avatar-sm role-'+m.role+'">'+initials(m.name)+'</div>'+
      '<div style="font-size:13px;">'+m.name+' <span style="color:var(--ink-4);font-size:11.5px;">· '+m.role+'</span></div>';
    wrap.appendChild(row);
  });
}

function openNewTeamModal(){
  document.getElementById('ntName').value = '';
  renderMemberPicker('ntMemberPicker', null);
  document.getElementById('newTeamModal').classList.add('open');
}
function submitNewTeam(){
  var name = document.getElementById('ntName').value.trim();
  if(!name){ toast('Give the team a name first'); return; }
  teams.push({name:name, members:0, agents:0, projects:0});
  var checks = document.querySelectorAll('#ntMemberPicker input[type=checkbox]:checked');
  checks.forEach(function(c){ members[+c.dataset.idx].team = name; });
  closeModal('newTeamModal');
  renderTeams();
  renderMembers();
  renderStructure();
  toast(name+' created');
}

var mtCurrentTeam = null;
function openManageTeam(teamName){
  mtCurrentTeam = teamName;
  document.getElementById('mtTitle').textContent = 'Manage '+teamName;
  document.getElementById('mtName').value = teamName;
  renderMemberPicker('mtMemberPicker', teamName);
  document.getElementById('manageTeamModal').classList.add('open');
}
function saveManageTeam(){
  var newName = document.getElementById('mtName').value.trim() || mtCurrentTeam;
  var team = teams.find(function(t){ return t.name === mtCurrentTeam; });
  if(team) team.name = newName;
  members.forEach(function(m){ if(m.team === mtCurrentTeam) m.team = newName; });
  var checks = document.querySelectorAll('#mtMemberPicker input[type=checkbox]');
  checks.forEach(function(c){
    var m = members[+c.dataset.idx];
    if(c.checked) m.team = newName;
    else if(m.team === newName) m.team = 'Unassigned';
  });
  closeModal('manageTeamModal');
  renderTeams();
  renderMembers();
  renderStructure();
  toast(newName+' updated');
}
function deleteTeam(){
  teams = teams.filter(function(t){ return t.name !== mtCurrentTeam; });
  members.forEach(function(m){ if(m.team === mtCurrentTeam) m.team = 'Unassigned'; });
  closeModal('manageTeamModal');
  renderTeams();
  renderMembers();
  renderStructure();
  toast(mtCurrentTeam+' deleted');
}

var AVATAR_COLORS = ['var(--grad-signal)','linear-gradient(135deg,#0f6e56,#1d9e75)','linear-gradient(135deg,#b45309,#f59e0b)','linear-gradient(135deg,#7c3aed,#c026d3)','linear-gradient(135deg,#0e7490,#0891b2)'];
var pfAvatarIdx = 0;
function openProfileModal(){
  document.getElementById('pfName').value = currentAdmin.name;
  document.getElementById('pfEmail').value = currentAdmin.email;
  document.getElementById('pfPassword').value = '';
  var picker = document.getElementById('avatarPicker');
  picker.innerHTML = '';
  AVATAR_COLORS.forEach(function(bg, i){
    var d = document.createElement('div');
    d.className = 'avatar-opt'+(i===pfAvatarIdx?' sel':'');
    d.style.background = bg;
    d.textContent = initials(currentAdmin.name);
    d.onclick = function(){
      picker.querySelectorAll('.avatar-opt').forEach(function(x){ x.classList.remove('sel'); });
      d.classList.add('sel');
      pfAvatarIdx = i;
    };
    picker.appendChild(d);
  });
  document.getElementById('profileModal').classList.add('open');
}
function saveProfile(){
  var name = document.getElementById('pfName').value.trim();
  var email = document.getElementById('pfEmail').value.trim();
  if(!name || !email){ toast('Name and email are required'); return; }
  currentAdmin.name = name;
  currentAdmin.email = email;
  document.getElementById('topbarAvatar').textContent = initials(name);
  document.getElementById('topbarAvatar').style.background = AVATAR_COLORS[pfAvatarIdx];
  closeModal('profileModal');
  toast('Profile updated');
}
function doLogoutFromProfile(){
  closeModal('profileModal');
  doLogout();
}

function addTeam(){ openNewTeamModal(); }

function switchManageTab(btn, id){
  btn.parentElement.querySelectorAll('.tab2').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  ['mg-members','mg-teams','mg-structure','mg-access'].forEach(function(pid){
    document.getElementById(pid).style.display = (pid===id) ? 'block' : 'none';
  });
}

function openInviteModal(){
  var name = prompt('Full name');
  if(!name) return;
  var email = prompt('Email');
  members.push({name:name, email: email || '—', role:'Member', status:'Invited', team:'General'});
  renderMembers();
  renderStructure();
  toast(name+' invited');
}


// Dot-grid login background — theme-aware
(function(){
  var canvas = document.getElementById('loginBg');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var DOT_DARK='rgba(100,160,255,0.18)', GLOW_DARK=[59,130,246];
  var DOT_LIGHT='rgba(14,96,255,0.16)',  GLOW_LIGHT=[14,96,255];
  function isDark(){ return document.documentElement.dataset.theme !== 'light'; }
  var w, h, dots, mouse={x:-9999,y:-9999}, hasMouse=false;
  var GAP=34, RAD=1.6, SPOT=160, t=0;
  function build(){
    w=canvas.width=window.innerWidth;
    h=canvas.height=window.innerHeight;
    dots=[];
    for(var i=0;i<=Math.ceil(w/GAP)+1;i++)
      for(var j=0;j<=Math.ceil(h/GAP)+1;j++)
        dots.push({x:i*GAP,y:j*GAP});
  }
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;hasMouse=true;});
  window.addEventListener('mouseleave',function(){hasMouse=false;});
  window.addEventListener('resize',build);
  build();
  var running=true;
  function draw(){
    if(!running) return;
    t+=0.006;
    ctx.clearRect(0,0,w,h);
    var dark=isDark(), DOT=dark?DOT_DARK:DOT_LIGHT, GLOW=dark?GLOW_DARK:GLOW_LIGHT;
    var mx=hasMouse?mouse.x:w*(0.5+0.32*Math.cos(t));
    var my=hasMouse?mouse.y:h*(0.5+0.28*Math.sin(t*1.3));
    for(var k=0;k<dots.length;k++){
      var d=dots[k];
      var dx=d.x-mx,dy=d.y-my;
      var dist=Math.sqrt(dx*dx+dy*dy);
      var inten=Math.max(0,1-dist/SPOT);
      if(inten>0.01){
        ctx.beginPath();
        ctx.arc(d.x,d.y,RAD+inten*2.2,0,Math.PI*2);
        ctx.fillStyle='rgba('+GLOW[0]+','+GLOW[1]+','+GLOW[2]+','+(0.15+inten*0.85)+')';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(d.x,d.y,RAD,0,Math.PI*2);
        ctx.fillStyle=DOT;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  // Stop when login view is hidden
  window._loginBgStop=function(){ running=false; };
  window._loginBgStart=function(){ if(!running){running=true;draw();} };
})();
addMemberRow('Ananya Rao', 'ananya.rao@xccelera.ai');
addMemberRow('Rahul Mehta', 'rahul.mehta@xccelera.ai');
detectJoinFromUrl();

  // ── Theme toggle ──────────────────────────────────────────
  function applyTheme(t){
    document.documentElement.dataset.theme = t;
    try{ localStorage.setItem('xcTheme',t); } catch(e){}
  }
  function toggleTheme(){
    const cur = document.documentElement.dataset.theme;
    applyTheme(cur === 'light' ? 'dark' : 'light');
  }
  // Apply saved theme on load
  (function(){
    try{
      const saved = localStorage.getItem('xcTheme');
      if(saved === 'light' || saved === 'dark') applyTheme(saved);
    } catch(e){}
  })();