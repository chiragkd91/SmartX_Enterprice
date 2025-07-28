#!/usr/bin/env node

/**
 * SmartBizFlow Portal Deployment Script
 * Handles building and deploying the customized portal
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (message) => console.log(`${colors.blue}ℹ${colors.reset} ${message}`),
  success: (message) => console.log(`${colors.green}✓${colors.reset} ${message}`),
  warning: (message) => console.log(`${colors.yellow}⚠${colors.reset} ${message}`),
  error: (message) => console.log(`${colors.red}✗${colors.reset} ${message}`),
  header: (message) => console.log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}\n`)
};

// Configuration
const config = {
  buildDir: join(projectRoot, 'dist'),
  publicDir: join(projectRoot, 'public'),
  envFile: join(projectRoot, '.env'),
  envExampleFile: join(projectRoot, 'env.example'),
  packageJson: join(projectRoot, 'package.json'),
  viteConfig: join(projectRoot, 'vite.config.ts'),
  tailwindConfig: join(projectRoot, 'tailwind.config.js'),
  tsConfig: join(projectRoot, 'tsconfig.json')
};

// Utility functions
function checkFileExists(filePath) {
  if (!existsSync(filePath)) {
    log.error(`File not found: ${filePath}`);
    return false;
  }
  return true;
}

function createDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    log.info(`Created directory: ${dirPath}`);
  }
}

function readJsonFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log.error(`Failed to read JSON file: ${filePath}`);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    log.success(`Updated file: ${filePath}`);
  } catch (error) {
    log.error(`Failed to write JSON file: ${filePath}`);
  }
}

function executeCommand(command, options = {}) {
  try {
    log.info(`Executing: ${command}`);
    const result = execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    throw error;
  }
}

// Environment setup
function setupEnvironment() {
  log.header('Setting up environment variables');
  
  if (!checkFileExists(config.envExampleFile)) {
    log.error('env.example file not found. Please create it first.');
    return false;
  }
  
  if (!existsSync(config.envFile)) {
    log.info('Creating .env file from env.example...');
    const envExample = readFileSync(config.envExampleFile, 'utf8');
    writeFileSync(config.envFile, envExample);
    log.success('Created .env file');
    log.warning('Please update .env file with your actual configuration values');
  } else {
    log.info('.env file already exists');
  }
  
  return true;
}

// Dependency installation
function installDependencies() {
  log.header('Installing dependencies');
  
  if (!checkFileExists(config.packageJson)) {
    log.error('package.json not found');
    return false;
  }
  
  try {
    executeCommand('npm install');
    log.success('Dependencies installed successfully');
    return true;
  } catch (error) {
    log.error('Failed to install dependencies');
    return false;
  }
}

// Type checking
function runTypeCheck() {
  log.header('Running TypeScript type check');
  
  try {
    executeCommand('npx tsc --noEmit');
    log.success('TypeScript type check passed');
    return true;
  } catch (error) {
    log.error('TypeScript type check failed');
    return false;
  }
}

// Linting
function runLinting() {
  log.header('Running ESLint');
  
  try {
    executeCommand('npm run lint');
    log.success('ESLint passed');
    return true;
  } catch (error) {
    log.error('ESLint failed');
    return false;
  }
}

// Building
function buildProject() {
  log.header('Building project');
  
  try {
    // Clean build directory
    if (existsSync(config.buildDir)) {
      executeCommand(`rm -rf ${config.buildDir}`);
      log.info('Cleaned build directory');
    }
    
    // Build the project
    executeCommand('npm run build');
    log.success('Project built successfully');
    return true;
  } catch (error) {
    log.error('Build failed');
    return false;
  }
}

// Testing
function runTests() {
  log.header('Running tests');
  
  try {
    // Check if test script exists
    const packageJson = readJsonFile(config.packageJson);
    if (packageJson && packageJson.scripts && packageJson.scripts.test) {
      executeCommand('npm test');
      log.success('Tests passed');
    } else {
      log.warning('No test script found, skipping tests');
    }
    return true;
  } catch (error) {
    log.error('Tests failed');
    return false;
  }
}

// Database setup
function setupDatabase() {
  log.header('Setting up database');
  
  try {
    // Generate Prisma client
    executeCommand('npx prisma generate');
    log.success('Prisma client generated');
    
    // Push database schema
    executeCommand('npx prisma db push');
    log.success('Database schema pushed');
    
    // Seed database
    executeCommand('npm run db:seed');
    log.success('Database seeded');
    
    return true;
  } catch (error) {
    log.error('Database setup failed');
    return false;
  }
}

// Production optimization
function optimizeForProduction() {
  log.header('Optimizing for production');
  
  try {
    // Update package.json for production
    const packageJson = readJsonFile(config.packageJson);
    if (packageJson) {
      // Add production scripts if they don't exist
      if (!packageJson.scripts.start) {
        packageJson.scripts.start = 'node server/index.js';
      }
      if (!packageJson.scripts.prod) {
        packageJson.scripts.prod = 'NODE_ENV=production npm start';
      }
      
      writeJsonFile(config.packageJson, packageJson);
    }
    
    // Create production environment file
    const prodEnvPath = join(projectRoot, '.env.production');
    if (!existsSync(prodEnvPath)) {
      const envContent = readFileSync(config.envFile, 'utf8')
        .replace(/NODE_ENV=development/g, 'NODE_ENV=production')
        .replace(/VITE_DEV_SERVER_PORT=5173/g, '# VITE_DEV_SERVER_PORT=5173')
        .replace(/DEBUG_ENABLED=true/g, 'DEBUG_ENABLED=false');
      
      writeFileSync(prodEnvPath, envContent);
      log.success('Created production environment file');
    }
    
    return true;
  } catch (error) {
    log.error('Production optimization failed');
    return false;
  }
}

// Docker setup
function setupDocker() {
  log.header('Setting up Docker');
  
  const dockerfilePath = join(projectRoot, 'Dockerfile');
  const dockerIgnorePath = join(projectRoot, '.dockerignore');
  
  try {
    // Create Dockerfile if it doesn't exist
    if (!existsSync(dockerfilePath)) {
      const dockerfile = `# SmartBizFlow Portal Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;
      
      writeFileSync(dockerfilePath, dockerfile);
      log.success('Created Dockerfile');
    }
    
    // Create .dockerignore if it doesn't exist
    if (!existsSync(dockerIgnorePath)) {
      const dockerignore = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
dist
coverage
.nyc_output
.DS_Store
*.log`;
      
      writeFileSync(dockerIgnorePath, dockerignore);
      log.success('Created .dockerignore');
    }
    
    // Create nginx.conf if it doesn't exist
    const nginxConfPath = join(projectRoot, 'nginx.conf');
    if (!existsSync(nginxConfPath)) {
      const nginxConf = `server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`;
      
      writeFileSync(nginxConfPath, nginxConf);
      log.success('Created nginx.conf');
    }
    
    return true;
  } catch (error) {
    log.error('Docker setup failed');
    return false;
  }
}

// Main deployment function
async function deploy(options = {}) {
  const {
    skipTests = false,
    skipLint = false,
    skipTypeCheck = false,
    setupDockerFiles = false,
    production = false
  } = options;
  
  log.header('SmartBizFlow Portal Deployment');
  
  try {
    // Step 1: Environment setup
    if (!setupEnvironment()) {
      throw new Error('Environment setup failed');
    }
    
    // Step 2: Install dependencies
    if (!installDependencies()) {
      throw new Error('Dependency installation failed');
    }
    
    // Step 3: Type checking
    if (!skipTypeCheck && !runTypeCheck()) {
      throw new Error('Type checking failed');
    }
    
    // Step 4: Linting
    if (!skipLint && !runLinting()) {
      throw new Error('Linting failed');
    }
    
    // Step 5: Tests
    if (!skipTests && !runTests()) {
      throw new Error('Tests failed');
    }
    
    // Step 6: Database setup
    if (!setupDatabase()) {
      throw new Error('Database setup failed');
    }
    
    // Step 7: Build project
    if (!buildProject()) {
      throw new Error('Build failed');
    }
    
    // Step 8: Production optimization
    if (production && !optimizeForProduction()) {
      throw new Error('Production optimization failed');
    }
    
    // Step 9: Docker setup
    if (setupDockerFiles && !setupDocker()) {
      throw new Error('Docker setup failed');
    }
    
    log.header('Deployment completed successfully! 🎉');
    log.success('Your SmartBizFlow portal is ready for use');
    
    if (production) {
      log.info('Production build completed');
      log.info('To start the production server, run: npm run prod');
    } else {
      log.info('Development build completed');
      log.info('To start the development server, run: npm run dev');
    }
    
    if (setupDockerFiles) {
      log.info('Docker files created');
      log.info('To build Docker image, run: docker build -t smartbizflow .');
      log.info('To run Docker container, run: docker run -p 80:80 smartbizflow');
    }
    
  } catch (error) {
    log.error(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI argument parsing
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    skipTests: args.includes('--skip-tests'),
    skipLint: args.includes('--skip-lint'),
    skipTypeCheck: args.includes('--skip-type-check'),
    setupDockerFiles: args.includes('--docker'),
    production: args.includes('--production')
  };
  
  return options;
}

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArguments();
  deploy(options);
}

export { deploy, setupEnvironment, installDependencies, buildProject, setupDatabase }; 