const {chromium}=require('C:/Users/mussa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
const dir='D:/ATC/ATC_WEB/audit-output';fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:8000/index.html');await p.waitForTimeout(1800);
await p.screenshot({path:dir+'/desktop-entry.png'});
await p.locator('#gateway-close').click();await p.waitForTimeout(600);
await p.screenshot({path:dir+'/desktop-hero.png'});
for(const id of ['intro','engineering-divisions','trading-services','clients']){const el=p.locator('#'+id);if(await el.count()){await el.scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:dir+'/'+id+'.png'});}}
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(400);await p.screenshot({path:dir+'/footer.png'});
const info=await p.evaluate(()=>({text:document.body.innerText,sections:[...document.querySelectorAll('main section')].map(e=>({id:e.id,height:e.offsetHeight})),links:[...document.querySelectorAll('a')].map(e=>({text:e.innerText,href:e.getAttribute('href')})),images:[...document.images].map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0})),height:document.body.scrollHeight}));
await p.setViewportSize({width:390,height:844});await p.reload();await p.waitForTimeout(1200);await p.screenshot({path:dir+'/mobile-entry.png'});await p.locator('#gateway-close').click();await p.waitForTimeout(400);await p.screenshot({path:dir+'/mobile-hero.png'});
info.mobile=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));info.errors=errors;fs.writeFileSync(dir+'/observations.json',JSON.stringify(info,null,2));
await p.locator('#hamburger').click();await p.screenshot({path:dir+'/mobile-menu.png'});
await b.close();console.log(JSON.stringify(info));
})();
