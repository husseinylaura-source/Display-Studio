(() => {
const CONFIG = window.BOARD_CONFIG || {};
const isAr = t => /[\u0600-\u06FF]/.test(String(t || ''));
const F_EN = {display:"'Archivo Black','Arial Black',Impact,sans-serif", body:"'Nunito','Trebuchet MS',sans-serif", hand:"'Gochi Hand','Comic Sans MS',cursive"};
const F_AR = {display:"'Lalezar','Archivo Black','Arial Black',sans-serif", body:"'Cairo','Nunito','Tahoma',sans-serif", hand:"'Cairo','Nunito','Tahoma',sans-serif"};
const F = {
  get display(){ return (typeof state !== 'undefined' && state.lang === 'ar') ? F_AR.display : F_EN.display; },
  get body(){ return (typeof state !== 'undefined' && state.lang === 'ar') ? F_AR.body : F_EN.body; },
  get hand(){ return (typeof state !== 'undefined' && state.lang === 'ar') ? F_AR.hand : F_EN.hand; }
};
const AR_LABELS = {'BIG QUESTION':'سؤال كبير','DID YOU KNOW?':'هل تعلم؟','KEY WORD':'كلمة مفتاحية',
  'GLUE THIS STRIP · FOLD ON THE DASHED LINE':'ألصق هذا الشريط · اطوِ على الخط المتقطع','LIFT TO FIND OUT':'ارفع لتعرف',
  'STICK THE FLAP STRIP HERE':'ألصق شريط الغطاء هنا','ANSWER':'الإجابة','CHALLENGE':'تحدٍّ','PICK A CHALLENGE':'اختر تحديًا',
  'Take a card, try it, put it back.':'خذ بطاقة، جرّبها، ثم أعدها.','ADD YOUR IDEA':'أضف فكرتك','Pin student work here':'ثبّت أعمال الطلاب هنا',
  'Great':'رائع','Good':'جيد','Okay':'لا بأس','Low':'متعب','Need to talk':'أريد التحدث','Put your sticky note under how you feel':'ضع ورقتك تحت ما تشعر به',
  'NOTICE':'إعلان','Write a notice here':'اكتب إعلانًا هنا','Student name':'اسم الطالب','HOUSE':'بيت','POINTS':'النقاط','IDEA':'فكرة','MY IDEA':'فكرتي',
  'Name: ______________':'الاسم: ______________','Role':'الدور'};
const tr = t => (typeof state !== 'undefined' && state.lang === 'ar' && AR_LABELS[t]) || t;
const PAL = {
  black: {name:'Black', backing:'#151515', trim:'#262626', dark:'#2c2c2c', mid:'#5e5e5e', light:'#a9a9a9', card:'#ededed', ink:'#1b1b1b'},
  green: {name:'Green', backing:'#2b5a3c', trim:'#214a31', dark:'#1b3a26', mid:'#3f7d54', light:'#93c3a0', card:'#e4f1e7', ink:'#16301f'},
  beige: {name:'Beige', backing:'#e7d9bd', trim:'#d8c6a2', dark:'#6a5131', mid:'#a68556', light:'#d3ba8f', card:'#faf3e5', ink:'#463419'}
};

/* ---------- content ---------- */
const EXAMPLE = {
  subtitle: 'Water is always on the move',
  bigQuestion: 'Could the water you drink today once have been in a dinosaur?',
  facts: [
    {heading:'Evaporation', text:'The Sun heats water in oceans, lakes and rivers until it turns into invisible water vapour.'},
    {heading:'Condensation', text:'Water vapour cools as it rises and turns back into tiny droplets that form clouds.'},
    {heading:'Precipitation', text:'When droplets join and get heavy, they fall as rain, snow, sleet or hail.'},
    {heading:'Collection', text:'Water gathers in oceans, rivers, lakes and underground, ready to start the cycle again.'}
  ],
  vocab: [
    {term:'Vapour', def:'Water in the form of a gas.'},
    {term:'Runoff', def:'Water that flows over land into rivers and seas.'},
    {term:'Transpiration', def:'Water released into the air by plants.'},
    {term:'Groundwater', def:'Water stored in soil and rocks underground.'}
  ],
  flaps: [
    {q:'Where does a puddle go on a sunny day?', a:'It evaporates. The Sun turns the water into vapour that rises into the air.'},
    {q:'Why do clouds look white?', a:'Their tiny droplets scatter all colours of sunlight equally, so we see white.'},
    {q:'How much of Earth\'s water is fresh?', a:'Only about 3%. Most of it is frozen in ice caps and glaciers.'}
  ],
  challenges: [
    'Draw the water cycle in four steps from memory.',
    'Name two places water is stored on Earth.',
    'Explain condensation to a partner in one sentence.',
    'List three ways your family uses water each day.'
  ],
  celebrate: {heading:'Water Wizards', prompt:'Spotted being curious about our planet'},
  voice: ['I was surprised that…', 'One way to save water is…', 'I still wonder…']
};

const FAM = {
  match:  {name:'Match backing'},
  green:  {name:'Green',  dark:'#1b3a26', mid:'#3f7d54', light:'#93c3a0', card:'#e4f1e7', ink:'#16301f'},
  grey:   {name:'Grey',   dark:'#2c2c2c', mid:'#5e5e5e', light:'#a9a9a9', card:'#ededed', ink:'#1b1b1b'},
  brown:  {name:'Brown',  dark:'#6a5131', mid:'#a68556', light:'#d3ba8f', card:'#faf3e5', ink:'#463419'},
  blue:   {name:'Blue',   dark:'#1d3557', mid:'#3d6fa8', light:'#9cc0e6', card:'#e6f0fa', ink:'#14253d'},
  teal:   {name:'Teal',   dark:'#14403f', mid:'#2f7f7b', light:'#8fcfc9', card:'#e2f4f2', ink:'#0f2e2d'},
  purple: {name:'Purple', dark:'#3d2560', mid:'#7350a8', light:'#bfa6e3', card:'#f1eafa', ink:'#2a1844'},
  pink:   {name:'Pink',   dark:'#7a1e48', mid:'#c94d86', light:'#f0a9c8', card:'#fdeaf2', ink:'#4f1230'},
  red:    {name:'Red',    dark:'#6e1d1d', mid:'#b8473f', light:'#eba59c', card:'#fcebe8', ink:'#471212'},
  orange: {name:'Orange', dark:'#7a3b0d', mid:'#d97a2b', light:'#f5c08e', card:'#fdf0e3', ink:'#4d2508'},
  yellow: {name:'Yellow', dark:'#6b5205', mid:'#c9a227', light:'#efd77e', card:'#fdf7df', ink:'#423205'},
  custom: {name:'Your colour'}
};
const MATCH = {black:'grey', green:'green', beige:'brown'};
function famFromHex(hex){
  const n = parseInt(hex.slice(1),16), r=(n>>16&255)/255, g=(n>>8&255)/255, b=(n&255)/255;
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, d=mx-mn;
  let h=0, sat=d===0?0:d/(1-Math.abs(2*l-1));
  if (d){ h = mx===r ? ((g-b)/d)%6 : mx===g ? (b-r)/d+2 : (r-g)/d+4; h*=60; if(h<0)h+=360; }
  const S = Math.round(Math.min(sat,1)*100), hsl=(s2,l2)=>`hsl(${Math.round(h)} ${Math.round(S*s2)}% ${l2}%)`;
  return {dark:hsl(.7,22), mid:hsl(.75,42), light:hsl(.7,74), card:hsl(.6,94), ink:hsl(.6,13)};
}
function famOf(key){
  if (!key || key==='match') key = MATCH[state.backing];
  if (key==='custom') return famFromHex(state.custom);
  return FAM[key] || FAM[MATCH[state.backing]];
}
function palFor(pieceKey){
  const k = (pieceKey && state.over[pieceKey]) || state.elem;
  return {...PAL[state.backing], ...famOf(k)};
}
const pieceKey = (tpl, type, idx) => `${tpl}|${type}|${idx}`;

let content = JSON.parse(JSON.stringify(EXAMPLE));
let state = {lang:'en', boardType:'topic', topicTemplate:'grid',
  team:{subtitle:'Student leadership 2026–27', introHeading:'Our team', introText:'Meet the students who lead, represent and serve our school community.',
    pocketTitle:'HAVE YOUR SAY', pocketText:'Take a slip, write your idea and post it here.',
    members:[{name:'', role:'President'},{name:'', role:'Vice President'},{name:'', role:'Team member'},{name:'', role:'Team member'}]},
  yb:{year:'Year 8', classes:['8A','8B','8C','8D','8E'], headers:['Timetables','Wellbeing','Notices','Student Leadership','House Points'],
    houses:[{name:'Camels', color:'#e53935'},{name:'Falcons', color:'#1e88e5'},{name:'Khanjars', color:'#fdd835'},{name:'Dhows', color:'#7cb342'}],
    leaders:[{name:'Student name', role:'Year Leader'},{name:'Student name', role:'Deputy Leader'},{name:'Student name', role:'Wellbeing Ambassador'},{name:'Student name', role:'Sports Captain'}],
    notices:['Trip forms are due on Thursday.','Library books back by Friday.'], mood:'How are you feeling today?', tt:[]},
  title:'The Water Cycle', backing:'green', template:'grid', elem:'match', custom:'#c94d86', over:{}, extras:[], pos:{}, editOpen:null};

function clip(s, n){ s = String(s ?? '').replace(/\s+/g,' ').trim(); return s.length > n ? s.slice(0, n-1).trim() + '…' : s; }
function normalize(raw, title, idea){
  const base = localContent(title, idea);
  const r = raw && typeof raw === 'object' ? raw : {};
  const arr = (a, n, fb, map) => { const out = Array.isArray(a) ? a.map(map).filter(Boolean) : []; while (out.length < n) out.push(fb[out.length]); return out.slice(0, n); };
  return {
    subtitle: clip(r.subtitle || base.subtitle, 60),
    bigQuestion: clip(r.bigQuestion || base.bigQuestion, 110),
    facts: arr(r.facts, 4, base.facts, f => f && f.heading && f.text ? {heading:clip(f.heading,28), text:clip(f.text,150)} : null),
    vocab: arr(r.vocab, 4, base.vocab, v => v && v.term && v.def ? {term:clip(v.term,22), def:clip(v.def,90)} : null),
    flaps: arr(r.flaps, 3, base.flaps, f => f && f.q && f.a ? {q:clip(f.q,90), a:clip(f.a,140)} : null),
    challenges: arr(r.challenges, 4, base.challenges, c => typeof c === 'string' && c.trim() ? clip(c,100) : null),
    celebrate: {heading: clip(r.celebrate?.heading || base.celebrate.heading, 24), prompt: clip(r.celebrate?.prompt || base.celebrate.prompt, 70)},
    voice: arr(r.voice, 3, base.voice, v => typeof v === 'string' && v.trim() ? clip(v,50) : null)
  };
}
function localContentAr(title, idea){
  const t = title.trim() || 'لوحتنا';
  const parts = String(idea||'').split(/(?<=[.!?؟])\s+|[،;؛]\s*|\s+و(?=\S)/).map(s => s.trim()).filter(s => s.split(' ').length >= 3);
  const fallback = [{heading:'فكرة رئيسة', text:`ما أهم شيء يجب أن نعرفه عن ${t}؟`},{heading:'في حياتنا', text:`أين نرى ${t} في العالم من حولنا؟`},
    {heading:'هل تعلم؟', text:`ابحث عن معلومة مدهشة عن ${t} وشاركها.`},{heading:'الصورة الكبيرة', text:`لماذا يهمنا ${t} ويهم الآخرين؟`}];
  return {
    subtitle: clip(parts[0] || `نستكشف ${t} معًا`, 60), bigQuestion: `ماذا سيتغير لو لم يكن ${t} موجودًا؟`,
    facts: [0,1,2,3].map(i => parts[i] ? {heading: clip(parts[i].split(' ').slice(0,3).join(' '), 28), text: clip(parts[i], 150)} : fallback[i]),
    vocab: [1,2,3,4].map(i => ({term:'كلمة مفتاحية ' + i, def:'أضف التعريف هنا.'})),
    flaps: [{q:`ماذا تعرف عن ${t}؟`, a:'شارك فكرتك مع زميلك ثم راجع اللوحة.'},{q:`لماذا ${t} مهم؟`, a:'ابحث عن الإجابة في المعلومات على هذه اللوحة.'},{q:`كيف تشرح ${t} لطالب أصغر منك؟`, a:'استخدم صورة واحدة وجملة واحدة.'}],
    challenges: [`اكتب سؤالًا عن ${t}.`, 'اختر معلومة من اللوحة واشرحها لصديقك.', 'ارسم مخططًا يوضح الفكرة الرئيسة.', 'اربط هذا الموضوع بمادة أخرى.'],
    celebrate: {heading:'نجوم التعلّم', prompt:`تفكير رائع في ${t}`}, voice: ['تعلمت أن…', 'فاجأني أن…', 'ما زلت أتساءل…']
  };
}
function localContent(title, idea){
  if (typeof state !== 'undefined' && state.lang === 'ar') return localContentAr(title, idea);
  const t = title.trim() || 'Our Board';
  const parts = String(idea||'').split(/(?<=[.!?])\s+|;\s*|,\s+(?:and\s+)?/).map(s => s.trim()).filter(s => s.split(' ').length >= 3);
  const facts = [0,1,2,3].map(i => parts[i]
    ? {heading: clip(parts[i].split(' ').slice(0,3).join(' '), 28), text: clip(parts[i], 150)}
    : [{heading:'Key idea', text:`What is the most important thing to know about ${t}?`},
       {heading:'In real life', text:`Where do we see ${t} in the world around us?`},
       {heading:'Did you know?', text:`Find one surprising fact about ${t} and share it.`},
       {heading:'Big picture', text:`Why does ${t} matter to us and to others?`}][i]);
  return {
    subtitle: clip(parts[0] || `Explore ${t} with us`, 60),
    bigQuestion: `What would change if ${t} did not exist?`,
    facts,
    vocab: [{term:'Key word 1', def:'Add a definition here.'},{term:'Key word 2', def:'Add a definition here.'},{term:'Key word 3', def:'Add a definition here.'},{term:'Key word 4', def:'Add a definition here.'}],
    flaps: [{q:`What do you already know about ${t}?`, a:'Share your idea with a partner, then check the board.'},
            {q:`Why is ${t} important?`, a:'Look for clues in the facts around this board.'},
            {q:`How could you explain ${t} to a younger student?`, a:'Use one picture and one sentence.'}],
    challenges: [`Write one question about ${t}.`, 'Find a fact on the board and explain it to a friend.', 'Draw a diagram that shows the main idea.', 'Connect this topic to another subject.'],
    celebrate: {heading:'Star Learners', prompt:`Great thinking about ${t}`},
    voice: ['I learned that…', 'I was surprised that…', 'I still wonder…']
  };
}

/* ---------- canvas helpers ---------- */
function rr(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function wrapLines(c, text, maxW){
  const words = String(text).split(/\s+/).filter(Boolean); const out = []; let cur = '';
  for (const w of words){ const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width <= maxW || !cur) cur = t; else { out.push(cur); cur = w; } }
  if (cur) out.push(cur); return out;
}
function fit(c, text, o){
  const lh = o.lh || (isAr(text) ? 1.42 : 1.18), wt = o.weight ?? 800;
  for (let s = o.max; s >= (o.min||6); s -= Math.max(1, s*0.05)){
    c.font = `${wt} ${s}px ${o.family}`;
    const L = wrapLines(c, text, o.maxW);
    if (!L.some(l => c.measureText(l).width > o.maxW) && L.length*s*lh <= o.maxH) return {size:s, lines:L, lh};
  }
  const s = o.min||6; c.font = `${wt} ${s}px ${o.family}`; return {size:s, lines:wrapLines(c,text,o.maxW), lh};
}
function text(c, str, x, cy, o, color, align='center'){
  const f = fit(c, str, o);
  c.font = `${o.weight ?? 800} ${f.size}px ${o.family}`; c.fillStyle = color; c.textAlign = align; c.textBaseline = 'middle';
  c.direction = isAr(str) ? 'rtl' : 'ltr';
  const total = f.lines.length * f.size * f.lh; let y = cy - total/2 + f.size*f.lh/2;
  for (const l of f.lines){ c.fillText(l, x, y); y += f.size*f.lh; }
  return f;
}
function cardBox(c,w,h,u,fill,stroke,r=6){ rr(c,u*1.5,u*1.5,w-u*3,h-u*3,u*r); c.fillStyle=fill; c.fill(); c.lineWidth=u*1.4; c.strokeStyle=stroke; c.stroke(); }
function starPath(c,cx,cy,R,r,n=5){ c.beginPath(); for(let i=0;i<n*2;i++){ const a=-Math.PI/2+i*Math.PI/n, rad=i%2?r:R; c.lineTo(cx+Math.cos(a)*rad, cy+Math.sin(a)*rad);} c.closePath(); }

/* ---------- pieces ---------- */
const TAGS = {int:'Interactive', cel:'Celebrating', edu:'Educational', ico:'Icon', ib:'IB', pic:'Picture'};

/* ---------- icons ---------- */
const ICON_PICKS = ['BookOpen','Lightbulb','Brain','FlaskConical','Atom','Microscope','Telescope','Dna','Magnet','Calculator','Sigma','Globe','Map','Compass','Landmark','Languages','Palette','Music','Drama','Camera','PenTool','Pencil','Laptop','Puzzle','Target','Trophy','Award','Medal','Star','Sparkles','Rocket','Heart','HeartHandshake','Smile','Users','Handshake','MessageCircle','Megaphone','Search','Leaf','Sprout','TreePine','Recycle','Sun','Cloud','Droplets','Mountain','Clock','Hourglass','Calendar','Scale','ShieldCheck','Flag','GraduationCap','Dumbbell','Bike','Zap','Eye','Fingerprint','Network'];
function iconNodes(name){
  const L = window.lucide && window.lucide.icons; if (!L || !name) return null;
  const ic = L[name]; if (!ic) return null;
  if (Array.isArray(ic) && ic[0] === 'svg') return ic[2];
  return Array.isArray(ic) ? ic : null;
}
function iconSvg(name){
  const nodes = iconNodes(name); if (!nodes) return '';
  const esc = v => String(v).replace(/[&"<>]/g, '');
  const inner = nodes.map(([t,a]) => `<${t} ${Object.entries(a||{}).filter(([k]) => k !== 'key').map(([k,v]) => `${k}="${esc(v)}"`).join(' ')}/>`).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
function drawNodes(c, nodes, cx, cy, size, color){
  c.save(); const k = size/24; c.translate(cx - size/2, cy - size/2); c.scale(k, k);
  c.strokeStyle = color; c.lineWidth = 2.1; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [tag, a0] of nodes){
    const a = a0 || {};
    if (tag === 'path'){ try { c.stroke(new Path2D(a.d)); } catch(e){} continue; }
    c.beginPath();
    if (tag === 'circle') c.arc(+a.cx, +a.cy, +a.r, 0, Math.PI*2);
    else if (tag === 'ellipse') c.ellipse(+a.cx, +a.cy, +a.rx, +a.ry, 0, 0, Math.PI*2);
    else if (tag === 'rect') rr(c, +(a.x||0), +(a.y||0), +a.width, +a.height, +(a.rx||0));
    else if (tag === 'line'){ c.moveTo(+a.x1, +a.y1); c.lineTo(+a.x2, +a.y2); }
    else if (tag === 'polyline' || tag === 'polygon'){ const pts = String(a.points).trim().split(/[\s,]+/).map(Number); for (let i=0;i<pts.length;i+=2) c.lineTo(pts[i], pts[i+1]); if (tag === 'polygon') c.closePath(); }
    c.stroke();
  }
  c.restore();
}
function drawGlyph(c, ex, cx, cy, size, color, letterFallback){
  if (ex.img && ex.img.complete && ex.img.naturalWidth){
    const r = Math.min(size/ex.img.naturalWidth, size/ex.img.naturalHeight);
    const w = ex.img.naturalWidth*r, h = ex.img.naturalHeight*r; c.drawImage(ex.img, cx-w/2, cy-h/2, w, h); return;
  }
  const nodes = iconNodes(ex.icon) || iconNodes('Star');
  if (nodes) { drawNodes(c, nodes, cx, cy, size, color); return; }
  c.font = `400 ${size*.8}px ${F.display}`; c.fillStyle = color; c.textAlign='center'; c.textBaseline='middle';
  c.fillText((letterFallback || ex.label || '★').slice(0,1).toUpperCase(), cx, cy);
}

/* ---------- IB ---------- */
const IB = [
  {id:'lp', name:'IB Learner Profile', short:'LEARNER PROFILE', items:[
    ['Inquirers','Search','We are curious and ask questions to find things out.'],
    ['Knowledgeable','BookOpen','We explore ideas and build deep understanding.'],
    ['Thinkers','Brain','We think critically and creatively to solve problems.'],
    ['Communicators','MessageCircle','We share ideas with confidence and listen well.'],
    ['Principled','ShieldCheck','We act with honesty and fairness and own our actions.'],
    ['Open-minded','Globe','We value other views, cultures and traditions.'],
    ['Caring','Heart','We show kindness and act to help others.'],
    ['Risk-takers','Rocket','We try new things and learn from mistakes.'],
    ['Balanced','Scale','We look after our minds, bodies and wellbeing.'],
    ['Reflective','Lightbulb','We think about our learning so we can grow.']]},
  {id:'atl', name:'Approaches to Learning (ATL) skills', short:'ATL SKILLS', items:[
    ['Thinking','Puzzle','I can analyse, evaluate and create new ideas.'],
    ['Communication','Megaphone','I can share and receive ideas clearly.'],
    ['Social','Users','I can collaborate and work well with others.'],
    ['Self-management','Clock','I can organise my time and manage my feelings.'],
    ['Research','Microscope','I can find, check and use information well.']]},
  {id:'gc', name:'MYP Global contexts', short:'GLOBAL CONTEXT', items:[
    ['Identities and relationships','Fingerprint','Who am I? Who are we?'],
    ['Orientation in space and time','Compass','Where we come from and where we are going.'],
    ['Personal and cultural expression','Palette','How we express ideas, feelings and culture.'],
    ['Scientific and technical innovation','Atom','How we understand and shape our world.'],
    ['Globalization and sustainability','Recycle','How everything connects, and our impact.'],
    ['Fairness and development','Scale','Rights, responsibilities and a fairer world.']]},
  {id:'kc', name:'MYP Key concepts', short:'KEY CONCEPT', items:[
    ['Aesthetics','Flower2',''],['Change','RefreshCw',''],['Communication','MessageSquare',''],['Communities','Home',''],
    ['Connections','Link',''],['Creativity','Lightbulb',''],['Culture','Drama',''],['Development','TrendingUp',''],
    ['Form','Shapes',''],['Global interactions','Globe',''],['Identity','Fingerprint',''],['Logic','Sigma',''],
    ['Perspective','Eye',''],['Relationships','HeartHandshake',''],['Systems','Network',''],['Time, place and space','Hourglass','']]},
  {id:'pyp', name:'PYP Transdisciplinary themes', short:'PYP THEME', items:[
    ['Who we are','Users',''],['Where we are in place and time','Map',''],['How we express ourselves','Palette',''],
    ['How the world works','Atom',''],['How we organize ourselves','Network',''],['Sharing the planet','Globe','']]},
  {id:'dp', name:'DP Core', short:'DP CORE', items:[
    ['Theory of Knowledge','Brain','How do we know what we claim to know?'],
    ['Extended Essay','FileText','An independent research essay on a topic you choose.'],
    ['Creativity, Activity, Service','HeartHandshake','Learning through creative, active and service experiences.']]}
];

const IB_AR = {
  lp:{short:'ملامح المتعلم', items:[['باحثون','نحن فضوليون ونطرح الأسئلة لنكتشف.'],['مطّلعون','نستكشف الأفكار ونبني فهمًا عميقًا.'],['مفكّرون','نفكر بطريقة ناقدة ومبدعة لحل المشكلات.'],
    ['متواصلون','نعبّر عن أفكارنا بثقة ونحسن الاستماع.'],['مبدئيّون','نتصرف بصدق وعدل ونتحمل مسؤولية أفعالنا.'],['منفتحو العقل','نقدّر الآراء والثقافات والتقاليد الأخرى.'],
    ['مهتمّون بالآخرين','نُظهر اللطف ونعمل على مساعدة الآخرين.'],['مقدامون','نجرّب أشياء جديدة ونتعلم من أخطائنا.'],['متوازنون','نهتم بعقولنا وأجسامنا ورفاهيتنا.'],['متأمّلون','نتأمل في تعلّمنا لننمو.']]},
  atl:{short:'مهارات التعلم', items:[['مهارات التفكير','أستطيع التحليل والتقييم وابتكار أفكار جديدة.'],['مهارات التواصل','أستطيع تبادل الأفكار بوضوح.'],['المهارات الاجتماعية','أستطيع التعاون والعمل جيدًا مع الآخرين.'],
    ['مهارات الإدارة الذاتية','أستطيع تنظيم وقتي وإدارة مشاعري.'],['مهارات البحث','أستطيع إيجاد المعلومات والتحقق منها واستخدامها.']]},
  gc:{short:'السياق العالمي', items:[['الهويات والعلاقات','من أنا؟ من نحن؟'],['التوجّه في المكان والزمان','من أين أتينا وإلى أين نمضي.'],['التعبير الشخصي والثقافي','كيف نعبّر عن أفكارنا ومشاعرنا وثقافتنا.'],
    ['الابتكار العلمي والتقني','كيف نفهم عالمنا ونشكّله.'],['العولمة والاستدامة','كيف يترابط كل شيء وما أثرنا.'],['العدالة والتنمية','الحقوق والمسؤوليات وعالم أكثر عدلًا.']]},
  kc:{short:'مفهوم رئيس', items:[['الجماليات',''],['التغيير',''],['التواصل',''],['المجتمعات',''],['الروابط',''],['الإبداع',''],['الثقافة',''],['التنمية',''],
    ['الشكل',''],['التفاعلات العالمية',''],['الهوية',''],['المنطق',''],['المنظور',''],['العلاقات',''],['الأنظمة',''],['الزمان والمكان والحيّز','']]},
  pyp:{short:'محور بين المواد', items:[['من نحن',''],['أين نحن في المكان والزمان',''],['كيف نعبّر عن أنفسنا',''],['كيف يعمل العالم',''],['كيف ننظّم أنفسنا',''],['المشاركة في الكوكب','']]},
  dp:{short:'جوهر الدبلوما', items:[['نظرية المعرفة','كيف نعرف ما ندّعي معرفته؟'],['البحث الموسّع','بحث مستقل في موضوع تختاره.'],['الإبداع والنشاط والخدمة','التعلم من خلال تجارب الإبداع والنشاط والخدمة.']]}
};
function ibCard(g, i){
  const it = g.items[i], A = state.lang === 'ar' && IB_AR[g.id];
  return A ? {id:`ib-${g.id}-${i}`, kind:'ib', group:A.short, label:A.items[i][0], icon:it[1], desc:A.items[i][1]}
           : {id:`ib-${g.id}-${i}`, kind:'ib', group:g.short, label:it[0], icon:it[1], desc:it[2]};
}
const photoRatio = ex => Math.max(.5, Math.min(2.2, ex.ratio || 1.33));
function aspectOf(ex){
  if (ex.kind !== 'photo') return EXTRA[ex.kind].aspect;
  const H = .05 + .9/photoRatio(ex) + (ex.caption ? .17 : .06);
  return 1/H;
}
function drawCover(c, img, x, y, w, h){
  const r = Math.max(w/img.naturalWidth, h/img.naturalHeight), sw = w/r, sh = h/r;
  c.drawImage(img, (img.naturalWidth - sw)/2, (img.naturalHeight - sh)/2, sw, sh, x, y, w, h);
}
const EXTRA = {
  house: {name:'House tile', tag:'cel', aspect:1.25, draw(c,w,h,p,ex){
    const save = state.yb.houses; state.yb.houses = [{name:ex.label, color:ex.color}];
    TYPES.house.pages(content, 0)[0].draw(c, w, h, p); state.yb.houses = save;
  }},
  photo: {name:'Picture', tag:'pic', aspect:1, draw(c,w,h,p,ex){
    const u = w/100, pad = w*.05, iw = w - pad*2, ih = iw/photoRatio(ex);
    rr(c, u*.6, u*.6, w-u*1.2, h-u*1.2, u*2.5); c.fillStyle = p.card; c.fill(); c.lineWidth = u*1.2; c.strokeStyle = p.dark; c.stroke();
    c.save(); rr(c, pad, pad, iw, ih, u*1.2); c.clip();
    if (ex.img && ex.img.complete && ex.img.naturalWidth) drawCover(c, ex.img, pad, pad, iw, ih); else { c.fillStyle = p.light; c.fillRect(pad, pad, iw, ih); }
    c.restore(); rr(c, pad, pad, iw, ih, u*1.2); c.lineWidth = u*.5; c.strokeStyle = p.mid; c.stroke();
    const below = h - pad - ih;
    if (ex.caption) text(c, ex.caption, w/2, pad + ih + below*.45, {family:F.body, weight:900, maxW:iw*.96, maxH:below*.62, max:w*.055}, p.ink);
    if (ex.credit){ c.save(); c.globalAlpha = .85;
      text(c, ex.credit, w - pad, h - Math.min(below*.22, w*.03), {family:F.body, weight:700, maxW:iw, maxH:w*.026, max:w*.021, min:3}, p.mid, 'right'); c.restore(); }
  }},
  icon: {name:'Icon badge', tag:'ico', aspect:1, draw(c,w,h,p,ex){
    const u = w/100, cy = ex.label ? h*.42 : h*.5, R = ex.label ? u*38 : u*44;
    c.beginPath(); c.arc(w/2, cy, R, 0, Math.PI*2); c.fillStyle = ex.img ? p.card : p.mid; c.fill(); c.lineWidth = u*2.2; c.strokeStyle = p.dark; c.stroke();
    c.beginPath(); c.arc(w/2, cy, R - u*5, 0, Math.PI*2); c.lineWidth = u*1; c.strokeStyle = ex.img ? p.mid : p.light; c.stroke();
    drawGlyph(c, ex, w/2, cy, R*1.05, '#ffffff');
    if (ex.label){ const pw = w*.9, ph = h*.17; rr(c, (w-pw)/2, h*.79, pw, ph, ph/2); c.fillStyle = p.dark; c.fill();
      text(c, ex.label.toUpperCase(), w/2, h*.79 + ph/2, {family:F.display, weight:400, maxW:pw*.86, maxH:ph*.62, max:ph*.5}, '#ffffff'); }
  }},
  ib: {name:'IB card', tag:'ib', aspect:.78, draw(c,w,h,p,ex){
    const u = Math.min(w,h)/100;
    cardBox(c,w,h,u,p.card,p.dark,7);
    c.save(); rr(c,u*1.5,u*1.5,w-u*3,h-u*3,u*7); c.clip(); c.fillStyle = p.dark; c.fillRect(0,0,w,h*.15); c.restore();
    text(c, ex.group, w/2, h*.085, {family:F.body, weight:900, maxW:w*.8, maxH:h*.08, max:h*.055}, '#ffffff');
    const cy = ex.desc ? h*.36 : h*.42, R = w*(ex.desc ? .2 : .24);
    c.beginPath(); c.arc(w/2, cy, R, 0, Math.PI*2); c.fillStyle = p.mid; c.fill(); c.lineWidth = u*1.2; c.strokeStyle = p.dark; c.stroke();
    drawGlyph(c, ex, w/2, cy, R*1.1, '#ffffff', ex.label);
    if (ex.desc){
      text(c, ex.label, w/2, h*.64, {family:F.display, weight:400, maxW:w*.84, maxH:h*.13, max:h*.075}, p.ink);
      text(c, ex.desc, w/2, h*.83, {family:F.body, weight:700, maxW:w*.8, maxH:h*.19, max:h*.05}, p.ink);
    } else {
      text(c, ex.label, w/2, h*.79, {family:F.display, weight:400, maxW:w*.84, maxH:h*.24, max:h*.085}, p.ink);
    }
  }}
};
let extraSeq = 0;
const TYPES = {
  banner: {name:'Subtitle banner', tag:'edu', pages:d => [{aspect:5, draw(c,w,h,p){
    const u=h/10;
    c.fillStyle=p.dark;
    c.beginPath(); c.moveTo(0,h*.28); c.lineTo(w*.12,h*.28); c.lineTo(w*.12,h*.96); c.lineTo(0,h*.96); c.lineTo(w*.045,h*.62); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(w,h*.28); c.lineTo(w*.88,h*.28); c.lineTo(w*.88,h*.96); c.lineTo(w,h*.96); c.lineTo(w*.955,h*.62); c.closePath(); c.fill();
    rr(c,w*.06,h*.04,w*.88,h*.74,u*1.4); c.fillStyle=p.mid; c.fill(); c.lineWidth=u*.45; c.strokeStyle=p.dark; c.stroke();
    text(c, d.subtitle, w/2, h*.41, {family:F.body, weight:900, maxW:w*.78, maxH:h*.58, max:h*.38}, '#ffffff');
  }}]},
  bigq: {name:'Big question', tag:'edu', pages:d => [{aspect:1.5, draw(c,w,h,p){
    const u=Math.min(w,h)/100;
    rr(c,u*2,u*9,w-u*4,h-u*11,u*7); c.fillStyle=p.card; c.fill(); c.lineWidth=u*1.6; c.strokeStyle=p.dark; c.stroke();
    c.save(); c.globalAlpha=.5; c.font=`400 ${h*.86}px ${F.display}`; c.fillStyle=p.light; c.textAlign='right'; c.textBaseline='alphabetic'; c.fillText('?', w-u*7, h-u*7); c.restore();
    const tw=w*.52; rr(c,(w-tw)/2,0,tw,u*18,u*5); c.fillStyle=p.dark; c.fill();
    text(c,tr('BIG QUESTION'),w/2,u*9,{family:F.display,weight:400,maxW:tw*.84,maxH:u*11,max:u*10},'#ffffff');
    text(c,d.bigQuestion,w/2,h*.6,{family:F.body,weight:900,maxW:w*.78,maxH:h*.6,max:h*.15},p.ink);
  }}]},
  fact: {name:'Fact card', tag:'edu', pages:(d,i) => [{aspect:.8, draw(c,w,h,p){
    const u=Math.min(w,h)/100, f=d.facts[i];
    cardBox(c,w,h,u,p.card,p.dark,7);
    c.save(); rr(c,u*1.5,u*1.5,w-u*3,h-u*3,u*7); c.clip(); c.fillStyle=p.mid; c.fillRect(0,0,w,h*.27); c.restore();
    c.strokeStyle=p.dark; c.lineWidth=u*1.4; c.beginPath(); c.moveTo(u*1.5,h*.27); c.lineTo(w-u*1.5,h*.27); c.stroke();
    text(c,f.heading.toUpperCase(),w/2,h*.14,{family:F.display,weight:400,maxW:w*.8,maxH:h*.17,max:h*.08},'#ffffff');
    text(c,f.text,w/2,h*.58,{family:F.body,weight:700,maxW:w*.8,maxH:h*.5,max:h*.07},p.ink);
    text(c,tr('DID YOU KNOW?'),w/2,h*.9,{family:F.body,weight:900,maxW:w*.7,maxH:h*.06,max:h*.04},p.mid);
  }}]},
  vocab: {name:'Key word card', tag:'edu', pages:(d,i) => [{aspect:1.25, draw(c,w,h,p){
    const u=Math.min(w,h)/100, v=d.vocab[i];
    cardBox(c,w,h,u,p.dark,p.ink,7);
    rr(c,u*6,u*6,w-u*12,h-u*12,u*5); c.lineWidth=u*.8; c.setLineDash([u*3,u*2.4]); c.strokeStyle=p.light; c.stroke(); c.setLineDash([]);
    text(c,tr('KEY WORD'),w/2,h*.17,{family:F.body,weight:900,maxW:w*.6,maxH:h*.08,max:h*.065},p.light);
    text(c,v.term,w/2,h*.36,{family:F.display,weight:400,maxW:w*.8,maxH:h*.22,max:h*.17},'#ffffff');
    c.fillStyle=p.light; c.fillRect(w*.3,h*.5,w*.4,u*1);
    text(c,v.def,w/2,h*.7,{family:F.body,weight:700,maxW:w*.78,maxH:h*.28,max:h*.09},p.card);
  }}]},
  flap: {name:'Lift-the-flap', tag:'int', pages:(d,i) => [
    {label:'flap (front)', aspect:1.1, draw(c,w,h,p){
      const u=Math.min(w,h)/100, f=d.flaps[i], strip=h*.15;
      rr(c,u*1.5,u*1.5,w-u*3,h-u*3,u*6); c.fillStyle=p.mid; c.fill(); c.lineWidth=u*1.4; c.strokeStyle=p.dark; c.stroke();
      c.save(); rr(c,u*1.5,u*1.5,w-u*3,h-u*3,u*6); c.clip(); c.fillStyle=p.light; c.fillRect(0,0,w,strip); c.restore();
      c.setLineDash([u*3,u*2]); c.lineWidth=u*.8; c.strokeStyle=p.dark; c.beginPath(); c.moveTo(u*1.5,strip); c.lineTo(w-u*1.5,strip); c.stroke(); c.setLineDash([]);
      text(c,tr('GLUE THIS STRIP · FOLD ON THE DASHED LINE'),w/2,strip/2+u,{family:F.body,weight:900,maxW:w*.84,maxH:strip*.5,max:strip*.3},p.dark);
      text(c,f.q,w/2,h*.5,{family:F.body,weight:900,maxW:w*.8,maxH:h*.42,max:h*.11},'#ffffff');
      const pw=w*.56, ph=h*.12; rr(c,(w-pw)/2,h*.78,pw,ph,ph/2); c.fillStyle=p.dark; c.fill();
      text(c,tr('LIFT TO FIND OUT'),w/2,h*.78+ph/2,{family:F.display,weight:400,maxW:pw*.84,maxH:ph*.6,max:ph*.45},'#ffffff');
    }},
    {label:'base (answer)', aspect:1.1, draw(c,w,h,p){
      const u=Math.min(w,h)/100, f=d.flaps[i], strip=h*.15;
      cardBox(c,w,h,u,p.card,p.dark,6);
      rr(c,u*5,u*4,w-u*10,strip-u*4,u*3); c.setLineDash([u*3,u*2]); c.lineWidth=u*.8; c.strokeStyle=p.mid; c.stroke(); c.setLineDash([]);
      text(c,tr('STICK THE FLAP STRIP HERE'),w/2,u*2+strip/2,{family:F.body,weight:900,maxW:w*.7,maxH:strip*.4,max:strip*.28},p.mid);
      text(c,tr('ANSWER'),w/2,h*.3,{family:F.display,weight:400,maxW:w*.5,maxH:h*.1,max:h*.08},p.mid);
      text(c,f.a,w/2,h*.62,{family:F.body,weight:800,maxW:w*.8,maxH:h*.48,max:h*.1},p.ink);
    }}
  ]},
  pocket: {name:'Challenge pocket', tag:'int', pages:d => [
    {label:'pocket', aspect:1.3, draw(c,w,h,p){
      const u=Math.min(w,h)/100;
      c.save(); c.translate(w*.5,h*.2); c.rotate(-.06); rr(c,-w*.3,-h*.17,w*.6,h*.5,u*4); c.fillStyle=p.card; c.fill(); c.lineWidth=u; c.strokeStyle=p.mid; c.stroke();
      text(c,tr('CHALLENGE'),0,-h*.08,{family:F.display,weight:400,maxW:w*.4,maxH:h*.08,max:h*.06},p.mid); c.restore();
      c.beginPath(); c.moveTo(u*1.5,h*.3); c.lineTo(w*.5,h*.46); c.lineTo(w-u*1.5,h*.3); c.lineTo(w-u*1.5,h-u*1.5); c.lineTo(u*1.5,h-u*1.5); c.closePath();
      c.fillStyle=p.dark; c.fill(); c.lineWidth=u*1.2; c.strokeStyle=p.ink; c.lineJoin='round'; c.stroke();
      text(c,tr('PICK A CHALLENGE'),w/2,h*.64,{family:F.display,weight:400,maxW:w*.8,maxH:h*.14,max:h*.11},'#ffffff');
      text(c,tr('Take a card, try it, put it back.'),w/2,h*.82,{family:F.body,weight:800,maxW:w*.8,maxH:h*.1,max:h*.065},p.light);
    }},
    {label:'challenge cards (cut out)', aspect:1.414, board:false, draw(c,w,h,p){
      const u=Math.min(w,h)/100, cw=w/2, ch=h/2;
      d.challenges.forEach((t,k) => {
        const x=(k%2)*cw, y=Math.floor(k/2)*ch;
        rr(c,x+u*3,y+u*3,cw-u*6,ch-u*6,u*4); c.fillStyle=p.card; c.fill(); c.lineWidth=u*1.1; c.strokeStyle=p.mid; c.stroke();
        text(c,tr('CHALLENGE'),x+cw/2,y+ch*.22,{family:F.display,weight:400,maxW:cw*.6,maxH:ch*.1,max:ch*.09},p.mid);
        text(c,t,x+cw/2,y+ch*.58,{family:F.body,weight:800,maxW:cw*.78,maxH:ch*.52,max:ch*.11},p.ink);
      });
      c.setLineDash([u*2,u*1.6]); c.lineWidth=u*.4; c.strokeStyle='#9a9a9a';
      c.beginPath(); c.moveTo(w/2,0); c.lineTo(w/2,h); c.moveTo(0,h/2); c.lineTo(w,h/2); c.stroke(); c.setLineDash([]);
    }}
  ]},
  voice: {name:'Student voice bubble', tag:'int', pages:(d,i) => [{aspect:1.3, draw(c,w,h,p){
    const u=Math.min(w,h)/100;
    c.beginPath(); const bx=u*2,by=u*2,bw=w-u*4,bh=h*.78,r=u*14;
    c.moveTo(bx+r,by); c.arcTo(bx+bw,by,bx+bw,by+bh,r); c.arcTo(bx+bw,by+bh,bx,by+bh,r);
    c.lineTo(w*.34,by+bh); c.lineTo(w*.18,h-u*2); c.lineTo(w*.22,by+bh);
    c.arcTo(bx,by+bh,bx,by,r); c.arcTo(bx,by,bx+bw,by,r); c.closePath();
    c.fillStyle=p.card; c.fill(); c.lineWidth=u*1.5; c.strokeStyle=p.dark; c.lineJoin='round'; c.stroke();
    text(c,d.voice[i],w/2,h*.2,{family:F.hand,weight:400,maxW:w*.8,maxH:h*.16,max:h*.13},p.ink);
    c.strokeStyle=p.light; c.lineWidth=u*.7;
    for (let k=0;k<3;k++){ const y=h*(.38+k*.12); c.beginPath(); c.moveTo(w*.12,y); c.lineTo(w*.88,y); c.stroke(); }
    text(c,tr('ADD YOUR IDEA'),w*.9,h*.88,{family:F.body,weight:900,maxW:w*.5,maxH:h*.07,max:h*.055},p.mid,'right');
  }}]},
  star: {name:'Celebration star', tag:'cel', pages:d => [{aspect:1, draw(c,w,h,p){
    const u=w/100, cx=w/2, cy=h*.53;
    c.strokeStyle=p.mid; c.lineWidth=u*2.2; c.lineCap='round';
    for (let k=0;k<10;k++){ const a=k*Math.PI/5+Math.PI/10; c.beginPath(); c.moveTo(cx+Math.cos(a)*u*42,cy+Math.sin(a)*u*42); c.lineTo(cx+Math.cos(a)*u*47,cy+Math.sin(a)*u*47); c.stroke(); }
    starPath(c,cx,cy,u*40,u*19); c.fillStyle=p.light; c.fill(); c.lineWidth=u*1.6; c.strokeStyle=p.dark; c.lineJoin='round'; c.stroke();
    c.beginPath(); c.arc(cx,cy+u*2,u*17,0,Math.PI*2); c.fillStyle=p.card; c.fill(); c.lineWidth=u*.8; c.stroke();
    text(c,d.celebrate.heading.toUpperCase(),cx,cy-u*3,{family:F.display,weight:400,maxW:u*28,maxH:u*14,max:u*7},p.ink);
    text(c,d.celebrate.prompt,cx,cy+u*9,{family:F.body,weight:800,maxW:u*27,maxH:u*10,max:u*3.6,min:4},p.mid);
  }}]},
  frame: {name:'Work spotlight frame', tag:'cel', pages:d => [{aspect:1.3, draw(c,w,h,p){
    const u=Math.min(w,h)/100;
    rr(c,u*1.5,u*8,w-u*3,h-u*9.5,u*4); c.fillStyle=p.mid; c.fill(); c.lineWidth=u*1.2; c.strokeStyle=p.dark; c.stroke();
    rr(c,u*8,u*15,w-u*16,h-u*23,u*2); c.fillStyle=p.card; c.fill();
    rr(c,u*12,u*24,w-u*24,h-u*36,u*2); c.setLineDash([u*2.5,u*2]); c.lineWidth=u*.7; c.strokeStyle=p.light; c.stroke(); c.setLineDash([]);
    text(c,tr('Pin student work here'),w/2,h*.6,{family:F.hand,weight:400,maxW:w*.6,maxH:h*.1,max:h*.07},p.light);
    const pw=w*.62, ph=u*17; rr(c,(w-pw)/2,0,pw,ph,u*4); c.fillStyle=p.dark; c.fill();
    text(c,d.celebrate.heading.toUpperCase(),w/2,ph/2,{family:F.display,weight:400,maxW:pw*.86,maxH:ph*.6,max:ph*.5},'#ffffff');
    [[u*8,h-u*8],[w-u*8,h-u*8]].forEach(([x,y]) => { starPath(c,x,y,u*5,u*2.3); c.fillStyle=p.light; c.fill(); });
  }}]}
};

/* ---------- templates (board space 1600 × 1000) ---------- */
const TEMPLATES = {
  grid: {name:'Fact gallery', desc:'Four fact cards, three flaps and a star. Clear and tidy.', items:[
    ['banner',0,360,212,880,150,0],
    ['fact',0,180,385,260,320,-.02],['fact',1,500,385,260,320,.015],['fact',2,840,385,260,320,-.01],['fact',3,1160,385,260,320,.02],
    ['flap',0,180,730,250,227,.01],['flap',1,500,730,250,227,-.015],['flap',2,840,730,250,227,.01],['star',0,1170,718,250,250,0]
  ]},
  question: {name:'Big question', desc:'A central question ringed by key words, a challenge pocket and student voice.', items:[
    ['bigq',0,540,235,520,347,0],
    ['vocab',0,110,240,300,240,-.02],['vocab',1,110,520,300,240,.015],['vocab',2,1190,240,300,240,.02],['vocab',3,1190,520,300,240,-.015],
    ['pocket',0,620,612,360,277,0],['voice',0,120,790,240,185,-.02],['star',0,1250,770,210,210,.03]
  ]},
  celebrate: {name:'Celebration wall', desc:'A spotlight for student work with a star, voice bubble, fact and flap.', items:[
    ['banner',0,400,212,800,140,0],
    ['frame',0,510,380,580,446,0],
    ['star',0,135,370,240,240,-.03],['voice',0,115,650,270,208,.02],
    ['fact',0,1245,365,220,275,.02],['flap',0,1222,672,250,227,-.02]
  ]}
};

/* ---------- year group board ---------- */
for (const t of Object.values(TEMPLATES)) t.kind = 'topic';
function lum(hex){ const n = parseInt(hex.slice(1),16); return (0.299*(n>>16&255) + 0.587*(n>>8&255) + 0.114*(n&255)) / 255; }
function shade(hex, k){ const n = parseInt(hex.slice(1),16); const f = v => Math.round(v*(1-k)).toString(16).padStart(2,'0'); return '#' + f(n>>16&255) + f(n>>8&255) + f(n&255); }
function drawContain(c, img, x, y, w, h){ const r = Math.min(w/img.naturalWidth, h/img.naturalHeight), dw = img.naturalWidth*r, dh = img.naturalHeight*r; c.drawImage(img, x+(w-dw)/2, y+(h-dh)/2, dw, dh); }
const imgOk = im => im && im.complete && im.naturalWidth;
Object.assign(TYPES, {
  header: {name:'Section heading', tag:'edu', pages:(d,i) => [{aspect:5.4, draw(c,w,h,p){
    rr(c, 0, h*.06, w, h*.88, h*.1); c.fillStyle = p.mid; c.fill(); c.lineWidth = h*.05; c.strokeStyle = p.dark; c.stroke();
    c.fillStyle = p.light; c.fillRect(w*.018, h*.3, Math.max(2, w*.006), h*.4); c.fillRect(w*.976, h*.3, Math.max(2, w*.006), h*.4);
    text(c, (state.yb.headers[i] || '').toUpperCase(), w/2, h/2, {family:F.display, weight:400, maxW:w*.86, maxH:h*.6, max:h*.5}, '#ffffff');
  }}]},
  tt: {name:'Class timetable', tag:'edu', pages:(d,i) => [{aspect:1.414, draw(c,w,h,p){
    const u = Math.min(w,h)/100, Y = state.yb, cls = Y.classes[i] || '', im = Y.tt[i] && Y.tt[i].img;
    cardBox(c, w, h, u, p.card, p.dark, 4);
    c.save(); rr(c, u*1.5, u*1.5, w-u*3, h-u*3, u*4); c.clip(); c.fillStyle = p.mid; c.fillRect(0, 0, w, h*.17); c.restore();
    text(c, state.lang === 'ar' ? `جدول ${cls}` : `${cls} TIMETABLE`, w/2, h*.095, {family:F.display, weight:400, maxW:w*.8, maxH:h*.1, max:h*.09}, '#ffffff');
    const x = w*.05, y = h*.22, aw = w*.9, ah = h*.72;
    if (imgOk(im)) drawContain(c, im, x, y, aw, ah);
    else { rr(c, x, y, aw, ah, u*2); c.setLineDash([u*2.5, u*2]); c.lineWidth = u*.7; c.strokeStyle = p.light; c.stroke(); c.setLineDash([]);
      text(c, state.lang === 'ar' ? `ثبّت جدول ${cls} هنا` : `Pin the ${cls} timetable here`, w/2, y + ah/2, {family:F.hand, weight:400, maxW:aw*.8, maxH:ah*.3, max:h*.09}, p.mid); }
  }}]},
  mood: {name:'Wellbeing check-in', tag:'int', pages:() => [{aspect:1.33, draw(c,w,h,p){
    const u = Math.min(w,h)/100; cardBox(c, w, h, u, p.card, p.dark, 6);
    text(c, state.yb.mood, w/2, h*.15, {family:F.display, weight:400, maxW:w*.84, maxH:h*.16, max:h*.09}, p.ink);
    const labels = ['Great','Good','Okay','Low','Need to talk'].map(tr);
    labels.forEach((lb, k) => {
      const cx = w*(.12 + k*.19), cy = h*.47, r = w*.07;
      c.beginPath(); c.arc(cx, cy, r, 0, Math.PI*2); c.fillStyle = p.light; c.fill(); c.lineWidth = u*.9; c.strokeStyle = p.dark; c.stroke();
      c.fillStyle = p.dark; [-1,1].forEach(s2 => { c.beginPath(); c.arc(cx + s2*r*.35, cy - r*.2, r*.1, 0, Math.PI*2); c.fill(); });
      c.beginPath(); c.lineWidth = u*.9; c.lineCap = 'round';
      if (k === 0) c.arc(cx, cy + r*.05, r*.5, .15*Math.PI, .85*Math.PI);
      else if (k === 1) c.arc(cx, cy + r*.1, r*.38, .22*Math.PI, .78*Math.PI);
      else if (k === 2){ c.moveTo(cx - r*.35, cy + r*.4); c.lineTo(cx + r*.35, cy + r*.4); }
      else c.arc(cx, cy + r*.75, r*.38, 1.22*Math.PI, 1.78*Math.PI);
      c.stroke();
      if (k === 4){ c.beginPath(); c.arc(cx + r*.42, cy + r*.12, r*.09, 0, Math.PI*2); c.fillStyle = p.mid; c.fill(); }
      text(c, lb, cx, cy + r + h*.07, {family:F.body, weight:900, maxW:w*.17, maxH:h*.1, max:h*.055}, p.ink);
    });
    text(c, tr('Put your sticky note under how you feel'), w/2, h*.87, {family:F.hand, weight:400, maxW:w*.84, maxH:h*.1, max:h*.075}, p.mid);
  }}]},
  notice: {name:'Notice', tag:'int', pages:(d,i) => [{aspect:.9, draw(c,w,h,p){
    const u = Math.min(w,h)/100; cardBox(c, w, h, u, p.card, p.dark, 4);
    c.beginPath(); c.arc(w/2, h*.09, w*.055, 0, Math.PI*2); c.fillStyle = p.mid; c.fill(); c.lineWidth = u; c.strokeStyle = p.dark; c.stroke();
    c.beginPath(); c.arc(w/2 - w*.015, h*.08, w*.015, 0, Math.PI*2); c.fillStyle = p.light; c.fill();
    text(c, tr('NOTICE'), w/2, h*.22, {family:F.display, weight:400, maxW:w*.6, maxH:h*.09, max:h*.07}, p.mid);
    text(c, state.yb.notices[i] || tr('Write a notice here'), w/2, h*.6, {family:F.body, weight:800, maxW:w*.8, maxH:h*.6, max:h*.11}, p.ink);
  }}]},
  leader: {name:'Student leader', tag:'cel', pages:(d,i) => [{aspect:.75, draw(c,w,h,p){
    const u = Math.min(w,h)/100, L = state.yb.leaders[i] || {}; cardBox(c, w, h, u, p.card, p.dark, 5);
    const x = w*.09, y = w*.09, pw = w*.82, ph = h*.6;
    c.save(); rr(c, x, y, pw, ph, u*3); c.clip(); c.fillStyle = p.light; c.fillRect(x, y, pw, ph);
    if (imgOk(L.img)) drawCover(c, L.img, x, y, pw, ph);
    else { c.fillStyle = p.mid; c.beginPath(); c.arc(w/2, y + ph*.38, pw*.17, 0, Math.PI*2); c.fill(); c.beginPath(); c.ellipse(w/2, y + ph*1.02, pw*.36, ph*.36, 0, Math.PI, 0); c.fill(); }
    c.restore();
    text(c, L.name || tr('Student name'), w/2, h*.77, {family:F.body, weight:900, maxW:w*.86, maxH:h*.09, max:h*.07}, p.ink);
    const bh = h*.1; rr(c, w*.08, h*.85, w*.84, bh, bh/2); c.fillStyle = p.dark; c.fill();
    text(c, (L.role || '').toUpperCase(), w/2, h*.85 + bh/2, {family:F.body, weight:900, maxW:w*.76, maxH:bh*.6, max:bh*.45}, '#ffffff');
  }}]},
  house: {name:'House points', tag:'cel', pages:(d,i) => [{aspect:1.25, draw(c,w,h,p){
    const u = Math.min(w,h)/100, H = state.yb.houses[i] || {name:'House', color:'#888888'}, col = H.color || '#888888';
    const ink = lum(col) > .62 ? '#1d1d1d' : '#ffffff';
    rr(c, u*1.5, u*1.5, w-u*3, h-u*3, u*9); c.fillStyle = col; c.fill(); c.lineWidth = u*1.8; c.strokeStyle = shade(col, .35); c.stroke();
    rr(c, u*5, u*5, w-u*10, h-u*10, u*6); c.lineWidth = u*.8; c.strokeStyle = ink === '#ffffff' ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.35)'; c.stroke();
    text(c, (H.name || '').toUpperCase(), w/2, h*.25, {family:F.display, weight:400, maxW:w*.82, maxH:h*.2, max:h*.17}, ink);
    text(c, tr('HOUSE'), w/2, h*.41, {family:F.body, weight:900, maxW:w*.5, maxH:h*.08, max:h*.07}, ink);
    rr(c, w*.12, h*.53, w*.76, h*.33, u*4); c.fillStyle = '#ffffff'; c.fill(); c.lineWidth = u*.8; c.strokeStyle = shade(col, .35); c.stroke();
    text(c, tr('POINTS'), w*.18, h*.6, {family:F.body, weight:900, maxW:w*.3, maxH:h*.06, max:h*.05}, '#555555', 'left');
  }}]}
});
function yearItems(){
  const Y = state.yb, it = [];
  it.push(['header',0,80,212,320,60,-.01]);
  Y.classes.slice(0,6).forEach((c, i) => { const col = i % 2, row = Math.floor(i/2); it.push(['tt',i,46 + col*300,292 + row*226,282,200,(i%2 ? .012 : -.01)]); });
  it.push(['header',1,690,212,340,60,.01]);
  it.push(['mood',0,670,292,380,286,0]);
  it.push(['header',2,690,606,340,60,-.01]);
  const notes = Math.max(1, Math.min(3, Y.notices.filter(n => n && n.trim()).length || 1)), nw = (380 - (notes-1)*12) / notes;
  for (let i = 0; i < notes; i++) it.push(['notice',i,670 + i*(nw + 12),686,nw,Math.min(250, nw/.9),(i%2 ? .02 : -.02)]);
  it.push(['header',3,1130,212,400,60,0]);
  const nl = Math.min(8, Y.leaders.length), lw = 106, lh = 141, rows = Math.ceil(nl/4);
  for (let i = 0; i < nl; i++) it.push(['leader',i,1104 + (i%4)*116,292 + Math.floor(i/4)*154,lw,lh,(i%2 ? .015 : -.015)]);
  const hy = 292 + Math.max(1, rows)*154 + 16;
  it.push(['header',4,1150,hy,360,60,.01]);
  const nh = Math.min(6, Y.houses.length), cols = nh <= 4 ? 2 : 3, hw = cols === 2 ? 200 : 140, hh = hw/1.25;
  const avail = 975 - (hy + 80), rowsH = Math.ceil(nh/cols), hScale = Math.min(1, avail / (rowsH*(hh + 12)));
  for (let i = 0; i < nh; i++){ const w2 = hw*hScale, h2 = hh*hScale; it.push(['house',i,1110 + (i%cols)*(w2 + 22) + (cols === 2 ? 20 : 0),hy + 80 + Math.floor(i/cols)*(h2 + 12),w2,h2,0]); }
  return it;
}
Object.assign(TYPES, {
  tbanner: {name:'Subtitle banner', tag:'edu', pages:() => [{aspect:5, draw(c,w,h,p){ TYPES.banner.pages({subtitle: state.team.subtitle})[0].draw(c,w,h,p); }}]},
  tintro: {name:'Introduction card', tag:'edu', pages:() => [{aspect:.8, draw(c,w,h,p){
    const u = Math.min(w,h)/100, T = state.team; cardBox(c,w,h,u,p.card,p.dark,7);
    const th = h*.16; rr(c, w*.12, u*1.5, w*.76, th, u*4); c.fillStyle = p.dark; c.fill();
    text(c, (T.introHeading || '').toUpperCase(), w/2, u*1.5 + th/2, {family:F.display, weight:400, maxW:w*.68, maxH:th*.7, max:th*.36}, '#ffffff');
    text(c, T.introText || '', w/2, h*.6, {family:F.body, weight:700, maxW:w*.8, maxH:h*.68, max:h*.065}, p.ink);
  }}]},
  tpocket: {name:'Idea pocket', tag:'int', pages:() => [
    {label:'pocket', aspect:1.3, draw(c,w,h,p){
      const u = Math.min(w,h)/100, T = state.team;
      c.save(); c.translate(w*.5,h*.2); c.rotate(-.06); rr(c,-w*.3,-h*.17,w*.6,h*.5,u*4); c.fillStyle=p.card; c.fill(); c.lineWidth=u; c.strokeStyle=p.mid; c.stroke();
      text(c,tr('IDEA'),0,-h*.08,{family:F.display,weight:400,maxW:w*.4,maxH:h*.08,max:h*.06},p.mid); c.restore();
      c.beginPath(); c.moveTo(u*1.5,h*.3); c.lineTo(w*.5,h*.46); c.lineTo(w-u*1.5,h*.3); c.lineTo(w-u*1.5,h-u*1.5); c.lineTo(u*1.5,h-u*1.5); c.closePath();
      c.fillStyle=p.dark; c.fill(); c.lineWidth=u*1.2; c.strokeStyle=p.ink; c.lineJoin='round'; c.stroke();
      text(c,(T.pocketTitle||'').toUpperCase(),w/2,h*.64,{family:F.display,weight:400,maxW:w*.8,maxH:h*.14,max:h*.11},'#ffffff');
      text(c,T.pocketText||'',w/2,h*.83,{family:F.body,weight:800,maxW:w*.8,maxH:h*.14,max:h*.06},p.light);
    }},
    {label:'idea slips (cut out)', aspect:1.414, board:false, draw(c,w,h,p){
      const u = Math.min(w,h)/100, cw = w/2, ch = h/3;
      for (let k = 0; k < 6; k++){ const x = (k%2)*cw, y = Math.floor(k/2)*ch;
        text(c,(state.team.pocketTitle||tr('MY IDEA')).toUpperCase(),x+cw/2,y+ch*.2,{family:F.display,weight:400,maxW:cw*.8,maxH:ch*.14,max:ch*.11},p.mid);
        c.strokeStyle='#bbbbbb'; c.lineWidth=u*.25; for (let l=0;l<3;l++){ const ly=y+ch*(.42+l*.17); c.beginPath(); c.moveTo(x+cw*.1,ly); c.lineTo(x+cw*.9,ly); c.stroke(); } }
      c.setLineDash([u*2,u*1.6]); c.lineWidth=u*.4; c.strokeStyle='#999999'; c.beginPath(); c.moveTo(w/2,0); c.lineTo(w/2,h);
      c.moveTo(0,h/3); c.lineTo(w,h/3); c.moveTo(0,2*h/3); c.lineTo(w,2*h/3); c.stroke(); c.setLineDash([]);
    }}]},
  tmember: {name:'Team member', tag:'cel', pages:(d,i) => [{aspect:.75, draw(c,w,h,p){
    const u = Math.min(w,h)/100, M = state.team.members[i] || {}; cardBox(c,w,h,u,p.card,p.dark,5);
    const x = w*.08, y = w*.08, pw = w*.84, ph = h*.62;
    c.save(); rr(c,x,y,pw,ph,u*3); c.clip(); c.fillStyle = p.light; c.fillRect(x,y,pw,ph);
    if (imgOk(M.img)) drawCover(c, M.img, x, y, pw, ph);
    else { c.fillStyle = p.mid; c.beginPath(); c.arc(w/2, y+ph*.38, pw*.17, 0, Math.PI*2); c.fill(); c.beginPath(); c.ellipse(w/2, y+ph*1.02, pw*.36, ph*.36, 0, Math.PI, 0); c.fill(); }
    c.restore(); rr(c,x,y,pw,ph,u*3); c.lineWidth = u*1.2; c.strokeStyle = p.dark; c.stroke();
    text(c, M.name || tr('Name: ______________'), w/2, h*.765, {family:F.display, weight:400, maxW:w*.86, maxH:h*.08, max:h*.065}, p.ink);
    const bh = h*.105; rr(c, w*.07, h*.85, w*.86, bh, bh/2); c.fillStyle = p.dark; c.fill();
    text(c, (M.role || tr('Role')).toUpperCase(), w/2, h*.85 + bh/2, {family:F.body, weight:900, maxW:w*.78, maxH:bh*.7, max:bh*.42}, '#ffffff');
  }}]}
});
function teamItems(){
  const it = [['tbanner',0,400,212,800,130,0], ['tintro',0,40,370,280,350,-.01], ['tpocket',0,52,740,250,192,.01]];
  const n = Math.max(1, Math.min(14, state.team.members.length));
  const rows = n <= 5 ? 1 : n <= 10 ? 2 : 3, cols = Math.ceil(n/rows);
  const AX = 350, AW = 1210, AY = 365, AH = 610;
  const w = Math.min(AW/cols - 22, (AH/rows - 22)*.75, 300), h = w/.75;
  for (let k = 0; k < n; k++){
    const r = Math.floor(k/cols), inRow = r < rows - 1 ? cols : n - cols*(rows-1), c0 = k - r*cols;
    const rowW = inRow*w + (inRow-1)*22, x0 = AX + (AW - rowW)/2, y0 = AY + (AH - (rows*h + (rows-1)*22))/2;
    it.push(['tmember', k, x0 + c0*(w+22), y0 + r*(h+22), w, h, (k%2 ? .012 : -.012)]);
  }
  return it;
}
TEMPLATES.team = {name:'Team board', kind:'team', desc:'Photo cards for every member, an introduction and an idea pocket.', get items(){ return teamItems(); }};
TEMPLATES.year = {name:'Year group board', kind:'year', desc:'Timetables, wellbeing check-in, notices, student leaders and house points.', get items(){ return yearItems(); }};

/* ---------- title ---------- */
const units = w => isAr(w) ? [w] : [...w];
function titleLayout(c, title, maxW, maxH){
  const words = title.toUpperCase().split(/\s+/).filter(Boolean);
  for (let s = maxH; s > 8; s *= .95){
    c.font = `400 ${s}px ${F.display}`;
    const gap = s*.07, wg = s*.42;
    const ww = words.map(w => units(w).reduce((a,ch) => a + c.measureText(ch).width + gap, -gap));
    const L = [[]], lw = [0];
    words.forEach((w,i) => { const k = L.length-1; const add = (L[k].length ? wg : 0) + ww[i];
      if (L[k].length && lw[k] + add > maxW){ L.push([i]); lw.push(ww[i]); } else { L[k].push(i); lw[k] += add; } });
    const lh = s*1.06;
    if (Math.max(...lw) <= maxW && L.length*lh <= maxH) return {s, gap, wg, L, lw, lh, words};
  }
  return null;
}
function drawLetter(c, ch, x, baseY, s, p, rot){
  const w = c.measureText(ch).width;
  c.save(); c.translate(x + w/2, baseY - s*.36); c.rotate(rot);
  c.direction = isAr(ch) ? 'rtl' : 'ltr'; if (isAr(ch)) c.textAlign = 'right';
  const ox = isAr(ch) ? w/2 : -w/2;
  c.lineJoin='round'; c.lineWidth = s*.09; c.strokeStyle = p.dark; c.strokeText(ch, ox, s*.36);
  c.fillStyle = '#ffffff'; c.fillText(ch, ox, s*.36); c.restore(); c.textAlign = 'left';
  return w;
}
function drawTitle(c, title, cx, top, maxW, maxH, p){
  const T = titleLayout(c, title, maxW, maxH); if (!T) return;
  c.font = `400 ${T.s}px ${F.display}`; c.textAlign='left'; c.textBaseline='alphabetic';
  let y = top + (maxH - T.L.length*T.lh)/2 + T.s*.86, n = 0;
  T.L.forEach((line, li) => {
    let x = cx - T.lw[li]/2;
    const order = line.some(wi => isAr(T.words[wi])) ? [...line].reverse() : line;
    order.forEach((wi, j) => { if (j) x += T.wg; const us = units(T.words[wi]);
      us.forEach((ch, k) => { const rot = Math.sin(n++*2.3)*.035; const w = drawLetter(c, ch, x, y, T.s, p, rot); x += w + (k < us.length-1 ? T.gap : 0); });
    });
    y += T.lh;
  });
}

/* ---------- free space for added pieces ---------- */
const slotCache = {};
const hitR = (a,b) => a[0] < b[0]+b[2] && b[0] < a[0]+a[2] && a[1] < b[1]+b[3] && b[1] < a[1]+a[3];
function freeSlots(tplKey){
  const items = TEMPLATES[tplKey].items, sig = tplKey + ':' + items.map(i => i.slice(2,6).map(Math.round).join(',')).join(';');
  if (slotCache[sig]) return slotCache[sig];
  const occ = items.map(([,,x,y,w,h]) => [x-12,y-12,w+24,h+24]);
  const slots = [];
  for (const S of [150,124,100,84]){
    const cand = [];
    for (let y=214; y+S<=972; y+=8) for (let x=34; x+S<=1566; x+=8) cand.push([x,y]);
    cand.sort((a,b) => Math.abs(b[0]+S/2-800) - Math.abs(a[0]+S/2-800) || a[1]-b[1]);
    for (const [x,y] of cand){ const r = [x,y,S,S]; if (occ.some(o => hitR(o,r))) continue; slots.push(r); occ.push([x-10,y-10,S+20,S+20]); }
  }
  return slotCache[sig] = slots;
}

/* ---------- board ---------- */
function boardRects(tplKey){
  const out = [];
  for (const [type, idx, x, y, w, h, rot] of TEMPLATES[tplKey].items){
    const key = pieceKey(tplKey, type, idx), o = state.pos[key] || [0,0];
    const mx = state.lang === 'ar' ? 1600 - x - w : x;   // Arabic boards read right to left
    out.push({key, colorKey:key, type, idx, x:mx+o[0], y:y+o[1], w, h, rot: state.lang === 'ar' ? -rot : rot});
  }
  const slots = freeSlots(tplKey);
  state.extras.forEach((ex, i) => {
    const s = slots[i] || [740 + (i % 5)*14, 440 + (i % 5)*14, 110];
    const [sx, sy, S0] = s, S = S0 * (ex.scale || 1), a = aspectOf(ex), w = a >= 1 ? S : S*a, h = a >= 1 ? S/a : S;
    const key = tplKey + '|x|' + ex.id, o = state.pos[key] || [0,0];
    const bx = Math.max(24, Math.min(1576 - w, sx + (S0-w)/2)), by = Math.max(214, Math.min(976 - h, sy + (S0-h)/2));
    out.push({key, colorKey:'x|' + ex.id, extra:ex, x:bx + o[0], y:by + o[1], w, h, rot:Math.sin(i*1.7)*.04});
  });
  return out;
}
function drawBoard(c, W, H, p, tplKey){
  const k = W/1600;
  c.fillStyle = p.backing; c.fillRect(0,0,W,H);
  c.save(); c.scale(k,k);
  // scalloped trim
  c.fillStyle = p.trim;
  for (let x=0; x<=1600; x+=40){ c.beginPath(); c.arc(x,0,22,0,Math.PI*2); c.arc(x,1000,22,0,Math.PI*2); c.fill(); }
  for (let y=0; y<=1000; y+=40){ c.beginPath(); c.arc(0,y,22,0,Math.PI*2); c.arc(1600,y,22,0,Math.PI*2); c.fill(); }
  drawTitle(c, state.title, 800, 38, 1420, 168, palFor());
  const rects = boardRects(tplKey);
  const top = drag ? drag.key : (drawingMain ? selKey : null);
  if (top){ const di = rects.findIndex(r => r.key === top); if (di >= 0) rects.push(rects.splice(di, 1)[0]); }
  for (const r of rects){
    c.save(); c.translate(r.x + r.w/2, r.y + r.h/2); c.rotate(r.rot); c.translate(-r.w/2, -r.h/2);
    if (drag && drag.key === r.key){ c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 24; c.shadowOffsetY = 10; }
    const pal = palFor(r.colorKey);
    if (r.extra) EXTRA[r.extra.kind].draw(c, r.w, r.h, pal, r.extra);
    else TYPES[r.type].pages(content, r.idx)[0].draw(c, r.w, r.h, pal, content, r.idx);
    if (drawingMain && selKey === r.key){
      c.shadowColor = 'transparent'; c.setLineDash([16, 10]); c.lineWidth = 6; c.strokeStyle = '#ffcc33';
      c.strokeRect(-8, -8, r.w + 16, r.h + 16); c.setLineDash([]);
    }
    c.restore();
  }
  c.restore();
}

function sizeCanvas(cv, cssW, aspect){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(cssW*dpr); cv.height = Math.round(cssW/aspect*dpr);
  return cv.getContext('2d');
}

/* ---------- pieces list ---------- */
function pieceList(){
  const out = [];
  for (const [type, idx] of TEMPLATES[state.template].items){
    const T = TYPES[type];
    T.pages(content, idx).forEach(pg => out.push({type, idx, key: pieceKey(state.template, type, idx), name: T.name + (pg.label ? ' · ' + pg.label : ''), tag: T.tag, page: pg}));
  }
  for (const ex of state.extras){
    const E = EXTRA[ex.kind];
    out.push({type:'extra', idx:ex.id, key:'x|' + ex.id, extra:ex, tag:E.tag,
      name: ex.kind === 'ib' ? `${ex.label} (${ex.group.toLowerCase()})` : ex.kind === 'photo' ? `Picture${ex.caption ? ' · ' + ex.caption : ''}` : `${E.name}${ex.label ? ' · ' + ex.label : ''}`,
      page: {get aspect(){ return aspectOf(ex); }, draw:(c,w,h,p) => E.draw(c,w,h,p,ex)}});
  }
  return out;
}

/* ---------- render UI ---------- */
const $ = s => document.querySelector(s);
const tplWrap = $('#templates');
function renderTemplates(){
  tplWrap.innerHTML = '';
  for (const [key, t] of Object.entries(TEMPLATES)){
    if ((t.kind || 'topic') !== state.boardType) continue;
    const b = document.createElement('button'); b.type='button'; b.className='tpl'; b.setAttribute('aria-pressed', String(key===state.template));
    const cv = document.createElement('canvas'); b.appendChild(cv);
    const nm = document.createElement('b'); nm.textContent = t.name; b.appendChild(nm);
    const ds = document.createElement('small'); ds.textContent = t.desc; b.appendChild(ds);
    b.addEventListener('click', () => { state.template = key; if (t.kind === 'topic') state.topicTemplate = key; renderColors(); renderAll(); });
    tplWrap.appendChild(b);
    const w = Math.max(140, cv.clientWidth || 150);
    const ctx = sizeCanvas(cv, w, 1.6); drawBoard(ctx, cv.width, cv.height, PAL[state.backing], key);
  }
}
function renderBoard(){
  const cv = $('#boardCanvas'); const w = cv.clientWidth || 900;
  const ctx = sizeCanvas(cv, w, 1.6); drawingMain = true; try { drawBoard(ctx, cv.width, cv.height, PAL[state.backing], state.template); } finally { drawingMain = false; }
  updateSelBar();
}
function renderLetters(){
  const wrap = $('#letters'); wrap.innerHTML = '';
  wrap.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  const p = palFor();
  state.title.toUpperCase().split(/\s+/).filter(Boolean).forEach((word, wi) => {
    if (wi) { const g = document.createElement('span'); g.className='gap'; wrap.appendChild(g); }
    units(word).forEach(ch => {
      const cv = document.createElement('canvas'); cv.title = ch;
      const wide = isAr(ch) ? Math.max(42, 22*ch.length) : 42; cv.style.width = wide + 'px';
      const ctx = sizeCanvas(cv, wide, wide/56); ctx.fillStyle = p.backing; ctx.fillRect(0,0,cv.width,cv.height);
      drawLetterPage(ctx, cv.width, cv.height, p, ch, false); wrap.appendChild(cv);
    });
  });
}
function drawLetterPage(c, w, h, p, ch, paper){
  if (paper){ c.fillStyle='#ffffff'; c.fillRect(0,0,w,h); }
  let s = h*.78; c.font = `400 ${s}px ${F.display}`;
  const mw = c.measureText(ch).width; if (mw > w*.84){ s *= w*.84/mw; c.font = `400 ${s}px ${F.display}`; }
  c.textAlign='center'; c.textBaseline='alphabetic'; c.lineJoin='round'; c.direction = isAr(ch) ? 'rtl' : 'ltr';
  c.lineWidth = s*(paper ? .025 : .09); c.strokeStyle = paper ? '#555555' : p.dark;
  const y = h/2 + s*.36;
  c.strokeText(ch, w/2, y); c.fillStyle = '#ffffff'; c.fillText(ch, w/2, y);
}
function fieldsFor(it){
  const C = content, f = (label, obj, prop, n) => ({label, n: n||90, get: () => obj[prop] ?? '', set: v => { obj[prop] = v; }});
  if (it.extra && it.extra.kind === 'photo') return [f('Caption', it.extra, 'caption', 60), f('Credit (who made the picture)', it.extra, 'credit', 140)];
  if (it.extra && it.extra.kind === 'house') return [f('House name', it.extra, 'label', 20)];
  if (it.extra) return it.extra.kind === 'ib'
    ? [f('Name', it.extra, 'label', 40), f('Description', it.extra, 'desc', 90)]
    : [f('Label', it.extra, 'label', 24)];
  switch (it.type){
    case 'tbanner': return [f('Subtitle', state.team, 'subtitle', 60)];
    case 'tintro': return [f('Heading', state.team, 'introHeading', 30), f('Text', state.team, 'introText', 300)];
    case 'tpocket': return [f('Pocket heading', state.team, 'pocketTitle', 30), f('Pocket text', state.team, 'pocketText', 100)];
    case 'tmember': return [f('Name', state.team.members[it.idx], 'name', 40), f('Role', state.team.members[it.idx], 'role', 50)];
    case 'header': return [f('Heading', state.yb.headers, it.idx, 30)];
    case 'tt': return [f('Class name', state.yb.classes, it.idx, 12)];
    case 'mood': return [f('Question', state.yb, 'mood', 60)];
    case 'notice': return [f('Notice', state.yb.notices, it.idx, 160)];
    case 'leader': return [f('Name', state.yb.leaders[it.idx], 'name', 40), f('Role', state.yb.leaders[it.idx], 'role', 40)];
    case 'house': return [f('House name', state.yb.houses[it.idx], 'name', 20)];
    case 'banner': return [f('Subtitle', C, 'subtitle', 60)];
    case 'bigq': return [f('Question', C, 'bigQuestion', 110)];
    case 'fact': return [f('Heading', C.facts[it.idx], 'heading', 28), f('Fact', C.facts[it.idx], 'text', 150)];
    case 'vocab': return [f('Key word', C.vocab[it.idx], 'term', 22), f('Meaning', C.vocab[it.idx], 'def', 90)];
    case 'flap': return [f('Question (on the flap)', C.flaps[it.idx], 'q', 90), f('Answer (under the flap)', C.flaps[it.idx], 'a', 140)];
    case 'pocket': return C.challenges.map((_, i) => f('Challenge ' + (i+1), C.challenges, i, 100));
    case 'voice': return [f('Sentence starter', C.voice, it.idx, 50)];
    case 'star': case 'frame': return [f('Heading', C.celebrate, 'heading', 24), f('Message', C.celebrate, 'prompt', 70)];
  }
  return [];
}
function renderPieces(){
  const wrap = $('#pieces'); wrap.innerHTML = '';
  const list = pieceList();
  const hiddenN = Math.max(0, state.extras.length - freeSlots(state.template).length);
  $('#pieceCount').textContent = `${list.length} pages of pieces in this layout, plus ${state.title.replace(/\s+/g,'').length} title letters.` +
    (hiddenN > 0 ? ` ${hiddenN} added piece${hiddenN>1?'s':''} had no free space and ${hiddenN>1?'are':'is'} stacked in the middle of the board. Drag ${hiddenN>1?'them':'it'} into place.` : '');
  for (const it of list){
    const card = document.createElement('div'); card.className='piece';
    const th = document.createElement('div'); th.className='thumb';
    const cv = document.createElement('canvas'); th.appendChild(cv);
    const a = it.page.aspect; const cw = a >= 1 ? 130 : 130*a;
    const ctx = sizeCanvas(cv, cw, a); cv.style.width = cw+'px';
    const p = palFor(it.key);
    ctx.scale(cv.width/cw, cv.width/cw); it.page.draw(ctx, cw, cw/a, p, content, it.idx);
    const nm = document.createElement('b'); nm.textContent = it.name;
    const chip = document.createElement('span'); chip.className = 'chip ' + it.tag; chip.textContent = TAGS[it.tag]; chip.style.alignSelf='flex-start';
    const row = document.createElement('div'); row.className='row';
    const dot = document.createElement('span'); dot.className='dot'; dot.style.background = p.mid;
    const sel = document.createElement('select'); sel.id = 'col-' + it.key.replace(/\|/g,'-'); sel.setAttribute('aria-label', 'Colour for ' + it.name);
    const cur = state.over[it.key] || '';
    sel.innerHTML = `<option value="">Board colour (${FAM[state.elem]?.name || 'Match backing'})</option>` +
      Object.entries(FAM).filter(([k]) => k!=='match').map(([k,f]) => `<option value="${k}"${k===cur?' selected':''}>${f.name}</option>`).join('');
    sel.addEventListener('change', () => { if (sel.value) state.over[it.key] = sel.value; else delete state.over[it.key]; renderColors(); renderAll(); });
    row.append(dot, sel);
    card.append(th, nm, chip, row);
    const flds = fieldsFor(it);
    if (flds.length){
      const det = document.createElement('details'); const editKey = it.key + '#' + it.name;
      if (state.editOpen === editKey) det.open = true;
      det.addEventListener('toggle', () => { if (det.open) state.editOpen = editKey; else if (state.editOpen === editKey) state.editOpen = null; });
      const sm = document.createElement('summary'); sm.textContent = 'Edit text'; det.appendChild(sm);
      const box = document.createElement('div'); box.className = 'fields';
      flds.forEach((fd, fi) => {
        const lab = document.createElement('label'); lab.textContent = fd.label;
        const ta = document.createElement('textarea'); ta.maxLength = fd.n; ta.value = fd.get(); ta.id = 'ed-' + it.key.replace(/[^a-z0-9]/gi,'-') + '-' + fi;
        ta.addEventListener('input', () => { fd.set(ta.value);
          const cx = cv.getContext('2d'); cx.setTransform(1,0,0,1,0,0); cx.clearRect(0,0,cv.width,cv.height);
          cx.scale(cv.width/cw, cv.width/cw); it.page.draw(cx, cw, cw/a, p, content, it.idx); renderBoard(); });
        ta.addEventListener('change', () => { renderTemplates(); saveSoon(); });
        lab.appendChild(ta); box.appendChild(lab);
      });
      det.appendChild(box); card.appendChild(det);
    }
    if (it.type === 'tt' || it.type === 'leader' || it.type === 'tmember'){
      const up = document.createElement('label'); up.className = 'mini rm'; up.textContent = it.type === 'tt' ? 'Add timetable picture' : 'Add photo';
      if (it.type === 'tmember' && state.team.members[it.idx] && state.team.members[it.idx].src) up.textContent = 'Change photo';
      const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.hidden = true; up.appendChild(fi);
      fi.addEventListener('change', async () => { const fl = fi.files && fi.files[0]; if (!fl) return;
        const url = URL.createObjectURL(fl);
        try { const im0 = await loadImg(url); const src = shrink(im0, 2200); const im = await loadImg(src);
          if (it.type === 'tt') state.yb.tt[it.idx] = {src, img:im}; else if (it.type === 'tmember') Object.assign(state.team.members[it.idx], {src, img:im}); else Object.assign(state.yb.leaders[it.idx], {src, img:im});
          renderAll(); toast(it.type === 'tt' ? 'Timetable added' : 'Photo added'); }
        catch (e) { toast('That picture could not be read. Try a JPG or PNG.'); } finally { URL.revokeObjectURL(url); } });
      card.appendChild(up);
    }
    if (it.extra){
      const srow = document.createElement('div'); srow.className = 'row';
      const ss = document.createElement('select'); ss.id = 'size-' + it.extra.id; ss.setAttribute('aria-label', 'Size on the board preview for ' + it.name);
      [[.8,'Small on board'],[1,'Medium on board'],[1.6,'Large on board'],[2.4,'Extra large on board']].forEach(([v,l]) => { const o = document.createElement('option'); o.value = v; o.textContent = l; if (Math.abs((it.extra.scale||1) - v) < .01) o.selected = true; ss.appendChild(o); });
      ss.addEventListener('change', () => { it.extra.scale = +ss.value; renderBoard(); renderTemplates(); saveSoon(); });
      srow.appendChild(ss); card.appendChild(srow);
    }
    if (it.extra){ const rm = document.createElement('button'); rm.type='button'; rm.className='mini rm'; rm.textContent='Remove';
      rm.addEventListener('click', () => removeExtra(it.extra.id)); card.appendChild(rm); }
    wrap.appendChild(card);
  }
}
function renderAll(){ renderTemplates(); renderBoard(); renderLetters(); renderPieces(); if (typeof renderMyPics === 'function') renderMyPics(); saveSoon(); }

/* ---------- PDF ---------- */
function pageCanvas(aspect, longSide=2200){
  const cv = document.createElement('canvas');
  if (aspect >= 1){ cv.width = longSide; cv.height = Math.round(longSide/aspect); } else { cv.height = longSide; cv.width = Math.round(longSide*aspect); }
  return cv;
}
async function buildPdf(){
  const { jsPDF } = window.jspdf;
  const p = PAL[state.backing];
  const doc = new jsPDF({orientation:'landscape', unit:'mm', format:'a4', compress:true});
  const safe = t => String(t).replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '').slice(0, 150);
  const caption = (txt, W) => { doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(120); doc.text(safe(txt), 10, 7); };
  const place = (cv, W, H, top=12) => { const m=10, aw=W-2*m, ah=H-top-m; const s=Math.min(aw/cv.width, ah/cv.height); const w=cv.width*s, h=cv.height*s;
    doc.addImage(cv.toDataURL('image/jpeg', .92), 'JPEG', (W-w)/2, top+(ah-h)/2, w, h); };
  // cover
  const cover = pageCanvas(1.6, 2400); drawBoard(cover.getContext('2d'), cover.width, cover.height, p, state.template);
  doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(30); doc.text(safe(`${state.title} - ${TEMPLATES[state.template].name} layout on ${p.name.toLowerCase()} backing`), 10, 10);
  place(cover, 297, 210, 15);
  // letters
  const words = state.title.toUpperCase().split(/\s+/).filter(Boolean); let total = words.reduce((a, w) => a + units(w).length, 0), n = 0;
  for (const [wi, word] of words.entries()){
    for (const [li, ch] of units(word).entries()){
      n++; const arw = isAr(ch); doc.addPage('a4', arw ? 'landscape' : 'portrait');
      caption(arw ? `Title word ${wi+1} of ${words.length} (Arabic words print whole so the letters stay joined) · print on white card and cut on the outline`
                  : `Title letter ${n} of ${total} · word ${wi+1} "${word}", letter ${li+1} · print on white card and cut on the outline`, arw ? 297 : 210);
      if (arw){ const cv = pageCanvas(1.414, 2400); drawLetterPage(cv.getContext('2d'), cv.width, cv.height, palFor(), ch, true); place(cv, 297, 210, 12); await new Promise(r => setTimeout(r, 0)); continue; }
      const cv = pageCanvas(.72, 2000); drawLetterPage(cv.getContext('2d'), cv.width, cv.height, palFor(), ch, true);
      place(cv, 210, 297, 12);
      await new Promise(r => setTimeout(r, 0));
    }
  }
  // pieces
  const list = pieceList();
  for (const [i, it] of list.entries()){
    const port = it.page.aspect < 1; doc.addPage('a4', port ? 'portrait' : 'landscape');
    caption(`Piece ${i+1} of ${list.length} · ${it.name} · ${TAGS[it.tag]}${it.extra && it.extra.credit ? ' · ' + it.extra.credit : ''}`, port ? 210 : 297);
    const cv = pageCanvas(it.page.aspect); const ctx = cv.getContext('2d');
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,cv.width,cv.height);
    it.page.draw(ctx, cv.width, cv.height, palFor(it.key), content, it.idx);
    place(cv, port ? 210 : 297, port ? 297 : 210, 12);
    await new Promise(r => setTimeout(r, 0));
  }
  return doc;
}

/* ---------- wiring ---------- */
const statusEl = $('#status');
const setStatus = (msg, warn=false) => { statusEl.textContent = msg; statusEl.classList.toggle('warn', warn); };

/* ---------- drag on the board ---------- */
let drag = null, selKey = null, drawingMain = false;
function selRect(){ return selKey ? boardRects(state.template).find(r => r.key === selKey) : null; }
function rectName(r){ if (r.extra) return r.extra.kind === 'photo' ? 'Picture' + (r.extra.caption ? ': ' + r.extra.caption : '') : r.extra.kind === 'ib' ? r.extra.label : (r.extra.label || EXTRA[r.extra.kind].name);
  return TYPES[r.type].name; }
function updateSelBar(){
  const bar = document.getElementById('selBar'); if (!bar) return;
  const r = selRect(); if (!r){ bar.hidden = true; return; }
  bar.hidden = false; document.getElementById('selName').textContent = rectName(r);
  ['selSmaller','selBigger','selRemove'].forEach(id => { document.getElementById(id).hidden = !r.extra; });
}
function selectKey(k){ selKey = k; renderBoard(); }
function resizeSel(f){ const r = selRect(); if (!r || !r.extra) return;
  r.extra.scale = Math.max(.5, Math.min(4, (r.extra.scale || 1) * f)); renderAll(); }
document.getElementById('selBigger').addEventListener('click', () => resizeSel(1.25));
document.getElementById('selSmaller').addEventListener('click', () => resizeSel(0.8));
document.getElementById('selRemove').addEventListener('click', () => { const r = selRect(); if (r && r.extra){ selKey = null; removeExtra(r.extra.id); } });
document.getElementById('selDone').addEventListener('click', () => selectKey(null));
function centreExtra(ex){
  const k = state.template + '|x|' + ex.id; delete state.pos[k];
  const r = boardRects(state.template).find(q => q.key === k); if (!r) return;
  state.pos[k] = [800 - (r.x + r.w/2), 590 - (r.y + r.h/2)]; selKey = k;
}
const boardCv = document.getElementById('boardCanvas');
function boardPoint(e){ const r = boardCv.getBoundingClientRect(); return [(e.clientX - r.left) * 1600 / r.width, (e.clientY - r.top) * 1000 / r.height]; }
function hitPiece(x, y){ const rs = boardRects(state.template); for (let i = rs.length - 1; i >= 0; i--){ const r = rs[i]; if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r; } return null; }
boardCv.addEventListener('pointerdown', e => {
  const [x, y] = boardPoint(e); const r = hitPiece(x, y); if (!r){ if (selKey) selectKey(null); return; }
  selKey = r.key;
  drag = {key: r.key, sx: x, sy: y, o: (state.pos[r.key] || [0,0]).slice()};
  boardCv.setPointerCapture(e.pointerId); boardCv.style.cursor = 'grabbing'; renderBoard();
});
boardCv.addEventListener('pointermove', e => {
  const [x, y] = boardPoint(e);
  if (!drag){ boardCv.style.cursor = hitPiece(x, y) ? 'grab' : 'default'; return; }
  const nx = Math.max(-1500, Math.min(1500, drag.o[0] + x - drag.sx)), ny = Math.max(-1000, Math.min(1000, drag.o[1] + y - drag.sy));
  state.pos[drag.key] = [nx, ny]; renderBoard();
});
document.addEventListener('keydown', e => {
  if (!selKey || /input|textarea|select/i.test((e.target.tagName || ''))) return;
  const d = {ArrowLeft:[-10,0], ArrowRight:[10,0], ArrowUp:[0,-10], ArrowDown:[0,10]}[e.key];
  if (d){ e.preventDefault(); const o = state.pos[selKey] || [0,0]; state.pos[selKey] = [o[0] + d[0]*(e.shiftKey?4:1), o[1] + d[1]*(e.shiftKey?4:1)]; renderBoard(); saveSoon(); }
  else if (e.key === 'Escape') selectKey(null);
});
const endDrag = () => { if (!drag) return; drag = null; boardCv.style.cursor = 'grab'; renderBoard(); renderTemplates(); saveSoon(); };
boardCv.addEventListener('pointerup', endDrag); boardCv.addEventListener('pointercancel', endDrag);
document.getElementById('resetPos').addEventListener('click', () => {
  Object.keys(state.pos).forEach(k => { if (k.startsWith(state.template + '|')) delete state.pos[k]; }); renderBoard(); renderTemplates();
});

function addExtra(ex){ ex.id = ex.id || ('e' + (++extraSeq)); state.extras.push(ex); renderAll(); renderIB(); }
function removeExtra(id){ state.extras = state.extras.filter(e => e.id !== id); delete state.over['x|' + id]; renderAll(); renderIB(); }

const iconMsg = $('#iconMsg');
function renderIconGrid(){
  const grid = $('#iconGrid'); grid.innerHTML = '';
  const L = window.lucide && window.lucide.icons;
  if (!L){ grid.innerHTML = '<p class="addmsg">The icon library did not load. You can still upload your own icon.</p>'; return; }
  const q = $('#iconSearch').value.trim().toLowerCase().replace(/\s+/g,'');
  const names = q ? Object.keys(L).filter(n => n.toLowerCase().includes(q)).slice(0, 96) : ICON_PICKS.filter(n => L[n]);
  if (!names.length){ grid.innerHTML = '<p class="addmsg">No icons match. Try a simpler word, like "book" or "leaf".</p>'; return; }
  for (const n of names){
    const nice = n.replace(/([a-z])([A-Z0-9])/g, '$1 $2');
    const b = document.createElement('button'); b.type='button'; b.className='ibtn'; b.setAttribute('aria-label', 'Add ' + nice + ' icon');
    b.innerHTML = iconSvg(n) + `<small>${nice}</small>`;
    b.addEventListener('click', () => { const label = $('#iconLabel').value.trim();
      addExtra({kind:'icon', icon:n, label}); iconMsg.textContent = `Added the ${nice.toLowerCase()} icon${label ? ' labelled "' + label + '"' : ''}.`; });
    grid.appendChild(b);
  }
}
$('#iconSearch').addEventListener('input', () => { clearTimeout(window.__iq); window.__iq = setTimeout(renderIconGrid, 120); });
$('#iconUpload').addEventListener('change', e => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => { const img = new Image(); img.onload = () => { let src = rd.result; try { src = shrink(img, 800, true); } catch(e){}
      addExtra({kind:'icon', img, src, label: $('#iconLabel').value.trim()}); iconMsg.textContent = 'Added your icon.'; };
    img.onerror = () => { iconMsg.textContent = 'That file could not be read as an image. Try a PNG or JPG.'; }; img.src = rd.result; };
  rd.readAsDataURL(f); e.target.value = '';
});

