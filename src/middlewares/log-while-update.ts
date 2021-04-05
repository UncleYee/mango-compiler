import codeManager from '@/common/code-manager';
import { KoaContext } from '@/interfaces/koa-context';
import { logger } from '@/common/logger';

const WHITE_LIST_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export default async (ctx: KoaContext, next: () => Promise<void>): Promise<void> => {
  await next();

  if (
    WHITE_LIST_METHODS.includes(ctx.method)
    && ctx.body
    && ctx.body.code === codeManager.success.code
  ) {
    const logInfo = {
      event: 'update-log',
      // eslint-disable-next-line no-underscore-dangle
      msg: `${ctx.method}-${ctx._customRouteName || ctx._matchedRouteName || ctx._matchedRoute}`,
      url: ctx.url,
      httpMethod: ctx.method,
      options: {
        userInfo: JSON.stringify(ctx.userInfo),
        body: JSON.stringify(ctx.request.body),
      },
      response: JSON.stringify(ctx.body),
    };
    logger.info(logInfo);
  }
};
