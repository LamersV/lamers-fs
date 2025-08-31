import * as crypto from "crypto";

export const md5 = (text: string): string => {
  const hash = crypto.createHash("md5");
  hash.update(text);

  return hash.digest("hex");
}