function renderIB(){
  const wrap = $('#ibGroups'); const openIds = [...wrap.querySelectorAll('details[open]')].map(d => d.dataset.id);
  wrap.innerHTML = '';
  IB.forEach((g, gi) => {
    const det = document.createElement('details'); det.className='ibg'; det.dataset.id = g.id;
    if (openIds.length ? openIds.includes(g.id) : gi === 0) det.open = true;
    const added = g.items.filter((_, i) => state.extras.some(e => e.id === `ib-${g.id}-${i}`)).length;
    const sum = document.createElement('summary');
    const sp = document.createElement('span'); sp.textContent = `${g.name} (${added}/${g.items.length})`;
    const all = document.createElement('button'); all.type='button'; all.className='mini';
    const allOn = added === g.items.length; all.textContent = allOn ? 'Remove all' : 'Add all';
    all.addEventListener('click', ev => { ev.preventDefault();
      if (allOn) state.extras = state.extras.filter(e => !e.id.startsWith(`ib-${g.id}-`));
      else g.items.forEach((it, i) => { const id = `ib-${g.id}-${i}`; if (!state.extras.some(e => e.id === id)) state.extras.push(ibCard(g, i)); });
      renderAll(); renderIB(); });
    sum.append(sp, all); det.appendChild(sum);
    const box = document.createElement('div'); box.className='ibitems';
    g.items.forEach((it, i) => {
      const id = `ib-${g.id}-${i}`, on = state.extras.some(e => e.id === id);
      const b = document.createElement('button'); b.type='button'; b.className='ibchip'; b.setAttribute('aria-pressed', String(on));
      b.innerHTML = iconSvg(it[1]); b.appendChild(document.createTextNode(it[0]));
      b.addEventListener('click', () => on ? removeExtra(id) : addExtra(ibCard(g, i)));
      box.appendChild(b);
    });
    det.appendChild(box); wrap.appendChild(det);
  });
}

