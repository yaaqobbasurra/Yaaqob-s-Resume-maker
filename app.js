(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const MM=96/25.4,PW=210*MM,PH=297*MM,GAP=18,MG=12*MM;           // A4 in CSS px, page gap, page margin
const FF=['"Noto Sans Arabic",Arial,Helvetica,sans-serif','"Noto Naskh Arabic",Georgia,"Times New Roman",serif','"Noto Sans Arabic",Verdana,Tahoma,sans-serif'];
const TPL=['classic','modern','minimal','bold'];
const TY=['header','summary','education','experience','projects','volunteer','skills','languages','certs','custom'];
const KIND={header:'h',summary:'t',custom:'t',education:'e',experience:'e',projects:'e',volunteer:'e',skills:'l',languages:'l',certs:'u'};
const D={
 en:{dir:'ltr',
  ui:{print:'Print / PDF',tools:'Tools',design:'Design',font:'Font',accent:'Accent',size:'Text size',secs:'Sections',add:'Add',sel:'Selected section',w:'Text width',h:'Text height',dupe:'Duplicate entry',dele:'Delete entry',samp:'Reset to sample',plus:'Add another entry',confirm:'Tap again to erase all',fit:'Fits on 1 page ✓',over:n=>`${n} pages: shorten the text or reduce its size`,tpl:['Classic','Modern','Minimal','Bold'],ff:['Sans','Serif','Rounded']},
  t:{header:'Header',summary:'Summary',education:'Education',experience:'Experience',projects:'Projects',volunteer:'Volunteering',skills:'Skills',languages:'Languages',certs:'Certificates',custom:'Custom section'},
  s:{name:'Your Full Name',contact:'City, Country | +966 5X XXX XXXX | name@email.com',text:'Write two or three sentences about who you are, your strengths and the role you want.',
   e:{education:['Diploma or Degree, School Name, City','2023 – 2026','Major or track | Grade','Relevant coursework or honors','Achievement or activity'],
      experience:['Job Title, Company, City','Jun 2025 – Aug 2025','','Describe what you did and the result','Add a number to show impact'],
      x:['Name','2025','Your role','What you did','The result']},
   sk:['Technical: Word, Excel, Google Workspace','Professional: Communication, teamwork, time management'],ln:['Arabic: native','English: fluent'],c:['Certificate name, Issuer, Year','Course name, Provider, Year']}},
 ar:{dir:'rtl',
  ui:{print:'طباعة / PDF',tools:'الأدوات',design:'التصميم',font:'الخط',accent:'اللون',size:'حجم الخط',secs:'الأقسام',add:'إضافة',sel:'القسم المحدد',w:'عرض النص',h:'ارتفاع النص',dupe:'نسخ الإدخال',dele:'حذف الإدخال',samp:'العودة إلى النموذج',plus:'إضافة إدخال آخر',confirm:'اضغط مرة أخرى للمسح',fit:'تتسع في صفحة واحدة ✓',over:n=>`المحتوى يمتد على ${n} صفحات: اختصر النص أو صغّر الخط`,tpl:['كلاسيكي','عصري','بسيط','جريء'],ff:['سانس','سيريف','مدور']},
  t:{header:'الترويسة',summary:'الملخص المهني',education:'التعليم',experience:'الخبرة العملية',projects:'المشاريع',volunteer:'التطوع',skills:'المهارات',languages:'اللغات',certs:'الشهادات',custom:'قسم مخصص'},
  s:{name:'الاسم الكامل',contact:'المدينة، السعودية | <bdi dir="ltr">+966 5X XXX XXXX</bdi> | <bdi dir="ltr">name@email.com</bdi>',text:'اكتب جملتين أو ثلاثًا عن نفسك ونقاط قوتك والوظيفة التي تريدها.',
   e:{education:['الشهادة، اسم المدرسة، المدينة','2023 – 2026','المسار | المعدل','المواد ذات الصلة أو التكريم','إنجاز أو نشاط'],
      experience:['المسمى الوظيفي، الشركة، المدينة','يونيو 2025 – أغسطس 2025','','اكتب ما قمت به والنتيجة','أضف رقمًا يوضح الأثر'],
      x:['الاسم','2025','دورك','ما قمت به','النتيجة']},
   sk:['تقنية: وورد، إكسل، خدمات جوجل','مهنية: التواصل، العمل الجماعي، إدارة الوقت'],ln:['العربية: لغة أم','الإنجليزية: بطلاقة'],c:['اسم الشهادة، الجهة، السنة','اسم الدورة، الجهة، السنة']}}
};
const S={lang:'en',tpl:0,ac:'#1f4e79',ff:0,fs:10.5,z:1,dirty:0};
const sheet=$('#sheet'),scaler=$('#scaler'),stat=$('#stat'),T=()=>D[S.lang].ui;
let sel=null,cur=null,sc=1,tm;

/* ---------- sections ---------- */
function ent(type){   // a blank entry (placeholder text only, never a copy of what you wrote)
  const e=D[S.lang].s.e[type]||D[S.lang].s.e.x;
  return `<div class="entry"><div class="row"><h3>${e[0]}</h3><span class="date">${e[1]}</span></div>${e[2]?`<p class="sub">${e[2]}</p>`:''}<ul><li>${e[3]}</li><li>${e[4]}</li></ul></div>`;
}
function mk(type){
  const l=D[S.lang],s=l.s,k=KIND[type],h=`<h2>${l.t[type]}</h2>`;
  if(k=='h')return `<h1>${s.name}</h1><p class="contact">${s.contact}</p>`;
  if(k=='t')return h+`<p>${s.text}</p>`;
  if(k=='e')return h+ent(type);
  if(k=='l')return h+(type=='skills'?s.sk:s.ln).map(x=>`<p>${x}</p>`).join('');
  return h+`<ul>${s.c.map(x=>`<li>${x}</li>`).join('')}</ul>`;
}
function addSec(type,html,sx='1',sy='1'){
  const e=document.createElement('section');
  e.className='sec';e.dataset.type=type;e.dataset.sx=sx;e.dataset.sy=sy;
  e.style.setProperty('--sx',sx);e.style.setProperty('--sy',sy);
  e.innerHTML=`<div class="inner" contenteditable="true" spellcheck="true">${html??mk(type)}</div>`+
    (KIND[type]=='e'?`<button class="plus" type="button" title="${T().plus}">+</button>`:'');
  return e;
}
function sample(){
  sheet.replaceChildren(...['header','summary','education','experience','skills','certs'].map(t=>addSec(t)));
  S.dirty=0;
}

/* ---------- save / load ---------- */
const save=()=>{try{localStorage.setItem('cvmaker1',JSON.stringify({S,c:$$('.sec').map(e=>[e.dataset.type,e.firstChild.innerHTML,e.dataset.sx,e.dataset.sy])}))}catch(e){}};
function load(){
  try{const d=JSON.parse(localStorage.getItem('cvmaker1'));Object.assign(S,d.S);
    sheet.replaceChildren(...d.c.map(c=>addSec(c[0],c[1],c[2],c[3])));return}catch(e){}
  sample();
}

/* ---------- UI ---------- */
const fill=(id,arr,v)=>{const s=$(id);s.innerHTML=arr.map((x,i)=>`<option value="${i}">${x}</option>`).join('');s.value=v};
function style(){
  sheet.dir=D[S.lang].dir;sheet.className='sheet t-'+TPL[S.tpl];
  sheet.style.setProperty('--ac',S.ac);sheet.style.setProperty('--ff',FF[S.ff]);sheet.style.setProperty('--fs',S.fs+'pt');
}
function apply(){
  const l=D[S.lang],u=l.ui;
  document.documentElement.lang=S.lang;document.documentElement.dir=l.dir;
  $$('[data-i]').forEach(e=>e.textContent=u[e.dataset.i]);
  fill('#tpl',u.tpl,S.tpl);fill('#ff',u.ff,S.ff);fill('#at',TY.map(t=>l.t[t]),$('#at').value||'2');
  $('#ac').value=S.ac;$('#fs').value=S.fs;style();
  $$('.plus').forEach(b=>b.title=u.plus);
}
function list(){
  const L=$('#list');L.innerHTML='';
  $$('.sec').forEach(e=>{
    const li=document.createElement('li'),sp=document.createElement('span');
    li.className=e===sel?'on':'';
    sp.textContent=(e.querySelector('h1,h2')||e).textContent.trim()||'—';
    sp.onclick=()=>{select(e);list();e.scrollIntoView({block:'center',behavior:'smooth'})};
    const acts=[['↑',()=>e.previousElementSibling?.before(e)],['↓',()=>e.nextElementSibling?.after(e)],['✕',()=>{if(sel===e)sel=null;e.remove()}]];
    li.append(sp,...acts.map(([t,f])=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{f();S.dirty=1;done()};return b}));
    L.append(li);
  });
}
function select(e){
  sel=e;$$('.sec').forEach(x=>x.classList.toggle('on',x===e));
  if(e){$('#sx').value=e.dataset.sx*100;$('#sy').value=e.dataset.sy*100}
}

