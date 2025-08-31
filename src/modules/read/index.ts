import { access, constants, readdir, readFile as fsReadFile, realpath } from "fs/promises";
import { Dirent, ObjectEncodingOptions, existsSync as exsSync } from "fs";
import { DirectoryError, FileError } from "../../utils/exceptions";

export const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.W_OK | constants.R_OK);
    return true;
  }
  catch (error) {
    return false;
  }
}

export const existsSync = (path: string): boolean => {
  try {
    return exsSync(path);
  }
  catch (error) {
    return false;
  }
}

interface ReadDirOptions {
  recursive?: boolean;
  encoding?: BufferEncoding | null | undefined;
}

export const readDir = async (path: string, options?: ReadDirOptions): Promise<string[]> => {
  try {
    if (!await exists(path)) throw new DirectoryError("Caminho não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return await readdir(path, { recursive: options?.recursive || false, encoding: options?.encoding || "utf8" });
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const readDirTyped = async (path: string, options?: ReadDirOptions): Promise<Dirent[]> => {
  try {
    if (!await exists(path)) throw new DirectoryError("Caminho não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return await readdir(path, {
      recursive: options?.recursive || false,
      withFileTypes: true,
      encoding: options?.encoding || "utf8"
    });
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const readFile = async (path: string, options?: ObjectEncodingOptions | BufferEncoding): Promise<Buffer | string> => {
  try {
    if (!await exists(path)) throw new FileError("Arquivo não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return await fsReadFile(path, options);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

export const readPath = async (path: string, options?: ObjectEncodingOptions | BufferEncoding | null): Promise<string> => {
  try {
    if (!await exists(path)) throw new DirectoryError("Caminho não encontrado", {
      code: "ENOENT",
      data: { path },
    });

    return await realpath(path, options);
  }
  catch (error) {
    throw new DirectoryError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}