function renderColors(){
  const wrap = $('#colors'); wrap.innerHTML = '';
  for (const [k, f] of Object.entries(FAM)){
    if (k==='custom') continue;
    const lab = document.createElement('label'); lab.className = 'cbtn' + (k==='match' ? ' match' : ''); lab.title = f.name;
    const inp = document.createElement('input'); inp.type='radio'; inp.name='elem'; inp.value=k; inp.id='elem-'+k; inp.checked = state.elem===k;
    inp.setAttribute('aria-label', k==='match' ? 'Match the backing paper' : f.name);
    const sw = document.createElement('span'); sw.style.setProperty('--c', famOf(k).mid);
    inp.addEventListener('change', () => { state.elem = k; renderColors(); renderAll(); });
    lab.append(inp, sw); wrap.appendChild(lab);
  }
  const nm = state.elem==='custom' ? 'Your colour' : state.elem==='match' ? `Matching the backing (${FAM[MATCH[state.backing]].name.toLowerCase()})` : FAM[state.elem].name;
  const n = Object.keys(state.over).filter(k => k.startsWith(state.template+'|')).length;
  $('#colorName').textContent = nm + (n ? ` · ${n} piece${n>1?'s':''} set separately below` : ' · change single pieces below');
}
$('#customColor').addEventListener('input', e => { state.custom = e.target.value; state.elem = 'custom'; renderColors(); renderAll(); });

