import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const angularApp = new AngularNodeAppEngine();

  server.use('/api/**', (req, res) => res.json({ hello: 'foo' }));

  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    }),
  );

  // With this config, /404 will not reach the Angular app
  server.get('/404', (req, res, next) => {
    res.send('Express is serving this server only error');
  });

  server.get('**', (req, res, next) => {
    angularApp
      .handle(req)
      .then((response) => {
        return response ? writeResponseToNodeResponse(response, res) : next();
      })
      .catch(next);
  });

  return server;
}

const server = app();
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

console.warn('Node Express server started');

// This exposes the RequestHandler
export default createNodeRequestHandler(server);
