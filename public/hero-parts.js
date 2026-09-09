import { applyResolvedCamera } from './hero-dom-action-map.js';
const parts=[...document.querySelectorAll('.spatial-part')];
let active=null;
const profiles=[
  {x:14,z:-5,d:18,phase:.0},
  {x:16,z:4,d:26,phase:1.8},
  {x:18,z:-1,d:22,phase:3.4},
];
const cameraForPart={surface:'WORKSPACE_CLOSE',focus:'SEAT_CLOSE',history:'DETAIL_ANCHOR'};
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
let reducedMotion=Boolean(reduced?.matches);
function focusCamera(name){
  const id=cameraForPart[name];
  if(!id)return;
  const hierarchyOpen = document.querySelector('.hero-shell')?.getAttribute('data-hero-machine-ui') === '1'
    || document.querySelector('.hero-shell')?.dataset?.hierarchyOpen === 'true';
  applyResolvedCamera(id, { hierarchyOpen });
}
function setPart(part){
  active=active===part?null:part;
  for(const el of parts){const on=el===active;el.classList.toggle('is-active',on);el.setAttribute('aria-pressed',String(on));}
  if(active){
    window.dispatchEvent(new CustomEvent('teamai:web-ai-spatial-part',{detail:{part:active.dataset.part,source:'hero'}}));
    focusCamera(active.dataset.part);
  }
}
for(const part of parts){part.addEventListener('click',()=>setPart(part));}
reduced?.addEventListener?.('change',event=>{reducedMotion=event.matches;});
function animateParts(now){
  const t=now*.001;
  for(let i=0;i<parts.length;i++){
    const el=parts[i],p=profiles[i]??profiles[0],isActive=el===active;
    const drift=reducedMotion?0:(isActive?.18:1);
    const dx=Math.sin(t*.62+p.phase)*1.05*drift;
    const dz=Math.cos(t*.47+p.phase)*.72*drift;
    const breathe=(Math.sin(t*.81+p.phase*.7)+1)*.5*2.4*drift;
    el.style.setProperty('--rest-x',`${p.x}`);
    el.style.setProperty('--rest-z',`${p.z}`);
    el.style.setProperty('--rest-d',`${p.d+breathe}`);
    el.style.setProperty('--drift-x',`${dx}`);
    el.style.setProperty('--drift-z',`${dz}`);
  }
  requestAnimationFrame(animateParts);
}
requestAnimationFrame(animateParts);
window.TeamAiHeroSpatial={getActivePart:()=>active?.dataset.part??null,setPart:(name)=>setPart(parts.find((part)=>part.dataset.part===name)??null),getMotionState:()=>reducedMotion?'reduced':'ambient',getCameraForPart:(name)=>cameraForPart[name]??null};
