import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
const execFileAsync = promisify(execFile);

const allowedTargets = new Set(['pdf','csv','txt','odt','odp']);
export const isAllowedTarget = (fmt) => allowedTargets.has(String(fmt||'').toLowerCase());

export function guessContentType(target) {
  const t = String(target).toLowerCase();
  if (t === 'pdf') return 'application/pdf';
  if (t === 'csv') return 'text/csv';
  if (t === 'txt') return 'text/plain';
  if (t === 'odt') return 'application/vnd.oasis.opendocument.text';
  if (t === 'odp') return 'application/vnd.oasis.opendocument.presentation';
  return 'application/octet-stream';
}

export async function libreOfficeConvert(inputPath, targetFormat, outDir) {
  const args = ['--headless','--convert-to', targetFormat,'--outdir', outDir, inputPath];
  await execFileAsync('soffice', args);
  const base = path.parse(inputPath).name;
  return `${outDir}/${base}.${targetFormat}`;
}
