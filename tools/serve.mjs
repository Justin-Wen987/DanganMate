import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async (req,res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const file = (await stat(path)).isDirectory() ? resolve(path,'index.html') : path;
    res.writeHead(200, {'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'}).end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4173,'127.0.0.1', () => console.log('DanganMate: http://127.0.0.1:4173'));
