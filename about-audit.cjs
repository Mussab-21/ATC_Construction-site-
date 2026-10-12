const {chromium}=require('C:/Users/mussa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),crypto=require('crypto');
(async()=>{
const dir='D:/ATC/ATC_WEB/audit-output/about';fs.mkdirSync(dir,{recursive:true});
for(const f of ['about.html','index.html','css/pages/about.css','css/base.css','css/components.css','js/main.js','css/variables.css','css/animations.css']){const raw=fs.readFileSync('D:/ATC/ATC_WEB/'+f,'utf8').replace(/\r\n/g,'\n');const buf=Buffer.from(raw);console.log('hash',f,crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+buf.length+'\0'),buf])).digest('hex'));}
const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8000/about.html');await p.waitForTimeout(700);
await p.screenshot({path:dir+'/desktop-hero.png'});
for(const id of ['story','vision','values','why','structure','about-cta']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:dir+'/'+id+'.png'});}
const info=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.body.scrollHeight,sections:[...document.querySelectorAll('main section')].map(e=>({id:e.id,height:e.offsetHeight})),images:[...document.images].map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0}))}));
const card=p.locator('.value-card').first();await card.focus();await p.keyboard.press('Enter');info.valueKeyboard=await card.getAttribute('aria-expanded');
const org=p.locator('.org-card').first();await org.focus();await p.keyboard.press('Enter');info.orgKeyboard=await org.getAttribute('aria-expanded');
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);await p.screenshot({path:dir+'/mobile-hero.png'});
await p.locator('#structure').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.screenshot({path:dir+'/mobile-structure.png'});
info.mobile=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.body.scrollHeight}));info.errors=errors;fs.writeFileSync(dir+'/observations.json',JSON.stringify(info,null,2));console.log(JSON.stringify(info));await b.close();})();
