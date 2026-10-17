(function(){
'use strict';
var U='https://hngwasixgyvnvfanpuax.supabase.co/functions/v1/api';
var PUSH='https://supercopa-push-server.onrender.com/api/push';
var SITE='https://www.supercopaafc.com.br/',APPU='https://drdiegopadua.github.io/supercopa-app/';
var EVENTO=new Date('2026-11-28T08:00:00-03:00'),PRAZO=new Date('2026-11-27T13:00:00-03:00');
var $=function(i){return document.getElementById(i)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var N=function(n){return Math.round(+n||0).toLocaleString('pt-BR')};
var AUTH=null,TAB='painel',LOADED={};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){}return null}
function toast(m,er){var t=$('toast');t.textContent=m;t.className='toast on'+(er?' er':'');clearTimeout(toast.t);toast.t=setTimeout(function(){t.className='toast'},3200)}

/* ---------- API ---------- */
function get(a,p){var q=new URLSearchParams(Object.assign({action:a},p||{})),t=performance.now();return fetch(U+'?'+q,{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){j._ms=Math.round(performance.now()-t);return j})}
function post(a,d,auth){var t=performance.now();return fetch(U,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(Object.assign({acao:a,auth:auth||AUTH},d||{}))}).then(function(r){return r.json()}).then(function(j){j._ms=Math.round(performance.now()-t);return j})}
function safe(p){return p.catch(function(){return null})}

/* ---------- gráficos ---------- */
function bars(d,o){o=o||{};var W=560,H=o.h||220,pl=10,pr=10,pt=28,pb=34,mx=Math.max.apply(null,d.map(function(x){return x.v}).concat([1]))*1.14,bw=(W-pl-pr)/d.length,s='<svg viewBox="0 0 '+W+' '+H+'" class="nmc">';
 for(var i=0;i<=3;i++){var y=pt+(H-pt-pb)*i/3;s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'" class="nmg"/>'}
 d.forEach(function(x,i){var h=(H-pt-pb)*x.v/mx,x0=pl+i*bw+bw*.16,w=bw*.68,y=H-pb-h;s+='<rect x="'+x0+'" y="'+y+'" width="'+w+'" height="'+h+'" class="nmb'+(x.hi?' hi':'')+'" style="--d:'+i*60+'ms"/>'+(d.length<=14?'<text x="'+(x0+w/2)+'" y="'+(y-7)+'" class="nmv" text-anchor="middle">'+N(x.v)+'</text>':'')+'<text x="'+(x0+w/2)+'" y="'+(H-12)+'" class="nml" text-anchor="middle">'+x.l+'</text>'});
 return s+'</svg>'}
function stack(d,sk){var W=560,H=220,pl=10,pr=10,pt=18,pb=34,mx=Math.max.apply(null,d.map(function(x){return x.a+x.b}).concat([1]))*1.1,bw=(W-pl-pr)/d.length,s='<svg viewBox="0 0 '+W+' '+H+'" class="nmc">';
 for(var i=0;i<=3;i++){var y=pt+(H-pt-pb)*i/3;s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'" class="nmg"/>'}
 d.forEach(function(x,i){var ha=(H-pt-pb)*x.a/mx,hb=(H-pt-pb)*x.b/mx,x0=pl+i*bw+bw*.12,w=bw*.76,yb=H-pb-hb,ya=yb-ha;s+='<rect x="'+x0+'" y="'+yb+'" width="'+w+'" height="'+hb+'" class="nmb app"/><rect x="'+x0+'" y="'+ya+'" width="'+w+'" height="'+ha+'" class="nmb"/>'+((i%(sk||1)===0)?'<text x="'+(x0+w/2)+'" y="'+(H-12)+'" class="nml" text-anchor="middle">'+x.l+'</text>':'')});
 return s+'</svg>'}
function hbars(d,fmt){var mx=Math.max.apply(null,d.map(function(x){return x.v}).concat([1]));return '<div class="nmh">'+d.map(function(x,i){return '<div class="nmhr"><span>'+esc(x.l)+'</span><b>'+(fmt?fmt(x.v):N(x.v))+'</b><div class="nmht"><i style="width:'+(x.v/mx*100).toFixed(1)+'%;animation-delay:'+i*60+'ms"></i></div></div>'}).join('')+'</div>'}
function donut(parts,label){var tot=parts.reduce(function(s,p){return s+p.v},0)||1,R=54,C=2*Math.PI*R,off=0,s='<svg viewBox="0 0 140 140" class="nmdn"><circle cx="70" cy="70" r="'+R+'" class="nmdb"/>';
 parts.forEach(function(p,i){var len=C*p.v/tot;s+='<circle cx="70" cy="70" r="'+R+'" class="nmds s'+i+'" stroke-dasharray="'+len.toFixed(1)+' '+(C-len).toFixed(1)+'" stroke-dashoffset="'+(-off).toFixed(1)+'" transform="rotate(-90 70 70)"/>';off+=len});
 return s+'<text x="70" y="76" text-anchor="middle" class="nmdt">'+N(tot)+'</text></svg>'}
function skel(){return '<div class="card"><p class="empty"><span class="ld"></span> Carregando...</p></div>'}

/* ---------- login ---------- */
function entrar(u,p,keep,silent){
 var a={usuario:u,senha:p};$('lb').disabled=true;$('le').textContent='';
 return post('loginPainel',{},a).then(function(r){
  if(!r||!r.ok){throw new Error((r&&r.erro)||'Não foi possível entrar.')}
  if(r.papel!=='admin'){throw new Error('Este aplicativo é só para administradores.')}
  AUTH=a;(keep?ls:ss)('sca_auth',JSON.stringify(a));if(!keep)ls('sca_auth',null);
  $('login').classList.add('hide');$('app').classList.remove('hide');iniciar();
 }).catch(function(e){ss('sca_auth',null);ls('sca_auth',null);if(!silent)$('le').textContent=e.message||'Erro de conexão.';$('login').classList.remove('hide');$('app').classList.add('hide')}).then(function(){$('lb').disabled=false});
}
$('lf').addEventListener('submit',function(e){e.preventDefault();entrar($('lu').value.trim(),$('lp').value,$('lk').checked)});
$('lo').addEventListener('click',function(){ss('sca_auth',null);ls('sca_auth',null);location.reload()});
(function(){var s=ss('sca_auth')||ls('sca_auth');if(s){try{var a=JSON.parse(s);entrar(a.usuario,a.senha,!!ls('sca_auth'),true)}catch(e){}}})();

