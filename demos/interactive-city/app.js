/* React owns the editorial homepage; Three.js owns the interactive scene. */
const h=React.createElement;
function Icon({name}){return h('svg',{className:'ui-icon',viewBox:'0 0 24 24',fill:'none','aria-hidden':true},...(window.cityIcons[name]||[]).map(([tag,attrs])=>h(tag,attrs)))}
function CityIntroduction(){
  const [place,setPlace]=React.useState('沿锦江，遇见成都');
  React.useEffect(()=>{const listener=e=>setPlace(e.detail);window.addEventListener('city:select',listener);return()=>window.removeEventListener('city:select',listener)},[]);
  return h(React.Fragment,null,
    h('div',{className:'eyebrow'},'PARK CITY · CHINA'),
    h('div',{className:'english-title'},'CHENGDU'),
    h('h1',null,'成都',h('span',null,'一城山水，半城烟火。')),
    h('p',{className:'description'},'在青瓦与高楼之间，让锦江慢慢流过。',h('br'),'走进竹影、桥廊和街巷，发现这座公园城市的日常。'),
    h('button',{id:'explore',onClick:()=>window.dispatchEvent(new CustomEvent('city:explore'))},'Explore City',h(Icon,{name:'arrow'})),
    h('div',{className:'city-facts'},h('div',null,h(Icon,{name:'wave'}),h('strong',null,'锦江'),h('small',null,'RIVER OF LIFE')),h('div',null,h(Icon,{name:'tree'}),h('strong',null,'天府'),h('small',null,'LAND OF ABUNDANCE'))),
    h('div',{className:'intro-foot'},h('span',{className:'live-dot'}),place)
  )
}
ReactDOM.flushSync(()=>ReactDOM.createRoot(document.getElementById('intro-root')).render(h(CityIntroduction)));
