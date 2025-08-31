import { FSErrorCode, ErrorParserProperties } from "../types";
import { FS_ERROR } from "../constants";

export function parseError(error: Error, prefix: 'DIRECTORY' | 'FILE' = 'FILE') {
  const code = error.code as FSErrorCode || "EUNKNOWN";

  const handler = FS_ERROR?.[code];
  const userMessage = typeof handler === 'function'
    ? handler(error)
    : handler || FS_ERROR?.["EUNKNOWN"];

  const parsedCode = code.startsWith(prefix) ? code : `${prefix}_${code}`;

  return {
    code: parsedCode,
    message: error.message,
    userMessage: userMessage,
  }
}

export function parseString(message: string, options: ErrorParserProperties) {
  const code = options.code || "EUNKNOWN";
  const prefix = options.prefix || 'FILE';

  const parsedCode = code.startsWith(prefix) ? code : `${prefix}_${code}`;

  return {
    code: parsedCode,
    message,
    userMessage: options.userMessage,
    data: options.data,
  }
}