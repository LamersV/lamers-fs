import { FileError } from "../../utils/exceptions";
import { basename, dirname, join } from "path";
import { cleanString } from "@lamersv/clean";
import { exists, readDir } from "../read";
import { copyFile } from "fs/promises";
import { makeDir } from "../write";
import { existsSync } from "fs";
import { lstat } from "../stat";

interface CopyOptions {
  ignore?: {
    folders: (string | RegExp)[];
    files?: (string | RegExp)[];
    extensions?: string[];
    depth?: number;
  }
}

export const copy = async (oldPath: string, newPath: string, options?: CopyOptions) => {
  const resolvedOptions: Required<CopyOptions> = {
    ignore: {
      folders: options?.ignore?.folders ?? [],
      files: options?.ignore?.files ?? [],
      extensions: options?.ignore?.extensions ?? [],
      depth: options?.ignore?.depth ?? 1,
    }
  };

  await recursiveCopy(oldPath, newPath, 0, resolvedOptions);
};

const recursiveCopy = async (source: string, destination: string, depth: number, options: Required<CopyOptions>): Promise<void> => {
  try {
    if (!exists(source)) {
      throw new FileError('Arquivo não encontrado', {
        code: 'ENOENT',
        data: { path: source },
      });
    }

    const stat = lstat(source);
    if (!stat) {
      throw new FileError('Arquivo não encontrado', {
        code: 'ENOENT',
        data: { path: source },
      });
    }

    if (stat.isFile()) {
      const fileName = basename(source);

      const shouldIgnore = someMatch(options.ignore?.files ?? [], fileName);
      if (shouldIgnore) return;

      if (options.ignore?.extensions) {
        const ext = fileName.split('.').pop();
        if (ext && someMatch(options.ignore.extensions, ext)) return;
      }

      const dir = dirname(destination);

      if (!existsSync(dir)) await makeDir(dir);
      await copyFile(source, destination);

      return;
    }

    if (stat.isDirectory()) {
      const folderName = basename(source);

      const shouldIgnore = someMatch(options.ignore?.folders ?? [], folderName) && depth <= options.ignore?.depth!;

      if (shouldIgnore) return;

      if (!existsSync(destination)) await makeDir(destination);

      const entries = await readDir(source);
      for (const entry of entries) {
        const nextSource = join(source, entry);
        const nextDestination = join(destination, entry);

        await recursiveCopy(nextSource, nextDestination, depth + 1, options);
      }

      return;
    }

    throw new FileError('Tipo de arquivo inválido', {
      code: 'EINVALIDTYPE',
      data: { path: source },
    });
  }
  catch (err: any) {
    throw new FileError(err, {
      code: err.code,
      data: { ...err.data, oldPath: source, newPath: destination },
    });
  }
};

//* UTILS

const someMatch = (array: (string | RegExp)[], value: string): boolean => {
  return array.some(pattern => {
    const normalizedValue = normalizeString(value);

    if (typeof pattern === "string") {
      return normalizedValue === normalizeString(pattern);
    }
    return pattern.test(normalizedValue);
  });
}

const normalizeString = (value: string): string => {
  return cleanString(value, {
    case: 'lower',
    removeSpecial: true,
    removeJoiners: true,
    trim: true,
  });
}