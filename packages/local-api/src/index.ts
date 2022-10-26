import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filname: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filname, dir));

  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:4010',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    const packagePath = require.resolve(
      '@jsnote555/local-client/build/index.html'
    );
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
