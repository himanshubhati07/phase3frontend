(function(){ /* keep the whole sign-in page inside the window — scale the content down when the window is short */
  var root=document.getElementById('xc-login'); if(!root) return;
  function fit(){
    if(document.body.classList.contains('authed')) return;
    root.style.zoom=''; root.classList.remove('lg-scroll');
    /* phones and tablets: natural size, the page scrolls */
    if(window.innerWidth<900){ root.classList.add('lg-scroll'); return; }
    /* desktops: shrink a little on short windows, never below 82%; scroll beyond that */
    var need=root.scrollHeight, have=root.clientHeight;
    if(need>have+1){ var z=Math.max(0.82,have/need); root.style.zoom=z; if(root.scrollHeight>root.clientHeight+1) root.classList.add('lg-scroll'); }
  }
  window.addEventListener('resize',function(){ clearTimeout(window.__lgf); window.__lgf=setTimeout(fit,60); });
  new MutationObserver(function(){ clearTimeout(window.__lgf); window.__lgf=setTimeout(fit,40); }).observe(root,{attributes:true,attributeFilter:['data-portal'],subtree:false});
  document.addEventListener('DOMContentLoaded',fit); window.addEventListener('load',fit); setTimeout(fit,0); setTimeout(fit,500);
  window.lgFit=fit;
})();