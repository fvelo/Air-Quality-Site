# 1. Base image: use an official Node.js runtime
FROM node:22.14.0-alpine

# 2. Create & switch to app directory
WORKDIR /usr/src/app

# 3. Copy package files and install deps
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your source
COPY . .

# 5. Build step (if you have a build script—e.g. TypeScript, bundler)
RUN npm run build

# 6. Expose whichever port your server listens on
EXPOSE 3000

# 7. Start your app
CMD ["node", "./dist/server/app.js"]