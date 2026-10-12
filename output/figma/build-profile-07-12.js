const page=await figma.getNodeByIdAsync('0:1'); await figma.setCurrentPageAsync(page);
page.name='ATC / Company Profile';
await Promise.all([{family:'Archivo',style:'Bold'},{family:'Archivo',style:'ExtraBold'},{family:'IBM Plex Sans',style:'Regular'},{family:'IBM Plex Sans',style:'Medium'},{family:'IBM Plex Mono',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const ids=[page.id], frames=[], images=[];
const C={ink:'#111216',white:'#F5F3EF',orange:'#E85D2A',muted:'#ADB0B5',gray:'#51545B',line:'#D6D3CD',panel:'#202228'};
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const fill=h=>[{type:'SOLID',color:rgb(h)}];
function track(n){ids.push(n.id);return n;}
function rect(p,x,y,w,h,color){const n=track(figma.createRectangle());p.appendChild(n);n.x=x;n.y=y;n.resize(w,h);n.fills=fill(color);return n;}
function text(p,str,size,color,width,weight='Regular',family='IBM Plex Sans') {const t=track(figma.createText());p.appendChild(t);t.fontName={family,style:weight};t.fontSize=size;t.lineHeight={unit:'PIXELS',value:size*1.36};t.fills=fill(color);t.characters=str;t.resize(width,Math.max(size*1.36,t.height));t.textAutoResize='HEIGHT';return t;}
function stack(p,x,y,w,gap=12){const n=track(figma.createAutoLayout('VERTICAL'));p.appendChild(n);n.name='Editorial text group';n.x=x;n.y=y;n.resize(w,10);n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.itemSpacing=gap;n.fills=[];return n;}
function label(p,str,w=507,col=C.orange){const t=text(p,str,8,col,w,'Regular','IBM Plex Mono');t.letterSpacing={unit:'PIXELS',value:1.3};return t;}
function title(p,str,w=507,size=35,col=C.ink){return text(p,str,size,col,w,'ExtraBold','Archivo');}
function body(p,str,w=507,col=C.gray,size=11){return text(p,str,size,col,w);}
function photo(p,x,y,w,h,path,name){const n=rect(p,x,y,w,h,C.panel);n.name=name;images.push({nodeId:n.id,path});return n;}
function galleryPath(n){return 'D:/ATC/ATC_WEB/assests/gallery/full/project-'+String(n).padStart(3,'0')+'.webp';}
function make(num,name,dark=false){const f=track(figma.createFrame());page.appendChild(f);f.name=String(num).padStart(2,'0')+' / '+name;f.resize(595.28,841.89);f.x=100+((num-1)%4)*695.28;f.y=100+Math.floor((num-1)/4)*941.89;f.fills=fill(dark?C.ink:C.white);f.clipsContent=true;f.exportSettings=[{format:'PDF'}];frames.push({id:f.id,name:f.name});
const head=stack(f,44,27,507,3);label(head,'ATC  /  COMPANY PROFILE',507,dark?C.muted:C.gray);
rect(f,44,51,507,1,dark?C.panel:C.line);rect(f,44,794,507,1,dark?C.panel:C.line);
const ft=stack(f,44,806,450,0);text(ft,'AZAAN TRADING & CONTRACTING',7,dark?C.muted:C.gray,450,'Regular','IBM Plex Mono');const pg=stack(f,519,804,32,0);text(pg,String(num).padStart(2,'0'),9,C.orange,32,'Regular','IBM Plex Mono');return f;}
function heading(p,kicker,headline,desc,dark=false){const s=stack(p,44,83,507,12);label(s,kicker);title(s,headline,507,35,dark?C.white:C.ink);if(desc)body(s,desc,507,dark?C.muted:C.gray);return s;}
function block(p,x,y,w,num,head,desc,dark=false){const s=stack(p,x,y,w,8);label(s,num,w);text(s,head,17,dark?C.white:C.ink,w,'Bold','Archivo');body(s,desc,w,dark?C.muted:C.gray,10.5);return s;}


let s;
let f=make(7,'Operations and lifecycle support',true);heading(f,'06 / LIFECYCLE SERVICES','Performance beyond\nproject handover.','Long-term operational support, preventive maintenance and technical procurement.',true);
photo(f,44,257,507,229,galleryPath(22),'Outdoor refrigeration installation');
block(f,44,516,240,'OPERATIONS & MAINTENANCE','Keep critical assets working','Substations, generators, HVAC, firefighting and water systems. Annual maintenance contracts, preventive programs and technical support.',true);
block(f,312,516,239,'TRADING & PROCUREMENT','The right equipment.\nThe right support.','Electrical and mechanical equipment; switchgear and transformers; HVAC, fire and plumbing materials; industrial safety equipment and spare parts.',true);
s=stack(f,44,718,507,6);label(s,'DESIGN > PROCURE > BUILD > COMMISSION > MAINTAIN');

f=make(8,'Saudi collaboration and references');heading(f,'07 / INTERNATIONAL EXPERIENCE','Saudi experience.\nShared capability.','SPC-KSA brings engineering supervision, operational discipline and project experience to the ATC collaboration.');
photo(f,44,254,507,151,galleryPath(13),'Residential construction / SPC company profile');
s=stack(f,44,421,507,3);label(s,'SELECTED SPC-KSA EXPERIENCE',507,C.gray);
const refs=[['American military facilities','Electrical and HVAC maintenance, camp infrastructure and power distribution support.'],['Herfy Foods Company','HVAC, chillers, industrial exhaust and Greenheck ventilation systems.'],['Crown Gulf / Badoor Al Emar','Transformer and RMU works, electrical testing, MV infrastructure and civil support.'],['ROSHAN Villas / NEOM power generation','Villa construction, structural works and site coordination; technical participation in substation and transformer support.']];
for(let i=0;i<refs.length;i++){const y=453+i*72;const g=stack(f,44,y,507,5);text(g,refs[i][0],13,C.ink,507,'Bold','Archivo');body(g,refs[i][1],507,C.gray,10);if(i<3)rect(f,44,y+62,507,1,C.line);}

f=make(9,'Pakistan and client experience');heading(f,'08 / PAKISTAN OPERATIONS','Local knowledge.\nPractical execution.','Infrastructure development, facility engineering and technical services for Pakistan’s public, private and industrial sectors.');
rect(f,44,259,507,186,C.ink);s=stack(f,64,280,467,12);label(s,'KEY CLIENT EXPERIENCE',467);text(s,'Army Welfare Trust',29,C.white,467,'Bold','Archivo');body(s,'Our work with Army Welfare Trust includes renovation, infrastructure upgrades and technical maintenance within AWT-owned and operated facilities.',467,C.muted,11);
block(f,44,478,240,'01','Civil & facility upgrades','Roads, underground electricity, drainage, sewerage, lighting poles and building renovation.');
block(f,312,478,239,'02','MEP & maintenance','Mechanical, electrical, plumbing and HVAC works, supported by facility maintenance services.');
rect(f,44,630,507,1,C.line);s=stack(f,44,654,507,11);label(s,'WIDER OPERATIONAL FOCUS');body(s,'Power distribution, industrial maintenance, fuel infrastructure, high-rise construction, secure facilities and smart systems. Local delivery is supported by engineering consultancy, architectural planning and design services.',507);

f=make(10,'Project photography');heading(f,'09 / IN PICTURES','The work.\nThe detail.','Selected photographs from the supplied project collection and SPC company profile.');
const shots=[[3,'Industrial facilities'],[19,'Structural construction'],[1,'Landscape & finishing'],[66,'Electrical installations'],[22,'Mechanical equipment'],[61,'Site execution']];
for(let i=0;i<shots.length;i++){const x=44+(i%2)*261;const y=259+Math.floor(i/2)*171;photo(f,x,y,246,136,galleryPath(shots[i][0]),shots[i][1]);const cap=stack(f,x,y+143,246,0);label(cap,String(i+1).padStart(2,'0')+' / '+shots[i][1].toUpperCase(),246,C.gray);}

f=make(11,'People quality and responsibility',true);heading(f,'10 / DELIVERY STANDARDS','People. Process.\nResponsibility.','Technical capability is supported by clear supervision, coordinated teams and consistent operating practices.',true);
block(f,44,254,240,'QUALITY & SAFETY','Built into the work','ISO-aligned quality procedures; health, safety and environmental compliance; preventive safety systems; a zero-accident target; OEM-standard maintenance and energy-efficient solutions.',true);
block(f,312,254,239,'ORGANIZATION','Specialists, working together','Civil, electrical, mechanical, oil and gas, defense and smart-system teams, supported by procurement, finance, HR, administration, health, safety and quality functions.',true);
rect(f,44,487,507,1,C.panel);
s=stack(f,44,512,507,12);label(s,'2025-2030 / FUTURE OUTLOOK');text(s,'A regional engineering\nand contracting alliance.',25,C.white,507,'Bold','Archivo');body(s,'ATC and SPC-KSA aim to expand across secure infrastructure, power and energy, industrial and petroleum services, renewable energy, smart systems and construction in Pakistan.',507,C.muted,11);
rect(f,44,701,507,53,C.orange);s=stack(f,60,716,475,0);text(s,'Integrity. Safety. Technical precision.',15,C.ink,475,'Bold','Archivo');

f=make(12,'The next chapter',true);
photo(f,0,63,595.28,363,galleryPath(9),'Industrial facility / final spread');rect(f,0,405,595.28,389,C.ink);rect(f,44,405,96,5,C.orange);
s=stack(f,44,442,507,17);label(s,'AZAAN TRADING & CONTRACTING');title(s,'Let’s build\nwhat comes next.',507,47,C.white);body(s,'Engineering excellence. Global standards.\nNational commitment.',507,C.muted,13);
const end=stack(f,44,689,507,11);label(end,'PAKISTAN  /  STRATEGIC COLLABORATION WITH SPC-KSA');body(end,'Civil construction  •  Building systems  •  Technical services',507,C.white,11);
return {createdNodeIds:ids,frames,images,pageId:page.id};
