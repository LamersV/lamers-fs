import path from "path";

export const handleEBUSY = (error: Error): string => {
  const { path: errPath } = error as any;
  if (!errPath) return 'Arquivo está sendo usado por outro processo';

  const file = path.basename(errPath);
  const isDir = path.extname(file) === '';

  return `${isDir ? 'Diretório' : 'Arquivo'} "${file}" está sendo usado por outro processo`;
}