/* ---------- Word-style pagination ----------
   Every text "atom" (heading, row, paragraph, bullet) that would cross the bottom margin of a page
   gets top padding so it starts on the next page. Headings stay with the line after them. */
const ATOMS='.inner h1,.inner h2,.inner .row,.inner p,.inner li';
const fixH=s=>s.style.height=s.firstChild.offsetHeight*(+s.dataset.sy)+'px';   // stretched sections keep true height
function paginate(p){
  const secs=$$('.sec');if(!secs.length)return 1;
  $$(ATOMS).forEach(a=>a.style.paddingTop='');
  secs.forEach(fixH);
  const at=$$(ATOMS),P=p.page+p.g,o=secs[0].getBoundingClientRect().top;
  const pos=a=>{const r=a.getBoundingClientRect();return[(r.top-o)/p.s+p.m,(r.bottom-o)/p.s+p.m]};
  at.forEach((a,i)=>{
    let[t,b]=pos(a);
    if(a.matches('h1,h2,.row')&&at[i+1])b=Math.max(b,pos(at[i+1])[1]);
    const k=Math.floor(t/P),lim=k*P+p.page-p.m;
    if(b>lim+.5&&b-t<p.page-2*p.m){
      const sec=a.closest('.sec');
      a.style.paddingTop=((k+1)*P+p.m-t)/(+sec.dataset.sy)+'px';fixH(sec);
    }
  });
  return Math.max(1,Math.floor((pos(at[at.length-1])[1]-.5)/P)+1);
}
function layout(){
  const s=Math.min(1,($('#view').clientWidth-24)/PW)*S.z;sc=s;
  sheet.style.transform=`scale(${s})`;sheet.style.setProperty('--inv',Math.min(2.2,1/s));
  const n=paginate({page:PH,g:GAP,m:MG,s}),h=n*PH+(n-1)*GAP;
  sheet.style.height=h+'px';
  scaler.style.width=PW*s+'px';scaler.style.height=h*s+'px';
  stat.textContent=n>1?T().over(n):T().fit;stat.className=n>1?'bad':'';
}
const done=()=>{list();layout();save()};

