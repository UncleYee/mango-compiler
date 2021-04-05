import { KoaContext } from '@/interfaces/koa-context';

export default (name: string) => async (
  ctx: KoaContext,
  next: () => Promise<void>,
): Promise<void> => {
  if (name) {
    // eslint-disable-next-line no-underscore-dangle
    ctx._customRouteName = name;
  }
  await next();
};
