/* ═══ Xccelera AI shared support tickets ═══
   One ticket store used by the Enterprise Admin Portal, Platform Studio and Xccelera Customer Support.
   Customers raise tickets in the Enterprise portal or Studio; Xccelera staff work them in Customer Support.
   Files opened in the same browser share the store, and changes appear live in the other open windows. */
(function(){
  if(window.XT) return;
  var KEY='xc-support-tickets-v1', mem=null, subs=[];
  var ORG={name:'GlobalTech Solutions',domain:'globaltech.com'};
  function iso(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  var SEED=[
    {id:'gt-1041',org:ORG.name,domain:ORG.domain,source:'Enterprise Admin Portal',type:'Access',cat:'Access & sign-in',subject:'New joiners can’t complete single sign-on',prio:'High',status:'Resolved',created:'2026-10-08',at:Date.parse('2026-10-08T09:20:00'),
      from:{name:'Simon Kirkwood',email:'simon.kirkwood@xccelera.ai',role:'Organization Admin'},meta:{area:'Single sign-on',portal:'Enterprise Admin Portal'},
      thread:[{by:'org',name:'Simon Kirkwood',text:'Three people who joined this week get “account not provisioned” after signing in with SSO. Existing users are fine.',date:'2026-10-08'},
              {by:'super',name:'Xccelera AI Support',text:'Thanks Simon — the SCIM sync for your tenant was paused after the certificate rotation. We have re-enabled it and the three accounts are now provisioned. Please ask them to sign in again.',date:'2026-10-09'}],seen:2},
    {id:'gt-1043',org:ORG.name,domain:ORG.domain,source:'Platform Studio',type:'Integration',cat:'Integrations',subject:'GitHub connection drops during repository sync',prio:'Medium',status:'In progress',created:'2026-10-19',at:Date.parse('2026-10-19T14:05:00'),
      from:{name:'Danny Kemp',email:'danny@xccelera.ai',role:'Developer / Engineer'},meta:{portal:'Platform Studio',area:'Repositories'},
      thread:[{by:'org',name:'Danny Kemp',text:'Syncing customer-portal-web stops at about 60% with “connection reset”. It happens every time since yesterday.',date:'2026-10-19'},
              {by:'super',name:'Xccelera AI Support',text:'We can see the resets on our side and are working with GitHub on a rate-limit change. We will update you here by tomorrow.',date:'2026-10-20'}],seen:2}
  ];
  /* customer-facing categories → ticket type used by Customer Support */
  var CATS=[
    ['Access & sign-in','Access','lock','Sign-in, single sign-on and account access'],
    ['Licences & billing','Invoice query','idcard','Invoices, payments and licence questions'],
    ['Integrations','Integration','link','Git, CI/CD, design and knowledge connections'],
    ['Something isn’t working','Technical issue','alert','Errors, outages or unexpected behaviour'],
    ['Platform Studio','Technical issue','code','Projects, agents, code and knowledge in Studio'],
    ['Other','Other','chat','Anything else for the Xccelera AI team']
  ];
  var SLA={Urgent:4,High:8,Medium:24,Low:72};
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function load(){
    try{var raw=localStorage.getItem(KEY);if(raw){mem=JSON.parse(raw);return mem;}}catch(e){}
    if(!mem){mem=clone(SEED);save(mem,true);}
    return mem;
  }
  function save(a,quiet){mem=a;try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}if(!quiet)subs.forEach(function(f){try{f('local');}catch(e){}});}
  function all(){return load();}
  function get(id){return load().filter(function(t){return t.id===id;})[0]||null;}
  function nextId(){var n=1040;load().forEach(function(t){var m=/^gt-(\d+)$/.exec(t.id);if(m)n=Math.max(n,+m[1]);});return 'gt-'+(n+1);}
  function create(t){var a=load(),now=new Date();
    var x={id:nextId(),org:t.org||ORG.name,domain:t.domain||ORG.domain,source:t.source,type:t.type,cat:t.cat||'',subject:t.subject,prio:t.prio||'Medium',status:'Open',created:iso(now),at:now.getTime(),
      from:t.from,meta:t.meta||{},thread:[{by:'org',name:t.from.name,text:t.body,date:iso(now)}],seen:1};
    a.unshift(x);save(a);return x;}
  function update(id,fn){var a=load();a.forEach(function(t){if(t.id===id)fn(t);});save(a);}
  function reply(id,text,who){update(id,function(t){t.thread.push({by:'org',name:who.name,text:text,date:iso()});t.seen=t.thread.length;if(t.status==='Resolved'||t.status==='Declined')t.status='Open';});}
  function markSeen(id){var a=load(),ch=false;a.forEach(function(t){if(t.id===id&&t.seen!==t.thread.length){t.seen=t.thread.length;ch=true;}});if(ch)save(a,true);}
  function unread(t){return t.thread.slice(t.seen||0).filter(function(m){return m.by==='super';}).length;}
  function sla(t){if(t.status==='Resolved'||t.status==='Declined')return {txt:'Closed',tone:'neutral'};var h=(Date.now()-(t.at||Date.now()))/36e5,left=Math.round(SLA[t.prio]-h);var answered=t.thread.some(function(m){return m.by==='super';});if(answered)return {txt:'Responded',tone:'ok'};return left<0?{txt:'Response overdue',tone:'bad'}:{txt:'Reply within '+left+'h',tone:left<=SLA[t.prio]*.25?'warn':'ok'};}
  function on(fn){subs.push(fn);}
  window.addEventListener('storage',function(e){if(e.key===KEY){mem=null;load();subs.forEach(function(f){try{f('remote');}catch(x){}});}});
  window.XT={KEY:KEY,ORG:ORG,CATS:CATS,SLA:SLA,iso:iso,all:all,get:get,create:create,update:update,reply:reply,markSeen:markSeen,unread:unread,sla:sla,on:on,save:save,load:load};
})();

