import path from 'path';

const env = process.env.NODE_ENV || 'development';

export const isProduction: boolean = env === 'production';

export const isLocal = process.env.APP_LOCAL === 'true';

// tempPath 编译可视化页面文件临时存放位置
export const tempPath = path.resolve(process.cwd(), 'temp');

// 静态资源url
export const staticPublic = isProduction ? 'TODO' : 'TODO';

// componentsProjectPath mango-components项目目录，组件必须在项目src/components目录下，需要使用项目node_modules
export const componentsProjectPath = process.env.APP_COMPONENTS_PROJECT_PATH || (
  isProduction
    ? '' // TODO: /data/web/mango-components
    : (isLocal ? '/Users/uncle_ye/work/mango/mango-components/' : '/data/web/mango-components/')
);
