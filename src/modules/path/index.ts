import { FileError } from "../../utils/exceptions";
import { realpathSync } from "fs"

export const realPath = (path: string): string => {
  try {
    return realpathSync(path);
  }
  catch (error) {
    throw new FileError(error, {
      code: error.code || "EUNKNOWN",
      data: { ...error.data, path },
    });
  }
}