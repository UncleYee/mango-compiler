export interface CodeMessage {
  code: number
  message: string
}

interface CodeManager {
  [propName: string]: CodeMessage
}

const codeManager: CodeManager = {
  systemError: {
    code: -1000,
    message: '系统错误',
  },
  dbError: {
    code: -1001,
    message: '数据库异常',
  },

  success: {
    code: 0,
    message: '成功',
  },

  unknownError: {
    code: 1002,
    message: '未知错误',
  },
  paramError: {
    code: 1003,
    message: '参数错误',
  },
  signatureError: {
    code: 1004,
    message: '验签错误',
  },
  noAccessRight: {
    code: 1007,
    message: '没有访问权限',
  },
  requestLogin: {
    code: 1024,
    message: '请登录',
  },

  // html
  htmlTmplNotSupport: {
    code: 2001,
    message: 'html模板文件不支持',
  },

  // compile page
  compilePageError: {
    code: 3001,
    message: '编译异常',
  },

  // compile component
  compileComponentError: {
    code: 4001,
    message: '编译异常',
  },
  getComponentConfigError: {
    code: 4002,
    message: '获取组件配置异常',
  },
};

export function codeMessageWithDetail(codeMessage: CodeMessage, detail: string): CodeMessage {
  if (!detail) {
    return codeMessage;
  }
  return { ...codeMessage, message: `${codeMessage.message}, ${detail}` };
}

export function paramErrorWithDetail(detail: string): CodeMessage {
  return codeMessageWithDetail(codeManager.paramError, detail);
}

export default codeManager;
