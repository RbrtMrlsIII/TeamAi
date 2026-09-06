const parts=[...document.querySelectorAll('.spatial-part')];
let active=null;
function setPart(part){
  active=active===part?null:part;
  for(const el of parts){const on=el===active;el.classList.toggle('is-active',on);el.setAttribute('aria-pressed',String(on));}
  if(active){window.dispatchEvent(new CustomEvent('teamai:web-ai-spatial-part',{detail:{part:active.dataset.part,source:'hero'}}));}
}
for(const part of parts){part.addEventListener('click',()=>setPart(part));}
window.TeamAiHeroSpatial={getActivePart:()=>active?.dataset.part??null,setPart:(name)=>setPart(parts.find((part)=>part.dataset.part===name)??null)};
