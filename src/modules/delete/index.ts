import { DirectoryError, FileError } from "../../utils/exceptions";
import { existsSync, RmOptions } from "fs";
import { isDirectoryEmpty } from "../stat";
import { rm, rmdir } from "fs/promises";

export const deleteDir = async (path: string, options?: RmOptions): Promise<void> => {
  try {
    if (!existsSync(path)) throw new DirectoryError("Diretório não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    const isEmpty = await isDirectoryEmpty(path);
    if (!isEmpty && !options?.recursive) throw new DirectoryError("Diretório não está vazio", {
      code: "ENOTEMPTY",
      data: { path },
    });

    await rmdir(path, options);
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code,
      data: { ...error.data, path },
    });
  }
}

export const deleteFile = async (path: string): Promise<void> => {
  try {
    if (!existsSync(path)) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    await rm(path);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code,
      data: { ...error.data, path },
    });
  }
}