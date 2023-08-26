# Installing dependencies:
FROM node:20-alpine AS install-dependencies
WORKDIR /user/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

# Creating a build:
FROM node:20-alpine AS create-build
WORKDIR /user/src/app
COPY --from=install-dependencies /user/src/app ./
COPY ./prisma ./
RUN yarn build
USER node

# Running the application:
FROM node:20-alpine AS run
WORKDIR /user/src/app
COPY --from=create-build /user/src/app/node_modules ./node_modules
COPY --from=create-build /user/src/app/dist ./dist
COPY package.json ./

CMD [ "node", "dist/src/main.js" ]

