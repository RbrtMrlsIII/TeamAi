const shell=document.querySelector('.hero-shell');
if(shell){
  const sync=()=>{
    const n=Math.max(1,Math.min(8,Number(window.TeamAiHero?.getSeatCount?.())||1));
    shell.dataset.seats=String(n);
    shell.style.setProperty('--hero-density',String((n-1)/7));
    shell.style.setProperty('--hero-seat-glow',String(.10+((n-1)/7)*.13));
  };
  const onUnlock=()=>sync();
  window.addEventListener('teamai:web-ai-seat-unlocked',onUnlock);
  const timer=window.setInterval(sync,240);
  window.addEventListener('beforeunload',()=>{clearInterval(timer);window.removeEventListener('teamai:web-ai-seat-unlocked',onUnlock);},{once:true});
  sync();
}
