FROM node:18-bookworm
RUN apt-get update && apt-get install -y libreoffice && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm i
COPY . .
CMD ["pnpm","start"]
