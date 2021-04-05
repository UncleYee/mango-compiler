import Router from 'koa-router';

import logWhileUpdate from '@/middlewares/log-while-update';
import logWhileNotSuccess from '@/middlewares/log-while-not-success';

import innerRouter from './inner';

export default function getRouter(): Router {
  const router = new Router();

  router.use(logWhileNotSuccess);
  router.use(logWhileUpdate);

  router.get('/health', (ctx) => { ctx.body = 'ok'; });

  router.use('/inner', innerRouter.routes());

  return router;
}
