const EXCEL_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]);

const NEUTRAL_MIME_TYPES = new Set(['', 'application/octet-stream']);

export function formatImportFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function supportedExtensionsLabel(accept: string): string {
  return accept
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
}

/** Returns an error message, or null when the file is valid. */
export function validateImportDataFile(file: File, accept: string, maxFileSize: number): string | null {
  const extensions = accept
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.startsWith('.'));

  if (extensions.length === 0) {
    return 'No accepted file types configured.';
  }

  const dotIndex = file.name.lastIndexOf('.');
  const ext = dotIndex >= 0 ? file.name.slice(dotIndex).toLowerCase() : '';
  if (!extensions.includes(ext)) {
    return `File must be ${extensions.join(' or ')}.`;
  }

  const mime = file.type.trim().toLowerCase();
  if (!NEUTRAL_MIME_TYPES.has(mime) && !EXCEL_MIME_TYPES.has(mime)) {
    return 'Invalid Excel file type.';
  }

  if (file.size > maxFileSize) {
    return `File exceeds the maximum size of ${formatImportFileSize(maxFileSize)}.`;
  }

  return null;
}
