import path from 'path';

import { staticPublic, componentsProjectPath, tempPath } from '../config'; // componentsProjectPath

// 要求组件必须在项目 src/components 目录下
const componentsFolder = 'src/components';

export const commonPath = `${staticPublic}`; // TODO: react-v16.13.1-common/

// 组件项目的 tsconfig 位置
export const tsconfigPath = path.join(componentsProjectPath, 'tsconfig.json');
// component src
export const componentSrc = path.resolve(componentsProjectPath, 'src');
// 组件配置文件
export const getComponentYamlConfigPath = (folderName: string) => path.join(componentsProjectPath, componentsFolder, folderName, 'config.yaml');
// 组件入口文件
export const getComponentEntry = (folderName: string) => path.join(componentsProjectPath, componentsFolder, folderName, 'index.tsx');
// 组件输出路径
// export const getComponentOutputPath = (folderName: string) => (
//   path.join(tempPath, 'build/components', folderName, 'index.js')
// );

// 页面 js 临时文件入口
export const getPageEntry = (tenantID: number, pageID: number, fileName: string) => (
  path.join(tempPath, `pages/${tenantID}/${pageID}/${fileName}`)
);
// 页面 js 临时文件输出路径
export const getPageOutputPath = (tenantID: number, pageID: number) => (
  path.join(tempPath, `build/pages/${tenantID}/${pageID}`)
);