/* ---------- events ---------- */
sheet.style.setProperty('--pg',PH+'px');sheet.style.setProperty('--per',PH+GAP+'px');
sheet.addEventListener('input',()=>{S.dirty=1;clearTimeout(tm);tm=setTimeout(()=>{layout();list();save()},120)});
sheet.addEventListener('paste',e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))});
sheet.addEventListener('keydown',e=>{
  if(e.key!='Enter')return;
  let n=getSelection().anchorNode;n=n&&(n.nodeType==1?n:n.parentElement);
  if(n&&n.closest('h1,h2,h3,.date,.sub,.contact'))e.preventDefault();
});
document.addEventListener('selectionchange',()=>{
  let n=getSelection().anchorNode;n=n&&(n.nodeType==1?n:n.parentElement);
  const s=n&&n.closest&&n.closest('.sec');if(!s)return;
  cur=n.closest('.entry');
  if(s!==sel){select(s);list()}
});
sheet.addEventListener('click',e=>{
  const b=e.target.closest('.plus');if(!b)return;
  const sec=b.closest('.sec'),inner=sec.firstChild,all=inner.querySelectorAll('.entry'),box=document.createElement('div');
  box.innerHTML=ent(sec.dataset.type);const n=box.firstChild;
  all.length?all[all.length-1].after(n):inner.append(n);
  S.dirty=1;select(sec);done();
  const h=n.querySelector('h3'),r=document.createRange(),g=getSelection();
  r.selectNodeContents(h);inner.focus({preventScroll:true});g.removeAllRanges();g.addRange(r);   // type to replace the title
  h.scrollIntoView({block:'center',behavior:'smooth'});
});
$('#tpl').onchange=e=>{S.tpl=+e.target.value;style();layout();save()};
$('#ff').onchange=e=>{S.ff=+e.target.value;style();layout();save()};
$('#ac').oninput=e=>{S.ac=e.target.value;style();save()};
$('#fs').oninput=e=>{S.fs=+e.target.value;style();layout();save()};
['sx','sy'].forEach(k=>$('#'+k).oninput=e=>{
  if(!sel)return;const v=e.target.value/100;
  sel.dataset[k]=v;sel.style.setProperty('--'+k,v);layout();save();
});
const entry=()=>cur&&cur.isConnected?cur:sel&&[...sel.querySelectorAll('.entry')].pop();
$('#du').onclick=()=>{const e=entry();if(e){e.after(e.cloneNode(true));S.dirty=1;done()}};
$('#de').onclick=()=>{const e=entry();if(e){e.remove();S.dirty=1;done()}};
$('#add').onclick=()=>{
  const e=addSec(TY[$('#at').value]);S.dirty=1;
  sel?sel.after(e):sheet.append(e);select(e);done();e.scrollIntoView({block:'center'});
};
let arm=0;
$('#rs').onclick=e=>{
  if(!arm){arm=1;e.target.textContent=T().confirm;setTimeout(()=>{arm=0;e.target.textContent=T().samp},3000);return}
  arm=0;e.target.textContent=T().samp;sample();select($('.sec'));done();
};
$('#lang').onclick=()=>{
  S.lang=S.lang=='en'?'ar':'en';
  if(!S.dirty)sample();            // untouched sample switches language; your own text is never overwritten
  apply();select($('.sec'));done();
};
$('#zi').onclick=()=>{S.z=Math.min(2,+(S.z+.1).toFixed(1));layout();save()};
$('#zo').onclick=()=>{S.z=Math.max(.5,+(S.z-.1).toFixed(1));layout();save()};
$('#tg').onclick=()=>$('#panel').classList.toggle('open');
$('#pr').onclick=()=>print();
// printing has no page gap or extra margin: repaginate for the real printable area (A4 minus 12 mm margins)
addEventListener('beforeprint',()=>paginate({page:PH-2*MG-3,g:0,m:0,s:sc}));
addEventListener('afterprint',layout);
addEventListener('resize',layout);

load();apply();select($('.sec'));list();layout();
if(document.fonts)document.fonts.ready.then(layout);
})();