document.querySelectorAll('input[name=backing]').forEach(r => r.addEventListener('change', () => { state.backing = r.value; renderColors(); renderAll(); }));

const PROMPT = (title, idea, grade) => `You are helping a school teacher design a classroom bulletin board.
Title: ${title}
Idea: ${idea || '(none given)'}
Students: ${grade || 'not specified'}
Write short, accurate, age-appropriate content in British English. Every string will be printed on a small card, so keep within the word limits.
Return only JSON with exactly this shape:
{"subtitle":"max 8 words","bigQuestion":"one thought-provoking question, max 14 words","facts":[{"heading":"max 3 words","text":"max 22 words"}],"vocab":[{"term":"1-2 words","def":"max 12 words"}],"flaps":[{"q":"a question students think about before lifting a flap, max 12 words","a":"the answer, max 20 words"}],"challenges":["a quick task students can do at the board, max 14 words"],"celebrate":{"heading":"max 3 words celebrating students","prompt":"max 10 words"},"voice":["a sentence starter for students' sticky notes, max 6 words, ending with …"]}
facts: exactly 4. vocab: exactly 4. flaps: exactly 3. challenges: exactly 4. voice: exactly 3.`;
const genBtn = $('#gen');
const genLabel = CONFIG.aiEndpoint ? 'Write my board content' : 'Fill the board with starter text';
genBtn.textContent = genLabel;
$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const title = $('#title').value.trim(), idea = $('#idea').value.trim(), grade = $('#grade').value.trim();
  if (!title){ setStatus('Add a board title first.', true); $('#title').focus(); return; }
  state.title = title; state.idea = idea; state.grade = grade;
  let raw = null, used = 'local';
  if (CONFIG.aiEndpoint){
    genBtn.disabled = true; genBtn.textContent = 'Writing content…';
    setStatus('Writing facts, questions and prompts for your board. This takes about 15 seconds.');
    try {
      const r = await fetch(CONFIG.aiEndpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title, idea, grade, lang: state.lang})});
      if (r.ok){ raw = await r.json(); if (!raw.error) used = 'ai'; else raw = null; }
    } catch (err) { raw = null; }
    genBtn.disabled = false; genBtn.textContent = genLabel;
  }
  content = normalize(raw, title, idea);
  renderAll();
  if (used === 'ai') setStatus('Done. Read each piece in step 5 and change any words you like.');
  else if (CONFIG.aiEndpoint) setStatus('The writing service did not answer, so the board has starter text. Try again in a minute, or edit the text in step 5.', true);
  else setStatus('Starter text added from your idea. Change any words in step 5 under "Pieces to print".');
  toast('Board content updated');
});

