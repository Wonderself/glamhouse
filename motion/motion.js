/* MYGLAMHOUSE — MOTION · moteur d'animations */
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  /* ---- Curseur custom ---- */
  if(!coarse){
    const dot=document.querySelector('.cursor'), ring=document.querySelector('.cursor-ring');
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(dot){dot.style.left=mx+'px';dot.style.top=my+'px';}},{passive:true});
    const loop=()=>{rx+=(mx-rx)*.18;ry+=(my-ry)*.18;if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}requestAnimationFrame(loop);};
    loop();
    const hov='a,button,[data-magnetic],.pcard,.film';
    document.querySelectorAll(hov).forEach(el=>{
      el.addEventListener('pointerenter',()=>ring&&ring.classList.add('big'));
      el.addEventListener('pointerleave',()=>ring&&ring.classList.remove('big'));
    });
  }

  /* ---- Magnetic buttons ---- */
  if(!coarse&&!reduce){
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.3}px,${y*.4}px)`;});
      el.addEventListener('pointerleave',()=>{el.style.transform='';});
    });
  }

  /* ---- Nav solid + progress ---- */
  const nav=document.querySelector('.mnav'), prog=document.querySelector('.progress');
  const onScroll=()=>{
    const y=scrollY;
    if(nav) nav.classList.toggle('solid',y>40);
    if(prog){const h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?(y/h*100):0)+'%';}
    pins.forEach(updatePin);
  };

  /* ---- Reveal ---- */
  const rev=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    rev.forEach(el=>io.observe(el));
  } else rev.forEach(el=>el.classList.add('in'));

  /* ---- Counters ---- */
  const cs=document.querySelectorAll('[data-count]');
  if('IntersectionObserver'in window){
    const cio=new IntersectionObserver((es)=>{es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,t=parseFloat(el.dataset.count),suf=el.dataset.suffix||'';const st=performance.now();const step=(n)=>{const p=Math.min((n-st)/1500,1);const v=t%1===0?Math.round(t*(1-Math.pow(1-p,3))):(t*(1-Math.pow(1-p,3))).toFixed(1);el.textContent=v+suf;if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);cio.unobserve(el);});},{threshold:.5});
    cs.forEach(el=>cio.observe(el));
  }

  /* ---- Parallax ---- */
  const px=[...document.querySelectorAll('[data-parallax]')];
  /* ---- Pin horizontal ---- */
  const pins=[...document.querySelectorAll('.pin')].map(pin=>({pin,track:pin.querySelector('.pin__track')}));
  function updatePin({pin,track}){
    if(!track)return;
    const rect=pin.getBoundingClientRect();
    const total=pin.offsetHeight-innerHeight;
    const p=Math.min(Math.max(-rect.top/total,0),1);
    const max=track.scrollWidth-innerWidth+ (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter'))||40);
    track.style.transform=`translate3d(${-(max>0?max:0)*p}px,0,0)`;
  }
  function updateParallax(){const vh=innerHeight;px.forEach(el=>{const r=el.getBoundingClientRect();const c=(r.top+r.height/2-vh/2)/vh;const sp=parseFloat(el.dataset.parallax)||.15;el.style.transform=`translateY(${c*sp*-140}px)`;});}

  addEventListener('scroll',()=>{onScroll();if(!reduce)updateParallax();},{passive:true});
  addEventListener('resize',()=>{onScroll();},{passive:true});
  onScroll();if(!reduce)updateParallax();

  /* ---- Text scramble au reveal ---- */
  const glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/*+';
  function scramble(el){
    const final=el.dataset.scramble;el.textContent='';
    let i=0;const dur=final.length*38;const st=performance.now();
    const tick=(n)=>{const p=(n-st)/dur;const lock=Math.floor(p*final.length);
      let out='';for(let k=0;k<final.length;k++){out+= k<lock?final[k]:(final[k]===' '?' ':glyphs[Math.floor(Math.random()*glyphs.length)]);}
      el.textContent=out;if(p<1)requestAnimationFrame(tick);else el.textContent=final;};
    requestAnimationFrame(tick);
  }
  const sc=document.querySelectorAll('[data-scramble]');
  if('IntersectionObserver'in window&&!reduce){
    const sio=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){scramble(e.target);sio.unobserve(e.target);}});},{threshold:.6});
    sc.forEach(el=>sio.observe(el));
  } else sc.forEach(el=>{el.textContent=el.dataset.scramble;});

  /* ---- Kinetic hero words : stagger ---- */
  document.querySelectorAll('.kin span').forEach((s,i)=>{s.style.animationDelay=(.15+i*.08)+'s';});
})();
