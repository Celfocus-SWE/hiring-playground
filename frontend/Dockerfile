FROM node:21 as builder
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY babelrc ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY globals.d.ts ./
COPY .prettierrc ./
COPY .prettierignore ./
COPY .eslintrc.json ./
COPY .editorconfig ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY modules/ ./modules/

# Build the application
RUN npm run build

FROM node:21
WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy node_modules from builder stage (includes nx and other build tools)
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/modules ./modules

EXPOSE 4200
CMD ["npm", "run", "start"]
