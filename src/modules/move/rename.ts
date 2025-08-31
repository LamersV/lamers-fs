import { FileError } from "../../utils/exceptions";
import { rename as fsRename } from "fs/promises";
import { makeDir } from "../write";
import { existsSync } from "fs";
import { dirname } from "path";

export const rename = async (oldPath: string, newPath: string) => {
  try {
    if (!existsSync(oldPath)) throw new FileError('Arquivo não encontrado', {
      code: "ENOENT",
      data: { path: oldPath },
    });

    const folderName = dirname(newPath);
    if (!existsSync(folderName)) await makeDir(folderName);

    await fsRename(oldPath, newPath);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code,
      data: { ...error.data, oldPath, newPath },
    });
  }
}