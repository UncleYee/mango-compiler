import _ from 'lodash';
import path from 'path';
import fse from 'fs-extra';
import { promisify } from 'util';

import * as rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';

import { logger } from '@/common/logger';
import { hashString } from '@/common/utils';
import { KoaContext } from '@/interfaces/koa-context';
import { getPageEntry, getPageOutputPath } from '@/common/paths';
import codeManager, { paramErrorWithDetail, codeMessageWithDetail } from '@/common/code-manager';

const outputFileAsync = promisify<string, any>(
  fse.outputFile as (file: string, data: any, callback: (err: Error) => void) => void,
);
const removeAsync = promisify(fse.remove);

export default async (ctx: KoaContext) => {
  const { modules } = ctx.request.body;
  let { tenantID, pageID } = ctx.request.body;
  tenantID = +tenantID;
  pageID = +pageID;

  if (tenantID < 0 || pageID < 0) {
    ctx.body = paramErrorWithDetail('tenantID、pageID');
    return;
  }
  if (!(_.isArray(modules) && _.every(modules, (module) => module.id && module.library))) {
    ctx.body = paramErrorWithDetail('modules');
    return;
  }
  const moduleIDs = modules.map((module) => module.id).toString();

  // 临时文件名称
  const filename = `${hashString(moduleIDs).slice(0, 8)}.js`;
  // 临时入口文件
  const entry = getPageEntry(tenantID, pageID, filename);
  // 输出的临时文件夹路径
  const outputPath = getPageOutputPath(tenantID, pageID);
  // 临时输出文件的路径
  const outputFilePath = path.join(outputPath, filename);

  // 动态生成入口文件
  const Modules = `const Modules = [${modules.map((module) => `{ component: window['${module.library}'], id: '${module.id}' }`).join(', ')}]`;
  try {
    // 模板内容
    const templateContent = fse.readFileSync(path.resolve(__dirname, '../../templates/page.jsx'), { encoding: 'utf-8' });
    // 根据模板 生成入口文件
    await outputFileAsync(entry, Modules + templateContent);
    // 编译页面的配置
    const options = {
      input: entry,
      external: ['react', 'react-dom', 'lodash', '@base'],
      plugins: [
        babel({
          exclude: 'node_modules/**',
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
        }),
        // resolve(),
        commonjs(),
        uglify(),
      ],
    };
    // 编译输出的配置
    const outputOptions: any = {
      // file: `${outputPath}/${hashString(moduleIDs).slice(0, 8)}.js`,
      format: 'iife',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        lodash: '_',
        '@base': '@base',
      },
    };
    // 打包过程
    const bundle = await rollup.rollup(options);
    // const res = await bundle.generate(outputOptions);
    const { output } = await bundle.generate(outputOptions);
    const fileContent = output[0].code;

    ctx.body = {
      ...codeManager.success,
      data: fileContent,
    };
  } catch (e) {
    const message = typeof e === 'string' ? e : e.message;
    logger.error({
      event: 'compile-page',
      msg: message,
      desc: 'page compiler failed',
      stack: e.stack,
    });
    ctx.body = codeMessageWithDetail(codeManager.compileComponentError, message);
  } finally {
    // 清理文件 包括临时的入口文件和生成的文件
    const filePaths = [entry, outputFilePath];
    Promise
      .all(filePaths.map((filePath) => removeAsync(filePath)))
      .catch((e) => console.log(`remove files${filePaths.join(';')} error: ${e.message}`));
  }
};