/* ═══ Xccelera AI shared tool-access requests ═══
   A developer asks for an extra AI agent or cognitive tool for a task. The request goes to the project manager,
   CTO or organisation admin, who approve it in Platform Studio or the Enterprise Admin Portal.
   Approved items become extra access for that person only, on top of their role. */
(function(){
  if(window.XA) return;
  var KEY='xc-access-requests-v2', mem=null, subs=[];
  var CAT={
    tool:[['apix','BackendX Agent'],['uix','FrontendX Agent'],['integrationx','IntegrationX'],['appbuilderx','AppBuilderX Agent'],['libx','VulnerabilityX'],['legacycode','LegacyCodeX'],['businessextraction','ConnectX']]
  };
  var DUR=[['task','Until the task is done'],['7','7 days'],['30','30 days'],['perm','Permanently']];
  var TO=[['pm','Project Manager'],['cto','CTO / Engineering Admin'],['admin','Organisation Admin']];
  function name(k,id){var r=(CAT[k]||[]).filter(function(x){return x[0]===id;})[0];return r?r[1]:id;}
  function iso(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  function it(k,id){return {k:k,id:id,n:name(k,id)};}
  var SEED=[
    {id:'AR-1004',status:'Pending',at:'2026-10-25',by:{name:'Danny Kemp',email:'danny@xccelera.ai',role:'Developer / Engineer'},items:[it('tool','legacycode')],
      task:'CP-151',taskT:'Billing API integration',project:'Customer Portal',reason:'The billing integration calls an old Java module. LegacyCodeX can produce a migration plan and behaviour tests much faster than doing it by hand.',dur:'task',to:'pm',toName:'Charlotte Hughes'},
    {id:'AR-1003',status:'Pending',at:'2026-10-24',by:{name:'Sophie Lee',email:'sophie.lee@globaltech.com',role:'Frontend Developer'},items:[it('tool','apix'),it('tool','integrationx')],
      task:'CP-146',taskT:'Invoice filters',project:'Customer Portal',reason:'The filters need two new API endpoints and their tests. I would like to generate them and their contract tests myself instead of waiting for the backend team.',dur:'7',to:'cto',toName:'CTO / Engineering Admin'},
    {id:'AR-1001',status:'Approved',at:'2026-10-21',by:{name:'Test User',email:'testuser@xccelera.ai',role:'QA / Test Engineer'},items:[it('tool','apix')],ok:['tool:apix'],
      task:'CP-146',taskT:'Invoice filters',project:'Customer Portal',reason:'I need to fix flaky test fixtures in the repository while the developer is on leave.',dur:'task',to:'pm',toName:'Charlotte Hughes',
      decided:{by:'Rob Stevens',role:'Project Manager',at:'2026-10-22',note:'Approved for the fixture fixes only.'}},
    {id:'AR-0998',status:'Rejected',at:'2026-10-18',by:{name:'Danny Kemp',email:'danny@xccelera.ai',role:'Developer / Engineer'},items:[it('tool','appbuilderx')],ok:[],
      task:'CP-135',taskT:'Billing API documentation',project:'Customer Portal',reason:'I want to build a mobile preview of the billing screens for the client demo.',dur:'30',to:'cto',toName:'CTO / Engineering Admin',
      decided:{by:'Simon Kirkwood',role:'CTO / Engineering Admin',at:'2026-10-19',note:'Mobile isn’t in scope for Customer Portal this quarter. Let’s revisit after the client demo.'}}
  ];
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function load(){if(mem)return mem;try{var raw=localStorage.getItem(KEY);if(raw){mem=JSON.parse(raw);return mem;}}catch(e){}mem=clone(SEED);save(mem,true);return mem;}
  function save(a,quiet){mem=a;try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}if(!quiet)subs.forEach(function(f){try{f('local');}catch(e){}});}
  function all(){return load();}
  function get(id){return load().filter(function(r){return r.id===id;})[0]||null;}
  function nextId(){var n=1000;load().forEach(function(r){var m=/^AR-(\d+)$/.exec(r.id);if(m)n=Math.max(n,+m[1]);});return 'AR-'+(n+1);}
  function create(o){var a=load();var r={id:nextId(),status:'Pending',at:iso(),ts:Date.now(),by:o.by,items:o.items.map(function(x){return it(x.k,x.id);}),task:o.task||'',taskT:o.taskT||'',project:o.project||'',reason:o.reason||'',dur:o.dur||'task',to:o.to||'pm',toName:o.toName||''};a.unshift(r);save(a);return r;}
  function until(r){if(r.status!=='Approved')return null;if(r.dur==='7'||r.dur==='30'){var d=new Date(r.decided&&r.decided.at||r.at);d.setDate(d.getDate()+(+r.dur));return iso(d);}return null;}
  function durText(r){var u=until(r);if(r.dur==='task')return 'Until '+(r.task||'the task')+' is done';if(r.dur==='perm')return 'Permanent';return u?'Until '+u:(r.dur+' days');}
  function decide(id,o){var a=load();a.forEach(function(r){if(r.id!==id)return;r.status=o.status;r.ok=o.ok||[];if(o.dur)r.dur=o.dur;r.decided={by:o.by,role:o.role||'',at:iso(),note:o.note||''};});save(a);}
  function revoke(id,o){var a=load();a.forEach(function(r){if(r.id!==id)return;r.status='Revoked';r.revoked={by:o.by,at:iso(),note:o.note||''};});save(a);}
  function active(r){if(r.status!=='Approved')return false;var u=until(r);return !u||u>=iso();}
  /* extra access for one person: [{k,id,n,req}] */
  function grants(email){var out=[];if(!email)return out;email=String(email).toLowerCase();load().forEach(function(r){if(!active(r)||String(r.by.email).toLowerCase()!==email)return;(r.ok||[]).forEach(function(key){var p=key.split(':');if(!out.some(function(g){return g.k===p[0]&&g.id===p[1];}))out.push({k:p[0],id:p[1],n:name(p[0],p[1]),req:r});});});return out;}
  function grant(email,k,id){return grants(email).filter(function(g){return g.k===k&&g.id===id;})[0]||null;}
  function pending(){return load().filter(function(r){return r.status==='Pending';});}
  function on(fn){subs.push(fn);}
  window.addEventListener('storage',function(e){if(e.key===KEY){mem=null;load();subs.forEach(function(f){try{f('remote');}catch(x){}});}});
  window.XA={KEY:KEY,CAT:CAT,DUR:DUR,TO:TO,name:name,iso:iso,all:all,get:get,create:create,decide:decide,revoke:revoke,grants:grants,grant:grant,pending:pending,until:until,durText:durText,active:active,on:on,save:save,reload:function(){mem=null;return load();}};
})();