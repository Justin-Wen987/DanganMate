import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshState,validateBackup,changeQuantity,subtractGift,parseDR1} from '../src/core.js';

function fixture(){
 const size=0x3ac94, buffer=new ArrayBuffer(size+24), raw=new Uint8Array(buffer), v=new DataView(buffer);
 v.setUint32(0,12,true);raw.set(new TextEncoder().encode('data0000.bin'),4);v.setUint32(16,size,true);
 const entry=20,core=entry+0x2e4;
 v.setUint32(entry+0x2e0,0x3a9b0,true);v.setUint32(core,0x16ae9564,true);
 raw.set(new TextEncoder().encode('06.09.2026/15.54.48'),entry+0x2c0);
 raw.fill(255,entry+0x558,entry+0x558+100);raw.set([3,4,1,0,2],entry+0x558);
 const sum=(a,b)=>raw.subarray(a,b).reduce((s,n)=>s+n,0);
 v.setUint32(core+0x38,sum(core,core+0x38),true);v.setUint32(entry+size-4,sum(core+0x3c,entry+size-4),true);
 v.setUint32(entry+size,0xdeadbeef,true);return buffer;
}
test('gift accounting preserves unknown and zero; cannot subtract missing gifts',()=>{
 const r=freshState().games.dr1;assert.throws(()=>subtractGift(r,1));
 const next=changeQuantity(r,1,1);assert.equal(subtractGift(next,1).quantities[1],0);assert.equal(r.quantities[1],undefined);
 for(const value of [-1,1.2,1000,NaN])assert.throws(()=>changeQuantity(r,1,value));
});
test('backup validates and reconstructs clean records',()=>{
 const s=freshState();s.games.dr1.quantities[1]=3;s.games.dr1.reading={id:'trial-1',offset:200};
 assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(s))),s);
 const legacy=structuredClone(s);legacy.games.dr1.events={kyoko:2};
 assert.deepEqual(validateBackup(legacy),s);
 assert.ok(!Object.hasOwn(validateBackup(legacy).games.dr1,'events'));
 for(const mutate of [s=>s.version=2,s=>s.games.dr1.quantities[1]=-1,s=>s.games.dr1.reading={id:'<img>',offset:0},s=>s.lastGame='untrusted']){
  const bad=structuredClone(s);mutate(bad);assert.throws(()=>validateBackup(bad));
 }
});

test('optional import metadata survives backup and quantity edits; old v1 data remains valid',()=>{
 const state=freshState();
 for(const game of ['dr1','dr2','v3']){
  state.games[game].lastImport={fileName:game==='v3'?'SAVE-DATA00.dat':'savedata_ch.vfs',importedAt:1793599200000};
  state.games[game]=changeQuantity(state.games[game],1,3);
 }
 assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(state))),state);
 const legacy=structuredClone(state);
 for(const record of Object.values(legacy.games))delete record.lastImport;
 const clean=validateBackup(legacy);
 for(const game of ['dr1','dr2','v3']){
  assert.equal(clean.games[game].lastImport,null);
  assert.equal(clean.games[game].quantities[1],3);
 }
});

test('invalid import metadata is rejected without altering supplied records',()=>{
 for(const lastImport of [{fileName:'',importedAt:1},{fileName:'x'.repeat(256),importedAt:1},{fileName:'bad\nname',importedAt:1},{fileName:'save.dat',importedAt:-1},{fileName:'save.dat',importedAt:1.5},{fileName:'save.dat',importedAt:8640000000000001},'invalid']){
  const state=freshState();state.games.v3.lastImport=lastImport;const original=structuredClone(state);
  assert.throws(()=>validateBackup(state),/导入信息/);
  assert.deepEqual(state,original);
 }
});
test('VFS checksums, dates, sentinel and read-only parsing',()=>{
 const b=fixture(), before=new Uint8Array(b).slice(), parsed=parseDR1(b);
 assert.equal(parsed.latest,'data0000.bin');assert.equal(parsed.slots[0].date,'2026-09-06 15:54:48');
 assert.deepEqual(Object.values(parsed.slots[0].quantities),[3,4,1,0,2]);assert.equal(parsed.slots[0].unknown.length,95);
 assert.deepEqual(new Uint8Array(b),before);
 const broken=b.slice(0);new Uint8Array(broken)[20+0x558]=9;assert.throws(()=>parseDR1(broken),/校验/);
 assert.throws(()=>parseDR1(b.slice(0,-2)));assert.throws(()=>parseDR1(new ArrayBuffer(0)));
});

