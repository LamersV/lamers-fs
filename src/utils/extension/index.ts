export const extensionFromPath = (path: string): string | null => {
  if(!path.match(/\./g))  return null;
  
  const ext = path.split('.').pop();
  if (!ext) return null;
  return ext.toLowerCase();
}

export const extensionFromBuffer = (buffer: Buffer): string | null => {
  const signatures = [
    { signature: 'FFD8FF', ext: 'jpg' },
    { signature: '89504E47', ext: 'png' },
    { signature: '47494638', ext: 'gif' },
    { signature: '25504446', ext: 'pdf' },
    { signature: '504B0304', ext: 'zip' },
    { signature: '4D5A', ext: 'exe' },
    { signature: '49492A00', ext: 'tiff' },
    { signature: '424D', ext: 'bmp' },
    { signature: '7F454C46', ext: 'elf' },
    { signature: '504B0304', ext: 'docx' },
    { signature: 'D0CF11E0', ext: 'doc' },
    { signature: '504B0304', ext: 'xlsx' },
    { signature: '504B0304', ext: 'pptx' },
    { signature: '52617221', ext: 'rar' },
    { signature: '377ABCAF271C', ext: '7z' }
  ];

  const maxSignatureLength = Math.max(...signatures.map(s => s.signature.length)) / 2;
  const header = buffer.slice(0, maxSignatureLength).toString('hex').toUpperCase();

  for (let { signature, ext } of signatures) {
    if (header.startsWith(signature)) {
      if (ext === 'zip') return checkZipSubtypes(buffer);
      return ext;
    }
  }

  return null;
}

const checkZipSubtypes = (buffer: Buffer): string => {
  const content = buffer.toString('utf-8');

  if (content.includes('[Content_Types].xml')) {
    if (content.includes('word/')) return 'docx';
    if (content.includes('xl/')) return 'xlsx';
    if (content.includes('ppt/')) return 'pptx';
  }

  return 'zip';
};