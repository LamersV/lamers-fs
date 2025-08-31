# @lamersv/fs

Este pacote fornece utilitários de sistema de arquivos em TypeScript para criação e escrita de arquivos, links e diretórios, leitura e verificação de paths, movimentação e renomeação, remoção segura e obtenção de metadados. Também expõe utilidades de apoio para detecção de MIME e extensão, sanitização de nomes, validações e hash MD5, além de classes de erro padronizadas para arquivos e diretórios. A API foi pensada para chamadas simples e diretas em scripts e aplicações Node.js, com retornos previsíveis e tratamento de erros consistente.

Repositório: https://github.com/LamersV/lamers-fs  
Homepage: https://github.com/LamersV/lamers-fs#readme  
Versão: 1.0.0

## Instalação

O pacote é publicado no GitHub Packages sob o escopo `@lamersv`. É necessário configurar um token de acesso com permissão de leitura de packages e incluir a autenticação no `.npmrc` do seu projeto apontando para o registro do GitHub.

```
@lamersv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Após configurar, instale com o gerenciador de sua preferência.

```
npm install @lamersv/fs
```

```
yarn add @lamersv/fs
```

```
pnpm add @lamersv/fs
```

## Uso básico

A importação principal reexporta os módulos de alto nível. Também é possível importar utilidades diretamente do subcaminho `"@lamersv/fs/utils"` quando desejar usar somente funções auxiliares e classes de erro.

```ts
import {
  // escrita
  makeDir, makeFile, makeLink,
  // leitura
  exists, existsSync, readDir, readDirTyped, readFile, readPath,
  // movimentação
  rename, copy, move,
  // remoção
  deleteFile, deleteDir,
  // caminhos e stat
  realPath, stat, lstat, isDirectory, isFile, isDirectoryEmpty,
} from '@lamersv/fs';

import {
  FileError, DirectoryError,
  // utils
  md5, sanitize,
  isPath, isFilename, isExtension,
  extensionFromPath, extensionFromBuffer,
  mimeFromFile, extensionFromMime,
} from '@lamersv/fs/utils';

async function exemplo() {
  await makeDir('out/logs');                               // cria diretório (recursivo)
  await makeFile('out/logs/app.txt', 'Olá mundo');         // cria/escreve arquivo
  await makeLink('out/logs/app.lnk', 'out/logs/app.txt');  // cria symlink

  const ok = await exists('out/logs/app.txt');             // verificação assíncrona
  const oks = existsSync('out/logs/app.txt');              // verificação síncrona

  const itens = await readDir('out/logs');                 // retorna string[]
  const itensTipados = await readDirTyped('out/logs');     // retorna Dirent[]
  const buf = await readFile('out/logs/app.txt');          // Buffer por padrão
  const real = await readPath('out/logs/app.txt');         // realpath assíncrono
  const realSync = realPath('out/logs/app.txt');           // realpath síncrono

  const s = stat('out/logs/app.txt');                      // fs.statSync com tratamento
  const ls = lstat('out/logs/app.lnk');                    // fs.lstatSync
  const ehDir = isDirectory('out/logs');
  const ehArq = isFile('out/logs/app.txt');
  const vazio = await isDirectoryEmpty('out/logs');

  await rename('out/logs/app.txt', 'out/logs/arquivo.txt');
  await copy('out', 'backup/out');                         // copia recursiva
  await move('backup/out', 'backup/out-final');            // move diretórios/arquivos

  await deleteFile('out/logs/arquivo.txt');
  await deleteDir('out', { recursive: true });             // remove recursivamente
}
```

## Exemplos práticos

A função `makeFile` aceita a interface `MakeFileOptions` com controle de encoding e sobrescrita. Se o destino já existir e `overwrite` não for definido, a chamada não reescreve o conteúdo.

```ts
import { makeFile } from '@lamersv/fs';

await makeFile('out/report.txt', 'conteúdo', { encoding: 'utf-8', overwrite: true });
```

A cópia suporta filtros de exclusão por pasta, arquivo, extensão e profundidade. Os filtros aceitam `string` ou `RegExp` e permitem limitar a recursão.

```ts
import { copy } from '@lamersv/fs';

await copy('apps/site', 'dist/site', {
  ignore: {
    folders: ['node_modules', /^\.git$/],
    files: [/\.map$/, 'README.md'],
    extensions: ['log', 'tmp'],
    depth: 3,
  },
});
```

A leitura de diretório pode ser feita como lista de nomes ou com metadados do Node (`Dirent`) quando você precisa diferenciar arquivos e pastas.

```ts
import { readDir, readDirTyped } from '@lamersv/fs';

