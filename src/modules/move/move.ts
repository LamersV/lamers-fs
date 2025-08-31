import { FileError } from "../../utils/exceptions";
import { basename, dirname, join } from "path";
import { deleteDir } from "../delete";
import { makeDir } from "../write";
import { readDir } from "../read";
import { rename } from "./rename";
import { existsSync } from "fs";
import { lstat } from "../stat";

export const move = async (oldPath: string, newPath: string) => {
  try {
    if (!existsSync(oldPath)) throw new FileError('Diretório não encontrado', {
      code: "ENOENT",
      data: { path: oldPath },
    });

    const stat = lstat(oldPath);
    if (!stat) throw new FileError('Diretório não encontrado', {
      code: "ENOENT",
      data: { path: oldPath },
    });

    if (stat.isFile()) {
      const folderName = dirname(newPath);

      await makeDir(folderName, { recursive: true });

      if (existsSync(newPath)) {
        const folderPath = dirname(newPath);
        const fileName = basename(newPath);

        const antigoPath = join(folderPath, 'antigo');
        if (!existsSync(antigoPath)) await makeDir(antigoPath, { recursive: true });

        const antigoFilePath = join(antigoPath, fileName);

        await rename(newPath, antigoFilePath);
      }

      await rename(oldPath, newPath);
    }
    else if (stat.isDirectory()) {
      if (!existsSync(newPath)) await makeDir(newPath, { recursive: true });

      const files = await readDir(oldPath);

      for (const file of files) {
        const oldFilePath = join(oldPath, file);
        const newFilePath = join(newPath, file);

        await move(oldFilePath, newFilePath);
      }

      await deleteDir(oldPath, { recursive: true });
    }
    else {
      throw new FileError('Tipo de arquivo inválido', {
        code: "EINVALIDTYPE",
        data: { path: oldPath },
      });
    };
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code,
      data: { ...error.data, oldPath, newPath },
    });
  }
};