export const isPath = (str: string): boolean => {
  if (typeof str !== 'string' || str.trim() === '') return false;

  const unixOrRelative = str.startsWith('/') || str.startsWith('~/');
  const windowsDrive = /^[a-zA-Z]:\\/.test(str);
  const hasSeparator = str.includes('/') || str.includes('\\');

  return unixOrRelative || windowsDrive || hasSeparator;
}

export const isFilename = (str: string): boolean => {
  if (typeof str !== 'string' || str.trim() === '') return false;

  if (str.includes('/') || str.includes('\\')) return false;

  const invalidChars = /[<>:"/\\|?*\x00]/;
  if (invalidChars.test(str)) return false;

  if (/[ .]$/.test(str)) return false;

  return true;
}

export const isExtension = (str: string): boolean => {
  if (typeof str !== 'string' || str.trim() === '') return false;

  if (str.includes('/') || str.includes('\\')) return false;
  if (str.includes('.') && !str.startsWith('.')) return false;

  return /^[.]{0,1}[a-zA-Z0-9]+$/.test(str);
}