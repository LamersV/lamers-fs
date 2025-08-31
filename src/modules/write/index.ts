import { DirectoryError, FileError } from "../../utils/exceptions";
import { symlink, writeFile, mkdir } from "fs/promises";
import { existsSync, MakeDirectoryOptions } from "fs";
import { MakeFileOptions } from "./types";

export const makeFile = async (path: string, data: string | Buffer, options?: MakeFileOptions): Promise<void> => {
  try {
    if (existsSync(path) && !options?.overwrite) return;
    await writeFile(path, data, options?.encoding);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const makeDir = async (path: string, options?: MakeDirectoryOptions): Promise<void> => {
  try {
    if (existsSync(path)) return;

    await mkdir(path, options)
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const makeLink = async (target: string, path: string): Promise<void> => {
  try {
    if (!existsSync(target)) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path: target },
    });

    await symlink(target, path);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, target, path },
    });
  }
}