$('#dl').addEventListener('click', async () => {
  const btn = $('#dl'); const note = $('#dlNote');
  if (!window.jspdf){ note.textContent = 'The PDF tool did not load. Check your internet connection and reload the page.'; return; }
  btn.disabled = true; btn.textContent = 'Building PDF…'; note.textContent = 'Drawing each page at print quality. This takes a few seconds.';
  try {
    const doc = await buildPdf();
    const slug = state.title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g,'-').replace(/^-|-$/g,'') || 'board';
    doc.save(`${slug}-${state.template}-${state.backing}.pdf`);
    note.textContent = 'Downloaded. Print at 100% (actual size) on A4 white card.';
  } catch (err) {
    console.error(err);
    note.textContent = 'The PDF could not be made. If you added pictures from other websites, remove the last one and try again.';
  } finally { btn.disabled = false; btn.textContent = 'Download PDF'; }
});

/* ---------- small helpers ---------- */
let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); }
function loadImg(src, cors){
  return new Promise((res, rej) => { const i = new Image(); if (cors) i.crossOrigin = 'anonymous';
    i.onload = () => res(i); i.onerror = () => rej(new Error('load failed')); i.src = src; });
}
function shrink(img, max = 2000, keepAlpha = false){
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(img.naturalWidth*k)); cv.height = Math.max(1, Math.round(img.naturalHeight*k));
  const c = cv.getContext('2d'); if (!keepAlpha){ c.fillStyle = '#ffffff'; c.fillRect(0, 0, cv.width, cv.height); }
  c.drawImage(img, 0, 0, cv.width, cv.height);
  return cv.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', .9);   // throws if the picture's website blocks printing
}

