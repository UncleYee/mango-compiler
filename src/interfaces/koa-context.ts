import { RouterContext } from 'koa-router';

export type KoaContext<UserInfo = any> = RouterContext<any, {
  _customRouteName?: string;
  userInfo?: UserInfo

  body: any;
  // 一些通过中间件绑定到 context 的信息可以在这里定义
  [param: string]: any;
}>;
