// Minimal static file server — zero dependencies, just Node.js
// Usage: node serve.js
// Then open http://localhost:3000/preview.html

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.obj':  'text/plain',
  '.mtl':  'text/plain',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, decodeURIComponent(req.url === '/' ? '/preview.html' : req.url));

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') { res.writeHead(404); res.end('Not found: ' + req.url); }
      else { res.writeHead(500); res.end('Server error'); }
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  🐍 Serpientes y Escaleras 3D — Pokémon Edition`);
  console.log(`  ────────────────────────────────────────────`);
  console.log(`  Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`  Abre en tu navegador:  http://localhost:${PORT}/preview.html\n`);
});
