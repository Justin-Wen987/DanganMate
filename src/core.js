export const STORAGE_KEY = 'danganmate.records.v1';
export const freshRecord = () => ({quantities:{},reading:null,coins:null,lastImport:null});
export const freshState = () => ({format:'DanganMate',version:1,lastGame:null,games:{dr1:freshRecord(),dr2:freshRecord(),v3:freshRecord()}});
const games = ['dr1','dr2','v3'];
const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v);
export function validateBackup(input) {
  if (!plain(input) || input.format !== 'DanganMate' || input.version !== 1 || !plain(input.games) || (input.lastGame !== null && !games.includes(input.lastGame))) throw new Error('不是兼容的 DanganMate v1 备份。请选择本网站导出的 JSON 文件。');
  const out = freshState(); out.lastGame = input.lastGame;
  for (const game of games) {
    const r = input.games[game];
    if (!plain(r) || !plain(r.quantities)) throw new Error('备份缺少作品记录，原记录已保留。');
    const clean = freshRecord();
    for (const [key,value] of Object.entries(r.quantities)) {
      if (!/^\d{1,3}$/.test(key) || +key < 1 || +key > (game === 'dr1' ? 114 : 200) || !Number.isInteger(value) || value < 0 || value > 999) throw new Error('备份中的礼物编号或数量无效。');
      clean.quantities[String(+key)] = value;
    }
    // Legacy v1 backups may contain events. Ignore this retired field while
    // retaining gift quantities, reading position, coins and game selection.
    if (r.reading !== null && (!plain(r.reading) || typeof r.reading.id !== 'string' || !/^[a-z0-9-]{1,50}$/.test(r.reading.id) || !Number.isFinite(r.reading.offset) || r.reading.offset < 0 || r.reading.offset > 100000)) throw new Error('阅读记录格式无效。');
    clean.reading = r.reading ? {id:r.reading.id,offset:r.reading.offset} : null;
    if (r.coins !== null && (!Number.isInteger(r.coins) || r.coins < 0 || r.coins > 65535)) throw new Error('徽章记录无效。');
    clean.coins = r.coins;
    // The optional field keeps existing v1 records and backups compatible.
    if (r.lastImport != null) {
      const info=r.lastImport;
      if (!plain(info) || typeof info.fileName!=='string' || !info.fileName.trim() || info.fileName.length>255 || /[\u0000-\u001f\u007f]/.test(info.fileName) || !Number.isInteger(info.importedAt) || info.importedAt<0 || info.importedAt>8640000000000000) throw new Error('存档导入信息格式无效，原记录已保留。');
      clean.lastImport={fileName:info.fileName,importedAt:info.importedAt};
    }
    out.games[game] = clean;
  }
  return out;
}
export function changeQuantity(record,id,next) {
  if (!Number.isInteger(next) || next < 0 || next > 999) throw new Error('请输入 0–999 的整数；未录入表示数量未知。');
  return {...record, quantities:{...record.quantities,[id]:next}};
}
export function subtractGift(record,id) {
  const value = record.quantities[id];
  if (!Number.isInteger(value) || value < 1) throw new Error('没有可扣除的已记录礼物。请先确认持有数量。');
  return changeQuantity(record,id,value-1);
}
export const parseDR1=buffer=>parseSteamSave(buffer,{game:'dr1',size:0x3ac94,coreSize:0x3a9b0,checksumOffset:0x38,giftOffset:0x558,giftCount:100,coinOffset:0x490});
export const parseDR2=buffer=>parseSteamSave(buffer,{game:'dr2',size:0x3763c,coreSize:0x37358,checksumOffset:0x3c,giftOffset:0x33714,giftCount:140,coinOffset:0x3759e});
export function parseV3(buffer,{name='SAVE-DATA.dat',lastModified=0}={}) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength!==279528) throw new Error('V3 存档大小或布局不匹配。请选择原始 SAVE-DATAxx.dat 文件。');
  const bytes=new Uint8Array(buffer),view=new DataView(buffer);
  const text=(start,end)=>new TextDecoder().decode(bytes.subarray(start,end)).split('\0')[0];
  if (!/Ｖ３|V3/.test(text(0,0x80)) || !/ダンガンロンパ|枪弹辩驳|槍彈辯駁|Danganronpa/i.test(text(0,0x80))) throw new Error('不是已支持的 V3 Steam PC 存档。');
  const quantities={},unknown=[];
  for(let i=0;i<143;i++) {
    const count=view.getUint16(0x30e4+i*2,true);
    if(count===65535)unknown.push(i+1);
    else if(count<=999)quantities[i+1]=count;
    else throw new Error('V3 礼物数量超出范围，未导入任何数据。');
  }
  const date=lastModified?new Date(lastModified).toISOString().replace('T',' ').slice(0,19)+' UTC':null;
  return {game:'v3',latest:null,slots:[{name,chapter:text(0x80,0x100),date,rawDate:'',coins:view.getUint16(0x590,true),quantities,unknown}]};
}
function parseSteamSave(buffer,layout) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 24 || buffer.byteLength > 32*1024*1024) throw new Error('文件大小异常。请选择当前作品的 Steam PC 存档。');
  const bytes = new Uint8Array(buffer), view = new DataView(buffer), slots = [];
  const u32 = (offset) => view.getUint32(offset,true);
  const str = (start,end) => new TextDecoder('utf-8').decode(bytes.subarray(start,end)).split('\0')[0];
  const sum = (start,end) => { let n=0;for(let i=start;i<end;i++) n=(n+bytes[i])>>>0;return n; };
  let pos=0, footer=false;
  while (pos+4<=bytes.length) {
    if (u32(pos) === 0xdeadbeef) { footer=true;pos+=4;break; }
    const nameLength=u32(pos);pos+=4;
    if (nameLength<1 || nameLength>255 || pos+nameLength+4>bytes.length) throw new Error('VFS 文件头损坏或不是受支持的格式。');
    const name=str(pos,pos+nameLength);pos+=nameLength;
    const size=u32(pos);pos+=4;
    if (size>bytes.length-pos) throw new Error('存档内容不完整，未导入任何数据。');
    const entry=pos;pos+=size;
    if (!/^data\d{4}\.bin$/.test(name)) continue;
    if (size!==layout.size || u32(entry+0x2e0)!==layout.coreSize) throw new Error('这个存档布局尚未支持，原记录已保留。');
    const core=entry+0x2e4;
    if (u32(core)!==0x16ae9564 || sum(core,core+layout.checksumOffset)!==u32(core+layout.checksumOffset) || sum(core+layout.checksumOffset+4,entry+size-4)!==u32(entry+size-4)) throw new Error(`${name} 的校验未通过。请选择完整的原始游戏存档。`);
    const rawDate=str(entry+0x2c0,entry+0x2e0);
    const match=rawDate.match(/^(\d{2})\.(\d{2})\.(\d{4})\/(\d{2})\.(\d{2})\.(\d{2})$/);
    const date=match ? `${match[3]}-${match[2]}-${match[1]} ${match[4]}:${match[5]}:${match[6]}` : null;
    const quantities={},unknown=[];
    for(let i=0;i<layout.giftCount;i++) {
      const count=bytes[entry+layout.giftOffset+i];
      // 0xff is an unresolved sentinel, never show as 255 or assume zero.
      if(count===255) unknown.push(i+1); else quantities[i+1]=count;
    }
    slots.push({name,chapter:str(entry+0x40,entry+0xc0),date,rawDate,coins:layout.coinOffset===null?null:view.getUint16(entry+layout.coinOffset,true),quantities,unknown});
  }
  if (!footer || pos!==bytes.length || !slots.length || new Set(slots.map(s=>s.name)).size!==slots.length) throw new Error('存档结构异常或没有可读取的存档槽。');
  const dated=slots.every(s=>s.date);
  const latest=dated ? [...slots].sort((a,b)=>b.date.localeCompare(a.date))[0].name : null;
  return {game:layout.game,slots,latest};
}
