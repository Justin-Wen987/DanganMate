import {rows} from './locales/ui.js';
import {appStorage} from './storage.js';
import {translations as dr2Translations} from './dr2/content.js';
import {translations as v3Translations} from './v3/content.js';

export const LANGUAGE_KEY='danganmate.language';
export const languages=['zh-CN','en','ja'];
let language='zh-CN';
const catalogs={};
const commonCatalogs={},gameCatalogs={};
const originals=new WeakMap();
const attributes=['aria-label','title','placeholder','content'];
const patterns=[
 [/^\/ (\d+) 项$/,n=>`/ ${n[1]} entries`,n=>`/ ${n[1]}項目`],
 [/^共 (\d+) 项 · 名称暂译，优先用编号核对$/,n=>`${n[1]} entries · Match by ID when names differ`,n=>`全${n[1]}項目・名前が異なる場合は番号で照合`],
 [/^备份中当前作品有 (\d+) 项礼物记录。确认后将替换三个作品的礼物、阅读位置和上次选择。$/,n=>`This game has ${n[1]} present records in the backup. Import replaces all games’ records.`,n=>`現在の作品は${n[1]}項目。取込は全作品の記録を置換します。`],
 [/^将用 (.+) 替换当前作品的礼物记录。未识别的数值会成为未录入。$/,n=>`Replace this game’s present records with ${n[1]}. Unrecognized values become unrecorded.`,n=>`${n[1]}で現在の作品の記録を置換。不明値は未記録になります。`],
 [/^继续阅读：(.+)$/,(n,tr)=>`Continue reading: ${tr(n[1])}`,(n,tr)=>`続きを読む：${tr(n[1])}`],
 [/^(\d{3,4})　(.+)$/,(n,tr)=>`${n[1]}　${tr(n[2])}`,(n,tr)=>`${n[1]}　${tr(n[2])}`],
 [/^(.+) · 纪念品$/,(n,tr)=>`${tr(n[1])} · Memento`,(n,tr)=>`${tr(n[1])}・記念品`],
 [/^显示 (\d+) \/ (\d+) 项礼物$/,n=>`Showing ${n[1]} / ${n[2]} presents`,n=>`${n[2]}項目中${n[1]}項目を表示`],
 [/^找到 (\d+) 项结果$/,n=>`${n[1]} results`,n=>`${n[1]}件の結果`],
 [/^(角色|礼物|攻略) · (\d+)$/,(n,tr)=>`${tr(n[1])} · ${n[2]}`,(n,tr)=>`${tr(n[1])}・${n[2]}件`],
 [/^第 (\d+) 章$/,n=>`Chapter ${n[1]}`,n=>`第${n[1]}章`],
 [/^(.+)攻略$/,(n,tr)=>`${tr(n[1])} guides`,(n,tr)=>`${tr(n[1])}の攻略`],
 [/^(\d+) 项来源$/,n=>`${n[1]} references`,n=>`出典${n[1]}件`],
 [/^(\d+) 项已录入 · 未录入与数量 0 分开$/,n=>`${n[1]} recorded · Unknown and zero are distinct`,n=>`${n[1]}項目を記録済み・未記録と0個は別扱い`],
 [/^(\d+) 项有可读取数量$/,n=>`${n[1]} readable quantities`,n=>`${n[1]}項目の数量を読込可能`],
 [/^(\d+) 项特殊值待确认$/,n=>`${n[1]} special values to check`,n=>`${n[1]}項目の特殊値は要確認`],
 [/^没有找到与“(.*)”匹配的礼物。$/,n=>`No presents match “${n[1]}”.`,n=>`「${n[1]}」に合うプレゼントはありません。`],
 [/^(.+)持有数量$/,(n,tr)=>`${tr(n[1])} quantity`,(n,tr)=>`${tr(n[1])}の所持数`],
 [/^(.+)功能图$/,(n,tr)=>`${tr(n[1])} illustration`,(n,tr)=>`${tr(n[1])}のイラスト`],
 [/^(.+)的修改尚未写入背包。请选择保存或放弃修改后离开。$/,(n,tr)=>`Changes to ${tr(n[1])} are not saved. Save or discard them before leaving.`,(n,tr)=>`${tr(n[1])}の変更は未保存です。保存または破棄して移動してください。`],
 [/^(.+)已扣除 1 件。$/,(n,tr)=>`Subtracted one ${tr(n[1])}.`,(n,tr)=>`${tr(n[1])}を1個減らしました。`],
 [/^完成(.+)获得的纪念品。$/,(n,tr)=>`Memento for completing ${tr(n[1])}.`,(n,tr)=>`${tr(n[1])}クリアの記念品。`],
 [/^完成学院模式中(.+)的个人结局后获得。$/,(n,tr)=>`Complete ${tr(n[1])}’s individual School Mode ending.`,(n,tr)=>`スクールモードで${tr(n[1])}の個別エンドを達成して入手。`],
 [/^备份中 1 代有 (\d+) 项礼物记录。确认后将替换三个作品的礼物、阅读位置和上次选择。$/,n=>`The backup has ${n[1]} DR1 present records. Confirming replaces gifts, reading positions and the last selection for all three games.`,n=>`1作目のプレゼント記録が${n[1]}項目あります。確認すると3作品の所持品、読書位置、最後の作品選択を置換します。`],
 [/^将用 (.+) 的主线背包替换当前 1 代礼物记录。特殊值及未解析的 101–114 会成为未录入。$/,n=>`Replace current DR1 present records with ${n[1]}’s story inventory. Special values and unmapped 101–114 become unrecorded.`,n=>`${n[1]}の本編所持品で1作目の記録を置換します。特殊値と未解析の101～114は未記録になります。`],
 [/^(.+) 的校验未通过。请选择完整的原始游戏存档。$/,n=>`${n[1]} failed validation. Select a complete original game save.`,n=>`${n[1]}の検証に失敗しました。完全な元のゲームセーブを選択してください。`],
 [/^(.+) · 最新$/,n=>`${n[1]} · Latest`,n=>`${n[1]}・最新`],
 [/^(.+) · DanganMate 弹丸手册$/,(n,tr)=>`${tr(n[1])} · DanganMate`,(n,tr)=>`${tr(n[1])} · DanganMate`],
];

