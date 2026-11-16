(function(){ /* decorative windows + dot wave for the login background */
  var w=document.getElementById('lgWins'),h='';
  for(var r=0;r<34;r++)for(var c=0;c<9;c++){var x=162+c*33,y=150+r*12+c*6.5,lit=Math.random()<.42;h+='<rect x="'+x+'" y="'+y+'" width="24" height="7" rx="1" fill="'+(lit?'url(#lgWin)':'#2a4fb4')+'" opacity="'+(lit?(.55+Math.random()*.45).toFixed(2):'.25')+'"/>';}
  for(var r2=0;r2<30;r2++)for(var c2=0;c2<3;c2++){var x2=52+c2*30,y2=170+r2*13-c2*8;h+='<rect x="'+x2+'" y="'+y2+'" width="20" height="7" fill="#2a4fb4" opacity="'+(Math.random()<.3?.6:.18)+'"/>';}
  w.innerHTML=h;
  var g=document.getElementById('lgWave'),d='';
  for(var i=0;i<46;i++)for(var j=0;j<16;j++){var px=i*13.5,py=420+j*11+Math.sin(i/5+j/3)*26-j*2,o=(1-j/16)*.85;d+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(1+o*.9).toFixed(2)+'" fill="#6d8dff" opacity="'+o.toFixed(2)+'"/>';}
  g.innerHTML=d;
})();