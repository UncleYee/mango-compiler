import { getLogger, configure, Logger } from 'log4js';

export interface Log {
  event: 'common' | 'redis' | 'mongo' | 'mongoose' | 'request' | 'fetch' | 'mq' | string; // event name
  msg: string; // error message
  desc?: string; // detail
  // request other service
  url?: string;
  method?: string
  options?: {
    [key: string]: any;
  };
  startTime?: number;
  duration?: number;
  statusCode?: number; // http状态码
  errorCode?: number | string; // 返回状态码
  errorMessage?: string;
  response?: string;
  responseBody?: string;

  // 记录向服务请求的相关信息
  request?: string;
  // {
  //   url: string;
  //   method: string;
  //   ip?: string;
  //   userInfo?: string;
  //   body?: string;
  // },
  requestBody?: string;

  stack?: string; // 堆栈信息
}

export interface CustomLogger {
  logger: Logger;
  info: (log: Log) => void;
  warn: (log: Log) => void;
  error: (log: Log) => void;
  debug: (log: Log) => void;
}

configure({
  appenders: {
    console: {
      type: 'console', // 可以设置成 console、file、dateFile三种
    },
    trace: {
      type: 'dateFile',
      encoding: 'utf-8', // 设置文件编码格式
      filename: 'logs/trace', // 设置log输出的文件路径和文件名
      pattern: 'yyyy-MM-dd.log', // 和上面同时使用 设置每天生成log名
      // filename: 'logs/', // 需要手动创建此文件夹
      // pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      maxLogSize: 31457280, // 设置文件大小
    },
    http: {
      type: 'logLevelFilter',
      appender: 'trace',
      level: 'trace', // 设置log输出的最低级别
      maxLevel: 'trace', // 设置log输出的最高级别
      // log级别为8级 ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF。默认级别是 OFF
    },
    info: {
      type: 'dateFile',
      encoding: 'utf-8',
      filename: 'logs/info',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%5p  %z  %c] %m',
      },
      compress: true,
    },
    maxInfo: {
      type: 'logLevelFilter',
      appender: 'info',
      level: 'debug',
      maxLevel: 'error',
    },
    error: {
      type: 'dateFile',
      encoding: 'utf-8',
      filename: 'logs/error',
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%5p  %z  %c] %m',
      },
      compress: true,
    },
    minError: {
      type: 'logLevelFilter',
      appender: 'error',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: [
        'console',
        'http',
        'maxInfo',
        'minError',
      ],
      level: 'all',
    },
  },
});

class MyLogger implements CustomLogger {
  logger: Logger;

  constructor() {
    this.logger = getLogger();
  }

  info(log: Log) {
    this.logger.info(log);
  }

  warn(log: Log) {
    this.logger.warn(log);
  }

  error(log: Log) {
    this.logger.error(log);
  }

  debug(log: Log) {
    this.logger.debug(log);
  }

  trace(msg: string) {
    this.logger.trace(msg);
  }
}

const logger = new MyLogger();
export {
  logger,
};
