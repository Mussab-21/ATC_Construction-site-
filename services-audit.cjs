const {chromium}=require('C:/Users/mussa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
const dir='D:/ATC/ATC_WEB/audit-output/services';fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
const info={widths:[],inquiries:[]};
for(const width of [1440,390,360,768]){
await p.setViewportSize({width,height:width===1440?1000:844});await p.goto('http://localhost:8000/services.html');await p.waitForTimeout(1100);
await p.screenshot({path:dir+'/'+width+'-hero.png'});
info.widths.push(await p.evaluate(()=>({width:innerWidth,height:document.body.scrollHeight,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&& (r.right>innerWidth+2||r.left< -2)}).slice(0,20).map(e=>({tag:e.tagName,cls:e.className.baseVal??e.className,text:e.textContent.trim().slice(0,60),right:e.getBoundingClientRect().right}))})));
if(width===1440){
for(const id of ['design','civil','electrical','finishing','security','defense','consultancy','trading']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.waitForTimeout(1000);await p.screenshot({path:dir+'/'+id+'.png'});}
info.sections=await p.locator('main section').evaluateAll(es=>es.map(e=>({id:e.id,title:e.querySelector('h2')?.textContent,height:e.offsetHeight})));
info.images=await p.locator('img').evaluateAll(es=>es.map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0,width:e.naturalWidth,loading:e.loading})));
info.ctas=await p.locator('.service-media-card__btn').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),href:e.getAttribute('href'),color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor,font:getComputedStyle(e).fontSize})));
info.resources=await p.evaluate(()=>performance.getEntriesByType('resource').map(e=>({name:e.name,bytes:e.transferSize,duration:e.duration})));
}
if(width===390){await p.locator('#design').scrollIntoViewIfNeeded();await p.waitForTimeout(1000);await p.screenshot({path:dir+'/mobile-design.png'});await p.locator('#hamburger').click();info.menu=await p.locator('#hamburger').getAttribute('aria-expanded');await p.screenshot({path:dir+'/mobile-menu.png'});}
}
for(const c of info.ctas){await p.goto('http://localhost:8000/'+c.href);info.inquiries.push({href:c.href,selected:await p.locator('#service-division').inputValue()});}
await p.goto('http://localhost:8000/index.html');info.homeServices=await p.locator('.services-carousel-slide').evaluateAll(es=>es.map(e=>({title:e.querySelector('h3')?.textContent,description:e.querySelector('p')?.textContent,href:e.getAttribute('href')})));
info.errors=errors;fs.writeFileSync(dir+'/observations.json',JSON.stringify(info,null,2));console.log(JSON.stringify({...info,resources:undefined},null,2));await b.close();
})();
