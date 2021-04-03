import Router from 'koa-router';

export default function getRouter(): Router {
  const router = new Router();

  router.get('/health', (ctx) => ctx.body = 'ok');

  return router;
}