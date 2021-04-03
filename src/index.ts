import app from './server';

import { isProduction } from './config';

async function run() {
  // TODO: 全链路监控

  // 端口
  const port = Number(process.env.PORT) || 3000;
  // 服务启动
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    if (process.send) {
      setTimeout(() => {
        process.send!('ready');
      }, 3000);
    }
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      console.log(sig);
      server.close(() => process.exit());
    })
  })
}

run();
