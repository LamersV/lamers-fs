import { extensionFromPath } from "../extension";
import { isExtension } from "../validator";
import { MIMETYPES } from "./constants";

export function mimeFromFile(str: string): string | null {
  if (!str || typeof str !== 'string') return null;

  const extension = isExtension(str) ? str.toLowerCase().replace('.', '') : extensionFromPath(str)
  if (!extension) return null;

  const mime = Object.keys(MIMETYPES).find(key => MIMETYPES[key].includes(extension));

  return mime || null;
}

export function extensionFromMime(mime: string): string | null {
  if (!mime || typeof mime !== 'string') return null;

  mime = mime.toLowerCase();
  const extension = MIMETYPES[mime];

  if (extension) return extension[0];
  return null;
}