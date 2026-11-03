import {STORAGE_KEY,freshState,validateBackup,changeQuantity,subtractGift,parseDR1,parseDR2,parseV3} from './core.js';
import {v3Themes,v3Dial,v3BannerTexture} from './v3/artwork.js';
import {editions} from './games.js';
import {appStorage} from './storage.js';
import {initI18n,aliases,localize,setGameLanguage,currentLanguage,t} from './i18n.js';

const $ = s => document.querySelector(s);
const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${({right:'<path d="m9 5 7 7-7 7"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',arrow:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',book:'<path d="M12 6v15M12 6C8 3 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-1-10 2Z"/>'})[name]||''}</svg>`;
const nativeNumber=value=>String(value).split('').map(d=>/\d/.test(d)?`<i class="dr2-digit" style="--digit:${d}">${d}</i>`:escape(d)).join('');
const pad = (id,len=3) => String(id).padStart(len,'0');
let data,state=freshState(),storageWorks=true,pendingSave=null,route='',giftFilter='',onlyOwned=false,charTab='love',prefOwned=false,guideFilter='全部',searchQuery='',busy=false;
let initialError=null,quantityDraft=null,rollbackDelta=null,nativeTraversal=false;
let routeIndex=window.navigation?.currentEntry?.index??(Number.isInteger(history.state?.danganmateIndex)?history.state.danganmateIndex:0);
history.replaceState({...history.state,danganmateIndex:routeIndex},'',location.href);
let characterById=new Map(),giftById=new Map(),giftSearchIndex=new Map();
const sourceById=new Map();
let activeGame='dr1',edition=editions.dr1,articles=edition.content.articles,sources=edition.content.sources,sourceGroups=edition.content.sourceGroups;
const databases=new Map();
const databaseURLs={dr1:new URL('./data.json',import.meta.url),dr2:new URL('./dr2/data.json',import.meta.url),v3:new URL('./v3/data.json',import.meta.url)};
let homeSelection='characters', directorySelection='makoto',giftPreviewId=1,giftFocusId=1;
const backupErrors={dr1:null,dr2:null,v3:null};
document.addEventListener('click',async e=>{
 if(!globalThis.danganmatePlatform)return;
 const picker=e.target.closest('label[data-import-kind="save"],[data-action="pick-backup"]');
 if(!picker)return;
 e.preventDefault();e.stopImmediatePropagation();if(busy)return;
 try{
  const isSave=picker.dataset.importKind==='save';
  const file=await globalThis.danganmatePlatform.pickFile(isSave?(activeGame==='v3'?['.dat']:['.vfs','.bak']):['.json']);
  if(isSave)await loadSave(file);else await loadBackup(file);
 }catch(error){if(error.code!=='FILE_PICKER_CANCELLED')toast('文件选择失败。请确认客户端已更新，或先手动记录礼物数量。');}
},true);
const homeMenus=[
 {id:'characters',title:'通讯录',sub:'查角色喜好',art:'contacts',color:'#ff8a3d',tint:'#8a350b',description:'查看同学的资料与礼物偏好，按你的背包挑选合适的礼物。'},
 {id:'gifts',title:'礼物图鉴',sub:'按编号找礼物',art:'gifts',color:'#f0d928',tint:'#756a0b',description:'按编号或名称查阅礼物，了解获取方式，以及哪些同学喜欢这件礼物。'},
 {id:'bag',title:'我的背包',sub:'管理持有数量',art:'bag',image:'bag-v3-purple.webp',color:'#c7a0f1',tint:'#563079',description:'查看与记录当前持有的礼物数量，筛选已有礼物，方便送礼前核对。'},
 {id:'guides',title:'攻略中心',sub:'跟随章节查阅',art:'guide',color:'#a2e151',tint:'#3b601d',description:'按章节查阅流程、学级裁判与隐藏收集。'},
 {id:'system',title:'存档与备份',sub:'读取 · 导入 · 导出',art:'system',color:'#73bfff',tint:'#114978',description:'在浏览器中读取游戏存档，或导入、导出你的礼物数量与阅读记录。'}
];
const originalMenuColors=homeMenus.map(menu=>menu.color);
const mobileViewport=matchMedia('(max-width: 760px)');
const utilityActions=$('.utility-actions'),utility=$('.utility');
const menuButton=document.createElement('button');
menuButton.type='button';menuButton.id='open-mobile-menu';menuButton.className='mobile-menu-toggle';
menuButton.setAttribute('aria-haspopup','dialog');menuButton.setAttribute('aria-controls','mobile-menu');menuButton.setAttribute('aria-expanded','false');
menuButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg><span>菜单</span>';
utility.append(menuButton);
function closeMobileMenu(){if($('#mobile-menu').open)$('#mobile-menu').close();}
function syncMobileSettings(){
 (mobileViewport.matches?$('#mobile-settings'):utility).append(utilityActions);
 if(!mobileViewport.matches)closeMobileMenu();
 const heading=$('#heading');if(heading.dataset.mobileTitle)heading.textContent=mobileViewport.matches?heading.dataset.mobileTitle:heading.dataset.desktopTitle;
}
syncMobileSettings();mobileViewport.addEventListener('change',syncMobileSettings);
menuButton.onclick=()=>{$('#mobile-menu').showModal();menuButton.setAttribute('aria-expanded','true');};
$('#close-mobile-menu').onclick=closeMobileMenu;
$('#mobile-menu').addEventListener('close',()=>menuButton.setAttribute('aria-expanded','false'));
$('#mobile-menu').addEventListener('click',e=>{if(e.target===$('#mobile-menu')&&(e.clientX<$('#mobile-menu').getBoundingClientRect().left))closeMobileMenu();});
$('#mobile-menu').addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
try { const saved=appStorage.getItem(STORAGE_KEY); if(saved) state=validateBackup(JSON.parse(saved)); }
catch { storageWorks=false;initialError='浏览器记录无法读取。已保留原始数据，请先到“存档与备份”导出恢复文件，再继续编辑。'; }
const record = () => state.games[activeGame];
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').hidden=true,4500);}
let persisting=false;
const storedHere=()=>globalThis.danganmatePlatform?'记录保存在此设备':'记录保存在此浏览器';
async function saveState(next){
 if(persisting)return false;
 if(initialError){toast('原记录需要恢复，尚未覆盖。请先在“存档与备份”导出原始记录，再确认重建。');return false;}
 const shell=$('.app-shell'),focused=document.activeElement;persisting=true;if(globalThis.danganmatePlatform)shell.inert=true;
 try {await appStorage.setItem(STORAGE_KEY,JSON.stringify(next));state=next;storageWorks=true;$('#storage-status').textContent=storedHere();return true;}
 catch {storageWorks=false;$('#storage-status').textContent='保存失败 · 请导出备份';toast('浏览器存储不可用或已满，本次修改未写入。请导出备份并检查浏览器设置。');return false;}
 finally{persisting=false;if(globalThis.danganmatePlatform){shell.inert=false;if(focused?.isConnected)focused.focus({preventScroll:true});}}
}
function updateRecord(next){return saveState({...state,games:{...state.games,[activeGame]:next}});}
function quantity(id){return Object.hasOwn(record().quantities,id) ? record().quantities[id] : null;}
const quantityLabel=id=>quantity(id)===null?'未录入':`× ${quantity(id)}`;
const char=id=>characterById.get(id);
const gift=id=>giftById.get(+id);
const sourceLinks=(ids,note='中文礼物名按资料暂译，可用编号和日文名核对。')=>`<p class="source-line">资料：${[...new Set(ids)].map(id=>{const s=sourceById.get(id);return s?`<a href="${s.url}" target="_blank" rel="noreferrer">${escape(s.title)}</a>`:'';}).join(' · ')}<br>${escape(note)}</p>`;
function modal(title,body,actions){
 const d=$('#dialog');if(d.open)d.close();$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=body;$('#dialog-actions').replaceChildren();
 for(const [label,fn,primary] of actions){const b=document.createElement('button');b.type='button';b.className='btn'+(primary?' primary':'');b.textContent=label;b.onclick=async()=>{d.close();await fn?.();};$('#dialog-actions').append(b);}
 d.showModal();
}
function hasQuantityDraft(){
 if(!quantityDraft)return false;
 const stored=quantity(quantityDraft.id),{value,badInput}=quantityDraft;
 return badInput||(value===''?stored!==null:stored===null||Number(value)!==stored);
}
function quantityDraftUI(message=''){
 const input=$('#gift-quantity'),status=$('#quantity-status');if(!input||!status)return;
 const dirty=hasQuantityDraft();$('#quantity-form').classList.toggle('is-dirty',dirty);status.hidden=!dirty&&!message;
 status.textContent=message||(dirty?'尚未保存 · 保存后才会更新背包数量。':'');
 status.classList.toggle('unsaved',!!dirty);
 const value=input.value===''?null:Number(input.value);
 const minus=$('[data-action="quantity-step"][data-delta="-1"]');if(minus)minus.disabled=!(value>0);
 const plus=$('[data-action="quantity-step"][data-delta="1"]');if(plus)plus.disabled=value!==null&&value>=999;
}
async function saveQuantityDraft(){
 const input=$('#gift-quantity');if(!input)return false;
 try{
  if(input.value===''||input.validity.badInput)throw new Error('请输入 0–999 的整数；要清除数量，请使用“设为未录入”。');
  const id=Number(input.dataset.id);
  if(!await updateRecord(changeQuantity(record(),id,Number(input.value))))return false;
  quantityDraft=null;renderQuantityChange(id);quantityDraftUI('数量已保存。');return true;
 }catch(error){input.setAttribute('aria-invalid','true');quantityDraftUI(error.message);input.focus();return false;}
}
function confirmQuantityLeave(proceed){
 if(!hasQuantityDraft()){quantityDraft=null;proceed();return;}
 modal('礼物数量尚未保存',`<p>${escape(gift(quantityDraft.id).name)}的修改尚未写入背包。请选择保存或放弃修改后离开。</p>`,[
  ['继续编辑',()=>$('#gift-quantity')?.focus()],
  ['放弃修改并离开',()=>{quantityDraft=null;proceed();}],
  ['保存并离开',async()=>{if(await saveQuantityDraft())proceed();},true]
 ]);
}
function go(next){
 closeMobileMenu();
 if(location.hash==='#'+next&&history.state?.game===activeGame)return;
 confirmQuantityLeave(()=>{
  routeIndex++;const url=new URL(location.href);url.searchParams.set('game',activeGame);url.hash=next;history.pushState({...history.state,danganmateIndex:routeIndex,game:activeGame},'',url);finishRouteChange();
 });
}
// Preserve native links/new tabs; guard same-tab navigation before changing URL.
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href^="#"]');
 if(!link||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||link.target||link.hasAttribute('download')||link.getAttribute('href')==='#content')return;
 e.preventDefault();go(link.getAttribute('href').slice(1));
});
window.addEventListener('beforeunload',e=>{if(hasQuantityDraft()){e.preventDefault();e.returnValue='';}});
window.addEventListener('popstate',()=>{nativeTraversal=true;});
function theme(title,color,tint,section){
 $('#handbook').dataset.game=route==='games'?'':activeGame;$('#handbook').dataset.section=section;document.documentElement.dataset.game=route==='games'?'':activeGame;
 const sectionMenu=homeMenus.find(menu=>menu.id===section);if(sectionMenu)$('#handbook').style.setProperty('--section-icon',`url('${new URL(activeGame==='dr2'?dr2MenuIcon(sectionMenu):menuImage(sectionMenu),location.href).href}')`);
 $('.academy b').textContent=activeGame==='dr2'&&route!=='games'?'ELECTRONIC STUDENT HANDBOOK':'KIBOUGAMINE GAKUEN';$('.crest').src=activeGame==='dr2'?'assets/dr2/ui/techou_bg-2.webp':'assets/dr1/hope-peak-crest.webp';$('.book-footer>span:last-child').textContent=edition.label+' · v0.1';
 $('#handbook').dataset.page=route.split('/')[0];
 let coin=$('.dr2-coins');if(activeGame==='dr2'&&route!=='games'){if(!coin){coin=document.createElement('div');coin.className='dr2-coins';$('.header').append(coin);}coin.innerHTML=`<img src="assets/dr2/gifts/monocoin.webp" alt=""><span class="dr2-pixel-number" aria-label="${record().coins??'—'}">×${nativeNumber(record().coins??'—')}</span>`;}else coin?.remove();
 $('#heading').textContent=title;document.title=`${title} · DanganMate 弹丸手册`;
 if(activeGame==='v3'&&route!=='games')$('#heading').textContent=({characters:'PROFILES',gifts:'PRESENT',bag:'INVENTORY',guides:'SCHOOL RULES',system:'SYSTEM'})[section]||title;
 $('#heading').dataset.desktopTitle=$('#heading').textContent;$('#heading').dataset.mobileTitle=title;
 if(mobileViewport.matches)$('#heading').textContent=title;
 if(activeGame==='dr2'){const item=homeMenus.find(m=>m.id===section);if(item){color=({characters:'#c45dfa',gifts:'#28d5f0',bag:'#ff47a4',guides:'#a4ff32',system:'#d4d4d4'})[section];}}
 $('#handbook').style.setProperty('--accent',color);$('#handbook').style.setProperty('--tint',tint);
 const nav=[['home','首页'],['characters','通讯录'],['gifts','礼物图鉴'],['bag','我的背包'],['guides','攻略中心'],['system','存档与备份']].filter(([id])=>activeGame!=='v3'||id!=='bag');
 $('#navigation').innerHTML=route==='games'?'':nav.map(([id,title])=>`<a href="#${id}"${section===id?' aria-current="page"':''}>${title}</a>`).join('');
 $('#mobile-navigation').innerHTML=$('#navigation').innerHTML+(route==='games'?'':'<a href="#search">全站搜索</a><a href="#about">资料与素材来源</a>');
 $('#back').hidden=route==='games';
 let rail=$('.v3-rail');if(activeGame==='v3'&&route!=='games'){if(!rail){rail=document.createElement('aside');rail.className='v3-rail';rail.setAttribute('aria-label','MONOPAD');$('#handbook').append(rail);}rail.innerHTML=`<div class="v3-medal"><img src="assets/v3/ui/medal_icon_000.webp" alt=""><span>MEDAL<br>${record().coins??'—'}</span></div><img class="v3-mono" src="assets/v3/ui/side_monopad_CN.webp" alt="MONOPAD"><span class="v3-school">才囚学园<br>电子学生手册</span><small>01</small>`;if(section!=='home'){const colors=v3Themes;$('#handbook').style.setProperty('--accent',colors[section]||'#b85bff');}}else rail?.remove();
 document.documentElement.style.setProperty('--accent',$('#handbook').style.getPropertyValue('--accent'));
}
const dr2Art={characters:16,gifts:17,bag:17,guides:15,system:13};
const dr2Icons={characters:9,gifts:10,bag:10,guides:8,system:6};
function dr2MenuIcon(menu){return `assets/dr2/ui/techou_top-${dr2Icons[menu.id]}.webp`;}
function menuImage(menu){return activeGame==='dr2'?`assets/dr2/ui/techou_top-${dr2Art[menu.id]}.webp`:`assets/dr1/menu/${menu.image||menu.art+'-v2.webp'}`;}
function mobileHome(){
 const menus=homeMenus.filter(m=>activeGame!=='v3'||m.id!=='bag');
 const read=articles.find(a=>a.id===record().reading?.id);
 return `<section class="mobile-home"><div class="mobile-home-intro"><h2>${escape(edition.title)}</h2><p>攻略、礼物偏好与背包记录，在同一本手册里查阅。</p></div>${read?`<a class="mobile-reading-resume btn" href="#article/${read.id}"><span>继续阅读：${escape(read.title)}</span>${icon('right')}</a>`:''}<nav class="mobile-home-links" aria-label="快捷入口">${menus.map(m=>`<a href="#${m.id}" style="--menu-color:${activeGame==='v3'?v3Themes[m.id]:activeGame==='dr2'?({characters:'#c45dfa',gifts:'#28d5f0',bag:'#ff47a4',guides:'#a4ff32',system:'#d4d4d4'})[m.id]:m.color}"><span class="mobile-home-art" aria-hidden="true">${activeGame==='v3'?v3Dial(m.id):`<img src="${activeGame==='dr2'?dr2MenuIcon(m):menuImage(m)}" alt="">`}</span><span><strong>${m.title}</strong><small>${m.sub}</small></span>${icon('right')}</a>`).join('')}</nav><a class="mobile-search-link btn" href="#search">${icon('search')}全站搜索</a></section>`;
}
function dr2Home(){
 const selected=homeMenus.find(m=>m.id===homeSelection)||homeMenus[0];theme('首页',selected.color,selected.tint,'home');
 return `<div class="dr2-home"><nav class="dr2-home-menu" aria-label="快捷入口">${['gifts','characters','guides','bag','system'].map(id=>homeMenus.find(m=>m.id===id)).map(m=>`<a class="menu-item ${m.id===selected.id?'selected':''}" style="--menu-color:${m.color}" data-home-preview="${m.id}" href="#${m.id}" aria-label="${m.title}" aria-describedby="home-description"><img src="${dr2MenuIcon(m)}" alt=""><span>${m.title}</span></a>`).join('')}</nav><div class="dr2-home-art"><div id="home-art" class="menu-art" role="img" aria-label="${selected.title}功能图" style="background-image:url('${menuImage(selected)}')"></div></div><p id="home-description">${selected.description}</p></div>`;
}

