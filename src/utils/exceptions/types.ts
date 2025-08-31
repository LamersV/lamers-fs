import { CustomErrorProperties } from "@lamersv/error/types";

export interface ErrorParserProperties extends CustomErrorProperties {
  prefix: 'DIRECTORY' | 'FILE';
}

export type FSErrorCode =
  | 'EACCES' | 'EBADF' | 'EBUSY' | 'ECONNREFUSED' | 'EEXIST' | 'EFAULT'
  | 'EINVALIDTYPE' | 'EIO' | 'EISDIR' | 'ELOOP' | 'EMFILE' | 'ENAMETOOLONG'
  | 'ENOENT' | 'ENODEV' | 'ENOLINK' | 'ENOSPC' | 'ENOTCONN' | 'ENOTDIR'
  | 'ENOTEMPTY' | 'EPERM' | 'EROFS' | 'ERR_INVALID_ARG_TYPE'
  | 'ETXTBSY' | 'EUNKNOWN' | 'EXDEV';

export type FSErrorMessage = string | ((error: Error) => string);

export type FileSystemErrorMap = Record<FSErrorCode, FSErrorMessage>;