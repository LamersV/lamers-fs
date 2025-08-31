import { FileSystemErrorMap } from "./types";
import { handleEBUSY } from "./utils/ebusy";
import { withPath } from "./utils/path";

export const FS_ERROR: FileSystemErrorMap = {
  EACCES: (e) => withPath('Permissão negada', e),
  EBADF: 'Descritor de arquivo inválido',
  EBUSY: (e) => handleEBUSY(e),
  ECONNREFUSED: 'Conexão recusada',
  EEXIST: (e) => withPath('Arquivo ou diretório já existe', e),
  EFAULT: 'Endereço inválido',
  EINVALIDTYPE: (e) => withPath('Tipo de arquivo inválido', e),
  EIO: 'Erro de E/S',
  EISDIR: (e) => withPath('Esperava um arquivo, mas encontrou um diretório', e),
  ELOOP: 'Loop simbólico',
  EMFILE: 'Muitos arquivos abertos',
  ENAMETOOLONG: (e) => withPath('Nome do arquivo muito longo', e),
  ENOENT: (e) => withPath('Arquivo ou diretório não encontrado', e),
  ENODEV: 'Dispositivo inexistente',
  ENOLINK: 'Link rompido',
  ENOSPC: 'Espaço em disco insuficiente',
  ENOTCONN: 'Socket não está conectado',
  ENOTDIR: (e) => withPath('Esperava um diretório, mas encontrou algo diferente', e),
  ENOTEMPTY: (e) => withPath('Diretório não está vazio', e),
  EPERM: (e) => withPath('Operação não permitida', e),
  EROFS: (e) => withPath('Sistema de arquivos é somente leitura', e),
  ERR_INVALID_ARG_TYPE: 'Tipo de argumento inválido',
  ETXTBSY: 'Arquivo de texto está ocupado',
  EUNKNOWN: 'Erro desconhecido',
  EXDEV: 'Link cruzado entre dispositivos',
};
