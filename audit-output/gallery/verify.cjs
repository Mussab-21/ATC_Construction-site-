const {chromium}=require('C:/Users/mussa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:8000/projects.html',{waitUntil:'networkidle'});
await page.locator('[data-curated-index]').first().waitFor();
await page.locator('#gallery-section').scrollIntoViewIfNeeded();
await page.screenshot({path:'audit-output/gallery/desktop.png'});
const initial=await page.locator('[data-curated-index]').count();
await page.locator('[data-curated-index="0"]').click();
await page.locator('#lightbox-img').evaluate(img=>img.decode());
await page.keyboard.press('ArrowLeft');
const wrap=await page.locator('#lightbox-counter').innerText();
await page.keyboard.press('ArrowRight');
await page.screenshot({path:'audit-output/gallery/lightbox.png'});
await page.keyboard.press('Escape');
const focusReturned=await page.locator('[data-curated-index="0"]').evaluate(el=>el===document.activeElement);
while(await page.locator('#gallery-load-more').isVisible()) await page.locator('#gallery-load-more').click();
const count=await page.locator('[data-curated-index]').count();
const photos=JSON.parse(fs.readFileSync('data/gallery.json','utf8'));
for(const photo of photos)for(const key of ['thumbnail','src']){const r=await page.request.get('http://localhost:8000/'+photo[key]);if(!r.ok())throw new Error(photo[key]);}
await page.locator('[data-curated-index="89"]').click();
await page.locator('#lightbox-img').evaluate(img=>img.decode());
const last=await page.locator('#lightbox-counter').innerText();await page.keyboard.press('Escape');
const widths=[];
for(const width of [390,768,1440]){
await page.setViewportSize({width,height:900});await page.locator('#gallery-section').scrollIntoViewIfNeeded();
widths.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,columns:getComputedStyle(document.getElementById('gallery-grid')).columnCount})));
await page.screenshot({path:`audit-output/gallery/gallery-${width}.png`});
}
const result={initial,count,wrap,last,focusReturned,widths,errors,filters:await page.locator('[data-gallery-filter]').count(),validatedImageURLs:photos.length*2};
fs.writeFileSync('audit-output/gallery/verification.json',JSON.stringify(result,null,2));console.log(result);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
