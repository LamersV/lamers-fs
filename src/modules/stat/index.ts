import { BigIntStats, existsSync, lstatSync, StatFsOptions, Stats, statSync } from "fs";
import { DirectoryError, FileError } from "../../utils/exceptions";
import { readDir } from "../read";

export const stat = (path: string, options?: StatFsOptions): Stats | BigIntStats | undefined => {
  try {
    if (!existsSync(path)) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return statSync(path, options);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const lstat = (path: string, options?: StatFsOptions): Stats | BigIntStats | undefined => {
  try {
    if (!existsSync(path)) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return lstatSync(path, options);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const isDirectory = (path: string): boolean => {
  try {
    if (!existsSync(path)) throw new DirectoryError("Diretório não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    const stats = lstat(path);
    if (!stats) throw new DirectoryError("Diretório não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return stats.isDirectory();
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const isFile = (path: string): boolean => {
  try {
    if (!existsSync(path)) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    const stats = lstat(path);
    if (!stats) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return stats.isFile();
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const isDirectoryEmpty = async (path: string): Promise<boolean> => {
  try {
    if (!isDirectory(path)) throw new DirectoryError("O caminho não é um diretório", {
      code: "ENOTDIR",
      data: { path },
    });

    const files = await readDir(path);
    return files.length === 0;
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}