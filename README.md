FileX Converter

FileX Converter é um conversor de arquivos com API em Node.js, frontend em Next.js, fila de processamento com Redis e armazenamento compatível com S3 (MinIO em desenvolvimento e Cloudflare R2 em produção).

O projeto permite upload de arquivos via navegador, conversão entre formatos comuns (docx, xlsx, pptx, txt, jpg para pdf, csv, png etc.), fila de processamento assíncrona com Redis e BullMQ, worker dedicado utilizando LibreOffice para conversões, armazenamento e recuperação de arquivos em buckets S3 e uma interface web desenvolvida em Next.js e TailwindCSS.

As principais tecnologias utilizadas são: Node.js, Express e GraphQL no backend; BullMQ e LibreOffice no worker; Next.js 14 e TailwindCSS no frontend; Redis (Upstash) como fila; MinIO local e Cloudflare R2 em produção como storage; Docker e Docker Compose para orquestração e Render ou Railway para deploy.

A estrutura do projeto está organizada em três serviços principais: api (API REST/GraphQL), worker (processamento de conversões) e web (frontend Next.js).

Para rodar localmente é necessário ter Node.js 18 ou superior, Docker e Docker Compose instalados e pnpm configurado via corepack. Após clonar o repositório e copiar o arquivo .env.example para .env, basta executar docker compose up -d --build. Os serviços estarão disponíveis em http://localhost:3000
 (frontend), http://localhost:4000
 (API) e http://localhost:9000
 (MinIO, usuário e senha padrão: minioadmin).

Para deploy no Render, a API deve ser configurada com root directory em services/api, build command pnpm i e start command node src/index.js. O frontend deve ser configurado com root directory em services/web, build command pnpm i && pnpm build e start command next start -p $PORT. As variáveis de ambiente necessárias são: REDIS_URL, S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_INPUT, S3_BUCKET_OUTPUT e NEXT_PUBLIC_API_URL.

Projeto desenvolvido por Ian Gama.
