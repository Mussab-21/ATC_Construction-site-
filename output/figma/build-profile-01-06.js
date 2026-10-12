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

let f=make(1,'Engineering excellence',true);
photo(f,0,180,595.28,424,galleryPath(3),'Cover / industrial architecture');
rect(f,0,520,595.28,274,C.ink);
photo(f,42,63,92,92,'D:/ATC/ATC_WEB/assests/logo/ATC Construction Crane Logo.png','ATC brand logo');
let s=stack(f,155,78,390,9);label(s,'CORPORATE PROFILE  /  2026',390);text(s,'Azaan Trading &\nContracting Company',18,C.white,390,'Bold','Archivo');
s=stack(f,44,548,507,16);label(s,'ENGINEERING. CONSTRUCTION. TECHNICAL SERVICES.');title(s,'Engineering excellence.\nBuilt on trust.',507,36,C.white);body(s,'Global standards. National commitment.\nIn strategic collaboration with SPC-KSA.',507,C.muted,12);
rect(f,44,520,96,5,C.orange);

f=make(2,'Who we are');heading(f,'01 / THE COMPANY','Local commitment.\nInternational capability.','Pakistan-based engineering, construction and technical services, backed by strategic collaboration with SPC-KSA.');
s=stack(f,44,267,282,13);body(s,'Azaan Trading & Contracting Company brings together local engineering teams and Saudi operational experience to support infrastructure, industrial facilities and commercial developments.',282);body(s,'From design and procurement to construction, commissioning and long-term maintenance, our focus is disciplined delivery, technical precision and lasting client partnerships.',282);
photo(f,350,268,201,228,galleryPath(60),'Reinforcement / site operations');
rect(f,44,527,507,207,C.ink);s=stack(f,62,547,470,12);label(s,'INSIDE THIS PROFILE',470);const rows=[['03','Vision, mission & values'],['04-07','Engineering & lifecycle services'],['08-10','Experience & project photography'],['11-12','People, standards & the next chapter']];for(const [n,t]of rows){text(s,n+'   /   '+t,11,C.white,470,'Medium');}

f=make(3,'Vision mission and values',true);heading(f,'02 / OUR DIRECTION','Precision in our work.\nIntegrity in our purpose.','A clear ambition, supported by practical commitments.',true);
block(f,44,261,240,'VISION','A trusted engineering partner','To establish ATC among Pakistan’s most reliable and technically capable contracting companies, combining Saudi engineering expertise with international project standards.',true);
block(f,312,261,239,'MISSION','Deliver with confidence','To deliver engineering, infrastructure and maintenance services with integrity, safety, efficiency and technical precision, while building long-term client partnerships.',true);
rect(f,44,493,507,1,C.panel);s=stack(f,44,521,507,15);label(s,'THE VALUES THAT GUIDE DELIVERY');for(const v of ['01   Integrity & accountability','02   Technical excellence','03   Safety & sustainability','04   Innovation & reliability','05   Partnership & long-term value'])text(s,v,14,C.white,507,'Medium');

f=make(4,'Civil and infrastructure');heading(f,'03 / ENGINEERING CAPABILITIES','Strong foundations.\nConsidered construction.','Civil and infrastructure works for industrial, commercial and residential environments.');
photo(f,44,254,507,231,galleryPath(19),'Structural reinforcement');
block(f,44,519,240,'01','Buildings & structures','Industrial and commercial buildings, warehouses, structural concrete and steelwork.');
block(f,312,519,239,'02','Site infrastructure','Roads, boundary walls, drainage, sewerage and supporting site services.');
block(f,44,651,240,'03','Renovation & upgrades','Facility renovation, structural upgrades and improvements to existing assets.');
block(f,312,651,239,'04','Design & coordination','Engineering consultancy, architectural planning, interior design and site supervision.');

f=make(5,'Power mechanical and HVAC',true);heading(f,'04 / BUILDING SYSTEMS','Power that performs.\nSystems that work.','Coordinated electrical and mechanical services for reliable building and facility operation.',true);
photo(f,44,261,245,208,galleryPath(66),'Electrical distribution equipment');photo(f,306,261,245,208,galleryPath(90),'Mechanical services pipework');
block(f,44,499,240,'ELECTRICAL & POWER','From distribution to backup','MV/LV networks; transformers and RMUs; substation installation, testing and maintenance; power cabling; generators; lighting and electrical automation.',true);
block(f,312,499,239,'MECHANICAL & HVAC','Comfort, control & protection','HVAC, chillers and ventilation; cold storage and walk-in freezers; industrial exhaust; wet and dry firefighting; piping, plumbing and equipment maintenance.',true);
s=stack(f,44,704,507,8);label(s,'DESIGN  /  INSTALLATION  /  TESTING  /  MAINTENANCE');

f=make(6,'Specialist infrastructure');heading(f,'05 / SPECIALIST CAPABILITIES','Integrated thinking.\nSpecialist delivery.','Engineering support for demanding operating environments.');
block(f,44,254,240,'01','Oil, gas & petroleum','Petrol pump civil works, fuel tanks and dispensing systems, pipelines, pumping systems, calibration and depot upgrades.');
block(f,312,254,239,'02','Defense infrastructure','Camp infrastructure, power and HVAC maintenance, communication installations, access control and secure facility support.');
rect(f,44,441,507,1,C.line);
block(f,44,473,240,'03','Smart infrastructure','Data center infrastructure, CCTV, access control, building automation, fiber networks and backup power systems.');
block(f,312,473,239,'04','Industrial maintenance','Electrical and mechanical maintenance, equipment overhaul, system upgrades, preventive programs and technical contracts.');
rect(f,44,674,507,69,C.orange);s=stack(f,60,691,475,6);text(s,'Technical discipline across every interface.',16,C.ink,475,'Bold','Archivo');

return {createdNodeIds:ids,frames,images,pageId:page.id};
