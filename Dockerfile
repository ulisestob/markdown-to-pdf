FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV PATH="/usr/local/lib/node_modules/phantomjs-prebuilt/bin:$PATH"

CMD ["node", "index.js"]
