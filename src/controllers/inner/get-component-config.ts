import _ from 'lodash';
import fse from 'fs-extra';
import yaml from 'js-yaml';
import { promisify } from 'util';

import { logger } from '@/common/logger';
import { KoaContext } from '@/interfaces/koa-context';
import { getComponentYamlConfigPath } from '@/common/paths';
import codeManager, { paramErrorWithDetail, codeMessageWithDetail } from '@/common/code-manager';

const readFileAsync = promisify<string, { encoding: string }, string>(fse.readFile);

export default async (ctx: KoaContext) => {
  let { folderName } = ctx.query;

  folderName = _.trim(folderName as string);
  if (!folderName) {
    ctx.body = paramErrorWithDetail('folderName');
    return;
  }

  try {
    const yamlData = await readFileAsync(getComponentYamlConfigPath(folderName), { encoding: 'utf-8' });
    const config = yaml.load(yamlData);

    if (!_.isPlainObject(config)) {
      ctx.body = paramErrorWithDetail('组件配置文件格式错误');
      return;
    }

    ctx.body = {
      ...codeManager.success,
      data: config,
    };
  } catch (e) {
    logger.error({
      event: 'component-config',
      msg: e.message,
      desc: `folderName[${folderName}]`,
      stack: e.stack,
    });
    ctx.body = codeMessageWithDetail(codeManager.getComponentConfigError, e.message);
  }
};
