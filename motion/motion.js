/* MYGLAMHOUSE — MOTION · moteur d'animations (v2 "lab électrique") */
(function(){
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

  /* ============ PRÉLOADER + RIDEAU ============ */
  (function preload(){
    const pre=$('.pre'); const curt=$('.curtain');
    const reveal=()=>{document.body.style.overflow='';
      if(curt) curt.classList.add('up');
      if(pre) pre.classList.add('hide');
      $$('.kin span').forEach((s,i)=>{s.style.animationPlayState='running';s.style.animationDelay=(.2+i*.07)+'s';});
    };
    if(!pre){reveal();return;}
    document.body.style.overflow='hidden';
    $$('.kin span').forEach(s=>{s.style.animationPlayState='paused';});
    if(reduce){setTimeout(reveal,200);return;}
    const num=$('.pre__num'), bar=$('.pre__bar i');
    let v=0;const iv=setInterval(()=>{
      v+=Math.max(1,Math.round((100-v)*.1));
      if(v>=100){v=100;clearInterval(iv);setTimeout(reveal,260);}
      if(num)num.textContent=v;if(bar)bar.style.right=(100-v)+'%';
    },70);
    setTimeout(reveal,4200);
  })();

  /* ============ OVERLAYS (grain + scanlines) ============ */
  ['fx-grain','fx-scan'].forEach(c=>{const d=document.createElement('div');d.className=c;d.setAttribute('aria-hidden','true');document.body.appendChild(d);});

  /* ============ CURSEUR + TRAÎNÉE ============ */
  let mx=innerWidth/2,my=innerHeight/2;
  if(!coarse){
    const dot=$('.cursor'),ring=$('.cursor-ring');
    let rx=mx,ry=my;
    const trails=[];const N=5;
    for(let i=0;i<N;i++){const t=document.createElement('div');t.className='trail';t.style.opacity=String(.5*(1-i/N));document.body.appendChild(t);trails.push({el:t,x:mx,y:my});}
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(dot){dot.style.left=mx+'px';dot.style.top=my+'px';}},{passive:true});
    const loop=()=>{rx+=(mx-rx)*.18;ry+=(my-ry)*.18;if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
      let px=mx,py=my;trails.forEach(t=>{t.x+=(px-t.x)*.35;t.y+=(py-t.y)*.35;t.el.style.left=t.x+'px';t.el.style.top=t.y+'px';px=t.x;py=t.y;});
      requestAnimationFrame(loop);};
    loop();
    $$('a,button,[data-magnetic],.pcard,.film,.index .row').forEach(el=>{
      el.addEventListener('pointerenter',()=>ring&&ring.classList.add('big'));
      el.addEventListener('pointerleave',()=>ring&&ring.classList.remove('big'));
    });
  }

  /* ============ MAGNETIC ============ */
  if(!coarse&&!reduce) $$('[data-magnetic]').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`;});
    el.addEventListener('pointerleave',()=>{el.style.transform='';});
  });

  /* ============ TILT (cartes/films) ============ */
  if(!coarse&&!reduce) $$('.pcard,.film').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.classList.add('tilting');el.style.transform=`perspective(900px) rotateX(${(-py*7).toFixed(2)}deg) rotateY(${(px*8).toFixed(2)}deg)`;});
    el.addEventListener('pointerleave',()=>{el.classList.remove('tilting');el.style.transform='';});
  });

  /* ============ BLOBS réactifs ============ */
  const blobHosts=$$('[data-blobs]').map(host=>{
    const b=document.createElement('div');b.className='blobs';b.setAttribute('aria-hidden','true');
    b.innerHTML='<b></b><b></b><b></b>';host.insertBefore(b,host.firstChild);
    return [...b.children];
  });

  /* ============ INDEX PEEK ============ */
  (function peek(){
    const pk=$('#peek');if(!pk||coarse)return;
    const medias=$$('[data-key]',pk);
    let active=null,shown=false,px=mx,py=my;
    $$('.index .row').forEach(row=>{
      row.addEventListener('pointerenter',()=>{const k=row.dataset.peek;medias.forEach(m=>m.classList.toggle('on',m.dataset.key===k));pk.classList.add('show');shown=true;});
      row.addEventListener('pointerleave',()=>{pk.classList.remove('show');shown=false;});
    });
    const loop=()=>{px+=(mx-px)*.16;py+=(my-py)*.16;pk.style.left=px+'px';pk.style.top=py+'px';requestAnimationFrame(loop);};
    loop();
  })();

  /* ============ NAV + PROGRESS + SCROLL FX ============ */
  const nav=$('.mnav'),prog=$('.progress');
  const pins=$$('.pin').map(pin=>({pin,track:$('.pin__track',pin)}));
  const gutter=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter'))||40;
  const px=$$('[data-parallax]');
  const draws=$$('[data-draw]');
  draws.forEach(svg=>$$('path',svg).forEach(p=>{const L=p.getTotalLength();p.style.setProperty('--len',L);}));

  // skew marquees selon vélocité
  const marqs=$$('.mmarq__t');
  let lastY=scrollY,vel=0;

  function frameFx(){
    const y=scrollY;
    vel+=( (y-lastY) - vel)*.3; lastY=y;
    if(nav)nav.classList.toggle('solid',y>40);
    if(prog){const h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?y/h*100:0)+'%';}
    // pins
    pins.forEach(({pin,track})=>{if(!track)return;const r=pin.getBoundingClientRect();const total=pin.offsetHeight-innerHeight;const p=Math.min(Math.max(-r.top/total,0),1);const max=track.scrollWidth-innerWidth+gutter;track.style.transform=`translate3d(${-(max>0?max:0)*p}px,0,0)`;});
    if(!reduce){
      // parallax
      const vh=innerHeight;px.forEach(el=>{const r=el.getBoundingClientRect();const c=(r.top+r.height/2-vh/2)/vh;const sp=parseFloat(el.dataset.parallax)||.15;el.style.transform=`translateY(${c*sp*-150}px)`;});
      // skew marquee
      const sk=Math.max(-8,Math.min(8,vel*.35));
      marqs.forEach(m=>{m.style.transform=(m.style.transform.split(' skewX')[0]||'')+` skewX(${sk}deg)`;});
      // draw on scroll
      draws.forEach(svg=>{const r=svg.getBoundingClientRect();const p=Math.min(Math.max((innerHeight-r.top)/(innerHeight+r.height),0),1);$$('path',svg).forEach(path=>{const L=path.getTotalLength();path.style.strokeDashoffset=L*(1-p);});});
    }
    raf=requestAnimationFrame(frameFx);
  }
  let raf=requestAnimationFrame(frameFx);

  // blobs suivent légèrement le curseur
  if(!reduce&&blobHosts.length) addEventListener('pointermove',e=>{const nx=(e.clientX/innerWidth-.5),ny=(e.clientY/innerHeight-.5);blobHosts.forEach(bs=>{bs.forEach((b,i)=>{const f=(i+1)*14;b.style.transform=`translate(${nx*f}px,${ny*f}px)`;});});},{passive:true});

  /* ============ REVEAL + MASK + COUNTERS + SCRAMBLE ============ */
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    $$('[data-reveal],.mask').forEach(el=>io.observe(el));
    const cio=new IntersectionObserver((es)=>{es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,t=parseFloat(el.dataset.count),suf=el.dataset.suffix||'';const st=performance.now();const step=n=>{const p=Math.min((n-st)/1500,1);const v=t%1===0?Math.round(t*(1-Math.pow(1-p,3))):(t*(1-Math.pow(1-p,3))).toFixed(1);el.textContent=v+suf;if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);cio.unobserve(el);});},{threshold:.5});
    $$('[data-count]').forEach(el=>cio.observe(el));
    const glyphs='ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/*+0123456789';
    const sio=new IntersectionObserver((es)=>{es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,final=el.dataset.scramble;const st=performance.now(),dur=final.length*40;const tick=n=>{const p=(n-st)/dur,lock=Math.floor(p*final.length);let o='';for(let k=0;k<final.length;k++)o+=k<lock?final[k]:(final[k]===' '?' ':glyphs[Math.floor(Math.random()*glyphs.length)]);el.textContent=o;if(p<1)requestAnimationFrame(tick);else el.textContent=final;};requestAnimationFrame(tick);sio.unobserve(el);});},{threshold:.6});
    if(!reduce)$$('[data-scramble]').forEach(el=>sio.observe(el));else $$('[data-scramble]').forEach(el=>el.textContent=el.dataset.scramble);
  } else { $$('[data-reveal],.mask').forEach(el=>el.classList.add('in')); }

  /* ============ SON (Web Audio, discret) ============ */
  const Sound=(function(){
    let ctx,enabled = localStorage.getItem('mgh-sound')!=='off', last=0;
    const ensure=()=>{ try{ if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)(); if(ctx.state==='suspended') ctx.resume(); }catch(e){} };
    const blip=(freq,dur,vol,type)=>{ if(!enabled||!ctx) return; const o=ctx.createOscillator(),g=ctx.createGain(); o.type=type||'triangle'; o.frequency.value=freq; o.connect(g); g.connect(ctx.destination); const t=ctx.currentTime; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.008); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.start(t); o.stop(t+dur+0.02); };
    return {
      ensure,
      hover(){ const n=performance.now(); if(n-last<55) return; last=n; blip(1280+Math.random()*120,0.05,0.025,'triangle'); },
      click(){ ensure(); blip(620,0.10,0.05,'sine'); setTimeout(()=>blip(960,0.08,0.035,'sine'),45); },
      toggle(){ enabled=!enabled; localStorage.setItem('mgh-sound',enabled?'on':'off'); if(enabled){ensure();blip(880,0.08,0.04,'sine');} return enabled; },
      isOn(){ return enabled; }
    };
  })();
  // déblocage audio au 1er geste
  ['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>Sound.ensure(),{once:true}));
  // sons au survol
  if(!coarse) $$('a,button,.pcard,.film,.index .row,[data-magnetic]').forEach(el=>el.addEventListener('pointerenter',()=>Sound.hover()));

  // bouton SON dans la nav
  const navlinks=$('.mnav__links'), back=$('.mnav__back');
  if(navlinks){
    const btn=document.createElement('button');
    btn.className='sound-toggle'+(Sound.isOn()?' on':'');
    btn.setAttribute('aria-label','Activer / couper le son');
    btn.innerHTML='<span class="dot"></span> Son';
    btn.addEventListener('click',()=>{ const on=Sound.toggle(); btn.classList.toggle('on',on); });
    navlinks.insertBefore(btn, back||null);
  }

  /* ============ TRANSITIONS DE PAGE (rideau) ============ */
  const curtain=$('.curtain');
  // au retour (bfcache / bouton précédent), forcer l'état "révélé" pour éviter l'écran figé
  addEventListener('pageshow',e=>{ if(e.persisted){ if(curtain) curtain.classList.add('up'); const pre=$('.pre'); if(pre) pre.classList.add('hide'); document.body.style.overflow=''; } });
  if(curtain){
    $$('a[href]').forEach(a=>{
      const href=a.getAttribute('href');
      if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto')||a.target==='_blank') return;
      a.addEventListener('click',e=>{
        if(e.metaKey||e.ctrlKey||e.shiftKey) return;
        e.preventDefault();
        Sound.click();
        curtain.classList.remove('up'); // le rideau redescend
        const go=()=>{ location.href=a.href; };
        setTimeout(go, reduce?60:780);
      });
    });
  }
  // clic générique (boutons) -> son
  if(!coarse) $$('button:not(.sound-toggle)').forEach(b=>b.addEventListener('click',()=>Sound.click()));
})();
