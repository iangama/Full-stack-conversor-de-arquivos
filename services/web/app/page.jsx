'use client';
import { useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('pdf');
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState(null);
  const [download, setDownload] = useState(null);
  const [busy, setBusy] = useState(false);

  async function upload() {
    if (!file) return;
    setBusy(true); setStatus(null); setDownload(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('targetFormat', target);
    const res = await fetch(`${API}/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    setJob(data.jobId);
    setBusy(false);
  }

  async function check() {
    if (!job) return;
    const res = await fetch(`${API}/status/${job}`);
    const data = await res.json();
    setStatus(data);
    if (data.outputUrl) setDownload(data.outputUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white p-6">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-emerald-400">FileX Converter</h1>
        <p className="text-center text-gray-400">Envie um arquivo e escolha o formato de saída</p>

        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-emerald-500 file:text-white
                     hover:file:bg-emerald-600"
        />

        <select
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800 text-gray-200 border border-gray-700"
        >
          <option value="pdf">PDF (docs, slides, planilhas)</option>
          <option value="csv">CSV (planilhas)</option>
          <option value="txt">TXT (texto simples)</option>
          <option value="odt">ODT (documentos)</option>
          <option value="odp">ODP (apresentações)</option>
        </select>

        <div className="flex gap-4">
          <button
            onClick={upload}
            disabled={busy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 py-3 rounded-xl font-semibold"
          >
            {busy ? 'Enviando...' : 'Enviar'}
          </button>
          <button
            onClick={check}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
          >
            Checar status
          </button>
        </div>

        {status && (
          <div className="p-4 rounded-xl bg-gray-800 text-sm space-y-2">
            <pre className="whitespace-pre-wrap">{JSON.stringify(status, null, 2)}</pre>
            {status.progress && (
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {download && (
          <a
            href={download}
            target="_blank"
            className="block text-center bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold"
          >
            📥 Baixar resultado
          </a>
        )}
      </div>
    </div>
  );
}
