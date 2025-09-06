FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm i
COPY . .
EXPOSE 3000
CMD ["pnpm","dev"]
