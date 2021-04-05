import Router from 'koa-router';

import compileComponent from '@/controllers/inner/compile-component';

const router = new Router();

// 获取组件配置
// router.get('/component/config', getComponentConfig)

// 编译组件
router.post('/component/compile', compileComponent);

// 编译页面
// router.post('/page/compile', compilerPage)

// 生成 html 文件
// router.post('/html/render', renderHtml)

export default router;
