FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npx", "playwright", "test"]