import _ from 'lodash';
import fse from 'fs-extra';
import yaml from 'js-yaml';
import { promisify } from 'util';

import * as rollup from 'rollup';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import rollupYaml from '@rollup/plugin-yaml';
import replace from '@rollup/plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

import {
  getComponentEntry,
  getComponentYamlConfigPath,
  tsconfigPath,
  commonPath,
} from '@/common/paths';
import { logger } from '@/common/logger';
import { KoaContext } from '@/interfaces/koa-context';
import codeManager, { codeMessageWithDetail, paramErrorWithDetail } from '@/common/code-manager';

const readFileAsync = promisify<string, { encoding: string }, string>(fse.readFile);

export default async (ctx: KoaContext) => {
  const { folderName, base = false, globalVariables } = ctx.request.body;
  if (!folderName) {
    ctx.body = paramErrorWithDetail('folderName');
    return;
  }
  if (!_.isPlainObject(globalVariables)) {
    ctx.body = paramErrorWithDetail('globalVariables');
    return;
  }
  let config: any;
  try {
    const yamlData = await readFileAsync(getComponentYamlConfigPath(folderName), { encoding: 'utf-8' });
    config = yaml.load(yamlData);
    if (!_.isPlainObject(config)) {
      ctx.body = paramErrorWithDetail('组件配置文件格式错误');
      return;
    }
  } catch (e) {
    logger.error({
      event: 'component-config',
      msg: e.message,
      desc: `folderName[${folderName}]`,
      stack: e.stack,
    });
    ctx.body = codeMessageWithDetail(codeManager.getComponentConfigError, e.message);
  }

  const entry = getComponentEntry(folderName);
  const library = base ? '_mango_base' : `_mango_component_${_.get(config, 'metaType')}`;

  const defaultInputOptions = {
    input: entry,
    external: ['react', 'react-dom', 'lodash', '@base'],
  };
  const plugins = [
    babel({
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-env',
      ],
    }),
    typescript({
      tsconfig: tsconfigPath,
    }),
    postcss({
      autoModules: true,
      extensions: ['.css', '.scss'],
      plugins: [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
        require('postcss-px-to-viewport')({
          viewportWidth: 750, // 设计稿宽度
          viewportHeight: 1334, // 设计稿高度，可以不指定
          unitPrecision: 3, // px to vw无法整除时，保留几位小数
          viewportUnit: 'vw', // 转换成vw单位
          selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
          minPixelValue: 1, // 小于1px不转换
          mediaQuery: false, // 允许媒体查询中转换
        }),
        require('postcss-normalize')(),
      ],
    }),
    resolve(),
    commonjs(),
    uglify(),
    json(),
    rollupYaml(),
  ];

  const developmentInputOptions = {
    ...defaultInputOptions,
    plugins: [
      ...plugins,
      replace({
        preventAssignment: true,
        __EDIT__: true,
        ...globalVariables,
        __STATIC_COMMON_PATH__: JSON.stringify(commonPath),
      }),
    ],
  };
  const productionInputOptions = {
    ...defaultInputOptions,
    plugins: [
      ...plugins,
      replace({
        preventAssignment: true,
        __EDIT__: false,
        ...globalVariables,
        __STATIC_COMMON_PATH__: JSON.stringify(commonPath),
      }),
    ],
  };
  const outputOptions: any = {
    name: 'video',
    // file: outputPath,
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      lodash: '_',
      '@base': '@base',
    },
  };

  try {
    const generate = async (options) => {
      const bundle = await rollup.rollup(options);

      // generate code and a sourcemap
      const { output } = await bundle.generate(outputOptions);

      return output[0].code;
    };

    const [development, production] = await Promise.all([
      generate(developmentInputOptions),
      generate(productionInputOptions),
    ]);
    ctx.body = {
      ...codeManager.success,
      data: {
        library,
        content: _.zipObject(['development', 'production'], [development, production]),
      },
    };
  } catch (e) {
    const message = typeof e === 'string' ? e : e.message;
    logger.error({
      event: 'compile-component',
      msg: message,
      desc: `folderName[${folderName}]`,
      stack: e.stack,
    });
    ctx.body = codeMessageWithDetail(codeManager.compileComponentError, message);
  }
};
