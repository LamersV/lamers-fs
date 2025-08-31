# @lamersv/fs

File‑system utilities for Node.js/TypeScript: create/write files and directories, create links, read paths and metadata, move/rename, safe delete, plus helper utilities for MIME/extension detection, filename sanitization, validations, and MD5 hashing. Errors are normalized with `FileError` and `DirectoryError` for consistent handling in scripts and apps.

## Installation

This package is published under the `@lamersv` scope. Configure GitHub Packages auth in your project `.npmrc`:

```
@lamersv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install with your preferred manager:

```
npm install @lamersv/fs
```

```
yarn add @lamersv/fs
```

```
pnpm add @lamersv/fs
```

## Quick start

The main entry exports high‑level FS operations. You can also import helper utilities and error classes from the `@lamersv/fs/utils` subpath.

```ts
import {
  // write
  makeDir, makeFile, makeLink,
  // read
  exists, existsSync, readDir, readDirTyped, readFile, readPath,
  // move
  rename, copy, move,
  // remove
  deleteFile, deleteDir,
  // paths & stat
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

async function demo() {
  await makeDir('out/logs');                               // create directory (recursive)
  await makeFile('out/logs/app.txt', 'Hello world');       // create/write file
  await makeLink('out/logs/app.lnk', 'out/logs/app.txt');  // create symlink

  const ok = await exists('out/logs/app.txt');             // async check
  const oks = existsSync('out/logs/app.txt');              // sync check

  const names = await readDir('out/logs');                 // string[]
  const entries = await readDirTyped('out/logs');          // Dirent[]
  const buf = await readFile('out/logs/app.txt');          // Buffer by default
  const real = await readPath('out/logs/app.txt');         // async realpath
  const realSync = realPath('out/logs/app.txt');           // sync realpath

  const s = stat('out/logs/app.txt');                      // fs.statSync with guards
  const ls = lstat('out/logs/app.lnk');                    // fs.lstatSync
  const isDir = isDirectory('out/logs');
  const isFil = isFile('out/logs/app.txt');
  const empty = await isDirectoryEmpty('out/logs');

  await rename('out/logs/app.txt', 'out/logs/file.txt');
  await copy('out', 'backup/out');                         // recursive copy
  await move('backup/out', 'backup/out-final');            // move directories/files

  await deleteFile('out/logs/file.txt');
  await deleteDir('out', { recursive: true });             // remove recursively
}
```

## Practical examples

`makeFile` accepts `MakeFileOptions` with encoding and overwrite control. If the target already exists and `overwrite` is not set, the file is not rewritten.

```ts
import { makeFile } from '@lamersv/fs';

await makeFile('out/report.txt', 'content', { encoding: 'utf-8', overwrite: true });
```

Copy with ignore filters for folders, files, extensions and recursion depth. Filters accept either exact `string` or `RegExp`.

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

List a directory as names or as `Dirent[]` when you need to distinguish between files and folders.

```ts
import { readDir, readDirTyped } from '@lamersv/fs';

const names = await readDir('inputs');
const dirents = await readDirTyped('inputs');
for (const e of dirents) {
  console.log(e.name, e.isDirectory() ? 'dir' : 'file');
}
```

Validation and sanitization helpers ensure safe filenames and formats. MIME detection maps extensions to MIME, and you can also map MIME back to an extension. Buffer‑based extension inference looks at common signatures like JPG, PNG, GIF, PDF, ZIP and OOXML subtypes (docx, xlsx, pptx) when applicable.

```ts
import {
  isPath, isFilename, isExtension, sanitize,
  extensionFromPath, extensionFromBuffer,
  mimeFromFile, extensionFromMime,
  md5,
} from '@lamersv/fs/utils';

isPath('/var/data/x.txt');       // true for plausible paths
isFilename('final report');      // true for valid names (no path separators)
isExtension('.pdf');             // true

sanitize('*** report?.pdf ');    // 'report.pdf'

extensionFromPath('/var/www/logo.SVG');   // 'svg'
mimeFromFile('sheet.xlsx');               // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
extensionFromMime('image/png');           // 'png'

// buffer example
const ext = extensionFromBuffer(Buffer.from([0xFF,0xD8,0xFF])); // 'jpg' for JPEG signatures

md5('password'); // '5f4dcc3b5aa765d61d8327deb882cf99'
```

## Error handling

Operations throw `FileError` or `DirectoryError` with normalized `code` and optional `userMessage`. Inspect them in your `try/catch` blocks.

```ts
import { deleteDir } from '@lamersv/fs';
import { FileError, DirectoryError } from '@lamersv/fs/utils';

try {
  await deleteDir('/restricted/path');
} catch (err) {
  if (err instanceof DirectoryError || err instanceof FileError) {
    console.error(err.code, err.userMessage ?? err.message);
  } else {
    console.error('Unexpected error', err);
  }
}
```

## Quick API

Write: `makeDir`, `makeFile`, `makeLink`.  
Read: `exists` (async), `existsSync` (sync), `readDir` (string[]), `readDirTyped` (Dirent[]), `readFile` (Buffer by default), `readPath` (async realpath).  
Paths: `realPath` (sync realpath).  
Stats: `stat`, `lstat` (sync), `isDirectory`, `isFile`, `isDirectoryEmpty`.  
Move/Rename: `rename`, `copy` (with ignore filters), `move`.  
Remove: `deleteFile`, `deleteDir` (supports recursive deletion).

`MakeFileOptions`:

```ts
export interface MakeFileOptions {
  encoding?: BufferEncoding | null;
  overwrite?: boolean;
}
```

## Exports map

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

This lets you import high‑level operations from the package root and only the utilities from the `./utils` subpath when needed.

## License

MIT. See the license file in the official repository. [LICENSE](./LICENSE)
