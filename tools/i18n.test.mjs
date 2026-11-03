import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {articles,sources,sourceGroups} from '../src/content.js';
import {rows} from '../src/locales/ui.js';

const data=JSON.parse(await readFile(new URL('../src/data.json',import.meta.url),'utf8'));
for(const [locale,column] of [['en',1],['ja',2]]){
 const catalog={...JSON.parse(await readFile(new URL(`../src/locales/${locale}.json`,import.meta.url),'utf8')),...Object.fromEntries(rows.map(row=>[row[0],row[column]]))};
 test(`${locale}: all shipped guides, profiles, gifts and references have translations`,()=>{
  const texts=articles.flatMap(a=>[a.title,a.intro,a.kind,...a.sections.flatMap(([heading,steps])=>[heading,...steps,...steps.filter(s=>s.includes('｜')).flatMap(s=>s.split('｜',2))])]);
  texts.push(...data.gifts.map(g=>g.name),...data.characters.map(c=>c.name),...sources.map(s=>s.note),...sourceGroups.map(s=>s.title));
  for(const text of texts)assert.ok(typeof catalog[text]==='string'&&catalog[text].length>0,`${locale}: missing ${text}`);
  for(const c of data.characters.filter(c=>c.talent!=='???'))assert.ok(catalog['超高校级的'+c.talent]);
  assert.equal(new Set(data.gifts.map(g=>catalog[g.name])).size,114,'Gift names must remain distinct');
 });
}
test('UI messages have one source key and three nonempty columns',()=>{
 assert.equal(new Set(rows.map(row=>row[0])).size,rows.length,'Duplicate UI source keys');
 for(const row of rows)assert.ok(row.length===3&&row.every(Boolean),row.join('|'));
});
