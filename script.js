document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

// nav border + mobile sticky download button
const nav=$('#nav'), bar=$('.sticky-dl'), dl=$('#download');
addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',scrollY>10);
  const pastHero=scrollY>500, atDl=dl.getBoundingClientRect().top<innerHeight;
  bar.classList.toggle('show',pastHero&&!atDl);
},{passive:true});

// scroll reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.15});
$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});

// count-up stats
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return; co.unobserve(e.target);
  const el=$('b',e.target), end=+el.dataset.count, pre=el.dataset.prefix||'';
  if(calm||end===0){el.textContent=pre+end;return}
  const t0=performance.now();
  (function tick(t){const p=Math.min((t-t0)/1200,1);
    el.textContent=pre+Math.round(end*(1-Math.pow(1-p,3)));
    if(p<1)requestAnimationFrame(tick)})(t0);
}),{threshold:.6});
$$('.stats>div').forEach(d=>co.observe(d));

// tabs
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  $$('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
  $$('.panel').forEach(p=>p.hidden=p.id!==b.dataset.tab);
}));

// video: autoplay (muted, as browsers require) when visible, pause when scrolled away
const promo=$('#promo'), box=$('#videoBox');
let userPaused=false;
function videoError(){
  if($('.video-err',box))return;
  const m=document.createElement('p'); m.className='video-err';
  m.textContent='Sorry, the video could not be loaded. Check that animart-ad.mp4 is next to index.html and is an H.264 MP4.';
  box.append(m);
}
promo.muted=true;
promo.addEventListener('error',videoError);
promo.addEventListener('pause',()=>{userPaused=promo.dataset.auto!=='1'});
const vo=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting&&!userPaused){
    promo.dataset.auto='0';
    promo.play().catch(err=>console.warn('Autoplay blocked:',err.name));
  }else if(!e.isIntersecting&&!promo.paused){
    promo.dataset.auto='1';promo.pause();
  }
}),{threshold:.5});
vo.observe(promo);

// FAQ: only one open at a time
$$('.faq details').forEach(d=>d.addEventListener('toggle',()=>{
  if(d.open)$$('.faq details').forEach(o=>o!==d&&(o.open=false));
}));