/* ---------- steps ---------- */
function goStep(n){
  state.step = n;
  document.querySelectorAll('.step').forEach(sec => { sec.hidden = +sec.dataset.step !== n; });
  document.querySelectorAll('#stepper button').forEach(b => { if (+b.dataset.go === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  if (n === 3) renderTemplates();
  if (n === 4 && !$('#picResults').children.length && !picState.searched) { $('#picQuery').value = $('#picQuery').value || state.title; searchPictures(true); }
  const panel = $('#panel'); panel.scrollTop = 0;
  if (window.innerWidth <= 980) panel.scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('#stepper button').forEach(b => b.addEventListener('click', () => goStep(+b.dataset.go)));
document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => goStep(Math.min(5, (state.step||1) + 1))));
document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => goStep(Math.max(1, (state.step||1) - 1))));

/* tabs in step 4 */
const tabs = [...document.querySelectorAll('[role=tab]')];
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(o => { const on = o === t; o.setAttribute('aria-selected', String(on)); document.getElementById(o.getAttribute('aria-controls')).hidden = !on; });
}));

/* title updates live */
let titleT;
$('#title').addEventListener('input', () => { clearTimeout(titleT); titleT = setTimeout(() => { if (state.boardType === 'topic'){ state.title = $('#title').value.trim() || ' '; renderAll(); } }, 250); });
['idea','grade'].forEach(id => $('#' + id).addEventListener('input', () => { state[id] = $('#' + id).value; saveSoon(); }));

