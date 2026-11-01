// Local verification page: exact application sources inlined to avoid relay subrequest failures.
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,p)=>'<style>'+fs.readFileSync(path.join(root,p),'utf8')+'</style>');
html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,p)=>'<script>'+fs.readFileSync(path.join(root,p),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
// Distinct storage namespace: never overwrite the player's real colony or slots.
html=html.replaceAll('silk-profit-v1','silk-ui-check-v1').replaceAll('silk-slots','silk-ui-check-slots').replaceAll('silk-settings','silk-ui-check-settings');
html=html.replace('<body>','<body><pre id="ui-errors" hidden></pre><script>addEventListener("error",e=>{let p=document.getElementById("ui-errors");p.hidden=false;p.textContent+=e.error?.stack||e.message;});</script>');
html=html.replace('</head>','<style>.app{max-width:390px}#tabs{width:min(390px,100%)}</style></head>');
fs.writeFileSync(path.join(__dirname,'ui-preview.html'),html);
console.log('Verification fixture generated from current source; 390px column, isolated storage.');
