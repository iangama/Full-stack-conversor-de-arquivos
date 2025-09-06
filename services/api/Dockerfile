FROM node:18-slim
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm i
COPY . .
EXPOSE 4000
CMD ["pnpm","start"]