test('DR1 reads all 100 story gifts, keeps locked values distinct from zero and excludes following fields',()=>{
 const buffer=fixture(),raw=new Uint8Array(buffer),view=new DataView(buffer),entry=20;
 const counts=Array.from({length:100},(_,i)=>(i*7)%10);
 for(const id of [16,20,25,46,92])counts[id-1]=255;
 raw.set(counts,entry+0x558);
 raw.set(Array.from({length:14},(_,i)=>i+1),entry+0x558+100);
 const sum=raw.subarray(entry+0x2e4+0x3c,entry+0x3ac94-4).reduce((a,b)=>a+b,0);
 view.setUint32(entry+0x3ac94-4,sum,true);
 const before=raw.slice(),slot=parseDR1(buffer).slots[0];
 for(let i=0;i<100;i++)assert.equal(slot.quantities[i+1],counts[i]===255?undefined:counts[i]);
 assert.deepEqual(slot.unknown,[16,20,25,46,92]);
 for(let id=101;id<=114;id++)assert.equal(slot.quantities[id],undefined);
 assert.deepEqual(raw,before);
});
test('data referential integrity and shipped images',async()=>{
 const d=JSON.parse(await readFile(new URL('../src/data.json',import.meta.url),'utf8'));
 assert.equal(d.gifts.length,114);assert.equal(new Set(d.gifts.map(g=>g.id)).size,114);
 assert.equal(d.gifts[57].name,'速球大臣');assert.equal(d.gifts[60].name,'黄金航天飞机');
 for(const c of d.characters){
  assert.equal(new Set([...c.love,...c.like]).size,c.love.length+c.like.length);
  for(const id of [...c.love,...c.like])assert.ok(d.gifts.some(g=>g.id===id&&g.giftable));
  for(const asset of [c.portrait,c.pixel].filter(Boolean))assert.ok((await readFile(new URL('../'+asset,import.meta.url))).length>0);
 }
});

test('guide routes, half-trial links and source references remain valid',async()=>{
 const {articles,sources,sourceGroups}=await import('../src/content.js');
 assert.equal(new Set(articles.map(a=>a.id)).size,articles.length);
 assert.equal(new Set(sources.map(s=>s.id)).size,sources.length);
 const grouped=sourceGroups.flatMap(g=>g.ids);
 assert.equal(new Set(grouped).size,sources.length);
 assert.deepEqual([...grouped].sort(),sources.map(s=>s.id).sort());
 for(const a of articles){
  assert.ok(a.sections.length>0);
  for(const [title,items] of a.sections){assert.ok(title);assert.ok(items.length>0);assert.ok(items.every(t=>typeof t==='string'&&t.length>0));}
  for(const id of a.sources)assert.ok(sources.some(s=>s.id===id),`${a.id}: missing source ${id}`);
 }
 for(let chapter=1;chapter<=6;chapter++){
  const first=articles.find(a=>a.id===`trial-${chapter}`),second=articles.find(a=>a.id===`trial-${chapter}-2`);
  assert.equal(first.part,1);assert.equal(second.part,2);
  assert.equal(first.related,second.id);assert.equal(second.related,first.id);
  assert.ok(articles.some(a=>a.id===`chapter-${chapter}`));
 }
 for(const s of sources)assert.equal(new URL(s.url).protocol,'https:');
});
