const sections=[...document.querySelectorAll("main section")];
const scenes=[...document.querySelectorAll(".video-scene")];
const copies=[...document.querySelectorAll(".copy")];
const videos=[...document.querySelectorAll("video")];
const current=document.querySelector(".current");
const fill=document.querySelector(".progress b");
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let active=Math.max(0,Math.min(sections.length-1,Math.round(scrollY/innerHeight)));
let locked=false,touchY=0,timer;

function show(index,scroll=true){
  const next=Math.max(0,Math.min(sections.length-1,index)),previous=active;
  if(next===previous&&document.body.dataset.ready)return;
  active=next;document.body.dataset.ready="1";document.body.dataset.scene=String(next+1);clearTimeout(timer);
  copies.forEach((copy,i)=>copy.classList.toggle("active",i===next));
  scenes.forEach((scene,i)=>{scene.classList.remove("active","leaving");scene.style.zIndex=i===next?"3":"1"});
  if(previous!==next){scenes[previous].classList.add("leaving");scenes[previous].style.zIndex="2"}
  scenes[next].classList.add("active");
  videos.forEach((video,i)=>Math.abs(i-next)<=1?video.play().catch(()=>{}):video.pause());
  current.textContent=String(next+1).padStart(2,"0");fill.style.transform=`scaleY(${(next+1)/sections.length})`;
  timer=setTimeout(()=>scenes.forEach((scene,i)=>i!==active&&scene.classList.remove("leaving")),reduced?20:700);
  if(scroll)sections[next].scrollIntoView({behavior:reduced?"auto":"smooth"});
}
function move(direction){if(locked)return;const next=Math.max(0,Math.min(sections.length-1,active+direction));if(next===active)return;locked=true;show(next);setTimeout(()=>locked=false,reduced?80:950)}
addEventListener("wheel",e=>{e.preventDefault();if(Math.abs(e.deltaY)>8)move(e.deltaY>0?1:-1)},{passive:false});
addEventListener("keydown",e=>{if(["ArrowDown","PageDown"," "].includes(e.key)){e.preventDefault();move(1)}if(["ArrowUp","PageUp"].includes(e.key)){e.preventDefault();move(-1)}});
addEventListener("touchstart",e=>touchY=e.touches[0]?.clientY||0,{passive:true});
addEventListener("touchend",e=>{const d=touchY-(e.changedTouches[0]?.clientY||touchY);if(Math.abs(d)>45)move(d>0?1:-1)},{passive:true});
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",e=>{const target=document.querySelector(link.getAttribute("href")),i=sections.indexOf(target);if(i<0)return;e.preventDefault();show(i)}));
addEventListener("resize",()=>sections[active].scrollIntoView({behavior:"auto"}));
document.addEventListener("pointerdown",()=>videos[active]?.play().catch(()=>{}),{once:true});
show(active,false);
