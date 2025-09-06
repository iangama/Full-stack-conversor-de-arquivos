# FileX Converter
Conversor de arquivos com fila (Redis), storage S3 (MinIO local / S3/R2 em produção),
API REST/GraphQL, Worker (LibreOffice), e Frontend Next.js. Docker + CI/CD.

## Como rodar local
1. cp .env.example .env
2. docker compose up -d --build
3. Web: http://localhost:3000 | API: http://localhost:4000

## Deploy gratuito
Use Render ou Railway (gera link público permanente, mas pode adormecer).
