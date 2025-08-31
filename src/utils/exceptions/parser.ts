import { CustomError, ExceptionError } from '@lamersv/error';
import { CustomErrorProperties } from '@lamersv/error/types';
import { parseError, parseString } from './utils/parser';
import { ErrorParserProperties } from './types';

class FileSystemErrorParser {
  resolve(error: Error | string, options: CustomErrorProperties, prefix: 'DIRECTORY' | 'FILE') {
    if (error instanceof CustomError) return error as ExceptionError;

    return fileSystemErrorParser.parse(error, {
      code: options.code || "EUNKNOWN",
      prefix,
    }) as ExceptionError;
  }

  private parse(error: Error | string, options: ErrorParserProperties) {
    return typeof error === 'string'
      ? parseString(error, options)
      : parseError(error, options.prefix);
  }
}

export const fileSystemErrorParser = new FileSystemErrorParser();