/* ---------- pictures ---------- */
const picState = {q:'', page:1, searched:false, busy:false};
const picMsg = $('#picMsg');
function stripHtml(h){ const d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
function licenceName(r){
  const l = (r.license || '').toLowerCase();
  if (l === 'pdm') return 'Public domain'; if (l === 'cc0') return 'CC0';
  return `CC ${l.toUpperCase()} ${r.license_version || ''}`.trim();
}
async function searchOpenverse(q, page){
  const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=20&page=${page}&mature=false`);
  if (!r.ok) throw new Error('openverse ' + r.status);
  const d = await r.json();
  return (d.results || []).map(x => ({
    src:'Openverse', title: x.title || 'Untitled', thumb: x.thumbnail || x.url, full: x.url, fallback: x.thumbnail,
    link: x.foreign_landing_url || x.url,
    credit: `${x.title ? '"' + x.title + '"' : 'Picture'}${x.creator ? ' by ' + x.creator : ''} · ${licenceName(x)} · via Openverse`
  }));
}
async function searchWikimedia(q, page){
  const offset = (page - 1) * 20;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=20&gsroffset=${offset}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=400`;
  const r = await fetch(url); if (!r.ok) throw new Error('wikimedia ' + r.status);
  const d = await r.json(); const pages = Object.values((d.query && d.query.pages) || {}).sort((a,b) => (a.index||0) - (b.index||0));
  return pages.filter(p => p.imageinfo && p.imageinfo[0]).map(p => {
    const ii = p.imageinfo[0], md = ii.extmetadata || {};
    const big = ii.width > 1800 && ii.thumburl ? ii.thumburl.replace(/\/\d+px-/, '/1800px-') : ii.url;
    const artist = stripHtml(md.Artist && md.Artist.value), lic = stripHtml(md.LicenseShortName && md.LicenseShortName.value);
    const name = p.title.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '');
    return {src:'Wikimedia', title: name, thumb: ii.thumburl || ii.url, full: big, fallback: ii.thumburl, link: ii.descriptionurl,
      credit: `"${name}"${artist ? ' by ' + artist : ''}${lic ? ' · ' + lic : ''} · via Wikimedia Commons`};
  });
}
async function searchPictures(fresh){
  const q = $('#picQuery').value.trim(); if (!q){ picMsg.textContent = 'Type what you are looking for, for example "volcano" or "map of Europe".'; return; }
  if (picState.busy) return;
  if (fresh){ picState.q = q; picState.page = 1; $('#picResults').innerHTML = ''; }
  picState.busy = true; picState.searched = true; picMsg.textContent = `Searching for "${picState.q}"…`;
  const [ov, wm] = await Promise.allSettled([searchOpenverse(picState.q, picState.page), searchWikimedia(picState.q, picState.page)]);
  picState.busy = false;
  const a = ov.status === 'fulfilled' ? ov.value : [], b = wm.status === 'fulfilled' ? wm.value : [];
  const mixed = []; for (let i = 0; i < Math.max(a.length, b.length); i++){ if (a[i]) mixed.push(a[i]); if (b[i]) mixed.push(b[i]); }
  if (!mixed.length && picState.page === 1){
    picMsg.textContent = (ov.status === 'rejected' && wm.status === 'rejected')
      ? 'The picture libraries did not answer. Check your internet connection and try again.'
      : `No pictures found for "${picState.q}". Try a simpler word.`;
    $('#picMore').hidden = true; return;
  }
  picMsg.textContent = 'Tap a picture to add it to the board. Check pictures before printing, as results come from open libraries.';
  const grid = $('#picResults');
  for (const r of mixed){
    const b2 = document.createElement('button'); b2.type = 'button'; b2.className = 'pick'; b2.title = r.credit;
    const im = document.createElement('img'); im.loading = 'lazy'; im.alt = r.title; im.src = r.thumb; im.referrerPolicy = 'no-referrer';
    im.onerror = () => b2.remove();
    const sb = document.createElement('span'); sb.className = 'src'; sb.textContent = r.src;
    const cap = document.createElement('small'); cap.textContent = r.title;
    b2.append(im, sb, cap);
    b2.addEventListener('click', () => addRemotePicture(r, b2));
    grid.appendChild(b2);
  }
  $('#picMore').hidden = mixed.length < 10;
}
$('#picForm').addEventListener('submit', e => { e.preventDefault(); searchPictures(true); });
$('#picMoreBtn').addEventListener('click', () => { picState.page++; searchPictures(false); });

async function addPhotoFromSrc(src, meta = {}){
  const img = await loadImg(src);
  const ex = {kind:'photo', src, img, ratio: img.naturalWidth / img.naturalHeight, caption: $('#picCaption').value.trim(), credit: meta.credit || '', link: meta.link || '', scale: 1.6};
  ex.id = 'e' + (++extraSeq); state.extras.push(ex); centreExtra(ex); renderAll(); renderIB();
  if (window.innerWidth <= 980) document.getElementById('boardCanvas').scrollIntoView({behavior:'smooth', block:'center'});
  $('#picCaption').value = '';
}
async function addRemotePicture(r, btn){
  btn.classList.add('busy'); picMsg.textContent = 'Adding the picture…';
  let src = null, small = false;
  for (const [u, isSmall] of [[r.full, false], [r.fallback, true]]){
    if (!u) continue;
    try { const im = await loadImg(u, true); src = shrink(im, 2000); small = isSmall; break; } catch (e) {}
  }
  btn.classList.remove('busy');
  if (!src){ picMsg.innerHTML = ''; picMsg.append('This picture\'s website does not allow it to be printed from here. ');
    const a = document.createElement('a'); a.href = r.link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open its page';
    picMsg.append(a, ', save it to your computer, then use Upload pictures.'); return; }
  await addPhotoFromSrc(src, {credit: r.credit, link: r.link});
  btn.classList.add('added');
  picMsg.textContent = small ? 'Added a smaller copy of the picture. It may look slightly soft if printed very large.' : 'Picture added. Drag it on the board to place it.';
  toast('Picture added to the board');
}
async function addPictureFile(file, credit = ''){
  if (!file || !file.type.startsWith('image/')){ toast('That file is not a picture'); return; }
  const url = URL.createObjectURL(file);
  try { const im = await loadImg(url); const src = shrink(im, 2000); await addPhotoFromSrc(src, {credit}); toast('Picture added to the board'); }
  catch (e) { toast('That picture could not be read. Try a JPG or PNG.'); }
  finally { URL.revokeObjectURL(url); }
}
async function uploadMany(files){
  files = [...files].filter(f => f && (f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name)));
  if (!files.length){ toast('Choose a picture file (JPG, PNG, GIF or WEBP).'); return; }
  let ok = 0;
  for (const [i, f] of files.entries()){
    if (files.length > 1) toast(`Adding picture ${i+1} of ${files.length}…`);
    const before = state.extras.length; await addPictureFile(f); if (state.extras.length > before) ok++;
  }
  if (ok) toast(ok === 1 ? 'Picture added. Drag it on the board to place it.' : `${ok} pictures added. Drag them on the board to place them.`);
  else if (files.some(f => /\.(heic|heif)$/i.test(f.name))) toast('This browser cannot open HEIC photos. On iPhone choose "Most Compatible" in Camera settings, or send the photo as JPG.');
}
['picUpload','picUpload2','boardUpload'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('change', async e => { await uploadMany(e.target.files); e.target.value = ''; }); });
const uz = document.getElementById('uploadZone');
if (uz){ ['dragover','dragenter'].forEach(t => uz.addEventListener(t, () => uz.classList.add('over'))); ['dragleave','drop'].forEach(t => uz.addEventListener(t, () => uz.classList.remove('over'))); }

function renderMyPics(){
  const wrap = document.getElementById('myPics'); if (!wrap) return;
  const pics = state.extras.filter(e => e.kind === 'photo');
  wrap.hidden = !pics.length; const grid = document.getElementById('myPicGrid'); grid.innerHTML = '';
  for (const ex of pics){
    const card = document.createElement('div'); card.className = 'mypic';
    const im = document.createElement('img'); im.src = ex.src || (ex.img && ex.img.src) || ''; im.alt = ex.caption || 'Your picture';
    const cap = document.createElement('input'); cap.type = 'text'; cap.maxLength = 60; cap.placeholder = 'Add a caption'; cap.value = ex.caption || ''; cap.id = 'mpcap-' + ex.id; cap.setAttribute('aria-label', 'Caption');
    cap.addEventListener('input', () => { ex.caption = cap.value; renderBoard(); });
    cap.addEventListener('change', () => { renderAll(); });
    const acts = document.createElement('div'); acts.className = 'acts';
    const sz = document.createElement('select'); sz.id = 'mpsz-' + ex.id; sz.setAttribute('aria-label', 'Size on the board');
    [[.8,'Small'],[1,'Medium'],[1.6,'Large'],[2.4,'Extra large']].forEach(([v,l]) => { const o = document.createElement('option'); o.value = v; o.textContent = l; if (Math.abs((ex.scale||1) - v) < .01) o.selected = true; sz.appendChild(o); });
    sz.addEventListener('change', () => { ex.scale = +sz.value; renderAll(); });
    const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'mini'; rm.textContent = 'Remove'; rm.setAttribute('aria-label', 'Remove picture');
    rm.addEventListener('click', () => removeExtra(ex.id));
    acts.append(sz, rm); card.append(im, cap, acts); grid.appendChild(card);
  }
}

