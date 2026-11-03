import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {parseDR1,parseDR2} from '../src/core.js';
import {articles,sources,translations} from '../src/dr2/content.js';
const data=JSON.parse(await readFile(new URL('../src/dr2/data.json',import.meta.url),'utf8'));
test('DR2 content and translations cover all chapters, gifts and linked assets',async()=>{
 assert.equal(data.gifts.length,140);assert.equal(data.characters.length,16);
 const sourceIds=new Set(sources.map(s=>s.id));
 for(const a of articles){assert.ok(a.sections.length);for(const id of a.sources)assert.ok(sourceIds.has(id),id);for(const locale of ['en','ja'])for(const text of [a.title,a.intro,...a.sections.flatMap(([h,steps])=>[h,...steps])])assert.ok(translations[locale][text],text);}
 for(const ch of [1,2,3,4,5,6])assert.ok(articles.some(a=>a.id==='trial-'+ch));
 for(const g of data.gifts){assert.ok(g.acquisition);assert.ok(g.image);await access(new URL('../'+g.image,import.meta.url));}
 for(const c of data.characters){await access(new URL('../'+c.pixel,import.meta.url));await access(new URL('../'+c.portrait,import.meta.url));for(const id of [...c.love,...c.like])assert.ok(id<=114);}
});
test('DR2 read-only parser checks both checksums, latest dates and sentinel',()=>{
 const size=0x3763c,b=new ArrayBuffer(size+24),raw=new Uint8Array(b),v=new DataView(b),entry=20,core=entry+0x2e4;
 v.setUint32(0,12,true);raw.set(new TextEncoder().encode('data0000.bin'),4);v.setUint32(16,size,true);v.setUint32(entry+0x2e0,0x37358,true);v.setUint32(core,0x16ae9564,true);
 const counts=Array.from({length:140},(_,i)=>(i*3)%8);counts.splice(0,5,1,1,1,2,2);
 for(let id=115;id<=129;id++)if(id<122||id>124)counts[id-1]=255;
 raw.set(counts,entry+0x33714);v.setUint16(entry+0x3759e,338,true);
 raw.set(new TextEncoder().encode('30.10.2026/14.00.00'),entry+0x2c0);
 const sum=(a,z)=>raw.slice(a,z).reduce((s,n)=>s+n,0);v.setUint32(core+0x3c,sum(core,core+0x3c),true);v.setUint32(entry+size-4,sum(core+0x40,entry+size-4),true);v.setUint32(entry+size,0xdeadbeef,true);
 const before=raw.slice(),parsed=parseDR2(b),slot=parsed.slots[0];
 for(let i=0;i<140;i++)assert.equal(slot.quantities[i+1],counts[i]===255?undefined:counts[i]);
 assert.equal(slot.coins,338);assert.equal(slot.unknown.length,12);assert.deepEqual(raw,before);assert.throws(()=>parseDR1(b));raw[entry+0x33714]++;assert.throws(()=>parseDR2(b));
});