/* ---------- navegação ---------- */
var ICONS={painel:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',elencos:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5.5a3 3 0 010 5.6M18 14.5c2 .6 3.5 2.6 3.5 5.5"/>',noticias:'<path d="M5 4h11v16H5zM16 8h3v12H8M8 8h5M8 12h5"/>',push:'<path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0"/>',saude:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',premios:'<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H4v1a4 4 0 004 4M16 6h4v1a4 4 0 01-4 4M12 13v4M8 20h8"/>',mais:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'};
var TABS=[['painel','Painel'],['elencos','Elencos'],['noticias','Notícias'],['push','Push'],['saude','Saúde'],['premios','Prêmios'],['mais','Mais']];
$('nav').innerHTML=TABS.map(function(t){return '<button type="button" data-t="'+t[0]+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+ICONS[t[0]]+'</svg>'+t[1]+'</button>'}).join('');
$('nav').addEventListener('click',function(e){var b=e.target.closest('button');if(b)ir(b.dataset.t)});
$('rf').addEventListener('click',function(){LOADED[TAB]=false;ir(TAB,true)});
function ir(t,force){TAB=t;document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x.id==='t-'+t)});document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('on',b.dataset.t===t)});
 var nm=TABS.filter(function(x){return x[0]===t})[0][1];$('tt').firstChild.nodeValue=nm;ss('sca_tab',t);window.scrollTo(0,0);
 if(!LOADED[t]||force){LOADED[t]=true;var rb=$('rf');rb.classList.add('spin');Promise.resolve(({painel:pPainel,elencos:pElencos,noticias:pNoticias,push:pPush,saude:pSaude,premios:pPremios,mais:pMais})[t]()).catch(function(e){$('t-'+t).innerHTML='<div class="al er"><div><b>Erro</b>'+esc(e.message||e)+'</div></div>'}).then(function(){rb.classList.remove('spin');$('ts').textContent='Atualizado às '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})})}}
function iniciar(){ir(ss('sca_tab')||'painel')}

/* ---------- PAINEL ---------- */
function kpi(v,l,sub){return '<div class="card kpi"><b>'+v+'</b><small>'+l+'</small>'+(sub?'<i>'+sub+'</i>':'')+'</div>'}
function pPainel(){
 var el=$('t-painel');el.innerHTML=skel();
 var T=function(a,p){return safe(get(a,p))};
 return Promise.all([T('timesPublicos'),T('statusCadastroEquipes'),T('atletasTodos'),T('count_acessos_site'),T('count_acessos'),T('count_installs'),T('ranking_quiz'),T('feedback'),T('votacao'),safe(fetch(PUSH+'/status').then(function(r){return r.json()})),T('partidasTodas'),T('acessos_log'),T('torneio',{modalidade:'volei'}),T('torneio',{modalidade:'basquete'}),T('inscricoes')]).then(function(r){
  var tp=r[0]||{},st=(r[1]&&r[1].equipes)||[],at=(r[2]&&r[2].atletas)||[],cs=r[3]||{},ca=r[4]||{},ci=r[5]||{},qz=(r[6]&&r[6].ranking)||[],fb=(r[7]&&r[7].respostas)||[],vt=r[8]||{},pu=r[9],pa=(r[10]&&r[10].partidas)||[],lg=(r[11]&&r[11].log)||[],tv=r[12]||{},tb=r[13]||{},ins=(r[14]&&r[14].inscricoes)||[];
  var times=tp.times||[],semAt=st.filter(function(e){return !e.atletas}),comp=st.filter(function(e){return e.confirmou&&e.atletas>=6&&e.tecnico&&e.assTecnico&&e.assCapitao&&e.lgpd}).length;
  var dias=Math.ceil((EVENTO-new Date())/864e5),ms=EVENTO-new Date();
  var aoVivo=pa.filter(function(p){return p.status==='em_andamento'}).length,fin=pa.filter(function(p){return p.status==='finalizada'}).length;
  var notas=fb.map(function(x){return parseFloat(x['4. Qual sua nota geral para o evento?'])}).filter(function(n){return n>0}),media=notas.length?(notas.reduce(function(a,b){return a+b},0)/notas.length).toFixed(1).replace('.',','):'-';
  var uni=(cs.unicos||0)+(ca.unicos||0),tot=(cs.total||0)+(ca.total||0);
  var al=[];
  if(ms>0)al.push('<div class="al in"><div><b>Faltam '+dias+' dias para o vôlei</b>Início em 28/11/2026 às 08h, em Afonso Cláudio.</div></div>');
  if(semAt.length&&new Date()<PRAZO)al.push('<div class="al wa"><div><b>'+semAt.length+' de '+st.length+' equipes sem atletas cadastrados</b>Prazo até 27/11 às 13h. A súmula exige atletas cadastrados.</div></div>');
  if(semAt.length&&new Date()>=PRAZO)al.push('<div class="al er"><div><b>Prazo encerrado com '+semAt.length+' equipes sem atletas</b>'+esc(semAt.map(function(e){return e.equipe}).join(', '))+'</div></div>');
  if(!(tv.jogos||[]).length)al.push('<div class="al wa"><div><b>Chave do vôlei ainda não criada</b>Sem ela, Jogos, Classificação e Atleta Destaque ficam vazios no site e no app.</div></div>');
  if(pu&&pu.total<30)al.push('<div class="al wa"><div><b>Só '+pu.total+' aparelho(s) com notificação ativa</b>Incentive o pessoal a ativar as notificações no app.</div></div>');
  if(!pu)al.push('<div class="al wa"><div><b>Servidor de push não respondeu</b>Ele pode estar dormindo. Abra a aba Push para acordá-lo.</div></div>');
  if(!al.length)al.push('<div class="al ok"><div><b>Tudo em ordem</b>Nenhum alerta no momento.</div></div>');
  var dm={},ma={};lg.forEach(function(x){var d=String(x.data).slice(0,10);dm[d]=dm[d]||{a:0,b:0};if(x.plataforma==='app')dm[d].b++;else dm[d].a++;var m=d.slice(0,7);ma[m]=ma[m]||{a:0,b:0};if(x.plataforma==='app')ma[m].b++;else ma[m].a++});
  var dias30=[];for(var i=29;i>=0;i--){var dd=new Date(Date.now()-i*864e5),k=dd.toISOString().slice(0,10);dias30.push({l:k.slice(8),a:(dm[k]||{a:0}).a,b:(dm[k]||{b:0}).b})}
  var MS=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],meses=Object.keys(ma).sort().slice(-12).map(function(k){return{l:MS[+k.slice(5)-1]+'/'+k.slice(2,4),a:ma[k].a,b:ma[k].b}});
  var porc={};times.forEach(function(t){var c=String(t.cidade||'').split(' - ')[0];if(c)porc[c]=(porc[c]||0)+1});
  var cid=Object.keys(porc).map(function(c){return{l:c,v:porc[c]}}).sort(function(a,b){return b.v-a.v});
  var atl=st.map(function(e){return{l:e.equipe,v:e.atletas||0}}).sort(function(a,b){return b.v-a.v});
  var pill=function(ok,t){return '<span class="pill '+(ok?'ok':'er')+'">'+t+'</span> '};
  el.innerHTML='<div class="sec"><h2>Alertas</h2></div>'+al.join('')
  +'<div class="sec"><h2>Visão geral</h2></div><div class="grid kp">'
  +kpi(times.length+'<span style="font-size:20px;color:var(--mute)">/'+(tp.vagas||12)+'</span>','Times no vôlei')
  +kpi(N(at.length),'Atletas cadastrados',comp+' de '+st.length+' equipes completas')
  +kpi(N(ins.length),'Inscrições recebidas')
  +kpi(N(uni),'Aparelhos únicos',N(tot)+' acessos')
  +kpi(N(ci.total||0),'Instalações do app')
  +kpi(pu?N(pu.total):'-','Push ativos')
  +kpi(N(qz.length),'Quiz participantes')
  +kpi(N(vt.totalVotos||0),'Votos destaque')
  +kpi(N(pa.length),'Súmulas',aoVivo+' ao vivo · '+fin+' finalizadas')
  +kpi(N((tv.jogos||[]).length+(tb.jogos||[]).length),'Jogos na chave','vôlei '+(tv.jogos||[]).length+' · basquete '+(tb.jogos||[]).length)
  +kpi(N(fb.length),'Respostas feedback','nota geral '+media)
  +'</div>'
  +'<div class="sec"><h2>Audiência</h2><small>site e app, últimos 30 dias</small></div><div class="grid g2"><div class="card"><h3>Acessos por dia</h3>'+stack(dias30,5)+'<div class="leg"><span><i></i>Site</span><span><i class="app"></i>App</span></div></div><div class="card"><h3>Acessos por mês</h3>'+(meses.length?bars(meses.map(function(m){return{l:m.l,v:m.a+m.b}})):'<p class="empty">Sem dados</p>')+'<div class="dw" style="margin-top:12px">'+donut([{v:cs.total||0},{v:ca.total||0}])+'<div><b style="font:800 22px var(--display)">'+N(cs.total||0)+'</b> <span class="mut">no site</span><br><b style="font:800 22px var(--display)">'+N(ca.total||0)+'</b> <span class="mut">no app</span></div></div></div></div>'
  +'<div class="sec"><h2>Equipes</h2><small>cadastro e origem</small></div><div class="grid g2"><div class="card"><h3>Atletas por equipe</h3>'+(atl.length?hbars(atl):'<p class="empty">Sem dados</p>')+'</div><div class="card"><h3>Equipes por cidade</h3>'+(cid.length?hbars(cid):'<p class="empty">Sem dados</p>')+'</div></div>'
  +'<div class="card" style="margin-top:12px"><h3>Situação do cadastro</h3><div class="lst">'+(st.length?st.map(function(e){return '<div class="row"><div class="t"><b>'+esc(e.equipe)+'</b><small>'+(e.atletas||0)+' atletas</small></div><div style="text-align:right">'+pill(e.confirmou,'confirmou')+pill(e.atletas>=6,'elenco')+pill(e.tecnico,'técnico')+pill(e.assTecnico&&e.assCapitao,'assinaturas')+pill(e.lgpd,'termo')+'</div></div>'}).join(''):'<p class="empty">Sem equipes</p>')+'</div></div>';
 });
}


