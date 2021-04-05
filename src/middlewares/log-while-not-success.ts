import { logger } from '@/common/logger';
import { isProduction } from '@/config';
import codeManager from '@/common/code-manager';
import { KoaContext } from '@/interfaces/koa-context';

export default async (ctx: KoaContext, next: () => Promise<void>): Promise<void> => {
  await next();
  if (ctx.body && ctx.body.code !== undefined && ctx.body.code !== codeManager.success.code) {
    const logInfo = {
      event: 'body-error',
      // eslint-disable-next-line no-underscore-dangle
      msg: `${ctx.method}-${ctx._customRouteName || ctx._matchedRouteName || ctx._matchedRoute}`,
      desc: ctx.body.message,
      url: ctx.url,
      httpMethod: ctx.method,
      options: {
        headers: '', // 敏感信息较多，最好不要记录
        body: JSON.stringify(ctx.request.body),
      },
      response: JSON.stringify(ctx.body),
    };

    if (!isProduction) {
      logInfo.options!.headers = JSON.stringify(ctx.headers);
    }
    logger.warn(logInfo);
  }
};
