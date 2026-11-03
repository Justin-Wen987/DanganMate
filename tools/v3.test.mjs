import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {parseV3,parseDR1,parseDR2,freshState,validateBackup,changeQuantity} from '../src/core.js';
import {articles,sources,translations} from '../src/v3/content.js';
const data=JSON.parse(await readFile(new URL('../src/v3/data.json',import.meta.url),'utf8'));

test('V3 has contiguous 143 native presents, 16 profiles, valid preferences and local artwork',async()=>{
 assert.equal(data.gifts.length,143);assert.equal(data.characters.length,16);
 assert.deepEqual(data.gifts.map(g=>g.id),Array.from({length:143},(_,i)=>i+1));
 for(const g of data.gifts){assert.ok(g.name&&g.en&&g.ja&&g.description&&g.acquisition);await access(new URL('../'+g.image,import.meta.url));}
 for(const c of data.characters){assert.ok(c.name&&c.en&&c.ja&&c.bio.birthday);await access(new URL('../'+c.pixel,import.meta.url));await access(new URL('../'+c.portrait,import.meta.url));assert.equal(c.portraitBounds.length,4);const [x,y,w,h]=c.portraitBounds;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=c.portraitWidth&&y+h<=c.portraitHeight,'Native portrait viewport stays inside the original texture');assert.equal(new Set([...c.love,...c.like]).size,c.love.length+c.like.length);for(const id of [...c.love,...c.like])assert.ok(data.gifts.some(g=>g.id===id&&g.giftable));}
 assert.ok(data.characters.find(c=>c.id==='kaede').love.includes(45));
 assert.ok(data.characters.find(c=>c.id==='shuichi').like.includes(1));
});
test('V3 guides cover chapters, actual recesses, hidden locations and optional lies in three languages',()=>{
 const ids=new Set(sources.map(s=>s.id));assert.equal(new Set(articles.map(a=>a.id)).size,articles.length);
 for(let ch=1;ch<=6;ch++){assert.ok(articles.find(a=>a.id===`main-${ch}`));assert.ok(articles.find(a=>a.id===`hidden-${ch}`));assert.ok(articles.find(a=>a.id===`trial-${ch}`));if(ch<6)assert.equal(articles.find(a=>a.id===`trial-${ch}-2`).related,`trial-${ch}`);}
 assert.equal(articles.find(a=>a.id==='trial-6').part,undefined);
 assert.equal(articles.find(a=>a.id==='back-routes').sections[1][1].length,5);
 for(const a of articles){for(const id of a.sources)assert.ok(ids.has(id),id);for(const locale of ['en','ja'])for(const key of [a.title,a.intro,...a.sections.flatMap(([h,steps])=>[h,...steps])])assert.ok(translations[locale][key],key);}
});
function fixture(){
 const buffer=new ArrayBuffer(279528),raw=new Uint8Array(buffer),view=new DataView(buffer);
 raw.set(new TextEncoder().encode('新枪弹辩驳Ｖ３　大家的自相残杀新学期'));
 raw.set(new TextEncoder().encode('CHAPTER 6 END'),0x80);view.setUint16(0x590,811,true);
 for(let i=0;i<143;i++)view.setUint16(0x30e4+i*2,(i*3)%13,true);
 [1,4,3,3,4].forEach((q,i)=>view.setUint16(0x30e4+i*2,q,true));view.setUint16(0x30e4+142*2,65535,true);
 return {buffer,raw,view};
}
test('V3 parser reads 16-bit counts without modifying the original and rejects wrong formats',()=>{
 const {buffer,raw,view}=fixture(),before=raw.slice();const parsed=parseV3(buffer,{name:'SAVE-DATA18.dat',lastModified:1793584800000});
 assert.deepEqual([1,2,3,4,5].map(id=>parsed.slots[0].quantities[id]),[1,4,3,3,4]);assert.equal(parsed.slots[0].coins,811);assert.deepEqual(parsed.slots[0].unknown,[143]);assert.equal(parsed.latest,null);assert.equal(parsed.slots[0].name,'SAVE-DATA18.dat');assert.deepEqual(raw,before);
 assert.throws(()=>parseV3(buffer.slice(0,-1)));assert.throws(()=>parseDR1(buffer));assert.throws(()=>parseDR2(buffer));view.setUint16(0x30e4,1000,true);assert.throws(()=>parseV3(buffer));raw.fill(0,0,128);assert.throws(()=>parseV3(buffer));
});

test('V3 checks the full present range while preserving zero and the unknown sentinel',()=>{
 const {buffer,raw,view}=fixture(),before=raw.slice(),slot=parseV3(buffer).slots[0];
 for(let id=1;id<=142;id++)assert.equal(slot.quantities[id],view.getUint16(0x30e4+(id-1)*2,true));
 assert.equal(slot.quantities[14],0);assert.equal(slot.quantities[143],undefined);assert.deepEqual(slot.unknown,[143]);assert.deepEqual(raw,before);
});
test('V3 inventory backups stay isolated from DR1 and DR2 records',()=>{
 const state=freshState();state.lastGame='v3';state.games.v3=changeQuantity(state.games.v3,143,7);state.games.dr1=changeQuantity(state.games.dr1,1,2);
 const restored=validateBackup(JSON.parse(JSON.stringify(state)));assert.equal(restored.games.v3.quantities[143],7);assert.equal(restored.games.dr1.quantities[1],2);assert.deepEqual(restored.games.dr2.quantities,{});
});