/* ---------- ELENCOS ---------- */
var LIM_ATL=14,LIM_COM=2,MIN_SUM=6;
function ehCom(tp){tp=String(tp||'').toLowerCase();return tp&&tp!=='atleta'}
function pElencos(){
 var el=$('t-elencos');el.innerHTML=skel();
 return Promise.all([safe(get('statusCadastroEquipes')),safe(get('atletasTodos')),safe(get('timesPublicos'))]).then(function(r){
  var st=(r[0]&&r[0].equipes)||[],at=(r[1]&&r[1].atletas)||[],tm=(r[2]&&r[2].times)||[];
  var esc_={};tm.forEach(function(x){esc_[String(x.nome).toLowerCase()]=x.escudo});
  esc_['ct das montanhas']=SITE+'novo/escudos/ct-das-montanhas.png';esc_['união vôlei']=SITE+'novo/escudos/uniao-volei.png';
  var rows=st.map(function(e){
   var l=at.filter(function(a){return String(a.equipe).toLowerCase()===String(e.equipe).toLowerCase()});
   var atl=l.filter(function(a){return !ehCom(a.tipo)}),com=l.filter(function(a){return ehCom(a.tipo)});
   var pct=Math.min(100,Math.round(atl.length/LIM_ATL*100));
   return {e:e,atl:atl,com:com,pct:pct,ok:atl.length>=MIN_SUM,esc:esc_[String(e.equipe).toLowerCase()]||''}});
  rows.sort(function(a,b){return b.pct-a.pct||a.e.equipe.localeCompare(b.e.equipe)});
  var tot=rows.reduce(function(s,x){return s+x.atl.length},0),meta=rows.length*LIM_ATL,geral=meta?Math.round(tot/meta*100):0,prontas=rows.filter(function(x){return x.ok}).length,comp=rows.filter(function(x){var e=x.e;return e.confirmou&&x.ok&&e.tecnico&&e.assTecnico&&e.assCapitao&&e.lgpd}).length;
  var pill=function(ok,t){return '<span class="pill '+(ok?'ok':'er')+'">'+t+'</span> '};
  var pend=rows.filter(function(x){var e=x.e;return !(e.confirmou&&x.ok&&e.tecnico&&e.assTecnico&&e.assCapitao&&e.lgpd)}).map(function(x){var e=x.e,f=[];if(!e.confirmou)f.push('confirmar presença');if(x.atl.length<MIN_SUM)f.push('atletas ('+x.atl.length+'/'+LIM_ATL+')');if(!e.tecnico)f.push('técnico');if(!(e.assTecnico&&e.assCapitao))f.push('assinaturas');if(!e.lgpd)f.push('termo LGPD');return '- '+e.equipe+': '+f.join(', ')});
  var txt='Pendências de cadastro - Supercopa AFC\nPrazo: 27/11 às 13h\n\n'+(pend.length?pend.join('\n'):'Todas as equipes estão completas.');
  el.innerHTML='<div class="sec"><h2>Visão geral</h2><small>meta: '+LIM_ATL+' atletas por equipe</small></div>'
  +'<div class="card"><div style="display:flex;align-items:baseline;gap:10px"><b style="font:800 54px/1 var(--display);color:var(--b1)">'+geral+'%</b><span class="mut">'+N(tot)+' de '+N(meta)+' vagas de atletas preenchidas</span></div><div class="nmht" style="margin-top:10px"><i style="width:'+geral+'%"></i></div>'
  +'<div class="grid kp" style="margin-top:14px;grid-template-columns:repeat(3,1fr)"><div class="kpi"><b>'+prontas+'/'+rows.length+'</b><small>com '+MIN_SUM+'+ atletas</small></div><div class="kpi"><b>'+comp+'/'+rows.length+'</b><small>completas</small></div><div class="kpi"><b>'+N(rows.reduce(function(s,x){return s+x.com.length},0))+'</b><small>na comissão</small></div></div></div>'
  +'<div class="sec"><h2>Por equipe</h2><small>toque para ver o elenco</small></div><div class="grid g2">'
  +rows.map(function(x,i){var e=x.e,cor=x.pct>=70?'var(--ok)':x.ok?'#e0a21a':'var(--er)';
   return '<div class="card el" data-i="'+i+'" style="cursor:pointer"><div style="display:flex;gap:12px;align-items:center">'+(x.esc?'<img src="'+esc(x.esc)+'" alt="" style="width:46px;height:46px;object-fit:contain;flex:none" onerror="this.style.visibility=\'hidden\'">':'<div style="width:46px;height:46px;flex:none"></div>')+'<div style="flex:1;min-width:0"><b style="display:block;word-break:break-word">'+esc(e.equipe)+'</b><small class="mut">'+x.atl.length+'/'+LIM_ATL+' atletas · '+x.com.length+'/'+LIM_COM+' comissão</small></div><b style="font:800 30px var(--display);color:'+cor+'">'+x.pct+'%</b></div>'
   +'<div class="nmht" style="margin:10px 0"><i style="width:'+x.pct+'%;background:'+cor+'"></i></div><div>'+pill(e.confirmou,'confirmou')+pill(x.ok,'elenco mín.')+pill(e.tecnico,'técnico')+pill(e.assTecnico&&e.assCapitao,'assinaturas')+pill(e.lgpd,'termo')+'</div>'
   +'<div class="elx hide" style="margin-top:12px">'+(x.atl.length||x.com.length?'<div class="lst">'+x.atl.concat(x.com).map(function(a){return '<div class="row"><span class="pill">'+esc(a.numero||'-')+'</span><div class="t"><b>'+esc(a.nome)+'</b><small>'+esc(a.tipo||'Atleta')+'</small></div></div>'}).join('')+'</div>':'<p class="empty">Nenhum atleta cadastrado.</p>')+'</div></div>'}).join('')+'</div>'
  +'<div class="sec"><h2>Cobrar as equipes</h2></div><div class="card"><p class="mut" style="margin-bottom:10px">Lista de pendências pronta para colar no grupo.</p><div class="btns"><button class="btn" id="e-c">Copiar pendências</button><button class="btn gh" id="e-w">Enviar por WhatsApp</button></div></div>';
  el.querySelectorAll('.el').forEach(function(c){c.onclick=function(){c.querySelector('.elx').classList.toggle('hide')}});
  $('e-c').onclick=function(){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){toast('Pendências copiadas')},function(){toast('Não foi possível copiar',1)})};
  $('e-w').onclick=function(){window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank')};
 });
}
/* ---------- NOTÍCIAS ---------- */
var NOT=[],AVI=[];function MESANO(){var m=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],d=new Date();return m[d.getMonth()]+' '+d.getFullYear()}
function pNoticias(){
 var el=$('t-noticias');el.innerHTML=skel();
 return Promise.all([get('noticias'),get('avisos')]).then(function(r){NOT=(r[0].noticias||[]).slice().reverse();AVI=r[1].avisos||[];desenharNoticias()});
}
function desenharNoticias(){
 var el=$('t-noticias');
 el.innerHTML='<div class="sec"><h2>Nova notícia</h2></div><div class="card" id="nf"></div>'
 +'<div class="sec"><h2>Publicadas</h2><small>'+NOT.length+' notícias</small></div><div class="card"><div class="lst">'+(NOT.length?NOT.map(function(n){return '<div class="row"><div style="font-size:24px">'+esc(n.ic)+'</div><div class="t"><b>'+esc(n.titulo)+'</b><small>'+esc(n.cat)+' · '+esc(n.data)+'</small></div><button class="btn sm gh" data-ed="'+n.id+'">Editar</button></div>'}).join(''):'<p class="empty">Nenhuma notícia.</p>')+'</div></div>'
 +'<div class="sec"><h2>Avisos fixos</h2><small>aparecem no topo do app</small></div><div class="card"><div class="f"><span>Título</span><input id="av-t" maxlength="80"></div><div class="f"><span>Texto</span><textarea id="av-x" style="min-height:70px"></textarea></div><label class="chk"><input type="checkbox" id="av-f"> Fixar no topo</label><button class="btn" id="av-s">Publicar aviso</button><div class="lst" style="margin-top:14px">'+AVI.map(function(a){return '<div class="row"><div class="t"><b>'+(a.fixado?'[fixo] ':'')+esc(a.titulo)+'</b><small>'+esc(a.criadoEm)+'</small></div><button class="btn sm er" data-da="'+a.id+'">Apagar</button></div>'}).join('')+'</div></div>';
 formNoticia(null);
 el.querySelectorAll('[data-ed]').forEach(function(b){b.onclick=function(){formNoticia(NOT.filter(function(n){return n.id===b.dataset.ed})[0]);$('nf').scrollIntoView({behavior:'smooth',block:'center'})}});
 el.querySelectorAll('[data-da]').forEach(function(b){b.onclick=function(){if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Confirmar?';return}post('excluirAviso',{id:b.dataset.da}).then(function(r){if(r.ok){toast('Aviso apagado');pNoticias()}else toast(r.erro,1)})}});
 $('av-s').onclick=function(){var t=$('av-t').value.trim();if(!t)return toast('Informe o título do aviso',1);post('salvarAviso',{titulo:t,texto:$('av-x').value.trim(),fixado:$('av-f').checked}).then(function(r){if(r.ok){toast('Aviso publicado');pNoticias()}else toast(r.erro,1)})};
}
function formNoticia(n){
 var f=$('nf');n=n||{};
 f.innerHTML='<div class="chips" id="n-em">'+['📰','🏆','🏐','🏀','📣','⚠️','👑','🎉','📅','📍'].map(function(e){return '<button type="button" data-e="'+e+'">'+e+'</button>'}).join('')+'</div><div class="fr"><div class="f"><span>Ícone</span><input id="n-i" maxlength="4" value="'+esc(n.ic||'')+'" placeholder="📰"></div><div class="f"><span>Categoria</span><select id="n-c">'+['Notícia','Jogo','Patrocínio','Resultado','Bastidores','Aviso'].map(function(c){return '<option'+(c===n.cat?' selected':'')+'>'+c+'</option>'}).join('')+'</select></div></div>'
 +'<div class="f"><span>Título</span><input id="n-t" maxlength="140" value="'+esc(n.titulo||'')+'"></div><div class="f"><span>Data (texto livre)</span><input id="n-d" value="'+esc(n.data||(n.id?'':MESANO()))+'" placeholder="novembro 2026"></div><div class="f"><span>Texto</span><textarea id="n-x">'+esc(n.corpo||'')+'</textarea></div>'
 +'<div class="mut" style="margin:0 0 6px">Como aparece no app</div><div class="al in" id="n-v" style="margin-bottom:14px"></div>'+'<label class="chk"><input type="checkbox" id="n-p"> Avisar por push ao publicar</label><div class="btns"><button class="btn" id="n-s">'+(n.id?'Salvar alterações':'Publicar notícia')+'</button>'+(n.id?'<button class="btn gh" id="n-n">Cancelar</button><button class="btn er" id="n-e">Excluir</button>':'')+'</div>';
 var pv=function(){$('n-v').innerHTML='<div style="display:flex;gap:10px"><span style="font-size:26px">'+esc($('n-i').value||'📰')+'</span><div><b>'+esc($('n-t').value||'Título da notícia')+'</b><span class="mut">'+esc($('n-c').value)+' · '+esc($('n-d').value)+'</span><div style="margin-top:4px">'+esc($('n-x').value.slice(0,140))+'</div></div></div>'};
 ['n-i','n-t','n-c','n-d','n-x'].forEach(function(i){$(i).addEventListener('input',pv)});pv();
 $('n-em').onclick=function(e){var b=e.target.closest('button');if(b){$('n-i').value=b.dataset.e;pv()}};
 if(!n.id){try{var dr=JSON.parse(ls('sca_nd')||'null');if(dr){$('n-t').value=dr.t||'';$('n-x').value=dr.x||'';pv()}}catch(e){}['n-t','n-x'].forEach(function(i){$(i).addEventListener('input',function(){ls('sca_nd',JSON.stringify({t:$('n-t').value,x:$('n-x').value}))})})}
 $('n-s').onclick=function(){var t=$('n-t').value.trim();if(!t)return toast('Informe o título',1);var b=$('n-s');b.disabled=true;
  post('salvarNoticia',{id:n.id,ic:$('n-i').value.trim()||'📰',cat:$('n-c').value,titulo:t,data:$('n-d').value.trim(),corpo:$('n-x').value.trim()}).then(function(r){b.disabled=false;if(!r.ok)return toast(r.erro||'Erro ao salvar',1);toast(n.id?'Notícia atualizada':'Notícia publicada');ls('sca_nd',null);
   if($('n-p').checked)enviarPush(t,$('n-x').value.trim().slice(0,110)||'Nova notícia no app da Supercopa',APPU).then(function(x){toast(x.ok?'Push enviado':'Notícia salva, mas o push falhou',!x.ok)});pNoticias()}).catch(function(){b.disabled=false;toast('Falha de conexão',1)})};
 if(n.id){$('n-n').onclick=function(){formNoticia(null)};$('n-e').onclick=function(){var b=$('n-e');if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Confirmar exclusão?';return}post('excluirNoticia',{id:n.id}).then(function(r){if(r.ok){toast('Notícia excluída');pNoticias()}else toast(r.erro,1)})}}
}

/* ---------- PUSH ---------- */
function enviarPush(title,body,url,target){
 var c=new AbortController(),t=setTimeout(function(){c.abort()},70000);
 return fetch(PUSH+'/enviar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:title,body:body,url:url||'/',category:'geral',target:target||'all'}),signal:c.signal}).then(function(r){return r.json()}).then(function(j){clearTimeout(t);var h=JSON.parse(ls('sca_ph')||'[]');h.unshift({t:title,b:body,q:Date.now(),n:j.sucesso||0});ls('sca_ph',JSON.stringify(h.slice(0,30)));return{ok:true,n:j.sucesso||0,j:j}}).catch(function(e){clearTimeout(t);return{ok:false,erro:e.name==='AbortError'?'O servidor demorou demais.':e.message}});
}
function pPush(){
 var el=$('t-push');
 var modelos=[['Jogo começando','Próximo jogo na quadra','O próximo jogo da Supercopa está começando. Venha torcer!'],['Ao vivo agora','Jogo ao vivo','A partida está rolando. Acompanhe o placar em tempo real no app.'],['Resultado','Resultado disponível','Confira o resultado do jogo e a classificação atualizada.'],['Vote','Vote no atleta destaque','A votação está aberta. Escolha o melhor jogador em campo.'],['Quiz','Quiz da Supercopa liberado','Responda o quiz e concorra a prêmio. Você só tem uma tentativa.'],['Intervalo','Intervalo','Aproveite o intervalo. Já voltamos com o próximo jogo.']];
 el.innerHTML='<div class="sec"><h2>Enviar notificação</h2></div><div class="card"><div class="al in" id="pst"><div><b>Inscritos</b><span class="ld"></span> consultando o servidor...</div></div><div class="chips">'+modelos.map(function(m,i){return '<button type="button" data-m="'+i+'">'+m[0]+'</button>'}).join('')+'</div><div class="f"><span>Título</span><input id="p-t" maxlength="60"></div><div class="f"><span>Mensagem</span><textarea id="p-b" maxlength="180" style="min-height:80px"></textarea></div><div class="f"><span>Abrir ao tocar</span><input id="p-u" value="'+APPU+'"></div><div class="btns"><button class="btn" id="p-s">Enviar agora</button></div><p class="mut" style="margin-top:10px">Envio imediato e sem volta. Se o servidor estiver dormindo, o primeiro envio pode levar até 1 minuto.</p></div><div class="sec"><h2>Enviadas</h2></div><div class="card" id="ph"></div>';
 el.querySelectorAll('[data-m]').forEach(function(b){b.onclick=function(){var m=modelos[b.dataset.m];$('p-t').value=m[1];$('p-b').value=m[2]}});
 var hist=function(){var h=JSON.parse(ls('sca_ph')||'[]');$('ph').innerHTML=h.length?'<div class="lst">'+h.map(function(x){return '<div class="row"><div class="t"><b>'+esc(x.t)+'</b><small>'+esc(x.b)+'</small></div><div style="text-align:right"><span class="pill ok">'+x.n+' ok</span><br><small class="mut">'+new Date(x.q).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+'</small></div></div>'}).join('')+'</div>':'<p class="empty">Nada enviado por este aparelho ainda.</p>'};hist();
 fetch(PUSH+'/status').then(function(r){return r.json()}).then(function(j){$('pst').className='al '+(j.total>=30?'ok':'wa');$('pst').innerHTML='<div><b>'+N(j.total)+' aparelho(s) com notificação ativa</b>'+(j.total<30?'Poucos inscritos: divulgue o botão de ativar notificações no app.':'Servidor online.')+'</div>'}).catch(function(){$('pst').className='al er';$('pst').innerHTML='<div><b>Servidor não respondeu</b>Tente de novo em instantes.</div>'});
 var s=$('p-s');s.onclick=function(){var t=$('p-t').value.trim(),b=$('p-b').value.trim();if(!t||!b)return toast('Preencha título e mensagem',1);if(s.dataset.c!=='1'){s.dataset.c='1';s.textContent='Confirmar envio?';setTimeout(function(){s.dataset.c='';s.textContent='Enviar agora'},5000);return}
  s.dataset.c='';s.disabled=true;s.textContent='Enviando...';enviarPush(t,b,$('p-u').value.trim()).then(function(r){s.disabled=false;s.textContent='Enviar agora';if(r.ok){toast('Enviado para '+r.n+' aparelho(s)');$('p-t').value='';$('p-b').value='';hist()}else toast(r.erro,1)})};
 return Promise.resolve();
}

/* ---------- SAÚDE ---------- */
function ping(url){var t=performance.now();return fetch(url,{mode:'no-cors',cache:'no-store'}).then(function(){return{ok:true,ms:Math.round(performance.now()-t)}}).catch(function(){return{ok:false,ms:Math.round(performance.now()-t)}})}
function pSaude(){
 var el=$('t-saude');el.innerHTML=skel();var R=[];
 var add=function(grupo,nome,st,det,ms){R.push({g:grupo,n:nome,s:st,d:det,ms:ms})};
 var lat=function(ms){return ms>2500?'wa':'ok'};
 var T=function(a,p){return get(a,p).then(function(j){return j},function(e){return{ok:false,erro:e.message,_ms:0}})};
 return Promise.all([ping(SITE),ping(APPU),T('noticias'),T('timesPublicos'),T('torneio',{modalidade:'volei'}),T('partidasTodas'),T('count_acessos_site'),post('saudeSistema',{}),ping(PUSH+'/status'),fetch(PUSH+'/status').then(function(r){return r.json()}).catch(function(){return null}),ping(SITE+'novo/app.js'),ping(APPU+'novo/skin.js'),T('feedback')]).then(function(r){
  add('Site','Site público',r[0].ok?lat(r[0].ms):'er',r[0].ok?'respondeu em '+r[0].ms+' ms':'não respondeu',r[0].ms);
  add('Site','Script do site',r[10].ok?lat(r[10].ms):'er',r[10].ok?'carregou em '+r[10].ms+' ms':'não carregou',r[10].ms);
  add('Site','Registro de acessos',r[6].ok===false||r[6].unicos==null?'er':'ok',r[6].unicos!=null?N(r[6].unicos)+' aparelhos registrados':'sem resposta',r[6]._ms);
  add('App','App (PWA)',r[1].ok?lat(r[1].ms):'er',r[1].ok?'respondeu em '+r[1].ms+' ms':'não respondeu',r[1].ms);
  add('App','Script do app',r[11].ok?lat(r[11].ms):'er',r[11].ok?'carregou em '+r[11].ms+' ms':'não carregou',r[11].ms);
  add('App','Notícias',r[2].ok?lat(r[2]._ms):'er',r[2].ok?(r[2].noticias||[]).length+' notícias · '+r[2]._ms+' ms':(r[2].erro||'erro'),r[2]._ms);
  add('App','Times',r[3].ok?lat(r[3]._ms):'er',r[3].ok?(r[3].times||[]).length+' times · '+r[3]._ms+' ms':(r[3].erro||'erro'),r[3]._ms);
  add('App','Torneio (jogos e classificação)',r[4].ok?lat(r[4]._ms):'er',r[4].ok?(r[4].jogos||[]).length+' jogos na chave · '+r[4]._ms+' ms':(r[4].erro||'erro'),r[4]._ms);
  var pa=(r[5].partidas||[]),av=pa.filter(function(p){return p.status==='em_andamento'}).length,fa=pa.filter(function(p){return p.status==='sets_completos'}).length,fi=pa.filter(function(p){return p.status==='finalizada'}).length;
  add('Súmula','Banco da súmula',r[5].ok?lat(r[5]._ms):'er',r[5].ok?pa.length+' partidas · '+r[5]._ms+' ms':(r[5].erro||'erro'),r[5]._ms);
  add('Súmula','Partidas ao vivo',av?'ok':'in',av+' em andamento · '+fi+' finalizadas',0);
  add('Súmula','Esperando finalizar',fa?'wa':'ok',fa?fa+' partida(s) com sets completos sem finalizar':'nenhuma pendente',0);
  var sa=r[7];
  if(sa&&sa.ok){sa.itens.forEach(function(i){add('Sistema',i.nome,i.status==='ok'?'ok':i.status==='erro'?'er':'wa',i.detalhe,0)})}else add('Sistema','Verificação do servidor','er',(sa&&sa.erro)||'sem resposta',0);
  add('Notificações','Servidor de push',r[9]?'ok':'er',r[9]?N(r[9].total)+' aparelho(s) inscritos · '+r[8].ms+' ms':'não respondeu (pode estar dormindo)',r[8].ms);
  add('Feedback','Respostas do público',r[12].ok?'ok':'er',r[12].ok?(r[12].respostas||[]).length+' respostas':(r[12].erro||'erro'),r[12]._ms);
  var er=R.filter(function(x){return x.s==='er'}).length,wa=R.filter(function(x){return x.s==='wa'}).length,lv=er?'er':wa?'wa':'ok';
  var txt='RELATÓRIO DE FUNCIONAMENTO - SUPERCOPA\n'+new Date().toLocaleString('pt-BR')+'\nStatus geral: '+(er?er+' falha(s)':wa?wa+' aviso(s)':'tudo ok')+'\n';var gs=[];R.forEach(function(x){if(gs.indexOf(x.g)<0)gs.push(x.g)});
  gs.forEach(function(g){txt+='\n'+g.toUpperCase()+'\n';R.filter(function(x){return x.g===g}).forEach(function(x){txt+=(x.s==='ok'?'[ok] ':x.s==='er'?'[FALHA] ':x.s==='wa'?'[atenção] ':'[info] ')+x.n+': '+x.d+'\n'})});
  var h=JSON.parse(ls('sca_sh')||'[]');h.unshift({q:Date.now(),e:er,w:wa});ls('sca_sh',JSON.stringify(h.slice(0,12)));
  el.innerHTML='<div class="hlt '+lv+'"><b>'+(er?er+' falha(s) encontrada(s)':wa?wa+' ponto(s) de atenção':'Tudo funcionando')+'</b><span style="flex:1"></span><span>'+R.length+' verificações</span></div>'
  +gs.map(function(g){return '<div class="sec"><h2>'+g+'</h2></div><div class="card"><div class="lst">'+R.filter(function(x){return x.g===g}).map(function(x){return '<div class="row"><span class="dot '+(x.s==='in'?'':x.s)+'"></span><div class="t"><b>'+esc(x.n)+'</b><small>'+esc(x.d)+'</small></div></div>'}).join('')+'</div></div>'}).join('')
  +'<div class="sec"><h2>Relatório</h2></div><div class="card"><div class="btns"><button class="btn" id="s-c">Copiar relatório</button><button class="btn gh" id="s-w">Enviar por WhatsApp</button><button class="btn gh" id="s-r">Verificar de novo</button></div><p class="mut" style="margin-top:10px">As verificações são feitas agora, a partir deste aparelho. Últimos testes aqui: '+h.slice(0,6).map(function(x){return new Date(x.q).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+(x.e?' ('+x.e+' falha)':x.w?' ('+x.w+' aviso)':' ok')}).join(' · ')+'</p></div>';
  $('s-c').onclick=function(){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){toast('Relatório copiado')},function(){toast('Não foi possível copiar',1)})};
  $('s-w').onclick=function(){window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank')};
  $('s-r').onclick=function(){LOADED.saude=false;ir('saude',true)};
 });
}

/* ---------- PRÊMIOS ---------- */
function wa(fone,msg){var d=String(fone||'').replace(/\D/g,'');if(d.length<=11)d='55'+d;return 'https://wa.me/'+d+'?text='+encodeURIComponent(msg)}

/* ---------- DESTAQUE DA PARTIDA (nome, time e foto) ---------- */
var BASQ_T=['São Pedro Basquete','Central Serrano Basquete','Aracruz Basquete','Marlins','Crossover Basquete','CT das Montanhas'];
var DFOTO='';
function reduzirFoto(file,max){return new Promise(function(ok,no){var fr=new FileReader();fr.onerror=function(){no(new Error('Não foi possível ler a foto.'))};fr.onload=function(){var im=new Image();im.onerror=function(){no(new Error('Imagem inválida.'))};im.onload=function(){var s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.84))};im.src=fr.result};fr.readAsDataURL(file)})}
function destaqueHtml(lista,times){
 DFOTO='';
 var op=function(a){return a.map(function(x){return '<option>'+esc(x)+'</option>'}).join('')};
 setTimeout(bindDestaque,0);
 return '<div class="sec"><h2>Destaque da partida</h2><small>aparece no site e no app</small></div><div class="card"><div class="fr" style="grid-template-columns:1fr 1fr"><div class="f"><span>Modalidade</span><select id="d-m"><option>Vôlei</option><option>Basquete</option></select></div><div class="f"><span>Jogo</span><input id="d-j" maxlength="60" placeholder="Jogo 5 · Semifinal"></div></div>'
 +'<div class="f"><span>Time</span><select id="d-e"></select></div><div class="f"><span>Nome do atleta</span><input id="d-n" maxlength="80" autocapitalize="words"></div><div class="f"><span>Observação (opcional)</span><input id="d-o" maxlength="140" placeholder="Ex.: 22 pontos e 3 bloqueios"></div>'
 +'<div class="f"><span>Foto</span><input type="file" id="d-f" accept="image/*"></div><div id="d-p" style="margin-bottom:12px"></div><button class="btn w" id="d-s">Salvar destaque</button>'
 +'<div class="lst" style="margin-top:16px">'+(lista.length?lista.map(function(x){return '<div class="row">'+(x.foto?'<img src="'+esc(x.foto)+'" alt="" style="width:52px;height:52px;object-fit:cover;flex:none">':'<div style="width:52px;height:52px;background:var(--soft);flex:none"></div>')+'<div class="t"><b>'+esc(x.nome)+'</b><small>'+esc(x.equipe)+' · '+esc(x.modalidade)+' · '+esc(x.jogo||'')+'</small></div><button class="btn sm er" data-dd="'+x.id+'">Apagar</button></div>'}).join(''):'<p class="empty">Nenhum destaque cadastrado ainda.</p>')+'</div></div>'
 +'<script type="application/json" id="d-times">'+JSON.stringify({v:times,b:BASQ_T}).replace(/</g,'\\u003c')+'</script>';
}
function bindDestaque(){
 var el=$('d-m');if(!el)return;var T={v:[],b:BASQ_T};try{T=JSON.parse($('d-times').textContent)}catch(e){}
 var fill=function(){var l=$('d-m').value==='Basquete'?T.b:T.v;$('d-e').innerHTML=l.map(function(x){return '<option>'+esc(x)+'</option>'}).join('')};fill();$('d-m').onchange=fill;
 $('d-f').onchange=function(){var f=this.files[0];DFOTO='';$('d-p').innerHTML='';if(!f)return;reduzirFoto(f,720).then(function(u){DFOTO=u;$('d-p').innerHTML='<img src="'+u+'" alt="" style="width:120px;height:120px;object-fit:cover">'}).catch(function(e){toast(e.message,1)})};
 $('d-s').onclick=function(){var n=$('d-n').value.trim();if(!n)return toast('Informe o nome do atleta',1);if(!DFOTO)return toast('Escolha a foto do atleta',1);var b=$('d-s');b.disabled=true;b.textContent='Salvando...';
  post('salvarDestaquePartida',{modalidade:$('d-m').value,jogo:$('d-j').value.trim(),equipe:$('d-e').value,nome:n,observacao:$('d-o').value.trim(),fotoBase64:DFOTO}).then(function(r){b.disabled=false;b.textContent='Salvar destaque';if(!r.ok)return toast(r.erro||'Erro ao salvar',1);toast('Destaque salvo');LOADED.premios=false;ir('premios',true)}).catch(function(){b.disabled=false;b.textContent='Salvar destaque';toast('Falha de conexão',1)})};
 document.querySelectorAll('[data-dd]').forEach(function(b){b.onclick=function(){if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Confirmar?';return}post('excluirDestaquePartida',{id:b.dataset.dd}).then(function(r){if(r.ok){toast('Destaque apagado');LOADED.premios=false;ir('premios',true)}else toast(r.erro,1)})}});
}
function pPremios(){
 var el=$('t-premios');el.innerHTML=skel();
 return Promise.all([safe(get('ranking_quiz')),safe(get('rankingDestaque')),safe(post('listarVotosDestaque',{})),safe(get('votacao')),safe(get('destaques')),safe(get('timesPublicos'))]).then(function(r){
  var q=(r[0]&&r[0].ranking)||[],rk=(r[1]&&r[1].ranking)||[],vt=(r[2]&&r[2].votos)||[],vo=r[3]||{};
  var dpl=((r[4]&&r[4].destaques)||[]).slice().reverse(),tms=((r[5]&&r[5].times)||[]).map(function(x){return x.nome});
  el.innerHTML=destaqueHtml(dpl,tms)+'<div class="sec"><h2>Quiz</h2><small>'+q.length+' participante(s)</small></div><div class="card"><p class="mut" style="margin-bottom:8px">Ranking geral: maior % de acertos; no empate, menor tempo. Vale o melhor resultado por WhatsApp. Hoje o ranking mistura vôlei e basquete.</p><div class="lst">'+(q.length?q.slice(0,30).map(function(p,i){return '<div class="row"><span class="pill'+(i===0?' ok':'')+'">'+(i+1)+'º</span><div class="t"><b>'+esc(p.nome)+'</b><small>'+p.acertos+' de '+p.total+' · '+p.tempo+'s · '+esc(p.fone)+'</small></div><b style="font:800 22px var(--display)">'+Math.round(p.pct)+'%</b>'+(i===0?'<a class="btn sm" target="_blank" rel="noopener" href="'+wa(p.fone,'Olá, '+p.nome.split(' ')[0]+'! Você ficou em 1º lugar no Quiz da Supercopa AFC. Parabéns! Venha buscar seu prêmio com a organização.')+'">Avisar</a>':'')+'</div>'}).join(''):'<p class="empty">Ninguém respondeu ainda.</p>')+'</div></div>'
  +'<div class="sec"><h2>Atleta da galera</h2><small>'+N(vo.totalVotos||0)+' votos · votação '+(vo.aberta?'aberta':'fechada')+'</small></div><div class="card"><div class="lst">'+(rk.length?rk.slice(0,20).map(function(p){return '<div class="row"><span class="pill">'+p.pos+'º</span><div class="t"><b>'+esc(p.nome)+'</b><small>'+esc(p.equipe)+' · camisa '+esc(p.numero||'-')+'</small></div><b style="font:800 20px var(--display)">'+p.votos+' <span class="mut" style="font:500 13px var(--body)">('+p.pct+'%)</span></b></div>'}).join(''):'<p class="empty">Sem votos ainda.</p>')+'</div></div>'
  +'<div class="sec"><h2>Últimos votos</h2></div><div class="card"><div class="lst">'+(vt.length?vt.slice(0,12).map(function(v){return '<div class="row"><div class="t"><b>'+esc(v.atleta_nome)+'</b><small>'+esc(v.equipe)+' · votante '+esc(v.nome_votante)+' · fone final '+esc(v.tel_final)+(v.teste?' · teste':'')+'</small></div><small class="mut">'+esc(v.criado_em)+'</small></div>'}).join(''):'<p class="empty">Nenhum voto.</p>')+'</div></div>';
 });
}

/* ---------- MAIS ---------- */
var CHK=['Criar a chave do vôlei (Torneio → Criar chave)','Todas as equipes com atletas, técnico e assinaturas','Ensaiar o protocolo de contingência da súmula','Confirmar árbitros cadastrados com assinatura','Testar a súmula com um jogo de teste e limpar os testes','Conferir a transmissão ao vivo (link do YouTube)','Mandar push avisando que o app está pronto','Liberar o quiz de vôlei (dia 28/11)','Abrir a votação do atleta destaque','Manter o projeto do Supabase ativo e fazer backup'];
function pMais(){
 var el=$('t-mais'),ck=JSON.parse(ls('sca_ck')||'{}');
 var links=[['Site oficial',SITE],['App do público',APPU],['Painel completo',"https://drdiegopadua.github.io/supercopapainelcontrole/"],['Súmula (mesa)','https://drdiegopadua.github.io/supercopapainelcontrole/mesa.html'],['Árbitro 2','https://drdiegopadua.github.io/supercopapainelcontrole/arbitro2.html'],['TV basquete','https://drdiegopadua.github.io/supercopapainelcontrole/tv-basquete.html']];
 el.innerHTML='<div class="sec"><h2>Checklist do evento</h2><small id="ckn"></small></div><div class="card">'+CHK.map(function(c,i){return '<label class="chk" style="margin:0 0 10px"><input type="checkbox" data-c="'+i+'"'+(ck[i]?' checked':'')+'> '+esc(c)+'</label>'}).join('')+'</div>'
 +'<div class="sec"><h2>Atalhos</h2></div><div class="grid g2">'+links.map(function(l){return '<a class="card" style="text-decoration:none;font-weight:700;display:flex;justify-content:space-between" target="_blank" rel="noopener" href="'+l[1]+'">'+l[0]+'<span>↗</span></a>'}).join('')+'</div>'
 +'<div class="sec"><h2>Dados</h2></div><div class="card"><div class="btns"><button class="btn" id="m-b">Baixar backup completo</button><button class="btn gh" id="m-i">Baixar inscrições (CSV)</button><button class="btn gh" id="m-f">Baixar feedback (CSV)</button></div><p class="mut" style="margin-top:10px">O backup inclui partidas, atletas, PINs, assinaturas e avisos. Guarde em local seguro: contém dados pessoais.</p></div>'
 +'<div class="sec"><h2>Conta</h2></div><div class="card"><p class="mut">Conectado como <b>'+esc(AUTH&&AUTH.usuario)+'</b> (administrador). Este aparelho '+(ls('sca_auth')?'mantém você conectado.':'pede a senha ao fechar o navegador.')+'</p></div>';
 var cnt=function(){var n=Object.keys(ck).filter(function(k){return ck[k]}).length;$('ckn').textContent=n+' de '+CHK.length+' feitos'};cnt();
 el.querySelectorAll('[data-c]').forEach(function(i){i.onchange=function(){ck[i.dataset.c]=i.checked;ls('sca_ck',JSON.stringify(ck));cnt()}});
 var dl=function(nome,txt,tipo){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:tipo}));a.download=nome;document.body.appendChild(a);a.click();a.remove()};
 var csv=function(rows){return '﻿'+rows.map(function(r){return r.map(function(c){return '"'+String(c==null?'':c).replace(/"/g,'""')+'"'}).join(';')}).join('\r\n')};
 $('m-b').onclick=function(){var b=$('m-b');b.disabled=true;post('exportarTudo',{}).then(function(r){b.disabled=false;if(!r.ok)return toast(r.erro||'Erro no backup',1);dl('supercopa-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(r,null,1),'application/json');toast('Backup baixado')}).catch(function(){b.disabled=false;toast('Falha de conexão',1)})};
 $('m-i').onclick=function(){get('inscricoes').then(function(r){var l=r.inscricoes||[];if(!l.length)return toast('Sem inscrições');var ks=Object.keys(l[0]).filter(function(k){return k!=='_linha'});dl('inscricoes.csv',csv([ks].concat(l.map(function(x){return ks.map(function(k){return x[k]})}))),'text/csv');toast('CSV baixado')})};
 $('m-f').onclick=function(){get('feedback').then(function(r){var l=r.respostas||[],ks=r.headers||[];if(!l.length)return toast('Sem respostas');dl('feedback.csv',csv([ks].concat(l.map(function(x){return ks.map(function(k){return x[k]})}))),'text/csv');toast('CSV baixado')})};
 return Promise.resolve();
}
if('serviceWorker' in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
})();
