import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const router = jsonServer.router('build/db/app.json');

const middlewares = jsonServer.defaults({
  static: 'build',
  noCors: true
});
server.use(middlewares);

server.use(jsonServer.rewriter({ '/api/*': '/$1' }));

server.use(router);

server.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.includes('.')) return next();
  res.sendFile(path.resolve('build/index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});