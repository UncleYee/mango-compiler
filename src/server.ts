import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import morgan from 'koa-morgan';

import { isProduction } from './config';
import getRouter from './routes';

const app = new Koa();
app.proxy = true;

// dev 模式下的日志
if (!isProduction) {
  app.use(morgan('dev'));
}

// bodyparser
app.use(bodyParser());

// 路由相关配置
const router = getRouter();
app
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
