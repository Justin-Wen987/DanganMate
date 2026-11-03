import {mkdir,copyFile,cp} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'), out=resolve(root,'dist');
await mkdir(out,{recursive:true});
await copyFile(resolve(root,'index.html'),resolve(out,'index.html'));
for(const folder of ['src','assets'])await cp(resolve(root,folder),resolve(out,folder),{recursive:true});
console.log('静态站点已生成：'+out+'；仅包含 index.html、src 和 assets。');
