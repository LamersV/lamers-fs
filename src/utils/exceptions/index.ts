import { CustomError, ExceptionError } from "@lamersv/error";
import { CustomErrorProperties } from "@lamersv/error/types";
import { fileSystemErrorParser } from "./parser";

export * from "./parser";

export class FileError extends CustomError {
  constructor(message: string | Error, options?: CustomErrorProperties) {
    const parsedError = fileSystemErrorParser.resolve(message, options || {}, 'FILE');

    super(parsedError.message, {
      ...options,
      code: parsedError.code,
      userMessage: parsedError.userMessage,
    });
  }
}

export class DirectoryError extends ExceptionError {
  constructor(message: string | Error, options?: CustomErrorProperties) {
    const parsedError = fileSystemErrorParser.resolve(message, options || {}, 'DIRECTORY');

    super(parsedError.message, {
      ...options,
      code: parsedError.code,
      userMessage: parsedError.userMessage,
    });
  }
}