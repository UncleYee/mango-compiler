import _ from 'lodash';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Router from 'koa-router';

import Html from '@/html';
import codeManager, { paramErrorWithDetail } from '@/common/code-manager';

export default async (ctx: Router.IRouterContext) => {
  const { components } = ctx.request.body;
  let {
    title,
    jsonPath,
    pageJsPath,
    common,
  } = ctx.request.body;
  title = _.trim(title);
  jsonPath = _.trim(jsonPath);
  pageJsPath = _.trim(pageJsPath);
  common = _.trim(common);

  if (!jsonPath) {
    ctx.body = paramErrorWithDetail('jsonPath');
    return;
  }
  if (!/^http(s)?:\/\/(\S)*.js/.test(common)) {
    ctx.body = paramErrorWithDetail('common');
    return;
  }
  if (!/^http(s)?:\/\/(\S)*.js/.test(pageJsPath)) {
    ctx.body = paramErrorWithDetail('pageJsPath');
    return;
  }
  if (!_.isArray(components) || !components.every((item) => /^http(s)?:\/\/(\S)*.js/.test(item))) {
    ctx.body = paramErrorWithDetail('components');
    return;
  }

  const props = {
    title,
    jsonPath,
    pageJsPath,
    components,
    common,
    STATIC_PATH: '', // TODO: asure static path
  };

  // renderToStaticMarkup 同 renderToString，但不会在 React 内部创建的额外 DOM 属性
  // eslint-disable-next-line react/jsx-props-no-spreading
  const html = ReactDOMServer.renderToStaticMarkup(<Html {...props} />);

  ctx.body = {
    ...codeManager.success,
    data: `<!doctype html>\n${html}`,
  };
};