export function t(source,locale=language){
 if(locale==='zh-CN'||!source)return source;
 const key=source.trim(),dictionary=catalogs[locale];
 if(!dictionary)return source;
 let translated=dictionary[key];
 if(translated===undefined){
  for(const [pattern,en,ja] of patterns){const match=key.match(pattern);if(match){translated=(locale==='en'?en:ja)(match,value=>t(value,locale));break;}}
 }
 return translated===undefined?source:source.replace(key,translated);
}

// Only text and human-readable attributes are translated. Routes, IDs, form
// values and user records never pass through the localization layer.
function localizeElement(element){
 if(element.closest('script,style,noscript,option,[translate="no"]'))return;
 const record=originals.get(element)||{};
 for(const name of attributes){
  if(!element.hasAttribute(name)||name==='content'&&element.tagName!=='META')continue;
  const current=element.getAttribute(name),saved=record[name];
  const source=saved&&current===saved.output?saved.source:current,output=t(source);
  record[name]={source,output};if(current!==output)element.setAttribute(name,output);
 }
 originals.set(element,record);
 for(const node of element.childNodes){
  if(node.nodeType===Node.ELEMENT_NODE)localizeElement(node);
  else if(node.nodeType===Node.TEXT_NODE){
   const saved=originals.get(node),current=node.data;
   const source=saved&&current===saved.output?saved.source:current,output=t(source);
   originals.set(node,{source,output});if(current!==output)node.data=output;
  }
 }
}

export function localize(){localizeElement(document.documentElement);}
export function aliases(source){return [source,t(source,'en'),t(source,'ja')].join('\n').toLocaleLowerCase();}
export function currentLanguage(){return language;}
export function setGameLanguage(game){
 for(const locale of ['en','ja'])catalogs[locale]={...commonCatalogs[locale],...(gameCatalogs[game]?.[locale]||{}),...(game==='dr2'?dr2Translations[locale]:game==='v3'?v3Translations[locale]:{})};
}

export async function initI18n(){
 // All translations ship with the static site. No text or save file leaves the browser.
 const results=await Promise.all(['en','ja'].map(async locale=>{
  if(globalThis.danganmatePlatform)return [locale,globalThis.danganmatePlatform.catalogs.common[locale]];
  const response=await fetch(new URL(`./locales/${locale}.json`,import.meta.url));
  if(!response.ok)throw new Error('Translation data could not be loaded.');
  return [locale,await response.json()];
 }));
 for(const [locale,catalog] of results){catalogs[locale]=catalog;for(const [zh,en,ja] of rows)catalog[zh]=locale==='en'?en:ja;}
 Object.assign(commonCatalogs,catalogs);
 for(const locale of ['en','ja'])for(const key of ['文件大小异常。请选择当前作品的 Steam PC 存档。','确认覆盖当前作品记录？','会将当前作品所有未知数量设为 0；已经填写的数量不变。请确认未录入的礼物确实没有持有。','提供 1 代与 2 代的资料、攻略和背包工具，支持简体中文、英语与日语。V3 入口预留。角色页面提供资料与礼物偏好。'])commonCatalogs[locale][key]=dr2Translations[locale][key];
 await Promise.all(['dr2','v3'].map(async game=>{gameCatalogs[game]=Object.fromEntries(await Promise.all(['en','ja'].map(async locale=>{
  if(globalThis.danganmatePlatform)return [locale,globalThis.danganmatePlatform.catalogs[game][locale]];
  const response=await fetch(new URL(`./${game}/${locale}.json`,import.meta.url));if(!response.ok)throw new Error('Translation data could not be loaded.');return [locale,await response.json()];
 })));}));
 try{const saved=appStorage.getItem(LANGUAGE_KEY);if(languages.includes(saved))language=saved;}catch{/* The handbook can still switch languages without storage. */}
 const selector=document.getElementById('language-select');selector.value=language;
 function apply(){document.documentElement.lang=language;localize();}
 selector.addEventListener('change',async()=>{
  language=selector.value;
  try{await appStorage.setItem(LANGUAGE_KEY,language);}catch{/* Session-only language when browser storage is unavailable. */}
  apply();
 });
 apply();
 const observer=new MutationObserver(records=>{
  // Render updates are batched by the browser before painting. Retain source
  // text per node so switching back does not need a reverse dictionary.
  const targets=new Set(records.map(r=>r.target.nodeType===Node.TEXT_NODE?r.target.parentElement:r.target));
  for(const target of targets)if(target?.isConnected)localizeElement(target);
 });
 observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
}
