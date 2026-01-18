FROM node:20-alpine
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 8080
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "8080"]