const nomes = await readDir('inputs');
const entradas = await readDirTyped('inputs');
for (const e of entradas) {
  console.log(e.name, e.isDirectory() ? 'dir' : 'file');
}
```

Os utilitários de validação e sanitização ajudam a garantir nomes seguros e formatos corretos. A detecção de MIME considera a extensão e pode converter MIME em extensão. A inferência de extensão por buffer analisa assinaturas comuns como JPG, PNG, GIF, PDF, ZIP e subtipos OOXML (docx, xlsx, pptx) quando aplicável.

```ts
import {
  isPath, isFilename, isExtension, sanitize,
  extensionFromPath, extensionFromBuffer,
  mimeFromFile, extensionFromMime,
  md5,
} from '@lamersv/fs/utils';

isPath('/var/data/x.txt');       // true em caminhos plausíveis
isFilename('relatorio final');   // true para nomes válidos sem separadores
isExtension('.pdf');             // true

sanitize('*** relatório?.pdf '); // 'relatório.pdf'

extensionFromPath('/var/www/logo.SVG');   // 'svg'
mimeFromFile('planilha.xlsx');            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
extensionFromMime('image/png');           // 'png'

// exemplo com buffer de arquivo
const ext = extensionFromBuffer(Buffer.from([0xFF,0xD8,0xFF])); // 'jpg' para assinatura JPEG

md5('senha'); // '5f4dcc3b5aa765d61d8327deb882cf99'
```

O tratamento de erros utiliza `FileError` e `DirectoryError`, classes que padronizam `code` e `userMessage` baseadas no erro do sistema. Em blocos try/catch, você pode inspecionar `code` e informações auxiliares em `data`.

```ts
import { deleteDir } from '@lamersv/fs';
import { FileError, DirectoryError } from '@lamersv/fs/utils';

try {
  await deleteDir('/caminho/sem/permissao');
} catch (err) {
  if (err instanceof DirectoryError || err instanceof FileError) {
    console.error(err.code, err.userMessage \?\? err.message);
  } else {
    console.error('Erro inesperado', err);
  }
}
```

## API rápida

Escrita expõe `makeDir`, `makeFile` e `makeLink`. `makeDir` cria diretórios de forma recursiva utilizando opções compatíveis com `fs.mkdir`. `makeFile` escreve arquivo com suporte a `encoding` e `overwrite`, seguindo a interface `MakeFileOptions`. `makeLink` cria symlink para um alvo existente. Leitura expõe `exists` (assíncrono) e `existsSync` (síncrono) para verificação de caminho, além de `readDir` com retorno de `string[]`, `readDirTyped` com retorno de `Dirent[]`, `readFile` que retorna `Buffer` por padrão e `readPath` para `realpath` assíncrono. Caminhos expõem `realPath` como versão síncrona de `realpath`. Estatísticas expõem `stat` e `lstat` síncronos e auxiliares `isDirectory`, `isFile` e `isDirectoryEmpty`. Movimentação expõe `rename` para renomear, `copy` para cópia com filtros e `move` para mover arquivos ou diretórios preservando estrutura. Remoção expõe `deleteFile` e `deleteDir`, com suporte a remoção recursiva em diretórios quando indicado nas opções.

A interface de opções de arquivo é a seguir.

```ts
export interface MakeFileOptions {
  encoding?: BufferEncoding | null;
  overwrite?: boolean;
}
```

As utilidades expostas em `@lamersv/fs/utils` incluem `FileError` e `DirectoryError` para padronização de erros, `md5` para hash de texto, `sanitize` para nomes de arquivos seguros, validadores `isPath`, `isFilename`, `isExtension`, funções de extensão `extensionFromPath` e `extensionFromBuffer` e funções de MIME `mimeFromFile` e `extensionFromMime`.

## Mapa de exports

O pacote define exports para o módulo principal e para o subcaminho de utilidades conforme a configuração a seguir.

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.js",
      "default": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.js",
      "require": "./dist/utils/index.js",
      "default": "./dist/utils/index.js",
      "types": "./dist/utils/index.d.ts"
    }
  }
}
```

Isso permite importar todas as operações de alto nível diretamente da raiz do pacote e, quando necessário, importar apenas as utilidades do subcaminho `./utils`.

## Licença

MIT. Consulte o arquivo de licença no repositório oficial.