const v3BannerCopy={
 gifts:{title:'礼物',description:'查看礼物资料、获取方式与角色偏好。'},
 characters:{title:'通讯簿',description:'查看同学资料，挑选适合赠送的礼物。'},
 guides:{title:'攻略',description:'按章节查阅流程、学级裁判与隐藏收集。'},
 bag:{title:'背包',description:'查看和记录目前持有的礼物数量。'},
 system:{title:'系统',description:'读取游戏存档，导入或导出记录备份。'}
};
function v3BannerGraphics(id){

 return `<svg class="v3-home-objects" viewBox="60 48 1369 360" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="v3-monokuma-ink" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.2126 -.7152 -.0722 0 1"/><feComposite in2="SourceGraphic" operator="in"/></filter><filter id="v3-monokuma-red-eye" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 -1 -1 0 0"/><feComposite in2="SourceGraphic" operator="in"/></filter><pattern id="v3-banner-pixels" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#fff"/></pattern><mask id="v3-banner-dot-mask"><rect width="1489" height="512" fill="url(#v3-banner-pixels)"/></mask><clipPath id="v3-banner-panel"><rect x="118" y="99" width="1252" height="272"/></clipPath></defs><g clip-path="url(#v3-banner-panel)" mask="url(#v3-banner-dot-mask)"><image filter="url(#v3-monokuma-ink)" href="assets/v3/ui/parts_monokuma.webp" x="270" y="212" width="280" height="204"/><image href="assets/v3/ui/parts_monokuma.webp" x="270" y="212" width="280" height="204" filter="url(#v3-monokuma-red-eye)"/></g></svg>`;
}
function v3Home(){
 const selected=homeMenus.find(m=>m.id===homeSelection)||homeMenus[0];
 const colors=v3Themes;
 theme('首页',colors[selected.id],'#252020','home');
 return `<div class="v3-home" data-preview="${selected.id}"><div class="v3-home-banner">${v3BannerTexture(selected.id)}${v3BannerGraphics(selected.id)}<div class="v3-home-hero">${v3Dial(selected.id,true)}</div><h2>${v3BannerCopy[selected.id].title}</h2><p id="home-description">${v3BannerCopy[selected.id].description}</p></div><nav class="v3-home-menu" aria-label="快捷入口">${['gifts','characters','guides','system'].map(id=>homeMenus.find(m=>m.id===id)).map(m=>`<a class="menu-item ${m.id===selected.id?'selected':''}" data-home-preview="${m.id}" href="#${m.id}" style="--menu-color:${colors[m.id]}" aria-describedby="home-description"><span class="v3-orb" aria-hidden="true">${v3Dial(m.id)}</span><span>${m.title}</span></a>`).join('')}</nav></div>`;
}
function v3CharacterDetail(c){
 theme('通讯录','#ff46b3','#23141f','characters');
 return `<nav class="v3-character-ribbon" aria-label="同学名单"><button class="ribbon-key" data-action="character-step" data-delta="-1" aria-label="上一个角色（Q）"><kbd>Q</kbd></button>${data.characters.map(p=>`<a href="#character/${p.id}" title="${escape(p.name)}"${p.id===c.id?' aria-current="page"':''}><img src="${p.pixel}" alt="${escape(p.name)}"></a>`).join('')}<button class="ribbon-key" data-action="character-step" data-delta="1" aria-label="下一个角色（E）"><kbd>E</kbd></button></nav><div class="v3-character"><section class="v3-profile"><div class="v3-name-banner"><img class="v3-native-name" src="assets/v3/characters/name_tx_${pad(c.no-1)}_CN.webp" alt=""><h2>${escape(c.name)}</h2><p>${escape(c.en)}</p></div><dl class="v3-bio">${[['才能',c.talent==='???'?'???':'超高中级的'+c.talent],['身高',c.bio.height],['体重',c.bio.weight],['胸围',c.bio.chest],['血型',c.bio.blood],['生日',c.bio.birthday],['喜欢的东西',c.bio.likes],['讨厌的东西',c.bio.dislikes]].map(([label,value])=>`<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl></section>${portrait(c)}</div><section class="v3-preferences panel"><div class="preference-toolbar"><div class="tabs" role="tablist" aria-label="礼物偏好">${[['love','非常喜欢'],['like','喜欢'],['all','全部偏好']].map(([id,label])=>`<button id="pref-tab-${id}" role="tab" aria-controls="preference-results" aria-selected="${charTab===id}" tabindex="${charTab===id?0:-1}" data-action="pref-tab" data-id="${id}">${label}</button>`).join('')}</div><label class="check"><input type="checkbox" id="pref-owned" ${prefOwned?'checked':''}>只看持有</label></div><div id="preference-results" role="tabpanel" aria-labelledby="pref-tab-${charTab}" tabindex="0">${preferenceRows(c)}</div>${sourceLinks(c.source,'礼物名称与说明采用 Steam 版游戏文本，偏好按编号核对。')}</section>`;
}
function v3GiftTiles(selected,list){
 return list.length?list.map(g=>`<a class="v3-gift-tile ${g.id===selected?'active':''}" href="#gift/${g.id}" ${['gifts','bag'].includes(route)?`data-gift-preview="${g.id}"`:''} ${g.id===selected?'aria-current="true"':''} aria-label="${pad(g.id)}　${escape(g.name)}" title="${pad(g.id)}　${escape(g.name)}"><img src="${g.image}" alt="" width="${g.imageWidth}" height="${g.imageHeight}" loading="lazy"><small class="${quantity(g.id)===null?'quantity-unknown':''}">${quantity(g.id)===null?'未录入':'×'+pad(quantity(g.id))}</small></a>`).join(''):`<div class="empty"><p>${giftFilter.trim()?`没有找到与“${escape(giftFilter.trim())}”匹配的礼物。`:'还没有已记录持有的礼物。'}</p><p>可以更换关键词，或清除筛选查看全部礼物。</p><button class="btn" data-action="clear-gift-filters">清除筛选</button></div>`;
}
function v3GiftsView(id){
 theme('礼物图鉴','#e7eb35','#343414','gifts');
 const selected=gift(route.startsWith('gift/')?id:giftPreviewId)||gift(1);
 return `${giftToolbar()}<div class="section-head"><span id="inventory-record-status">${Object.keys(record().quantities).length} 项已录入 · 未录入与数量 0 分开</span><button class="btn" data-action="fill-zero">其余未录入设为 0</button></div>${route.startsWith('gift/')?`<nav class="v3-present-keys"><a class="btn" href="#gift/${(selected.id+141)%143+1}"><kbd>Q</kbd> 上一件礼物</a><a class="quiet" href="#gifts">礼物图鉴</a><a class="btn" href="#gift/${selected.id%143+1}">下一件礼物 <kbd>E</kbd></a></nav>`:`<nav id="gift-list" class="v3-present-grid" aria-label="礼物目录">${v3GiftTiles(selected.id,filteredGifts())}</nav>`}<section class="gift-detail v3-present-detail" aria-labelledby="gift-detail-title">${giftDetailHTML(selected)}</section>`;
}
function v3SystemMenu(){
 const art=(layers,box='0 0 256 256')=>`<span class="v3-system-symbol" aria-hidden="true"><svg viewBox="${box}" focusable="false">${layers}</svg></span>`;
 const disc='<image class="v3-system-color" href="assets/v3/ui/icon_save_color_DXT1.webp" x="14" y="28" width="228" height="228"/>';
 const load=art(`${disc}<image href="assets/v3/ui/icon_save_white_DXT1.webp" x="64" y="0" width="128" height="128"/>`);
 const backup=art(`${disc}<image href="assets/v3/ui/icon_save_white_DXT1.webp" x="64" y="0" width="128" height="128" transform="rotate(180 128 64)"/>`);
 const bag=art('<image class="v3-system-color" href="assets/v3/ui/icon_option_color_DXT1.webp" width="256" height="256"/><image href="assets/v3/ui/icon_option_white_DXT1.webp" width="256" height="256"/>');
 const sources=art('<image class="v3-system-color" href="assets/v3/ui/icon_backlog_color_DXT1.webp" width="256" height="256"/>');
 return `<nav class="v3-system-menu" aria-label="系统"><button type="button" data-action="system-pane" data-id="save" aria-controls="system-save" aria-current="true">${load}<span class="v3-system-label">读取游戏存档</span><small>LOAD</small></button><button type="button" data-action="system-pane" data-id="backup" aria-controls="system-backup">${backup}<span class="v3-system-label">记录备份</span><small>BACKUP</small></button><a href="#gifts">${bag}<span class="v3-system-label">礼物图鉴</span><small>PRESENT</small></a><a href="#about">${sources}<span class="v3-system-label">资料与素材来源</span><small>NOTICE</small></a></nav>`;
}

function activateGame(id){
 homeMenus.forEach((menu,i)=>menu.color=id==='dr2'?['#c45dfa','#28d5f0','#ff47a4','#a4ff32','#d4d4d4'][i]:originalMenuColors[i]);
 activeGame=id;edition=editions[id];data=databases.get(id);({articles,sources,sourceGroups}=edition.content);
 sourceById.clear();for(const source of sources)sourceById.set(source.id,source);
 setGameLanguage(id);directorySelection=id==='v3'?'shuichi':edition.protagonist;giftPreviewId=1;giftFocusId=1;pendingSave=null;busy=false;homeSelection='characters';giftFilter='';searchQuery='';onlyOwned=false;prefOwned=false;charTab='love';guideFilter='全部';
 characterById=new Map(data.characters.map(c=>[c.id,c]));giftById=new Map(data.gifts.map(g=>[g.id,g]));
 const fields=new Map(data.gifts.map(g=>[g.id,[pad(g.id),aliases(g.name),g.ja]]));
 for(const c of data.characters)for(const giftId of [...c.love,...c.like])fields.get(giftId)?.push(aliases(c.name),c.en);
 giftSearchIndex=new Map([...fields].map(([giftId,values])=>[giftId,values.join('\n').toLocaleLowerCase()]));
}
function games(){theme('作品选择','#ff4268','#841d39','');return `<div class="section-head"><h2>打开你的学生手册</h2><span class="muted">选择作品，开始查阅</span></div>${initialError?'<p class="error">原记录需要恢复。<a href="#system">前往存档与备份导出原始记录</a></p>':''}<div class="games"><button class="game available" data-action="choose-game" data-id="dr1"><span class="game-number">1</span><h2>弹丸论破 1</h2><span>希望的学园与绝望高中生</span><span class="start-label">打开手册 ${icon('right')}</span></button><button class="game available" data-action="choose-game" data-id="dr2"><span class="game-number">2</span><h2>超级弹丸论破 2</h2><span>再见绝望学园</span><span class="start-label">打开手册 ${icon('right')}</span></button><button class="game available" data-action="choose-game" data-id="v3"><span class="game-number">V3</span><h2>新弹丸论破 V3</h2><span>大家自相残杀的新学期</span><span class="start-label">打开手册 ${icon('right')}</span></button></div><p class="capsule">攻略、礼物偏好与背包记录，在同一本手册里查阅。<br>记录保存在你的浏览器，也可以导出备份随身带走。</p>`;}
function home(){
 if(activeGame==='v3')return v3Home();
 if(activeGame==='dr2')return dr2Home();
 const selected=homeMenus.find(m=>m.id===homeSelection)||homeMenus[0];
 theme('首页',selected.color,selected.tint,'home');const q=Object.values(record().quantities),owned=q.filter(n=>n>0),read=articles.find(a=>a.id===record().reading?.id);
 return `<div class="overview"><span>已记录 <strong>${q.length}</strong> / ${data.gifts.length} 项</span><span>持有 <strong>${owned.length}</strong> 种 · <strong>${owned.reduce((a,b)=>a+b,0)}</strong> 件</span>${record().coins!==null?`<span>徽章 <strong>${record().coins}</strong></span>`:''}<a href="#system">${q.length?'更新存档':'导入存档或手动录入'}</a></div><div class="home-layout"><nav class="menu-list panel" aria-label="快捷入口">${homeMenus.map(m=>`<a class="menu-item ${m.id===selected.id?'selected':''}" data-home-preview="${m.id}" href="#${m.id}" aria-describedby="home-description"><span>${m.title}</span><small>${m.sub}</small></a>`).join('')}</nav><div class="home-visual function-preview"><div id="home-art" class="menu-art" role="img" aria-label="${selected.title}功能图" style="background-image:url('${menuImage(selected)}')"></div></div></div><p class="capsule" id="home-description">${selected.description}</p>${read?`<div class="reading-resume"><a href="#article/${read.id}">继续阅读：${escape(read.title)} ${icon('right')}</a></div>`:''}`;
}
function previewHome(id){
 if(activeGame==='v3'){
  const m=homeMenus.find(item=>item.id===id);if(!m||route!=='home'||homeSelection===id)return;homeSelection=id;
  $('#handbook').style.setProperty('--accent',v3Themes[id]);document.documentElement.style.setProperty('--accent',v3Themes[id]);
  $('.v3-home').dataset.preview=id;$('#home-art').outerHTML=v3BannerTexture(id);
  $('.v3-home-hero').innerHTML=v3Dial(id,true);$('.v3-home-banner h2').textContent=v3BannerCopy[id].title;$('#home-description').textContent=v3BannerCopy[id].description;
  document.querySelectorAll('[data-home-preview]').forEach(el=>el.classList.toggle('selected',el.dataset.homePreview===id));return;
 }
 const m=homeMenus.find(m=>m.id===id);if(!m||route!=='home'||homeSelection===id)return;homeSelection=id;
 $('#handbook').style.setProperty('--accent',m.color);document.documentElement.style.setProperty('--accent',m.color);$('#handbook').style.setProperty('--tint',m.tint);
 document.querySelectorAll('[data-home-preview]').forEach(el=>el.classList.toggle('selected',el.dataset.homePreview===id));
 $('#home-art').style.backgroundImage=`url('${menuImage(m)}')`;$('#home-art').style.filter=activeGame==='dr2'&&id==='bag'?'hue-rotate(125deg)':'';$('#home-art').setAttribute('aria-label',m.title+'功能图');$('#home-description').textContent=m.description;
}
function previewCharacter(id){
 const c=char(id);if(!c||route!=='characters'||directorySelection===id)return;directorySelection=id;
 $('#directory-portrait').innerHTML=portrait(c);
 document.querySelectorAll('[data-character-preview]').forEach(el=>el.classList.toggle('active',el.dataset.characterPreview===id));
}
function previewGift(id){
 const g=gift(id);if(!['dr2','v3'].includes(activeGame)||!['gifts','bag'].includes(route)||!g||giftPreviewId===g.id||hasQuantityDraft())return;
 giftPreviewId=g.id;quantityDraft=null;
 $('#content .gift-detail').innerHTML=giftDetailHTML(g);
 document.querySelectorAll('[data-gift-preview]').forEach(el=>{const selected=Number(el.dataset.giftPreview)===g.id;el.classList.toggle('active',selected);if(selected)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current');});
}
for(const event of ['pointerover','focusin'])document.addEventListener(event,e=>{
 if(event==='pointerover'&&e.pointerType==='touch')return;
 if(event==='focusin'){const link=e.target.closest('#gift-list a[href^="#gift/"]');if(link){giftFocusId=Number(link.getAttribute('href').split('/')[1]);syncGiftListTabStop();}}
 const menu=e.target.closest('[data-home-preview]');if(menu)previewHome(menu.dataset.homePreview);
 const tile=e.target.closest('[data-dr2-class-name]');if(tile&&$('#class-name'))$('#class-name').textContent=tile.dataset.dr2ClassName;
 const person=e.target.closest('[data-character-preview]');if(person)previewCharacter(person.dataset.characterPreview);
 const present=e.target.closest('[data-gift-preview]');if(present)previewGift(present.dataset.giftPreview);
});

function portrait(c,withSwitches=false){
 if(activeGame==='v3')return `<div class="portrait-wrap"><svg class="v3-portrait-image" viewBox="${c.portraitBounds.join(' ')}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${escape(c.name)}游戏立绘"><image href="${c.portrait}" width="${c.portraitWidth}" height="${c.portraitHeight}"/></svg><div class="portrait-name">${escape(c.name)}<span>${escape(c.en)}</span></div></div>`;
 return `<div class="portrait-wrap">${withSwitches?`<nav class="portrait-shortcuts" aria-label="切换同学"><button type="button" data-action="character-step" data-delta="-1" aria-label="上一个角色（Q）" aria-keyshortcuts="Q" title="上一个角色（Q）"><kbd>Q</kbd><span>上一位</span></button><button type="button" data-action="character-step" data-delta="1" aria-label="下一个角色（E）" aria-keyshortcuts="E" title="下一个角色（E）"><kbd>E</kbd><span>下一位</span></button></nav>`:''}${c.portrait?`<img src="${c.portrait}" width="${c.portraitWidth}" height="${c.portraitHeight}" decoding="async" alt="${escape(c.name)}游戏立绘" ${c.portrait.includes('-portrait.')?'class="lowres"':''}>`:''}<div class="portrait-name">${escape(c.name)}<span>${escape(c.en)}</span></div></div>`;}
function characterGrid(){
 theme('通讯录','#c45dfa','#000','characters');const hero=char(edition.protagonist);
 return `<div class="dr2-class-name" id="class-name">${escape(hero.name)}</div><div class="dr2-classroom"><aside class="dr2-class-lead"><a href="#character/${hero.id}" title="${escape(hero.name)}"><img src="${hero.pixel}" alt="${escape(hero.name)}"></a><a href="#article/pets" title="宠物玩法"><span class="dr2-usami-avatar" role="img" aria-label="宠物玩法"></span></a></aside><nav class="dr2-class-grid" aria-label="同学名单">${data.characters.filter(c=>c.id!==hero.id).map(c=>`<a href="#character/${c.id}" data-dr2-class-name="${escape(c.name)}" title="${escape(c.name)}"><img src="${c.pixel}" width="${c.pixelWidth}" height="${c.pixelHeight}" alt="${escape(c.name)}"></a>`).join('')}</nav></div>`;
}
function characterList(){if(activeGame==='v3')return v3CharacterDetail(char(directorySelection)||char('shuichi'));if(activeGame==='dr2')return characterGrid();theme('通讯录','#ff8a3d','#8a350b','characters');return `<div class="section-head"><span class="muted">选择角色，查询偏好与持有礼物</span><a class="quiet" href="#article/gifting">如何查找合适的礼物</a></div><div class="directory"><div id="directory-portrait">${portrait(char(directorySelection)||char(edition.protagonist))}</div><nav class="list" aria-label="同学名单">${data.characters.map(c=>`<a class="list-row ${c.id===directorySelection?'active':''}" data-character-preview="${c.id}" href="#character/${c.id}"><b class="id">${pad(c.no,4)}</b>${c.pixel?`<img class="pixel ${c.id===edition.protagonist?'pixel-head':''}" src="${c.pixel}" width="${c.pixelWidth}" height="${c.pixelHeight}" loading="lazy" decoding="async" alt="">`:''}<span class="name">${escape(c.name)}</span><small>${c.id===edition.protagonist?'主人公':'查看礼物偏好'}</small>${icon('right')}</a>`).join('')}</nav></div>`;}
function preferenceRows(c){
 const levels=charTab==='all'?['love','like']:[charTab];
 const result=levels.flatMap(t=>c[t].map(id=>({g:gift(id),tier:t}))).filter(({g})=>!prefOwned||quantity(g.id)>0).sort((a,b)=>Number(quantity(b.g.id)>0)-Number(quantity(a.g.id)>0));
 return result.length?`<div class="pref-list">${result.map(({g,tier})=>`<div class="pref-row"><b>${pad(g.id)}</b><div><a href="#gift/${g.id}">${escape(g.name)}</a><small><span class="tier">${tier==='love'?'非常喜欢':'喜欢'}</span> · ${quantityLabel(g.id)}</small></div><button class="btn" data-action="give" data-id="${g.id}" ${quantity(g.id)>0?'':'disabled'}>记为已赠送</button></div>`).join('')}</div>`:`<p class="empty">${prefOwned?'还没有已记录持有的合适礼物。<br>去礼物图鉴录入数量，或取消“只看持有”。':'这位角色没有可赠礼的记录。'}</p>`;
}
function characterDetail(c){
 if(activeGame==='v3')return v3CharacterDetail(c);
 if(activeGame==='dr2')return dr2CharacterDetail(c);
 theme('通讯录','#ff8a3d','#8a350b','characters');
 return `${activeGame==='dr2'?`<nav class="character-ribbon" aria-label="同学名单">${data.characters.map(person=>`<a href="#character/${person.id}" ${person.id===c.id?'aria-current="page"':''} title="${escape(person.name)}"><img src="${person.pixel}" width="${person.pixelWidth}" height="${person.pixelHeight}" alt="${escape(person.name)}"></a>`).join('')}</nav>`:''}<div class="section-head"><h2>${pad(c.no,4)}　${escape(c.name)}</h2><a class="quiet" href="#characters">返回同学名单</a></div><div class="character-detail">${portrait(c,true)}<div><div class="field"><span class="label">才能</span><strong>${c.id==='kyoko'?'<button class="spoiler" data-action="spoiler" aria-pressed="false" aria-label="显示隐藏才能">超高校级的侦探</button>':`${c.talent==='???'?'???':'超高校级的'+escape(c.talent)}`}</strong></div>${c.id===edition.protagonist?`<p class="capsule">${activeGame==='dr2'?'以日向的视角，与同学们一起探索贾巴沃克岛。':'以苗木的视角，与同学们一起探索学园。'}</p>`:`<div class="preference-toolbar"><div class="tabs" role="tablist" aria-label="礼物偏好">${[['love','非常喜欢'],['like','喜欢'],['all','全部偏好']].map(([id,name])=>`<button id="pref-tab-${id}" role="tab" aria-controls="preference-results" tabindex="${charTab===id?0:-1}" aria-selected="${charTab===id}" data-action="pref-tab" data-id="${id}">${name}</button>`).join('')}</div><label class="check"><input type="checkbox" id="pref-owned" ${prefOwned?'checked':''}>只看持有</label></div><div id="preference-results" role="tabpanel" aria-labelledby="pref-tab-${charTab}" tabindex="0">${preferenceRows(c)}</div>${c.id==='toko'?`<p style="margin-top:24px">隐藏人物：<button class="spoiler" data-action="hidden-character" aria-pressed="false" aria-label="显示隐藏人物">灭族者翔（点击查看偏好）</button></p>`:''}${sourceLinks(c.source)}`}</div></div>`;
}

function dr2CharacterDetail(c){
 theme('通讯录','#c45dfa','#000','characters');
 return `<nav class="character-ribbon" aria-label="同学名单"><button class="ribbon-key" data-action="character-step" data-delta="-1" aria-label="上一个角色（Q）"><kbd>Q</kbd></button>${data.characters.map(person=>`<a href="#character/${person.id}" ${person.id===c.id?'aria-current="page"':''} title="${escape(person.name)}"><img src="${person.pixel}" alt="${escape(person.name)}"></a>`).join('')}<button class="ribbon-key" data-action="character-step" data-delta="1" aria-label="下一个角色（E）"><kbd>E</kbd></button></nav><div class="dr2-character"><section class="dr2-character-info"><div class="dr2-name-banner"><h2>${escape(c.name)}</h2><p>${escape(c.en)}</p></div><div class="field"><span class="label">才能</span><strong>${c.talent==='???'?'???':'超高校级的'+escape(c.talent)}</strong></div>${c.id===edition.protagonist?'<p class="dr2-protagonist-note">以日向的视角，与同学们一起探索贾巴沃克岛。</p>':`<div class="preference-toolbar"><div class="tabs" role="tablist" aria-label="礼物偏好">${[['love','非常喜欢'],['like','喜欢'],['all','全部偏好']].map(([id,name])=>`<button id="pref-tab-${id}" role="tab" aria-controls="preference-results" tabindex="${charTab===id?0:-1}" aria-selected="${charTab===id}" data-action="pref-tab" data-id="${id}">${name}</button>`).join('')}</div><label class="check"><input type="checkbox" id="pref-owned" ${prefOwned?'checked':''}>只看持有</label></div><div id="preference-results" role="tabpanel" aria-labelledby="pref-tab-${charTab}" tabindex="0">${preferenceRows(c)}</div>${sourceLinks(c.source)}`}<a class="quiet dr2-return-list" href="#characters">返回同学名单</a></section>${portrait(c)}</div>`;
}

function filteredGifts(){const q=giftFilter.trim().toLocaleLowerCase();return data.gifts.filter(g=>(!onlyOwned||quantity(g.id)>0)&&(!q||giftSearchIndex.get(g.id).includes(q)));}
function giftListHTML(selected,list=filteredGifts()){
 if(activeGame==='v3')return v3GiftTiles(selected,list);
 return list.length?list.map(g=>`<a class="list-row ${g.id===selected?'active':''}"${g.id===selected?' aria-current="true"':''} href="#gift/${g.id}"${activeGame==='dr2'&&route==='gifts'?` data-gift-preview="${g.id}"`:""}><b class="id">${activeGame==='dr2'?nativeNumber(pad(g.id)):pad(g.id)}</b><span class="name">${escape(g.name)}</span><small class="${quantity(g.id)===null?'quantity-unknown':''}">${activeGame==='dr2'&&quantity(g.id)!==null?'×'+nativeNumber(String(quantity(g.id)).padStart(2,'0')):quantityLabel(g.id)}</small></a>`).join(''):
 `<div class="empty"><p>${giftFilter.trim()?`没有找到与“${escape(giftFilter.trim())}”匹配的礼物。`:'还没有已记录持有的礼物。'}</p><p>可以更换关键词，或清除筛选查看全部礼物。</p><button type="button" class="btn" data-action="clear-gift-filters">清除筛选</button></div>`;
}
function syncGiftListTabStop(){
 const links=[...document.querySelectorAll('#gift-list a[href^="#gift/"]')];
 const selected=links.find(a=>Number(a.getAttribute('href').split('/')[1])===giftFocusId)||links.find(a=>a.classList.contains('active'))||links[0];
 if(selected)giftFocusId=Number(selected.getAttribute('href').split('/')[1]);
 for(const link of links)link.tabIndex=link===selected?0:-1;
}
function updateGiftResults(){
 const list=filteredGifts();$('#gift-list').innerHTML=giftListHTML(route.startsWith('gift/')?+route.split('/')[1]:['dr2','v3'].includes(activeGame)?giftPreviewId:1,list);
 $('#gift-filter-status').textContent=`显示 ${list.length} / ${data.gifts.length} 项礼物`;
 if(['dr2','v3'].includes(activeGame)&&['gifts','bag'].includes(route)){
  const detail=$('#content .gift-detail');if(detail)detail.hidden=!list.length&&!hasQuantityDraft();
  if(list.length&&!list.some(g=>g.id===giftPreviewId))previewGift(list[0].id);
 }
 syncGiftListTabStop();
}
function giftToolbar(){return `<div class="toolbar"><label class="search">${icon('search')}<input id="gift-search" name="gift-search" type="search" autocomplete="off" aria-label="搜索礼物" aria-describedby="gift-filter-status" placeholder="${activeGame==='v3'?'例如：001、乌龙茶、春川':activeGame==='dr2'?'例如：001、矿泉水、七海':'例如：001、矿泉水、雾切'}" value="${escape(giftFilter)}"></label><label class="check"><input id="owned-filter" type="checkbox" ${onlyOwned?'checked':''}>只看持有</label></div><p class="results-status" id="gift-filter-status" role="status">显示 ${filteredGifts().length} / ${data.gifts.length} 项礼物</p>`;}
function acquisition(g){if(['dr2','v3'].includes(activeGame))return g.acquisition;if(g.id===91)return '扭蛋机随机获取；第 3 章额外场景相关道具，详见“特殊礼物与限时事件”。';if(g.id===92)return '主线通关后，从扭蛋机随机获取。';if(g.id<93)return '一楼小卖部的扭蛋机，消耗黑白熊徽章随机获取。';if(g.id<=100)return `完成${g.id===93?'序章':g.id===100?'尾声':`第 ${g.id-93} 章`}获得的纪念品。`;return `完成学院模式中${char(g.owner).name}的个人结局后获得。`;}
function giftDetailHTML(g){const lovers=data.characters.filter(c=>c.love.includes(g.id)),likers=data.characters.filter(c=>c.like.includes(g.id));return `${activeGame==='v3'?`<header class="v3-present-caption"><span>NO.${pad(g.id)}</span><h2 class="gift-title" id="gift-detail-title">${escape(g.name)}</h2><strong>${quantityLabel(g.id)}</strong></header><div class="v3-present-overview"><div class="gift-pixel-image"><img src="${g.image}" width="${g.imageWidth}" height="${g.imageHeight}" alt=""></div><p class="v3-present-description">${escape(g.description)}</p></div><p class="v3-present-meta">${escape(g.ja)} · ${escape(g.category)}</p>`:`<div class="numberbar"><span>No.</span><span>${pad(g.id)} / ${data.gifts.length}</span></div>${g.image?`<div class="gift-pixel-image"><img src="${g.image}" width="${g.imageWidth}" height="${g.imageHeight}" alt=""></div>`:''}<h2 class="gift-title" id="gift-detail-title">${escape(g.name)}</h2>${activeGame==='v3'?`<p class="v3-present-description">${escape(g.description)}</p>`:''}${g.ja?`<p class="muted">${escape(g.ja)}</p>`:''}<p class="muted">${g.category}${!g.giftable?' · 纪念品':''}</p>`}<div class="gift-record"><label for="gift-quantity">目前持有数量 <span class="muted">${quantity(g.id)===null?'尚未录入':''}</span></label><form id="quantity-form" class="quantity-field" novalidate><button type="button" class="btn" data-action="quantity-step" data-id="${g.id}" data-delta="-1" aria-label="减少一件" ${quantity(g.id)>0?'':'disabled'}>−</button><input id="gift-quantity" name="gift-quantity" autocomplete="off" data-id="${g.id}" type="number" min="0" max="999" step="1" inputmode="numeric" placeholder="未知" value="${escape(quantityDraft?.id===g.id?quantityDraft.value:quantity(g.id)??'')}" aria-describedby="quantity-status" aria-label="${escape(g.name)}持有数量"><button type="button" class="btn" data-action="quantity-step" data-id="${g.id}" data-delta="1" aria-label="增加一件">+</button><button type="${globalThis.danganmatePlatform?'button':'submit'}" class="btn primary" data-action="save-quantity" data-id="${g.id}">保存数量</button><button type="button" class="quiet" data-action="unset-quantity" data-id="${g.id}">设为未录入</button></form><p id="quantity-status" class="quantity-status" role="status" hidden></p></div><div class="gift-acquisition"><h3>获取方式</h3><p>${escape(acquisition(g))}</p></div>${g.giftable?`${lovers.length?`<div class="gift-acquisition"><h3>非常喜欢</h3><div class="actions">${lovers.map(c=>`<a class="btn" href="#character/${c.id}">${escape(c.name)}</a>`).join('')}</div></div>`:''}${likers.length?`<div class="gift-acquisition"><h3>喜欢</h3><div class="actions">${likers.map(c=>`<a class="btn" href="#character/${c.id}">${escape(c.name)}</a>`).join('')}</div></div>`:''}${!lovers.length&&!likers.length?'<p class="muted">当前收录的偏好表没有对应的喜欢 / 非常喜欢角色。</p>':''}`:''}${sourceLinks(g.source,activeGame==='v3'?'礼物名称与说明采用 Steam 版游戏文本，偏好按编号核对。':undefined)}`;}
function dr2GiftPage(g){
 const previous=(g.id+data.gifts.length-2)%data.gifts.length+1,next=g.id%data.gifts.length+1;
 return `<div class="dr2-gift-heading"><a href="#gift/${previous}" aria-label="上一件礼物"><kbd>Q</kbd></a><div><b>${pad(g.id)}</b><span>${escape(g.name)}</span><strong id="dr2-gift-count">${quantityLabel(g.id)}</strong></div><a href="#gift/${next}" aria-label="下一件礼物"><kbd>E</kbd></a></div><section class="gift-detail dr2-gift-page" aria-labelledby="gift-detail-title">${giftDetailHTML(g)}</section><a class="quiet" href="#gifts">礼物图鉴</a>`;
}
function giftsView(id,bag=false){if(activeGame==='v3')return v3GiftsView(id);const section=homeMenus.find(m=>m.id===(bag?'bag':'gifts'));theme(bag?'我的背包':'礼物',section.color,section.tint,section.id);if(bag)return `${giftToolbar()}<div class="section-head"><span class="muted">${Object.keys(record().quantities).length} 项已录入 · 未录入与数量 0 分开</span><button class="btn" data-action="fill-zero">其余未录入设为 0</button></div><div class="list" id="gift-list" aria-label="背包礼物">${giftListHTML()}</div><p class="capsule">在游戏中确认数量后，选择一项礼物录入。<br><span style="font-size:13px">需要换设备？在“存档与备份”中导出 JSON，再到另一台设备导入。</span></p>`;
 const selected=gift(activeGame==='dr2'&&route==='gifts'?giftPreviewId:id)||gift(1);if(['dr2','v3'].includes(activeGame)&&route.startsWith('gift/'))return dr2GiftPage(selected);return `${giftToolbar()}<div class="gift-layout"><section class="gift-detail panel" aria-labelledby="gift-detail-title">${giftDetailHTML(selected)}</section><nav class="gift-directory"><div class="list" id="gift-list" aria-label="礼物目录">${giftListHTML(selected.id)}</div><p class="muted" style="margin-top:14px">共 ${data.gifts.length} 项 · 名称暂译，优先用编号核对</p></nav></div>`;}
const guideKinds=['全部','主线流程','学级裁判','隐藏收集','玩法说明'];
function guideLink(a){
 const label=a.part?`裁判 · ${a.part===1?'前':'后'}半场`:a.chapter===0?'开始序章':a.kind==='主线流程'?(a.chapter===6?'最终搜查':'日常与搜查'):a.title;
 return `<a class="chapter-link" data-kind="${a.kind==='主线流程'?'main':'other'}" href="#article/${a.id}" aria-label="${escape(a.title)}"><span>${escape(label)}</span>${icon('right')}</a>`;
}
function guides(){
 theme('攻略中心','#a2e151','#3b601d','guides');const list=articles.filter(a=>guideFilter==='全部'||a.kind===guideFilter);
 const chapters=[...new Set(list.map(a=>a.chapter))],active=guideKinds.indexOf(guideFilter),resume=activeGame==='v3'&&articles.find(a=>a.id===record().reading?.id);
 return `${resume?`<a class="reading-resume btn" href="#article/${resume.id}"><span>继续阅读：${escape(resume.title)}</span>${icon('right')}</a>`:''}<div class="notice">点击对应内容后显示该章节剧情。裁判按休庭分为前后半场，分别查阅。</div><div class="toolbar"><label class="search">${icon('search')}<input id="global-search" type="search" autocomplete="off" placeholder="搜索角色、礼物、攻略标题" aria-label="全站搜索"></label></div>
 <div class="tabs" role="tablist" aria-label="攻略类别">${guideKinds.map((t,i)=>`<button id="guide-tab-${i}" role="tab" aria-controls="guide-results" tabindex="${i===active?0:-1}" aria-selected="${i===active}" data-action="guide-tab" data-id="${t}">${t}</button>`).join('')}</div>
 <div class="panel chapter-groups" id="guide-results" role="tabpanel" aria-labelledby="guide-tab-${active}" tabindex="0">${chapters.map(ch=>{const title=ch===null?'收集与说明':ch===0?'序章':`第 ${ch} 章`;return `<section class="chapter-group${ch===null?' guide-extras':''}" aria-labelledby="chapter-group-${ch??'extra'}"><h2 id="chapter-group-${ch??'extra'}">${title}</h2><nav class="chapter-links" aria-label="${title}攻略">${list.filter(a=>a.chapter===ch).map(guideLink).join('')}</nav></section>`;}).join('')}</div>`;
}
function activateTab(action,id){
 if(action==='pref-tab')charTab=id;else guideFilter=id;
 render();[...document.querySelectorAll('[role="tab"]')].find(t=>t.dataset.action===action&&t.dataset.id===id)?.focus({preventScroll:true});
}
function guideStep(text){
 const split=text.indexOf('｜');return split<0?escape(text):`<span class="step-kind">${escape(text.slice(0,split))}</span><span>${escape(text.slice(split+1))}</span>`;
}
function articleView(a){
 theme('攻略手册','#a2e151','#3b601d','guides');
 const counterpart=articles.find(next=>next.id===a.related);
 const readingOrder=articles.filter(item=>['主线流程','学级裁判'].includes(item.kind)).sort((x,y)=>x.chapter-y.chapter||Number(x.kind==='学级裁判')-Number(y.kind==='学级裁判')||(x.part||0)-(y.part||0));
 const readingIndex=readingOrder.findIndex(item=>item.id===a.id),nextArticle=readingIndex<0?null:readingOrder[readingIndex+1];
 return `<div class="section-head"><a class="quiet" href="#guides">返回攻略目录</a><span class="muted">阅读位置自动保存</span></div>
 <article class="article" aria-labelledby="article-title"><h2 id="article-title" tabindex="-1">${escape(a.title)}</h2><span class="guide-tag">${a.kind}</span><p class="muted">${escape(a.intro)}</p>
 ${counterpart?`<nav class="trial-parts" aria-label="本章裁判半场"><a href="#article/trial-${a.chapter}" ${a.part===1?'aria-current="page"':''}>前半场</a><a href="#article/trial-${a.chapter}-2" ${a.part===2?'aria-current="page"':''}>后半场</a></nav>`:''}
 <nav class="article-toc" aria-labelledby="toc-title"><h3 id="toc-title">本页目录</h3><ol>${a.sections.map(([title],i)=>`<li><button type="button" data-action="article-section" data-id="${i}" aria-controls="guide-section-${i}">${escape(title)}</button></li>`).join('')}</ol></nav>
 ${a.sections.map(([title,items],i)=>`<section aria-labelledby="guide-section-${i}"><h3 id="guide-section-${i}" tabindex="-1">${escape(title)}</h3><ol>${items.map(t=>`<li>${guideStep(t)}</li>`).join('')}</ol></section>`).join('')}
 ${sourceLinks(a.sources,'攻略核对：2026-11-02。中文名称按物件与发言含义整理；不同语言和难度的界面可能有差异。')}
 <div class="actions article-end"><a href="#guides" class="btn">返回章节目录</a>${counterpart&&a.part===2?`<a href="#article/${counterpart.id}" class="btn">查看前半场</a>`:''}${nextArticle?`<a href="#article/${nextArticle.id}" class="btn" rel="next"><span>下一篇：</span><span>${escape(nextArticle.title)}</span></a>`:''}<button class="btn" data-action="article-top">返回本页顶部</button></div></article>
 <button id="article-back-top" class="btn article-back-top" data-action="article-top" hidden aria-label="返回攻略顶部">↑ 返回顶部</button>`;
}
function scrollArticleTo(target){
 if(!route.startsWith('article/')||!target)return;
 target.focus({preventScroll:true});
 const top=target.id==='article-title'?0:Math.max(0,target.getBoundingClientRect().top+window.scrollY-24);
 window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function updateArticleTop(){const b=$('#article-back-top');if(b)b.hidden=window.scrollY<550;}
function previewHTML(){if(!pendingSave)return '';const slot=pendingSave.slots.find(s=>s.name===pendingSave.selected);return `<section class="panel import-preview"><h2>解析完成 · 先选择记录</h2><p class="muted">${activeGame==='v3'?'每个 DAT 文件是一条记录；显示文件修改时间，尚未写入浏览器记录。':'按存档内部日期默认选择最新一条；尚未写入浏览器记录。'}</p><label for="save-slot">存档槽</label><select id="save-slot">${pendingSave.slots.map(s=>`<option value="${escape(s.name)}" ${s.name===slot.name?'selected':''}>${escape(s.name)} · ${escape(s.date||'日期无法识别')}${s.name===pendingSave.latest?' · 最新':''}</option>`).join('')}</select><div class="slot-info">章节：<button class="spoiler" data-action="spoiler" aria-pressed="false" aria-label="显示存档章节">${escape(slot.chapter)}</button><br>徽章：${slot.coins}<br>001–005：${[1,2,3,4,5].map(i=>slot.quantities[i]??'未知').join(' / ')}</div><div class="preview-counts"><span>${Object.keys(slot.quantities).length} 项有可读取数量</span><span>${slot.unknown.length} 项特殊值待确认</span></div><p class="muted" style="margin-top:15px">${activeGame==='v3'?'当前读取 001–143。106 项已显示数量与游戏截图逐项吻合，37 个问号格对应数量字段 0；不解析历史解锁状态。0xFFFF 仍保留为未知。':activeGame==='dr2'?'当前读取 001–140，已与玩家提供的全部数量及未解锁位置逐项核对。0xFF 对应此存档的未解锁条目，网站保留为未录入。':'当前读取主线区域 001–100，已与玩家提供的全部 100 项逐项核对。此存档的 0xFF 对应未解锁，网站保留为未录入；101–114 暂不自动读取。'}</p><div class="actions"><button class="btn primary" data-action="apply-save">确认覆盖并导入</button><button class="btn" data-action="cancel-save">取消</button></div></section>`;}
function recentImportHTML(){
 const info=record().lastImport;
 return `<section class="recent-import" id="recent-import" aria-labelledby="recent-import-title"><h3 id="recent-import-title">最近一次存档导入</h3>${info?`<dl><div><dt>存档文件</dt><dd><bdi translate="no">${escape(info.fileName)}</bdi></dd></div><div><dt>导入时间</dt><dd><time translate="no" datetime="${new Date(info.importedAt).toISOString()}">${escape(new Intl.DateTimeFormat(currentLanguage(),{dateStyle:'medium',timeStyle:'short'}).format(info.importedAt))}</time></dd></div></dl>`:'<p>暂无存档导入信息。</p>'}</section>`;
}
function backupErrorHTML(){
 const message=backupErrors[activeGame];
 return message?`<div class="error"><h3>备份导入失败</h3><p>${escape(message)}</p><p>当前记录未改变。请选择本站导出的 JSON 备份后重试。</p><button class="btn" data-action="pick-backup">重新选择备份</button></div>`:'';
}
function showBackupError(message){
 backupErrors[activeGame]=message;const target=$('#backup-error');
 if(target){target.innerHTML=backupErrorHTML();target.focus();}
}
function system(){theme('系统','#73bfff','#114978','system');return `${activeGame==='v3'?v3SystemMenu():''}${activeGame==='dr2'?'<nav class="dr2-system-menu" aria-label="系统"><button type="button" data-action="system-pane" data-id="save" aria-controls="system-save" aria-current="true"><img src="assets/dr2/ui/techou_system-9.webp" alt="">读取游戏存档</button><button type="button" data-action="system-pane" data-id="backup" aria-controls="system-backup"><img src="assets/dr2/ui/techou_system-12.webp" alt="">记录备份</button><a href="#bag"><img src="assets/dr2/ui/techou_top-10.webp" alt="">手动管理背包</a></nav>':''}<div class="system-grid"><section id="system-save" class="panel"><h2>读取游戏存档</h2><p>选择《${edition.title}》Steam PC 版的 <b>${activeGame==='v3'?'SAVE-DATAxx.dat':'savedata_ch.vfs'}</b>。文件只在此浏览器中读取。</p>${recentImportHTML()}<label class="file-select import-drop" data-import-kind="save" aria-busy="${busy}"><span>${icon('book')}<br>${busy?'正在解析…':activeGame==='v3'?'点击选择或拖入 .dat 存档文件':'点击选择或拖入 .vfs 存档文件'}</span><input id="save-file" name="save-file" type="file" accept="${activeGame==='v3'?'.dat':'.vfs,.bak'}" ${busy?'disabled':''}></label><p class="muted" style="margin-top:13px">${activeGame==='v3'?'Steam / userdata / 用户编号 / 567640 / remote。请选择修改时间最新的 SAVE-DATAxx.dat。':'Windows 常见位置：文档 / My Games / '+(activeGame==='dr2'?'Danganronpa2':'Danganronpa')+'。使用游戏已正常保存的文件。'}</p><p class="muted">${activeGame==='v3'?'当前支持中文版 Steam PC 固定布局。只读礼物数量与徽章，不读取好感度；导入前可核对前五项数量。':activeGame==='dr2'?'当前支持已核对的中文版 2 代 Steam PC 布局；其他布局会拒绝导入。':'当前兼容已研究的中文版 Steam PC 布局；其他布局会拒绝导入。学院模式背包请手动录入数量。'}</p></section><section id="system-backup" class="panel"><h2>记录备份</h2><p>将礼物数量和阅读位置存成 JSON，在另一台设备上继续使用。</p><div class="actions"><button class="btn" data-action="export">${icon('arrow')}导出全部记录</button></div><div class="import-drop backup-drop" data-import-kind="backup"><button class="btn" data-action="pick-backup" aria-describedby="backup-error">选择 JSON 备份</button><p class="muted">或将一个 JSON 备份文件拖到此处</p><input id="backup-file" name="backup-file" type="file" accept=".json,application/json" hidden></div><div id="backup-error" role="alert" tabindex="-1">${backupErrorHTML()}</div><p class="muted" style="margin-top:18px">导入前会校验并提示覆盖。清理浏览器数据可能清除记录，建议定期导出。</p>${initialError?'<button class="btn" data-action="export-recovery">导出原始记录用于恢复</button><button class="btn" data-action="rebuild-records">确认重建浏览器记录</button>':''}<div class="actions"><a href="#${activeGame==='v3'?'gifts':'bag'}" class="quiet">${activeGame==='v3'?'礼物图鉴':'手动管理背包'}</a><a href="#about" class="quiet">查看读取范围与资料来源</a></div></section></div><div id="import-error" role="alert"></div><div id="save-preview">${previewHTML()}</div>`;}
function about(){theme('关于手册','#c69aeb','#592a76','');return `<div class="about-grid"><section class="panel"><h2>DanganMate 弹丸手册</h2><p style="margin-top:13px">给正在游玩《弹丸论破》的玩家，一本能查攻略、找礼物、记录背包的网页手册。</p><p style="margin-top:15px">提供三部作品的资料、攻略和背包工具，支持简体中文、英语与日语。角色页面提供资料与礼物偏好。</p><h3 style="margin-top:23px">存档读取范围</h3><p class="muted">${activeGame==='v3'?'V3 读取 143 项数量与徽章。106 项数量与截图吻合，37 个问号格的数量字段为 0；不推断历史解锁状态。文件修改时间不等于游戏内保存时间，布局及数量检查不等于校验和验证。':activeGame==='dr2'?'2 代读取 001–140；全部 140 项的数量及未解锁位置已由玩家列表核对。12 个未解锁条目的 0xFF 保留为未录入。':'容器结构和校验和均检查通过后才提供导入。001–100 已与玩家提供的游戏内数量逐项吻合，包括数量 0 与未解锁位置。101–114 尚未完成映射，不自动读取。0xFF 不转成 255 或 0。'}</p><h3 style="margin-top:23px">AI 辅助开发</h3><p class="muted">需求与视觉由开发者确认；AI 辅助资料对照、页面实现和格式研究。自动整理不视为游戏内验证，冲突项在研究文档中记录。</p><h3 style="margin-top:23px">素材说明</h3><p class="muted">角色图像为游戏素材，权利属于 Spike Chunsoft 等原权利人。本站为非官方项目。下载来源不代表取得再分发许可；公开发布前仍需核对使用条件。</p><a href="assets/SOURCES.json" target="_blank" class="quiet">查看逐项素材来源</a></section><section class="panel"><h2>资料来源</h2><p class="muted">攻略补充核对：2026-11-02；礼物与素材初次整理：2026-10-27。内容以简体中文自行整理，未转载攻略图片和游戏对白全文。</p>${sourceGroups.map(group=>`<details class="source-group"><summary><span>${group.title}</span><small>${group.ids.length} 项来源</small></summary>${group.ids.map(id=>sourceById.get(id)).map(s=>`<div class="source-item"><a href="${s.url}" target="_blank" rel="noreferrer">${escape(s.title)}</a><p>${escape(s.note)}</p></div>`).join('')}${group.id==='artwork'&&activeGame==='dr1'?'<p class="source-item">首页功能插画由 AI 生成，展示使用压缩后的 WebP；原始提示词与素材来源保存在项目中。<a href="assets/dr1/menu/generation-prompts.json" target="_blank" rel="noreferrer">查看生成记录</a></p>':''}</details>`).join('')}</section></div>`;}
function searchResults(){
 const q=searchQuery.trim().toLocaleLowerCase();const match=s=>aliases(s).includes(q);const cs=q?data.characters.filter(c=>match(c.name)||match(c.en)):[],gs=q?data.gifts.filter(g=>match(g.name)||match(g.ja)||match(pad(g.id))):[],as=q?articles.filter(a=>match(a.title)||match(a.kind)||a.sections.some(([h])=>match(h))):[];return {count:cs.length+gs.length+as.length,html:`${q?`${cs.length?`<h2>角色 · ${cs.length}</h2>${cs.map(c=>`<a class="list-row" href="#character/${c.id}"><span class="name">${escape(c.name)}</span>${icon('right')}</a>`).join('')}`:''}${gs.length?`<h2>礼物 · ${gs.length}</h2>${gs.map(g=>`<a class="list-row" href="#gift/${g.id}"><span class="name">${pad(g.id)}　${escape(g.name)}</span><small>${quantityLabel(g.id)}</small>${icon('right')}</a>`).join('')}`:''}${as.length?`<h2>攻略 · ${as.length}</h2>${as.map(a=>`<a class="list-row" href="#article/${a.id}"><span class="name">${escape(a.title)}</span>${icon('right')}</a>`).join('')}`:''}${!cs.length&&!gs.length&&!as.length?'<p class="empty">没有找到结果，请换一个关键词。</p>':''}`:'<p class="empty">输入编号、角色名或攻略标题开始搜索。</p>'}`};
}
function searchView(){
 theme('全站检索','#a2e151','#3b601d','guides');const result=searchResults();
 return `<label class="search">${icon('search')}<input id="global-search" type="search" autocomplete="off" aria-label="全站搜索" aria-describedby="search-hint search-status" placeholder="角色、礼物、攻略标题" value="${escape(searchQuery)}"></label><p class="muted" id="search-hint" style="margin-top:12px">只检索攻略标题，不预览剧情正文。</p><p class="results-status" id="search-status" role="status">${searchQuery.trim()?`找到 ${result.count} 项结果`:''}</p><div class="results" id="search-results">${result.html}</div>`;
}
function render(){
 const requested=history.state?.game||new URL(location.href).searchParams.get('game');if(editions[requested]&&requested!==activeGame)activateGame(requested);
 let path=location.hash.slice(1)|| (editions[state.lastGame]?'home':'games');
 if(activeGame==='v3'&&['characters','bag'].includes(path)){
  path=path==='characters'?'character/'+directorySelection:'gifts';
  const url=new URL(location.href);url.hash=path;history.replaceState(history.state,'',url);
 }
 route=path;
 let html;const [page,id]=path.split('/');
 switch(page){case 'games':html=games();break;case 'home':html=home();break;case 'characters':html=characterList();break;case 'character':html=char(id)?characterDetail(char(id)):characterList();break;case 'gifts':case 'gift':html=giftsView(+id||1);break;case 'bag':html=giftsView(null,true);break;case 'guides':html=guides();break;case 'article':html=articles.find(a=>a.id===id)?articleView(articles.find(a=>a.id===id)):guides();break;case 'system':html=system();break;case 'about':html=about();break;case 'search':html=searchView();break;default:html=home();}
 $('#content').innerHTML=html;delete $('#content').dataset.systemPane;
 if(activeGame==='dr2'&&page==='characters')document.querySelectorAll('.dr2-class-grid a').forEach(link=>{const label=document.createElement('span');label.className='mobile-class-name';label.textContent=link.querySelector('img').alt;link.append(label);});
 if(page==='home')$('#content').insertAdjacentHTML('beforeend',mobileHome());
 if(page==='system')$('#save-file').closest('label').insertAdjacentHTML('afterend','<p class="mobile-import-help">请先将 Steam PC 存档传到手机，再选择文件；也可以手动记录礼物数量。</p>');
 if(page==='character'){
  const selected=char(id);if(selected)$('#content').insertAdjacentHTML('afterbegin',`<label class="mobile-character-picker"><span>切换同学</span><select id="mobile-character-select">${data.characters.map(c=>`<option value="${c.id}"${c.id===selected.id?' selected':''}>${escape(t(c.name))}</option>`).join('')}</select></label>`);
 }
 if(activeGame==='v3'&&page==='character'){
  if(char(id))directorySelection=id;
  const ribbon=$('.v3-character-ribbon'),selected=ribbon?.querySelector('[aria-current="page"]');
  if(selected)ribbon.scrollLeft+=selected.getBoundingClientRect().left-ribbon.getBoundingClientRect().left-(ribbon.clientWidth-selected.clientWidth)/2;
 }
 if($('#gift-list')){if($('#gift-list').tagName!=='NAV')$('#gift-list').setAttribute('role','navigation');if(page==='gift')giftFocusId=Number(id);$('#gift-list').setAttribute('aria-describedby','gift-keyboard-hint');$('#gift-list').insertAdjacentHTML('beforebegin','<p id="gift-keyboard-hint" class="keyboard-hint">方向键浏览礼物，Enter 查看详情，Tab 跳到下一项操作。</p>');syncGiftListTabStop();}
 quantityDraftUI();
 if(['dr2','v3'].includes(activeGame)&&['gifts','bag'].includes(route)&&$('#gift-list'))updateGiftResults();
 $('#storage-status').textContent=storageWorks?storedHere():'保存不可用 · 请导出备份';
 if(page==='gift'&&!mobileViewport.matches)requestAnimationFrame(()=>$('#gift-list .active')?.scrollIntoView({block:'nearest'}));
}
function renderQuantityChange(id){
 const active=document.activeElement,editing=active.closest('.quantity-field');
 const control=editing?{id:active.id,action:active.dataset.action,delta:active.dataset.delta}:null;
 const status=$('#inventory-record-status');if(status)status.textContent=`${Object.keys(record().quantities).length} 项已录入 · 未录入与数量 0 分开`;
 const input=$('#gift-quantity');if(input)$('#content .gift-detail').innerHTML=giftDetailHTML(gift(id));
 if($('#gift-list'))updateGiftResults();if($('#dr2-gift-count'))$('#dr2-gift-count').textContent=quantityLabel(id);
 if(control){
  const target=control.id?document.getElementById(control.id):[...document.querySelectorAll('.quantity-field button')].find(b=>b.dataset.action===control.action&&b.dataset.delta===control.delta);
  (target&&!target.disabled?target:$('#gift-quantity'))?.focus({preventScroll:true});
 }
}
async function download(text,filename,type='application/json'){if(globalThis.danganmatePlatform){await globalThis.danganmatePlatform.download(text,filename);return;}const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
async function loadSave(file){
 if(!file)return;const importGame=activeGame;busy=true;pendingSave=null;render();try{if(file.size>32*1024*1024)throw new Error('存档文件超过 32 MB，未读取。');const buffer=await file.arrayBuffer();if(importGame!==activeGame)return;const parsed=(activeGame==='v3'?parseV3:activeGame==='dr2'?parseDR2:parseDR1)(buffer,{name:file.name,lastModified:file.lastModified});pendingSave={...parsed,fileName:file.name,selected:parsed.latest||parsed.slots[0].name};busy=false;render();$('#save-preview').scrollIntoView({block:'nearest'});toast('解析成功，请确认存档槽和覆盖范围。');}catch(e){busy=false;render();$('#import-error').innerHTML=`<p class="error">${escape(e.message)}</p>`;}
}
async function loadBackup(file){
 if(!file)return;backupErrors[activeGame]=null;if($('#backup-error'))$('#backup-error').replaceChildren();try{if(file.size>1024*1024)throw new Error('备份文件超过 1 MB，请选择本站导出的 JSON。');const parsed=validateBackup(JSON.parse(await file.text()));const count=Object.keys(parsed.games[activeGame].quantities).length;modal('导入备份将覆盖全部记录',`<p>备份中当前作品有 ${count} 项礼物记录。确认后将替换三个作品的礼物、阅读位置和上次选择。</p><p>建议先导出现有记录。</p>`,[['取消'],['确认覆盖',async()=>{if(await saveState(parsed)){pendingSave=null;toast('备份已导入。');if(editions[parsed.lastGame])activateGame(parsed.lastGame);go(editions[parsed.lastGame]?'home':'games');render();}else showBackupError('备份未能保存，请检查浏览器存储后重试。');},true]]);}catch(e){showBackupError(e instanceof SyntaxError?'JSON 格式错误，请选择本站导出的备份。':e.message);}
}
document.addEventListener('submit',async e=>{
 if(e.target.id!=='quantity-form')return;e.preventDefault();
 if(await saveQuantityDraft())toast('数量已保存。');
});
document.addEventListener('keydown',async e=>{
 if(globalThis.danganmatePlatform&&e.key==='Enter'&&!e.isComposing&&e.target.id==='gift-quantity'){
  e.preventDefault();if(await saveQuantityDraft())toast('数量已保存。');
 }
});

document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');if(!b)return;const {action,id}=b.dataset;
 try{
 switch(action){
 case 'choose-game':if(editions[id]&&await saveState({...state,lastGame:id})){activateGame(id);go('home');}break;
 case 'spoiler':{const reveal=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',reveal);b.setAttribute('aria-label',reveal?'再次点击隐藏内容':'显示隐藏内容');break;}
 case 'system-pane':$('#content').dataset.systemPane=id;document.querySelectorAll('[data-action="system-pane"]').forEach(item=>{if(item.dataset.id===id)item.setAttribute('aria-current','true');else item.removeAttribute('aria-current');});break;
 case 'character-step':stepCharacter(Number(b.dataset.delta));break;
 case 'pref-tab':activateTab(action,id);break;
 case 'guide-tab':activateTab(action,id);break;
 case 'clear-gift-filters':giftFilter='';onlyOwned=false;$('#gift-search').value='';$('#owned-filter').checked=false;updateGiftResults();$('#gift-search').focus();break;
 case 'save-quantity':if(globalThis.danganmatePlatform&&await saveQuantityDraft())toast('数量已保存。');break;
 case 'article-section':scrollArticleTo($('#guide-section-'+id));break;
 case 'article-top':scrollArticleTo($('#article-title'));break;
 case 'give':{const g=gift(id);if(!g.giftable)break;if(await updateRecord(subtractGift(record(),id))){toast(`${g.name}已扣除 1 件。`);render();}break;}
 case 'quantity-step':{
  const input=$('#gift-quantity'),current=input.value===''&&!hasQuantityDraft()?0:Number(input.value);
  if(input.validity.badInput||!Number.isInteger(current)||(input.value===''&&hasQuantityDraft()))throw new Error('请先输入有效数量，再使用加减按钮。');
  if(await updateRecord(changeQuantity(record(),id,current+Number(b.dataset.delta)))){quantityDraft=null;renderQuantityChange(+id);quantityDraftUI('数量已保存。');}break;
 }
 case 'unset-quantity':{const q={...record().quantities};delete q[id];if(await updateRecord({...record(),quantities:q})){quantityDraft=null;renderQuantityChange(+id);toast('已设为未录入。');}break;}
 case 'fill-zero':modal('将其余未录入项设为 0？','<p>会将当前作品所有未知数量设为 0；已经填写的数量不变。请确认未录入的礼物确实没有持有。</p>',[['取消'],['确认设为 0',async()=>{const q={...record().quantities};for(const g of data.gifts)q[g.id]??=0;if(await updateRecord({...record(),quantities:q})){toast('其余数量已设为 0。');render();}},true]]);break;
 case 'pick-backup':$('#backup-file').click();break;
 case 'export':await download(JSON.stringify(state,null,2),`DanganMate-backup-${new Date().toISOString().slice(0,10)}.json`);toast('备份文件已生成。');break;
 case 'rebuild-records':modal('重建全部浏览器记录？','<p>请先导出原始记录。确认后将替换当前无法读取的数据，建立空白记录。</p>',[['取消'],['重建记录',async()=>{initialError=null;if(await saveState(freshState())){pendingSave=null;go('games');render();toast('已重建空白记录。');}},true]]);break;
 case 'export-recovery':await download(appStorage.getItem(STORAGE_KEY)||'null','DanganMate-recovery.json');break;
 case 'cancel-save':pendingSave=null;render();break;
 case 'apply-save':if(pendingSave){const slot=pendingSave.slots.find(s=>s.name===pendingSave.selected);modal('确认覆盖当前作品记录？',`<p>将用 ${escape(slot.name)} 替换当前作品的礼物记录。未识别的数值会成为未录入。</p><p>阅读位置保留。建议先导出备份。</p><p>原始游戏存档不会被修改。</p>`,[['取消'],['覆盖并导入',async()=>{if(await updateRecord({...record(),quantities:{...slot.quantities},reading:record().reading,coins:slot.coins,lastImport:{fileName:pendingSave.fileName,importedAt:Date.now()}})){pendingSave=null;toast('已导入主线礼物记录。');go('bag');}},true]]);}break;
 case 'hidden-character':{b.setAttribute('aria-pressed','true');modal('灭族者翔 · 礼物偏好',`<p>非常喜欢：017 永恒手链、071 少女旅行包、072 会动的木芥子。</p><p>请按游戏当前显示的角色形态核对礼物偏好。</p>${sourceLinks(['prefs'])}`,[['关闭']]);break;}
 }
 }catch(error){if(error.code!=='FILE_PICKER_CANCELLED')toast(error.message);}
});
function stepCharacter(delta){
 const current=location.hash.slice(1);
 if(!data||!current.startsWith('character/'))return;
 const i=data.characters.findIndex(c=>c.id===current.split('/')[1]);if(i<0)return;
 const next=data.characters[(i+delta+data.characters.length)%data.characters.length];
 directorySelection=next.id;go('character/'+next.id);
}
document.addEventListener('keydown',e=>{
 const link=e.target.closest('#gift-list a[href^="#gift/"]');
 if(!link||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||$('#dialog').open||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
 const links=[...$('#gift-list').querySelectorAll('a[href^="#gift/"]')],index=links.indexOf(link);
 const columns=activeGame==='v3'?getComputedStyle($('#gift-list')).gridTemplateColumns.split(' ').length:1;
 const step=e.key==='ArrowDown'?columns:e.key==='ArrowUp'?-columns:e.key==='ArrowRight'?1:-1;
 const next=e.key==='Home'?0:e.key==='End'?links.length-1:Math.max(0,Math.min(links.length-1,index+step));
 e.preventDefault();links[next].focus({preventScroll:true});links[next].scrollIntoView({block:'nearest',inline:'nearest'});
});
document.addEventListener('keydown',e=>{
 const tab=e.target.closest('[role="tab"]');
 if(!tab||e.altKey||e.ctrlKey||e.metaKey||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 const tabs=[...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')],i=tabs.indexOf(tab);
 const index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 e.preventDefault();activateTab(tabs[index].dataset.action,tabs[index].dataset.id);
});
document.addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.repeat||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||$('#dialog').open||e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return;
 const key=e.key.toLowerCase();if(['dr2','v3'].includes(activeGame)&&route.startsWith('gift/')&&['q','e'].includes(key)){e.preventDefault();const id=+route.split('/')[1];go('gift/'+((id-1+(key==='q'?-1:1)+data.gifts.length)%data.gifts.length+1));return;}if(!route.startsWith('character/')||!['q','e'].includes(key))return;
 e.preventDefault();stepCharacter(key==='q'?-1:1);
});
const draggedFiles=e=>Array.from(e.dataTransfer?.types||[]).includes('Files');
function clearDropHighlights(){document.querySelectorAll('.import-drop.drag-over').forEach(z=>z.classList.remove('drag-over'));}
for(const type of ['dragenter','dragover'])document.addEventListener(type,e=>{
 if(!draggedFiles(e))return;e.preventDefault();
 const zone=e.target.closest('.import-drop');
 if(route==='system'&&zone&&!$('#dialog').open&&!busy){e.dataTransfer.dropEffect='copy';clearDropHighlights();zone.classList.add('drag-over');}
 else{e.dataTransfer.dropEffect='none';clearDropHighlights();}
});
document.addEventListener('dragleave',e=>{
 const zone=e.target.closest('.import-drop');if(zone&&(!e.relatedTarget||!zone.contains(e.relatedTarget)))zone.classList.remove('drag-over');
});
document.addEventListener('dragend',clearDropHighlights);
document.addEventListener('drop',e=>{
 if(!draggedFiles(e))return;e.preventDefault();clearDropHighlights();
 const zone=e.target.closest('.import-drop');if(route!=='system'||!zone)return;
 if(busy){toast('正在解析文件，请稍候。');return;}
 if($('#dialog').open){toast('请先确认或取消当前导入。');return;}
 const files=Array.from(e.dataTransfer.files);if(files.length!==1){if(zone.dataset.importKind==='backup')showBackupError('每次请只拖入一个文件。');else toast('每次请只拖入一个文件。');return;}
 const file=files[0],kind=zone.dataset.importKind;
 if(kind==='backup'){
  if(!/\.json$/i.test(file.name)){showBackupError('请在备份区域拖入 .json 备份文件。');return;}
  loadBackup(file);
 }else{
  if(!(activeGame==='v3'?/\.dat$/i:/\.(vfs|bak)$/i).test(file.name)){toast(activeGame==='v3'?'请在存档区域拖入 .dat 游戏存档。':'请在存档区域拖入 .vfs 或 .bak 游戏存档。');return;}
  loadSave(file);
 }
});
document.addEventListener('change',e=>{
 if(e.target.id==='mobile-character-select')go('character/'+e.target.value);
 if(e.target.id==='language-select')document.querySelectorAll('#mobile-character-select option').forEach(option=>{option.textContent=t(char(option.value).name);});
 if(e.target.id==='language-select'&&$('#recent-import'))$('#recent-import').outerHTML=recentImportHTML();
 if(e.target.id==='owned-filter'){onlyOwned=e.target.checked;updateGiftResults();}
 if(e.target.id==='pref-owned'){prefOwned=e.target.checked;$('#preference-results').innerHTML=preferenceRows(char(route.split('/')[1]));}
 if(e.target.id==='save-file')loadSave(e.target.files[0]);
 if(e.target.id==='backup-file'){loadBackup(e.target.files[0]);e.target.value='';}
 if(e.target.id==='save-slot'){pendingSave.selected=e.target.value;$('#save-preview').innerHTML=previewHTML();}
});
document.addEventListener('input',e=>{
 if(e.target.id==='gift-quantity'){quantityDraft={id:Number(e.target.dataset.id),value:e.target.value,badInput:e.target.validity.badInput};e.target.removeAttribute('aria-invalid');quantityDraftUI();}
 if(e.isComposing)return;
 if(e.target.id==='gift-search'){giftFilter=e.target.value;updateGiftResults();}
 if(e.target.id==='global-search'){searchQuery=e.target.value;if(route!=='search'){go('search');}else{const result=searchResults();$('#search-results').innerHTML=result.html;$('#search-status').textContent=searchQuery.trim()?`找到 ${result.count} 项结果`:'';}}
});
document.addEventListener('compositionend',e=>{
 if(['gift-search','global-search'].includes(e.target.id))e.target.dispatchEvent(new Event('input',{bubbles:true}));
});
let readingTimer;
async function saveReading(){if(!route.startsWith('article/'))return;const id=route.split('/')[1];if(!articles.some(a=>a.id===id))return;updateRecord({...record(),reading:{id,offset:Math.round(window.scrollY)}});}
window.addEventListener('scroll',()=>{updateArticleTop();clearTimeout(readingTimer);if(route.startsWith('article/'))readingTimer=setTimeout(saveReading,500);},{passive:true});
window.addEventListener('pagehide',saveReading);
async function finishRouteChange(){
 closeMobileMenu();
 if($('#dialog').open)$('#dialog').close();
 clearTimeout(readingTimer);const previous=route;await saveReading();render();const id=route.split('/')[1];
 if(route.startsWith('article/')){const saved=record().reading;const offset=saved?.id===id?saved.offset:0;updateRecord({...record(),reading:{id,offset}});requestAnimationFrame(()=>window.scrollTo(0,offset));}else{window.scrollTo(0,0);}
 if(route==='search'){const i=$('#global-search');i?.focus();}else if(previous!==route)$('#heading').focus({preventScroll:true});
}
window.addEventListener('hashchange',()=>{
 if(!data)return;
 const traversed=nativeTraversal;nativeTraversal=false;
 // Roll back traversals before prompting so Cancel preserves the history entry.
 if(rollbackDelta!==null){const delta=rollbackDelta;rollbackDelta=null;confirmQuantityLeave(()=>history.go(delta));return;}
 let targetIndex=window.navigation?.currentEntry?.index??history.state?.danganmateIndex;
 if(!Number.isInteger(targetIndex)||targetIndex===routeIndex){targetIndex=routeIndex+(traversed?-1:1);history.replaceState({...history.state,danganmateIndex:targetIndex},'',location.href);}
 if(hasQuantityDraft()){
  rollbackDelta=targetIndex-routeIndex;history.go(-rollbackDelta);return;
 }
 routeIndex=targetIndex;finishRouteChange();
});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY){try{state=e.newValue?validateBackup(JSON.parse(e.newValue)):freshState();pendingSave=null;render();toast('已同步另一标签页的记录。');}catch{toast('另一标签页的记录无效，未覆盖此页数据。');}}});
$('#switch-game').onclick=()=>go('games');
$('.skip').onclick=e=>{e.preventDefault();$('#content').focus();$('#content').scrollIntoView({block:'start'});};
$('#back').onclick=()=>{if(route.startsWith('character/'))go(activeGame==='v3'?'home':'characters');else if(route.startsWith('article/'))go('guides');else if(route.startsWith('gift/'))go('gifts');else go('home');};
document.addEventListener('keydown',e=>{
 if(e.key!=='Escape'||e.defaultPrevented||e.repeat||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||$('#dialog').open||$('#mobile-menu').open||$('#back').hidden)return;
 e.preventDefault();$('#back').click();
});
async function boot(){try{
 const requested=new URL(location.href).searchParams.get('game'),initialGame=editions[requested]?requested:editions[state.lastGame]?state.lastGame:'dr1';
 const initialPath=location.hash.slice(1)||(editions[state.lastGame]?'home':'games');
 const firstImages=initialGame==='v3'&&initialPath!=='games'?['assets/v3/ui/bg_000_DXT1.webp',...(initialPath==='home'?['assets/v3/ui/icon_tsusinbo_DXT1.webp']:[])]:initialPath==='home'?[initialGame==='dr1'?'assets/dr1/menu/contacts-v2.webp':`assets/dr2/ui/techou_top-${dr2Art.characters}.webp`]:[];
 for(const path of firstImages){const preload=document.createElement('link');preload.rel='preload';preload.as='image';preload.href=path;preload.fetchPriority='high';document.head.append(preload);}
 await Promise.all([initI18n(),Promise.all(Object.values(editions).map(async game=>{
  let database=globalThis.danganmatePlatform?.databases[game.id];
  if(!database){const response=await fetch(databaseURLs[game.id]);if(!response.ok)throw new Error('资料库加载失败');database=await response.json();}
  databases.set(game.id,database);
  const characterId=initialPath.startsWith('character/')?initialPath.split('/')[1]:initialPath==='characters'&&initialGame!=='dr2'?(initialGame==='v3'?'shuichi':game.protagonist):null;
  const portrait=game.id===initialGame&&characterId&&database.characters.find(c=>c.id===characterId)?.portrait;
  if(portrait){const preload=document.createElement('link');preload.rel='preload';preload.as='image';preload.href=portrait;preload.fetchPriority='high';document.head.append(preload);}
 }))]);
 activateGame(initialGame);
 history.replaceState({...history.state,game:activeGame},'',location.href);
 render();
 localize();
 if(initialError){toast(initialError);$('#storage-status').textContent='原记录需恢复 · 请导出';}
}catch(error){$('#content').innerHTML=`<div class="error">手册资料未能加载。请通过本地 HTTP 预览或 GitHub Pages 打开网站，然后刷新重试。<br>${escape(error.message)}</div>`;}
}
boot();

