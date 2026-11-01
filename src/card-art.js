'use strict';
window.CardArt={portrait(c){
const n=c.id%12,h=c.id*47%360,col='hsl('+h+' 55% 67%)',line='#f4e8cc';let art='';
if(c.group==='Пауки'){
let rx=10+n%4*2,ry=13+n%3*4;
for(let side of [-1,1])for(let j=0;j<4;j++){let y=38+j*6,x=48+side*(25+(n+j)%4*3);art+='<path d="M'+(48+side*8)+' '+y+' Q'+x+' '+(y-14+n)+' '+(x+side*7)+' '+(16+j*20)+'" fill="none"/>';}
art+='<ellipse cx="48" cy="58" rx="'+rx+'" ry="'+ry+'"/><ellipse cx="48" cy="36" rx="'+(9+n%3)+'" ry="10"/>';
if(n%3===0)art+='<path d="M48 44v27M40 54h16" stroke="'+line+'"/>';else if(n%3===1)art+='<ellipse cx="48" cy="57" rx="5" ry="10" fill="'+line+'"/>';else for(let j=0;j<5;j++)art+='<circle cx="'+(43+j%2*10)+'" cy="'+(48+j*5)+'" r="2" fill="'+line+'"/>';
for(let j=0;j<(n===6?4:2);j++)art+='<circle cx="'+(42+j*4)+'" cy="33" r="2.5" fill="#17262b"/>';
if(n===6)art+='<path d="M36 31h25M46 31v5" stroke="#fff"/>';if(n===11)art+='<path d="M35 20l4-9 9 7 9-7 4 9Z" fill="#f5ca6b"/>';
}else if(c.group==='Насекомые'){
let wings=[0,1,2,4,7,10].includes(n),rx=[4,3,6,10,4,12,8,9,13,13,7,12][n];
if(wings)for(let side of [-1,1])art+='<ellipse cx="'+(48+side*(n===7?17:12))+'" cy="43" rx="'+(n===2||n===7?19:12)+'" ry="'+(n===2||n===7?23:8)+'" transform="rotate('+(side*28)+' '+(48+side*12)+' 43)" fill="hsl('+(h+45)+' 50% 80%)" fill-opacity=".65"/>';
for(let side of [-1,1])for(let j=0;j<3;j++)art+='<path d="M'+(48+side*rx)+' '+(46+j*9)+'l'+side*(12+j*2)+' '+(j*8-5)+'"/>';
art+='<ellipse cx="48" cy="54" rx="'+rx+'" ry="'+(n===5?26:20)+'"/><circle cx="48" cy="31" r="7"/><path d="M44 26l-9-12M52 26l9-12M48 38v35" fill="none" stroke="'+line+'"/>';
if(n===8)art+='<path d="M42 26l-7-13 5-7M54 26l7-13-5-7" stroke-width="5"/>';
if(n===9)for(let j=0;j<6;j++)art+='<circle cx="'+(42+j%2*12)+'" cy="'+(44+Math.floor(j/2)*10)+'" r="3" fill="#263032"/>';
if(n===10)art+='<ellipse cx="48" cy="68" rx="6" ry="8" fill="#f4ec94"/>';
}else{
const shapes=['M26 64Q17 29 44 27L72 49Q84 71 63 77Z','M48 21a26 26 0 1 0 0 52a26 26 0 1 0 0-52','M30 22h36v8h-5v38h5v8H30v-8h5V30h-5Z','M57 22Q76 22 69 41L47 74Q32 85 25 69Q20 61 29 49L51 21Q58 12 63 25L39 61','M25 32l23-12 25 18-7 29-30 9-15-23Z','M48 20a28 28 0 1 0 0 56a28 28 0 1 0 0-56','M22 25h51v49H22ZM31 34h16v19H31M53 34h13M53 42h13M31 61h35','M23 39h45v21H23ZM68 33l14 7v20l-14 7Z','M31 17h27v34l17 9Q81 74 65 80L31 65Z','M34 38a14 14 0 1 0 0-28a14 14 0 1 0 0 28M43 34l31 34-9 9-7-8 5-5-9-9','M30 24h36l-5 48H35Z','M30 72l4-39q14-23 28 0l4 39Z'];
art='<path d="'+shapes[n]+'"/>';
if(c.active)art='<circle cx="48" cy="48" r="30"/><path d="'+(c.id===36?'M30 58Q70 12 59 64M29 43h37':c.id===37?'M48 23 69 33v18Q65 68 48 77Q31 68 27 51V33Z':'M29 35h13v30H29ZM54 35h13v30H54Z')+'" fill="none" stroke="'+line+'" stroke-width="4"/>';
else for(let j=0;j<3+n%4;j++)art+='<circle cx="'+(38+j%3*10)+'" cy="'+(40+Math.floor(j/3)*13)+'" r="2.5" fill="'+line+'"/>';
}
return '<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="44" fill="'+col+'" fill-opacity=".09" stroke="none"/><g fill="'+col+'" stroke="'+col+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+art+'</g></svg>';
}};
