(function(){ /* dot grid with a moving spotlight — same as the onboarding sign-in screen */
  var c=document.getElementById('lgDots');if(!c||!c.getContext)return;
  var ctx=c.getContext('2d'),root=document.getElementById('xc-login');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w,h,dots,mouse={x:-9999,y:-9999},hasMouse=false,GAP=34,RAD=1.6,SPOT=160,t=0,running=false;
  function visible(){return !document.body.classList.contains('authed');}
  function build(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;dots=[];for(var i=0;i<=Math.ceil(w/GAP)+1;i++)for(var j=0;j<=Math.ceil(h/GAP)+1;j++)dots.push({x:i*GAP,y:j*GAP});}
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;hasMouse=true;});
  document.addEventListener('mouseleave',function(){hasMouse=false;});
  window.addEventListener('resize',function(){build();if(!running)paint();});
  function paint(){
    ctx.clearRect(0,0,w,h);
    var stu=root.dataset.portal==='studio',lt=document.documentElement.dataset.theme==='light',DOT=lt?(stu?'rgba(109,77,255,0.16)':'rgba(14,96,255,0.16)'):(stu?'rgba(165,148,255,0.18)':'rgba(100,160,255,0.18)'),G=stu?[124,92,255]:(lt?[14,96,255]:[59,130,246]);
    var mx=hasMouse?mouse.x:w*(0.5+0.32*Math.cos(t)),my=hasMouse?mouse.y:h*(0.5+0.28*Math.sin(t*1.3));
    for(var k=0;k<dots.length;k++){var d=dots[k],dx=d.x-mx,dy=d.y-my,inten=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/SPOT);
      ctx.beginPath();
      if(inten>0.01){ctx.arc(d.x,d.y,RAD+inten*2.2,0,6.2832);ctx.fillStyle='rgba('+G[0]+','+G[1]+','+G[2]+','+(0.15+inten*0.85)+')';}
      else{ctx.arc(d.x,d.y,RAD,0,6.2832);ctx.fillStyle=DOT;}
      ctx.fill();}
  }
  function draw(){if(!visible()||reduce){running=false;paint();return;}t+=0.006;paint();requestAnimationFrame(draw);}
  build();
  window.restartLoginDots=function(){if(!running){running=true;draw();}};
  window.restartLoginDots();
})();