/* Google Images link follows the search box and the free-to-reuse tick */
function updateGoogle(){
  const q = $('#picQuery').value.trim() || state.title;
  $('#googleLink').href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}${$('#googleFree').checked ? '&tbs=sur:cl' : ''}`;
}
$('#picQuery').addEventListener('input', updateGoogle); $('#googleFree').addEventListener('change', updateGoogle);

/* paste a copied picture anywhere on the page */
document.addEventListener('paste', async e => {
  const items = [...(e.clipboardData ? e.clipboardData.items : [])].filter(i => i.type.startsWith('image/'));
  if (!items.length) return;
  e.preventDefault();
  const html = e.clipboardData.getData('text/html'); const m = html && html.match(/<img[^>]+src="([^"]+)"/i);
  await addPictureFile(items[0].getAsFile(), m && /^https?:/.test(m[1]) ? 'Pasted from ' + new URL(m[1]).hostname : '');
  if (state.step !== 4) goStep(4);
});

/* drag a picture file onto the page */
let dragDepth = 0; const dz = $('#dropzone');
const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
window.addEventListener('dragenter', e => { if (!hasFiles(e)) return; dragDepth++; dz.hidden = false; });
window.addEventListener('dragleave', e => { if (!hasFiles(e)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) dz.hidden = true; });
window.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
window.addEventListener('drop', async e => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth = 0; dz.hidden = true;
  for (const f of [...e.dataTransfer.files]) await addPictureFile(f); });

/* ---------- ready-made board library ---------- */
const LIB = window.BOARD_LIBRARY || [];
function renderLibrary(){
  const wrap = $('#libList'); if (!wrap) return; wrap.innerHTML = '';
  const q = $('#libSearch').value.trim().toLowerCase();
  const groups = {};
  LIB.filter(b => b.boardType !== 'team').filter(b => !q || (b.title + ' ' + b.group + ' ' + b.idea).toLowerCase().includes(q)).forEach(b => (groups[b.group] ||= []).push(b));
  const keys = Object.keys(groups);
  if (!keys.length){ wrap.innerHTML = '<p class="addmsg">No ready-made board matches. Type your own title and idea below.</p>'; return; }
  for (const g of keys){
    const h = document.createElement('div'); h.className = 'libgroup'; h.textContent = g; wrap.appendChild(h);
    const row = document.createElement('div'); row.className = 'ibitems';
    for (const b of groups[g]){
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ibchip';
      const BA = state.lang === 'ar' && (window.BOARD_LIBRARY_AR || {})[b.id]; btn.textContent = BA ? `${BA.title} · ${b.title}` : b.title;
      btn.setAttribute('aria-pressed', String(state.libId === b.id)); btn.title = b.idea;
      btn.addEventListener('click', () => applyLibrary(b)); row.appendChild(btn);
    }
    wrap.appendChild(row);
  }
}
function applyLibrary(b){
  if (b.boardType === 'team'){
    state.libId = b.id; state.boardType = 'team'; state.template = 'team'; state.title = b.title;
    state.team = JSON.parse(JSON.stringify(b.team));
    const TA = state.lang === 'ar' && (window.BOARD_TEAM_AR || {})[b.id];
    if (TA){ state.title = TA.title; ['subtitle','introHeading','introText','pocketTitle','pocketText'].forEach(k => { state.team[k] = TA[k]; });
      state.team.members.forEach((M, i) => { M.role = TA.roleAll || (TA.roles || [])[i] || M.role; }); }
    state.team.members.forEach(M => { if (M.src && !M.img) loadImg(M.src).then(im => { M.img = im; renderAll(); }).catch(() => {}); });
    if (b.backing && PAL[b.backing]){ state.backing = b.backing; const r = document.getElementById('bk-' + b.backing); if (r) r.checked = true; }
    state.elem = b.elem && FAM[b.elem] ? b.elem : 'match';
    state.extras = state.extras.filter(e => e.kind !== 'house' && !e.fromLib);
    syncBoardTypeUI(); renderColors(); renderAll(); renderIB(); renderLibrary();
    toast(b.title + ' board loaded'); return;
  }
  if (state.boardType !== 'topic'){ state.boardType = 'topic'; state.template = state.topicTemplate || 'grid'; syncBoardTypeUI(); }
  const BA = state.lang === 'ar' && (window.BOARD_LIBRARY_AR || {})[b.id];
  const btitle = BA ? BA.title : b.title;
  state.libId = b.id; state.title = btitle; $('#title').value = btitle; $('#idea').value = b.idea; state.idea = b.idea;
  content = normalize(JSON.parse(JSON.stringify(BA ? BA.content : b.content)), btitle, b.idea);
  if (b.backing && PAL[b.backing]){ state.backing = b.backing; const r = document.getElementById('bk-' + b.backing); if (r) r.checked = true; }
  state.elem = b.elem && FAM[b.elem] ? b.elem : 'match';
  state.extras = state.extras.filter(e => e.kind !== 'house' && !e.fromLib);
  (b.houses || []).forEach((hh, i) => { const k = YB_DEF.en.houses.indexOf(hh.name); state.extras.push({id:'house-' + i, kind:'house', label: state.lang === 'ar' && k >= 0 ? YB_DEF.ar.houses[k] : hh.name, color:hh.color, scale:1}); });
  (b.ib || []).forEach(gid => { const g = IB.find(x => x.id === gid); if (!g) return;
    g.items.forEach((it, i) => { const id = `ib-${g.id}-${i}`; if (!state.extras.some(e => e.id === id)) state.extras.push({...ibCard(g, i), fromLib:true}); }); });
  renderColors(); renderAll(); renderIB(); renderLibrary();
  setStatus(`Loaded the ${b.title} board. Change any words in step 5, or press Next.`);
  toast(b.title + ' board loaded');
}
$('#libSearch').addEventListener('input', renderLibrary);
function renderTeamLib(){
  const wrap = document.getElementById('teamLib'); if (!wrap) return; wrap.innerHTML = '';
  LIB.filter(b => b.boardType === 'team').forEach(b => { const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ibchip';
    const TA = state.lang === 'ar' && (window.BOARD_TEAM_AR || {})[b.id]; btn.textContent = TA ? `${TA.title} · ${b.title}` : b.title; btn.title = b.idea; btn.setAttribute('aria-pressed', String(state.libId === b.id));
    btn.addEventListener('click', () => { applyLibrary(b); renderTeamLib(); }); wrap.appendChild(btn); });
}

/* ---------- board language ---------- */
const YB_DEF = {en:{headers:['Timetables','Wellbeing','Notices','Student Leadership','House Points'], mood:'How are you feeling today?', houses:['Camels','Dhows','Falcons','Khanjars'], year:'Year 8',
  notices:['Trip forms are due on Thursday.','Library books back by Friday.']},
  ar:{headers:['الجداول الدراسية','الرفاهية','الإعلانات','القيادة الطلابية','نقاط البيوت'], mood:'كيف تشعر اليوم؟', houses:['الجِمال','الداوات','الصقور','الخناجر'], year:'الصف الثامن',
  notices:['آخر موعد لتسليم استمارات الرحلة يوم الخميس.','أعيدوا كتب المكتبة قبل يوم الجمعة.']}};
function swapDefaults(from, to){
  const Y = state.yb, A = YB_DEF[from], B = YB_DEF[to];
  Y.headers = Y.headers.map((x, i) => x === A.headers[i] ? B.headers[i] : x);
  if (Y.mood === A.mood) Y.mood = B.mood;
  Y.houses.forEach(H => { const k = A.houses.indexOf(H.name); if (k >= 0) H.name = B.houses[k]; });
  Y.notices = Y.notices.map(n => { const k = A.notices.indexOf(n); return k >= 0 ? B.notices[k] : n; });
  const RL = {en:['Year Leader','Deputy Leader','Wellbeing Ambassador','Sports Captain','Class Representative'], ar:['قائد الصف','نائب القائد','سفير الرفاهية','قائد الرياضة','ممثل الصف']};
  const SN = {en:'Student name', ar:'اسم الطالب'};
  Y.leaders.forEach(L => { const k = RL[from].indexOf(L.role); if (k >= 0) L.role = RL[to][k]; if (L.name === SN[from]) L.name = SN[to]; });
  const TM = {en:['President','Vice President','Team member'], ar:['الرئيس','نائب الرئيس','عضو الفريق']};
  state.team.members.forEach(M => { const k = TM[from].indexOf(M.role); if (k >= 0) M.role = TM[to][k]; });
  if (Y.year === A.year){ Y.year = B.year; if (state.boardType === 'year') state.title = Y.year; }
}
async function setLang(l){
  if (l === state.lang) return;
  const from = state.lang; state.lang = l;
  if (l === 'ar') await Promise.all([document.fonts.load(`400 40px 'Lalezar'`), document.fonts.load(`800 20px 'Cairo'`), document.fonts.load(`900 20px 'Cairo'`)]).catch(() => {});
  swapDefaults(from, l);
  state.extras = state.extras.map(e => { if (e.kind !== 'ib') return e; const m = /^ib-(\w+)-(\d+)$/.exec(e.id); const g = m && IB.find(x => x.id === m[1]);
    return g ? {...e, ...ibCard(g, +m[2])} : e; });
  const lib = state.libId && LIB.find(b => b.id === state.libId);
  if (lib && (lib.boardType === 'team') === (state.boardType === 'team') && state.boardType !== 'year'){ applyLibrary(lib); }
  else if (state.boardType === 'topic' && (state.title === 'The Water Cycle' || state.title === 'دورة الماء')){
    const ex = (window.BOARD_LIBRARY_AR || {})._example;
    if (l === 'ar' && ex){ state.title = ex.title; content = normalize(JSON.parse(JSON.stringify(ex.content)), ex.title, ''); }
    else { state.title = 'The Water Cycle'; content = JSON.parse(JSON.stringify(EXAMPLE)); }
    $('#title').value = state.title;
  } else if (state.boardType === 'topic'){
    setStatus(l === 'ar' ? 'Board language is Arabic. Press the button to write this board in Arabic, or choose a ready-made board.' : 'Board language is English. Press the button to write this board in English.');
  }
  syncBoardTypeUI(); renderLibrary(); renderTeamLib(); renderIB(); renderAll();
  toast(l === 'ar' ? 'اللوحة الآن باللغة العربية' : 'Board language: English');
}
document.querySelectorAll('input[name=lang]').forEach(r => r.addEventListener('change', () => setLang(r.value)));

/* ---------- board type + year group form ---------- */
let yearDefaultsApplied = false;
function syncBoardTypeUI(){
  const yr = state.boardType === 'year', tm = state.boardType === 'team';
  $('#topicFields').hidden = yr || tm; $('#yearFields').hidden = !yr; $('#teamFields').hidden = !tm;
  const r = document.getElementById('bt-' + state.boardType); if (r) r.checked = true;
  $('#tmTitle').value = tm ? state.title : ($('#tmTitle').value || 'Our Team'); $('#tmSubtitle').value = state.team.subtitle;
  $('#tmIntroH').value = state.team.introHeading; $('#tmIntro').value = state.team.introText;
  renderTeamList();
  $('#ybYear').value = state.yb.year; $('#ybClasses').value = state.yb.classes.join(', ');
  $('#ybNotices').value = state.yb.notices.join('\n'); $('#ybMood').value = state.yb.mood;
  renderYearLists();
}
function setBoardType(t){
  state.boardType = t;
  if (t === 'year'){
    state.template = 'year'; state.title = state.yb.year || 'Year';
    if (!yearDefaultsApplied && state.backing === 'green' && state.elem === 'match'){ yearDefaultsApplied = true; state.backing = 'black'; state.elem = 'green'; document.getElementById('bk-black').checked = true; }
  } else if (t === 'team'){ state.template = 'team'; state.title = $('#tmTitle').value.trim() || 'Our Team'; }
  else { state.template = state.topicTemplate || 'grid'; state.title = $('#title').value.trim() || 'My Board'; }
  syncBoardTypeUI(); renderColors(); renderAll();
}
let tmT; const tmSoon = fn => { clearTimeout(tmT); tmT = setTimeout(() => { fn(); renderAll(); }, 220); };
$('#tmTitle').addEventListener('input', () => tmSoon(() => { state.title = $('#tmTitle').value.trim() || ' '; }));
$('#tmSubtitle').addEventListener('input', () => tmSoon(() => { state.team.subtitle = $('#tmSubtitle').value; }));
$('#tmIntroH').addEventListener('input', () => tmSoon(() => { state.team.introHeading = $('#tmIntroH').value; }));
$('#tmIntro').addEventListener('input', () => tmSoon(() => { state.team.introText = $('#tmIntro').value; }));
function renderTeamList(){
  const wrap = $('#tmMembers'); wrap.innerHTML = '';
  state.team.members.forEach((M, i) => {
    const row = document.createElement('div'); row.className = 'lrow tmrow';
    const th = document.createElement('label'); th.className = 'tmthumb'; th.title = 'Add or change photo';
    if (M.src){ const im = document.createElement('img'); im.src = M.src; im.alt = ''; th.appendChild(im); } else th.textContent = '+ Photo';
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.hidden = true; th.appendChild(fi);
    fi.addEventListener('change', async () => { const fl = fi.files && fi.files[0]; if (!fl) return; const url = URL.createObjectURL(fl);
      try { const im0 = await loadImg(url); const src = shrink(im0, 1400); Object.assign(M, {src, img: await loadImg(src)}); renderTeamList(); renderAll(); }
      catch (e) { toast('That picture could not be read. Try a JPG or PNG.'); } finally { URL.revokeObjectURL(url); } });
    const nm = document.createElement('input'); nm.type = 'text'; nm.value = M.name || ''; nm.placeholder = 'Name'; nm.maxLength = 40; nm.id = 'tm-name-' + i; nm.setAttribute('aria-label', 'Member ' + (i+1) + ' name');
    const ro = document.createElement('input'); ro.type = 'text'; ro.value = M.role || ''; ro.placeholder = 'Role'; ro.maxLength = 50; ro.id = 'tm-role-' + i; ro.setAttribute('aria-label', 'Member ' + (i+1) + ' role');
    const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'mini'; rm.textContent = '×'; rm.setAttribute('aria-label', 'Remove member ' + (i+1));
    nm.addEventListener('input', () => tmSoon(() => { M.name = nm.value.trim(); }));
    ro.addEventListener('input', () => tmSoon(() => { M.role = ro.value.trim(); }));
    rm.addEventListener('click', () => { state.team.members.splice(i, 1); renderTeamList(); renderAll(); });
    const fields = document.createElement('div'); fields.className = 'tmfields'; fields.append(nm, ro);
    row.append(th, fields, rm); wrap.appendChild(row);
  });
  $('#tmAdd').hidden = state.team.members.length >= 14;
}
$('#tmAdd').addEventListener('click', () => { state.team.members.push({name:'', role:'Team member'}); renderTeamList(); renderAll(); });
document.querySelectorAll('input[name=btype]').forEach(r => r.addEventListener('change', () => setBoardType(r.value)));
function ybChanged(){ renderAll(); }
let ybT; const ybSoon = fn => { clearTimeout(ybT); ybT = setTimeout(() => { fn(); ybChanged(); }, 220); };
$('#ybYear').addEventListener('input', () => ybSoon(() => { state.yb.year = $('#ybYear').value.trim() || 'Year'; state.title = state.yb.year; }));
$('#ybClasses').addEventListener('input', () => ybSoon(() => { state.yb.classes = $('#ybClasses').value.split(/[,;\n]+/).map(x => x.trim()).filter(Boolean).slice(0, 6); }));
$('#ybNotices').addEventListener('input', () => ybSoon(() => { state.yb.notices = $('#ybNotices').value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 3); }));
$('#ybMood').addEventListener('input', () => ybSoon(() => { state.yb.mood = $('#ybMood').value.trim() || 'How are you feeling today?'; }));
function renderYearLists(){
  const hw = $('#ybHouses'); hw.innerHTML = '';
  state.yb.houses.forEach((H, i) => {
    const row = document.createElement('div'); row.className = 'lrow';
    const nm = document.createElement('input'); nm.type = 'text'; nm.value = H.name; nm.maxLength = 20; nm.id = 'yb-house-' + i; nm.setAttribute('aria-label', 'House ' + (i+1) + ' name');
    const co = document.createElement('input'); co.type = 'color'; co.value = H.color; co.id = 'yb-housec-' + i; co.setAttribute('aria-label', 'House ' + (i+1) + ' colour');
    const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'mini'; rm.textContent = 'Remove'; rm.setAttribute('aria-label', 'Remove house ' + (H.name || i+1));
    nm.addEventListener('input', () => ybSoon(() => { H.name = nm.value.trim(); }));
    co.addEventListener('input', () => ybSoon(() => { H.color = co.value; }));
    rm.addEventListener('click', () => { state.yb.houses.splice(i, 1); renderYearLists(); ybChanged(); });
    row.append(co, nm, rm); hw.appendChild(row);
  });
  $('#ybAddHouse').hidden = state.yb.houses.length >= 6;
  const lw = $('#ybLeaders'); lw.innerHTML = '';
  state.yb.leaders.forEach((L, i) => {
    const row = document.createElement('div'); row.className = 'lrow';
    const nm = document.createElement('input'); nm.type = 'text'; nm.value = L.name || ''; nm.placeholder = 'Name'; nm.maxLength = 40; nm.id = 'yb-lname-' + i; nm.setAttribute('aria-label', 'Leader ' + (i+1) + ' name');
    const ro = document.createElement('input'); ro.type = 'text'; ro.value = L.role || ''; ro.placeholder = 'Role'; ro.maxLength = 40; ro.id = 'yb-lrole-' + i; ro.setAttribute('aria-label', 'Leader ' + (i+1) + ' role');
    const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'mini'; rm.textContent = 'Remove'; rm.setAttribute('aria-label', 'Remove leader ' + (i+1));
    nm.addEventListener('input', () => ybSoon(() => { L.name = nm.value.trim(); }));
    ro.addEventListener('input', () => ybSoon(() => { L.role = ro.value.trim(); }));
    rm.addEventListener('click', () => { state.yb.leaders.splice(i, 1); renderYearLists(); ybChanged(); });
    row.append(nm, ro, rm); lw.appendChild(row);
  });
  $('#ybAddLeader').hidden = state.yb.leaders.length >= 8;
}
/* timetables from the school's timetable PDF (one class per page) */
let pdfjsReady = null;
function loadPdfJs(){
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return pdfjsReady ??= new Promise((res, rej) => {
    const sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; res(window.pdfjsLib); };
    sc.onerror = () => { pdfjsReady = null; rej(new Error('pdf.js did not load')); };
    document.head.appendChild(sc);
  });
}
async function importTimetables(file){
  const msg = $('#ttMsg'); const yearNum = (state.yb.year.match(/\d{1,2}/) || [])[0];
  if (!yearNum){ msg.textContent = 'Add a number to the year group first, for example "Year 8".'; return; }
  msg.textContent = 'Reading the timetable PDF…';
  try {
    const lib = await loadPdfJs();
    const pdf = await lib.getDocument({data: await file.arrayBuffer()}).promise;
    const found = [];
    for (let n = 1; n <= pdf.numPages; n++){
      const page = await pdf.getPage(n); const tc = await page.getTextContent();
      let best = null;
      for (const it of tc.items){ const t = (it.str || '').trim(); const h = Math.abs(it.height || (it.transform && it.transform[3]) || 0);
        if (/^\d{1,2}[A-Z]$/.test(t) && (!best || h > best.h)) best = {t, h}; }
      if (best && best.t.replace(/[A-Z]$/, '') === yearNum) found.push({cls: best.t, page});
      msg.textContent = `Reading page ${n} of ${pdf.numPages}…`;
    }
    if (!found.length){ msg.textContent = `No ${state.yb.year} classes were found in that PDF. Check the year group name matches, for example "Year 8".`; return; }
    found.sort((a, b) => a.cls.localeCompare(b.cls)); const use = found.slice(0, 6);
    const tt = [];
    for (const [i, f] of use.entries()){
      msg.textContent = `Adding the ${f.cls} timetable (${i+1} of ${use.length})…`;
      const vp1 = f.page.getViewport({scale:1}), vp = f.page.getViewport({scale: 2400 / vp1.width});
      const cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
      const cx = cv.getContext('2d'); cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, cv.width, cv.height);
      await f.page.render({canvasContext: cx, viewport: vp}).promise;
      const src = cv.toDataURL('image/jpeg', .9); tt.push({src, img: await loadImg(src)});
    }
    state.yb.classes = use.map(f => f.cls); state.yb.tt = tt;
    $('#ybClasses').value = state.yb.classes.join(', ');
    renderAll();
    msg.textContent = `Added ${use.length} timetable${use.length > 1 ? 's' : ''}: ${state.yb.classes.join(', ')}.` + (found.length > 6 ? ' Only the first 6 fit on the board.' : '');
    toast('Timetables added');
  } catch (e) {
    console.error(e);
    msg.textContent = 'That PDF could not be read here. Check your internet connection, or add each timetable picture under Pieces to print.';
  }
}
$('#ttPdf').addEventListener('change', e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) importTimetables(f); });

$('#ybAddHouse').addEventListener('click', () => { state.yb.houses.push({name:'New house', color:'#8e24aa'}); renderYearLists(); ybChanged(); });
$('#ybAddLeader').addEventListener('click', () => { state.yb.leaders.push({name:'Student name', role:'Class Representative'}); renderYearLists(); ybChanged(); });

/* ---------- saving ---------- */
const SAVE_KEY = 'bbs-board-v1';
function boardData(withPictures = true){
  const yb = JSON.parse(JSON.stringify({...state.yb,
    leaders: state.yb.leaders.map(({img, ...r}) => withPictures ? r : {...r, src: undefined}),
    tt: state.yb.tt.map(t => t && withPictures ? {src: t.src} : null)}));
  const team = {...state.team, members: state.team.members.map(({img, ...r}) => withPictures ? r : {...r, src: undefined})};
  return {v:1, lang: state.lang, team, libId: state.libId, boardType: state.boardType, topicTemplate: state.topicTemplate, yb, title: state.title, idea: $('#idea').value, grade: $('#grade').value, backing: state.backing, template: state.template,
    elem: state.elem, custom: state.custom, over: state.over, pos: state.pos, content,
    extras: state.extras.filter(x => withPictures || !(x.src && x.src.startsWith('data:'))).map(({img, ...rest}) => rest)};
}
let saveT, saveWarned = false;
function saveSoon(){ clearTimeout(saveT); saveT = setTimeout(() => {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(boardData(true))); }
  catch (e) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(boardData(false)));
      if (!saveWarned){ saveWarned = true; toast('Your pictures are too big to keep in this browser. Use "Save board file" to keep them.'); } } catch (e2) {}
  } }, 600); }
async function applyBoard(d){
  if (!d || typeof d !== 'object' || !d.content) throw new Error('not a board');
  state.lang = d.lang === 'ar' ? 'ar' : 'en'; { const lr = document.getElementById('lang-' + state.lang); if (lr) lr.checked = true; }
  state.title = d.title || 'My Board'; state.backing = PAL[d.backing] ? d.backing : 'green'; state.template = TEMPLATES[d.template] ? d.template : 'grid';
  state.elem = FAM[d.elem] ? d.elem : 'match'; state.custom = d.custom || '#c94d86'; state.over = d.over || {}; state.pos = d.pos || {};
  content = normalize(d.content, state.title, d.idea || '');
  state.boardType = ['year','team'].includes(d.boardType) ? d.boardType : 'topic';
  if (d.team && typeof d.team === 'object'){
    const T = {...state.team, ...d.team};
    T.members = await Promise.all((T.members || []).map(async M => { if (M && M.src){ try { return {...M, img: await loadImg(M.src)}; } catch (e) {} } return M || {}; }));
    state.team = T;
  } state.topicTemplate = TEMPLATES[d.topicTemplate] ? d.topicTemplate : 'grid';
  if (d.yb && typeof d.yb === 'object'){
    const Y = {...state.yb, ...d.yb};
    Y.leaders = await Promise.all((Y.leaders || []).map(async L => { if (L && L.src){ try { return {...L, img: await loadImg(L.src)}; } catch (e) {} } return L || {}; }));
    Y.tt = await Promise.all((Y.tt || []).map(async t => { if (t && t.src){ try { return {src: t.src, img: await loadImg(t.src)}; } catch (e) {} } return null; }));
    state.yb = Y;
  }
  syncBoardTypeUI();
  state.extras = [];
  for (const x of (d.extras || [])){
    const ex = {...x};
    if (ex.src){ try { ex.img = await loadImg(ex.src); } catch (e) { continue; } }
    state.extras.push(ex);
    const n = parseInt(String(ex.id).replace(/^e/, ''), 10); if (!isNaN(n)) extraSeq = Math.max(extraSeq, n);
  }
  $('#title').value = state.title; $('#idea').value = d.idea || ''; $('#grade').value = d.grade || '';
  const bk = document.getElementById('bk-' + state.backing); if (bk) bk.checked = true;
  $('#customColor').value = state.custom;
  renderColors(); renderAll(); renderIB();
}
$('#saveBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(boardData(true))], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = (state.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'board') + '.board.json';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('Board file saved. Open it any time with "Open board".');
});
$('#openBtn').addEventListener('click', () => $('#openFile').click());
$('#openFile').addEventListener('change', async e => {
  const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
  try { await applyBoard(JSON.parse(await f.text())); toast('Board opened'); goStep(5); }
  catch (err) { toast('That file is not a saved board. Choose a file ending in .board.json.'); }
});
$('#newBtn').addEventListener('click', () => {
  if (!confirm('Start a new board? Your current board will be cleared from this browser. Save a board file first if you want to keep it.')) return;
  state.boardType = 'topic'; state.template = state.topicTemplate = 'grid'; syncBoardTypeUI();
  state.title = 'Our New Board'; state.extras = []; state.over = {}; state.pos = {};
  $('#title').value = ''; $('#idea').value = ''; $('#grade').value = '';
  content = localContent('Our New Board', '');
  renderAll(); renderIB(); goStep(1); $('#title').focus();
  setStatus('Type your title and idea, then press the button.');
});
$('#helpBtn').addEventListener('click', () => $('#help').showModal());

let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(renderAll, 150); });
const fontsReady = Promise.all([
  document.fonts.load(`400 40px 'Archivo Black'`), document.fonts.load(`800 20px 'Nunito'`),
  document.fonts.load(`900 20px 'Nunito'`), document.fonts.load(`700 20px 'Nunito'`), document.fonts.load(`400 20px 'Gochi Hand'`),
  document.fonts.load(`400 40px 'Lalezar'`), document.fonts.load(`800 20px 'Cairo'`), document.fonts.load(`900 20px 'Cairo'`)
]).catch(() => {});
renderColors();
renderAll();
syncBoardTypeUI(); renderIconGrid(); renderIB(); renderLibrary(); renderTeamLib(); updateGoogle(); goStep(1);
(async () => {
  let saved = null; try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) {}
  if (saved){ try { await applyBoard(saved); setStatus('Welcome back. Your last board is restored.'); } catch (e) {} }
  else { try { if (!localStorage.getItem('bbs-seen')){ localStorage.setItem('bbs-seen', '1'); $('#help').showModal(); } } catch (e) {} }
})();
fontsReady.then(renderAll);
})();
