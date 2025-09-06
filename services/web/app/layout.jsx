import './globals.css';

export const metadata = { title: "FileX Converter", description: "Conversor de arquivos" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
