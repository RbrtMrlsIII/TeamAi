import { applyResolvedCamera } from './hero-dom-action-map.js';
const parts=[...document.querySelectorAll('.spatial-part')];
let active=null;
const profiles=[
  {x:14,z:-5,d:18,phase:.0},
  {x:16,z:4,d:26,phase:1.8},
  {x:-12,z:8,d:22,phase:3.4}
];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion=reduced.matches;

function setPart(part){
  if(active===part){part.setAttribute('aria-pressed','false');active=null;return;}
  for(const p of parts)p.setAttribute('aria-pressed','false');
  part.setAttribute('aria-pressed','true');
  active=part;
  const id=part.dataset.part==='focus'?'SEAT_CLOSE':part.dataset.part==='history'?'WORKSPACE_CLOSE':'HERO_WIDE';
  {
  const hierarchyOpen = document.querySelector('.hero-shell')?.getAttribute('data-hero-machine-ui') === '1'
    || document.querySelector('.hero-shell')?.dataset?.hierarchyOpen === 'true';
  applyResolvedCamera(id, { hierarchyOpen });
}
}

for(const part of parts){part.addEventListener('click',()=>setPart(part));}
reduced?.addEventListener?.('change',event=>{reducedMotion=event.matches;});

window.TeamAiHeroParts={
  profiles:()=>profiles.slice(),
  active:()=>active?.dataset.part||null,
  reducedMotion:()=>reducedMotion
};
