'use strict';
/* Campaign extends the original rules; the v1 save is migrated without losing its colony. */
(()=>{
const S=Silk, G=S.Game.prototype, old={fresh:S.fresh,valid:S.valid,tick:G.tick,collect:G.collect,buy:G.buy,locked:G.locked,hit:G.hit};
S.rooms=[
 {name:'Гостиная',floor:'Первый этаж',color:'#38413b',prey:'Домовые мухи',bonus:1,time:0,cost:0,raids:0,desc:'Здесь всё началось. Даже тапок ещё не в курсе.'},
 {name:'Кухня',floor:'Первый этаж',color:'#485039',prey:'Дрозофилы и тараканы',bonus:1.3,time:240,cost:120,raids:4,desc:'Крошки со стола — дивиденды без налогов.'},
 {name:'Спальня',floor:'Второй этаж',color:'#3e3c51',prey:'Комары и платяная моль',bonus:1.65,time:600,cost:300,raids:10,desc:'Человек спит. Отдел продаж — нет.'},
 {name:'Подвал',floor:'Нижний этаж',color:'#304649',prey:'Мокрицы и жужелицы',bonus:2.1,time:1200,cost:650,raids:20,desc:'Сырость, тишина и очень питательные арендаторы.'},
 {name:'Чердак',floor:'Под крышей',color:'#514336',prey:'Бражники и жуки-олени',bonus:2.7,time:2100,cost:1100,raids:35,desc:'Выше только крыша. И самооценка директора.'}
];
S.traps.push(
 {name:'Крошечный буфет',icon:'food',cost:95,interval:7,food:15,silk:5,room:1,req:6,desc:'Дрозофилы и тараканы: +15 еды, +5 шёлка. Кухня и технология «Пищевые цепочки».'},
 {name:'Сонная спираль',icon:'lamp',cost:150,interval:9,food:14,silk:18,room:2,req:7,desc:'Моль и комары: +14 еды, +18 шёлка. Спальня и «Ночная смена».'},
 {name:'Капкан для титанов',icon:'beetle',cost:260,interval:14,food:45,silk:26,room:3,req:8,desc:'Мокрицы, жужелицы, жуки-олени: +45 еды, +26 шёлка. Подвал и «Армирование».'}
);
S.crew.push(
 {name:'Ремонтник',icon:'heart',cost:90,room:1,desc:'Каждый восстанавливает гнезду и сетям 0,35 прочности/с. Без расхода еды.'},
 {name:'Разведчик',icon:'human',cost:130,room:2,desc:'Каждый замедляет уборки на 2 секунды и увеличивает улов на 8%.'},
 {name:'Алхимик',icon:'food',cost:190,room:3,desc:'Каждый сокращает действие яда и липкой ленты, ускоряет ловушки на 10%.'}
);
S.tech.push(
 {name:'Пищевые цепочки',icon:'food',cost:120,room:1,req:2,desc:'Ветка экономики ← Бережная разделка. Открывает крошечный буфет.'},
 {name:'Ночная смена',icon:'lamp',cost:210,room:2,req:6,desc:'Ветка экономики ← Пищевые цепочки. Открывает сонную спираль; свет мешает вдвое меньше.'},
 {name:'Армирование',icon:'shield',cost:340,room:3,req:4,desc:'Ветка обороны ← Бункер. Открывает капкан для титанов; весь урон −25%.'},
 {name:'Страховка лап',icon:'heart',cost:480,room:3,req:8,desc:'Ветка обороны ← Армирование. За уборку дополнительно +35 еды.'},
 {name:'Шёлковая логистика',icon:'silk',cost:750,room:4,req:7,desc:'Ветка экономики ← Ночная смена. Весь улов +40%.'},
 {name:'Домовой договор',icon:'flag',cost:1200,room:4,req:9,desc:'Ветка обороны ← Страховка лап. Последний шаг к владению домом.'}
);
S.attacks.push(
 {name:'Газета «Последний хлопок»',desc:'Два резких удара по гнезду. Газета вчерашняя, боль свежая.',damage:38},
 {name:'Липкая лента',desc:'На 18 секунд замедляет ловлю на 65%. Укрытие спасает.',damage:18},
 {name:'Большой свет',desc:'Распугивает добычу на 16 секунд. Ночная смена снижает эффект.',damage:16}
);
S.achievements=[['first','Первый дивиденд','Собрать 10 коконов'],['crew','Отдел кадров','Нанять 5 помощников'],['defense','Тапкоустойчивость','Пережить 12 уборок'],['traveler','Восемь лап — пять адресов','Открыть все комнаты'],['catch','Пищевой магнат','Собрать 500 коконов'],['science','Доктор паутинных наук','Купить все технологии'],['hour','Стаж под плинтусом','Провести в игре час'],['home','Дом принадлежит пауку','Победить в кампании']];
S.events=[{name:'Окно настежь',desc:'Свежая партия клиентов! Ловушки вдвое быстрее.',kind:'swarm'}, {name:'Человек уехал за хлебом',desc:'Следующая уборка отложена на 25 секунд.',kind:'holiday'}, {name:'Крошки после вечеринки',desc:'Найдена провизия. Бухгалтер просит не спрашивать.',kind:'crumbs'}, {name:'Сквозняк',desc:'Ловушки на 30% медленнее. Зато бесплатная вентиляция.',kind:'draft'}, {name:'Тихий дождь',desc:'Влажная нить: ткачи работают вдвое быстрее.',kind:'rain'}];
function migrate(s){if(s.version===2)return s;s.version=2;s.room=0;s.unlocked=0;s.rooms=[null,null,null,null,null];s.crew.push(0,0,0);s.tech.push(false,false,false,false,false,false);s.achieved=[];s.eventTimer=70;s.eventLeft=0;s.eventIndex=-1;s.sticky=0;s.light=0;s.protected=0;s.moves=0;if(s.status==='won')s.status='playing';return s;}
S.valid=function(s){if(!s)return false;if(s.version===1)return old.valid(s);if(s.version!==2)return false;const nums=['room','unlocked','eventTimer','eventLeft','sticky','light','protected','moves'];if(!nums.every(k=>Number.isFinite(s[k])&&s[k]>=0)||!Number.isInteger(s.room)||!Number.isInteger(s.unlocked)||s.room>s.unlocked||s.unlocked>4)return false;
const web=w=>w===null||(w&&Number.isInteger(w.type)&&w.type>=0&&w.type<6&&['hp','ready','progress'].every(k=>Number.isFinite(w[k])&&w[k]>=0)&&w.hp<=100&&Number.isInteger(w.ready)&&w.ready<=3);
if(!Array.isArray(s.webs)||s.webs.length!==6||!s.webs.every(web)||!Array.isArray(s.rooms)||s.rooms.length!==5||!s.rooms.every(r=>r===null||(Array.isArray(r)&&r.length===6&&r.every(web))))return false;
if(!Array.isArray(s.crew)||s.crew.length!==6||!s.crew.every(n=>Number.isInteger(n)&&n>=0&&n<=5)||!Array.isArray(s.tech)||s.tech.length!==12||!s.tech.every(n=>typeof n==='boolean')||!Array.isArray(s.achieved)||!s.achieved.every(k=>S.achievements.some(a=>a[0]===k))||!Number.isInteger(s.eventIndex)||s.eventIndex< -1||s.eventIndex>=S.events.length)return false;
return old.valid({...s,version:1,webs:s.webs.map(w=>w?{...w,type:Math.min(2,w.type)}:null),crew:s.crew.slice(0,3),tech:s.tech.slice(0,6)});};
const Base=S.Game;S.Game=class extends Base{constructor(state){super();this.s=migrate(S.valid(state)?JSON.parse(JSON.stringify(state)):old.fresh());}};S.fresh=()=>migrate(old.fresh());
G.attackIndex=function(){return this.s.raids%6;};
G.locked=function(kind,i){const list=kind==='build'?S.traps:kind==='crew'?S.crew:S.tech,item=list[i];if(!item)return 'Неизвестная покупка';if((item.room||0)>this.s.unlocked)return 'Открой: '+S.rooms[item.room].name;if(item.req!==undefined&&!this.s.tech[item.req])return 'Сначала: '+S.tech[item.req].name;return i<(kind==='tech'?6:3)?old.locked.call(this,kind,i):'';};
G.buy=function(kind,i,slot){if(!['build','crew','tech'].includes(kind)||!Number.isInteger(i)||this.locked(kind,i)){this.emit('notice',this.locked(kind,i)||'Неизвестная покупка');return false;}return old.buy.call(this,kind,i,slot);};
G.collect=function(i){const before=[this.s.food,this.s.silk],ok=old.collect.call(this,i);if(ok){const s=this.s,m=S.rooms[s.room].bonus*(1+s.crew[4]*.08)*(s.tech[10]?1.4:1);s.food+=Math.floor((s.food-before[0])*(m-1));s.silk+=Math.floor((s.silk-before[1])*(m-1));this.events[this.events.length-1].text='+'+Math.floor(s.food-before[0])+' еды · +'+Math.floor(s.silk-before[1])+' шёлка';this.awards();}return ok;};
G.travelReason=function(i){const s=this.s,r=S.rooms[i];if(!r)return 'Нет такой комнаты';if(i<=s.unlocked)return '';if(i!==s.unlocked+1)return 'Сначала открой предыдущую комнату';if(s.time<r.time)return 'Разведка: ещё '+Math.ceil((r.time-s.time)/60)+' мин';if(s.raids<r.raids)return 'Нужно пережить '+r.raids+' уборок';if(s.silk<r.cost)return 'Нужно '+r.cost+' шёлка';return '';};
G.travel=function(i){let s=this.s;if(s.status!=='playing'||s.warning||s.shield>0||i===s.room)return false;let reason=this.travelReason(i);if(reason){this.emit('notice',reason);return false;}if(i>s.unlocked){s.silk-=S.rooms[i].cost;s.unlocked=i;}s.rooms[s.room]=s.webs;s.webs=s.rooms[i]||[{type:0,hp:100,progress:0,ready:0},null,null,null,null,null];s.rooms[i]=null;s.room=i;s.moves++;this.emit('travel',S.rooms[i].name+': '+S.rooms[i].desc);this.awards();return true;};
G.hit=function(){const s=this.s,idx=this.attackIndex(),a=S.attacks[idx],safe=s.shield>0;let damage=a.damage*Math.max(.2,1-s.crew[2]*.12)*(safe?.18:1)*(s.tech[8]?.75:1)*(1+s.room*.1);s.hp=Math.max(0,s.hp-damage);let targets=s.webs.map((w,i)=>w?i:-1).filter(i=>i>=0);if(idx===0||idx===3)targets=targets.sort((a,b)=>s.webs[b].ready-s.webs[a].ready).slice(0,2);targets.forEach(i=>{let w=s.webs[i];w.hp-=damage*(s.tech[0]?.8:1);if(idx===1&&!safe)w.ready=0;if(w.hp<=0){s.webs[i]=null;this.emit('notice','Сеть разрушена. Страховая компания — это ты.',i);}});if(!safe){if(idx===2)s.poison=12;if(idx===4)s.sticky=18;if(idx===5)s.light=16;}else s.protected++;s.raids++;s.timer=Math.max(42,65-s.room*3)+s.crew[4]*2;s.warning=false;this.emit('hit',safe?'Укрытие выдержало. Человек требует книгу жалоб.':a.name+'! Гнездо −'+Math.ceil(damage));if(s.hp>0){s.silk+=20;s.food+=12+(s.tech[9]?35:0);}this.check();this.awards();};
G.awards=function(){const s=this.s,flags=[s.caught>=10,s.crew.reduce((a,b)=>a+b,0)>=5,s.raids>=12,s.unlocked===4,s.caught>=500,s.tech.every(Boolean),s.time>=3600,s.status==='won'];S.achievements.forEach((a,i)=>{if(flags[i]&&!s.achieved.includes(a[0])){s.achieved.push(a[0]);s.food+=25;this.emit('achievement','Достижение: '+a[1]+' · +25 еды');}});};
G.check=function(){let s=this.s;if(s.status!=='playing')return;if(s.hp<=0){s.status='lost';this.emit('end','lost');}else if(s.unlocked===4&&s.time>=3000&&s.raids>=50&&s.tech.every(Boolean)&&s.webs.every(Boolean)){s.status='won';this.awards();this.emit('end','won');}};
G.tick=function(dt){let s=this.s;if(s.status!=='playing')return;dt=Math.max(0,Math.min(dt,.25));let factor=(s.sticky>0?.35:1)*(s.light>0?(s.tech[7]?.7:.35):1)*(1+s.crew[5]*.1)*(s.eventLeft>0?(s.eventIndex===0?2:s.eventIndex===3?.7:1):1);
// Alter only production progress, never real time, defense timers or save cadence.
s.webs.forEach(w=>{if(w&&w.ready<3&&s.poison<=0)w.progress+=dt*(s.tech[1]?1.25:1)*(factor-1);});
old.tick.call(this,dt);if(s.status!=='playing')return;
['sticky','light'].forEach(k=>s[k]=Math.max(0,s[k]-dt*(1+s.crew[5]*.3)));s.poison=Math.max(0,s.poison-dt*s.crew[5]*.3);
if(s.crew[3]){s.hp=Math.min(this.maxHp(),s.hp+dt*s.crew[3]*.35);s.webs.forEach(w=>{if(w)w.hp=Math.min(100,w.hp+dt*s.crew[3]*.35);});}
if(s.eventLeft>0){s.eventLeft=Math.max(0,s.eventLeft-dt);if(s.eventIndex===4)s.silk+=dt*s.crew[1]*(s.tech[3]?2:1);}
s.eventTimer-=dt;if(s.eventTimer<=0){s.eventTimer=90+Math.random()*60;s.eventIndex=Math.floor(Math.random()*S.events.length);s.eventLeft=25;const e=S.events[s.eventIndex];if(e.kind==='holiday')s.timer+=25;if(e.kind==='crumbs')s.food+=35*(s.room+1);this.emit('event',e.name+' · '+e.desc);}this.check();this.awards();};
})();
