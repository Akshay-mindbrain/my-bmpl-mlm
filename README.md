# Backend Auto-Code

A production-ready **Node.js + Express.js + TypeScript** backend boilerplate with OAuth2 authentication, Prisma ORM, MySQL database, and Docker support.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd backend-auto-code

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start MySQL with Docker
docker compose up -d db

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

**Server will be running on:** `http://localhost:3000`

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation - Windows](#-installation---windows)
- [Installation - Linux](#-installation---linux)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Project](#-running-the-project)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Development Workflow](#-development-workflow)

---

## 📦 Prerequisites

### Required Software

| Software | Version | Windows | Linux |
|----------|---------|---------|-------|
| **Node.js** | v20+ | [Download](https://nodejs.org/) | `sudo apt install nodejs` |
| **npm** | v10+ | Included with Node.js | `sudo apt install npm` |
| **Docker** | Latest | [Docker Desktop](https://www.docker.com/products/docker-desktop) | `sudo apt install docker.io` |
| **Docker Compose** | v2+ | Included with Docker Desktop | `sudo apt install docker-compose-v2` |
| **Git** | Latest | [Download](https://git-scm.com/) | `sudo apt install git` |

### Optional Tools
- **Postman** or **Insomnia** - API testing
- **VS Code** - Recommended IDE
- **MySQL Workbench** - Database GUI (optional)

---

## 🪟 Installation - Windows

### Step 1: Install Prerequisites

1. **Install Node.js**
   ```powershell
   # Download from https://nodejs.org/
   # Choose LTS version (v20+)
   # Run installer and follow prompts
   ```

2. **Install Docker Desktop**
   ```powershell
   # Download from https://www.docker.com/products/docker-desktop
   # Run installer
   # Restart computer if prompted
   # Ensure WSL2 is enabled
   ```

3. **Verify Installations**
   ```powershell
   node --version  # Should show v20.x.x or higher
   npm --version   # Should show v10.x.x or higher
   docker --version
   docker compose version
   ```

### Step 2: Clone and Setup Project

```powershell
# Navigate to your projects folder
cd C:\Users\YourUsername\Projects

# Clone the repository
git clone <repository-url>
cd backend-auto-code

# Install dependencies
npm install
```

### Step 3: Configure Environment

```powershell
# Copy environment template
copy .env.example .env

# Edit .env file with your preferred text editor
notepad .env
```

Update the following variables in `.env`:
```env
NODE_ENV=development
PORT=3000
APP_DEBUG=true
LOG_LEVEL=debug
DATABASE_URL=mysql://root:secret@localhost:33061/task_manager
APP_SECRET=your-very-long-secret-key-at-least-32-characters-long
```

### Step 4: Start MySQL Database

```powershell
# Start MySQL container
docker compose up -d db

# Verify container is running
docker ps
```

### Step 5: Setup Database

```powershell
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npm run db:seed
```

### Step 6: Start Development Server

```powershell
# Start the server
npm run dev
```

**Server is now running!** Visit `http://localhost:3000/health` to verify.

---

## 🐧 Installation - Linux (Ubuntu/Debian)

### Step 1: Install Prerequisites

```bash
# Update package list
sudo apt update

# Install Node.js v20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
sudo apt install -y docker.io docker-compose-v2

# Add current user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Log out and log back in for group changes to take effect
# Or run: newgrp docker

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installations
node --version  # Should show v20.x.x or higher
npm --version   # Should show v10.x.x or higher
docker --version
docker compose version
```

### Step 2: Clone and Setup Project

```bash
# Navigate to your projects folder
cd ~/projects
# Or create it if it doesn't exist
mkdir -p ~/projects && cd ~/projects

# Clone the repository
git clone <repository-url>
cd backend-auto-code

# Install dependencies
npm install
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with nano or your preferred editor
nano .env
# Or use: vim .env, gedit .env, code .env
```

Update the following variables in `.env`:
```env
NODE_ENV=development
PORT=3000
APP_DEBUG=true
LOG_LEVEL=debug
DATABASE_URL=mysql://root:secret@localhost:33061/task_manager
APP_SECRET=your-very-long-secret-key-at-least-32-characters-long
```

**Save and exit** (in nano: `Ctrl+X`, then `Y`, then `Enter`)

### Step 4: Start MySQL Database

```bash
# Start MySQL container
docker compose up -d db

# Verify container is running
docker ps

# Check container logs (optional)
docker compose logs db
```

### Step 5: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npm run db:seed
```

### Step 6: Start Development Server

```bash
# Start the server
npm run dev
```

**Server is now running!** Visit `http://localhost:3000/health` to verify.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Application Environment
NODE_ENV=development          # development, production, or test
PORT=3000                     # Server port
APP_DEBUG=true                # Enable debug mode
LOG_LEVEL=debug              # error, warning, info, http, debug

# Database Connection
DATABASE_URL=mysql://root:secret@localhost:33061/task_manager

# Security
APP_SECRET=your-secret-key-minimum-32-characters-long-required

# OAuth2 Configuration (for JWT authentication)
ISSUER_BASE_URL=https://auth.example.com
AUDIENCE=default-audience

# Pagination
DEFAULT_PAGE_SIZE=10

# Email Configuration
CONSOLE_LOG_EMAILS=true       # true for dev, false for production
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=                # Your SMTP username
MAIL_PASSWORD=                # Your SMTP password
ADMIN_EMAIL=admin@example.com
```

### Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port number | No | `3000` |
| `APP_DEBUG` | Enable debug output | No | `false` |
| `LOG_LEVEL` | Logging verbosity level | No | `info` |
| `DATABASE_URL` | MySQL connection string | **Yes** | - |
| `APP_SECRET` | JWT secret (32+ chars) | **Yes** | - |
| `ISSUER_BASE_URL` | OAuth2 issuer URL | No | - |
| `AUDIENCE` | OAuth2 audience | No | - |
| `DEFAULT_PAGE_SIZE` | Items per page | No | `5` |
| `CONSOLE_LOG_EMAILS` | Log emails to console | No | `false` |

---

## 🗄️ Database Setup

### Option 1: Docker (Recommended)

```bash
# Start MySQL container
docker compose up -d db

# Database will be accessible at:
# Host: localhost
# Port: 33061
# Username: root
# Password: secret
# Database: task_manager
```

### Option 2: Local MySQL Installation

If you prefer using a local MySQL installation:

**Windows:**
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Install MySQL Server
3. Create database: `CREATE DATABASE task_manager;`
4. Update `.env` with your connection string

**Linux:**
```bash
# Install MySQL
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE task_manager;
exit;

# Update .env
DATABASE_URL=mysql://root:yourpassword@localhost:3306/task_manager
```

### Database Migrations

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npm run migration:create

# Apply migrations
npm run migrate

# Or in development
npx prisma migrate dev
```

### Database Seeding

```bash
# Seed database with sample data
npm run db:seed
```

---

## 🏃 Running the Project

### Development Mode (with hot reload)

```bash
npm run dev
```

- Watches for file changes
- Auto-reloads on save
- Source maps enabled for debugging
- Running on `http://localhost:3000`

### Production Mode

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Docker Production Mode

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint code quality checks |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run migration:create` | Create new database migration |
| `npm run migrate` | Apply database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run docker-start` | Docker container startup script |

---

## 📁 Project Structure

```
backend-auto-code/
├── src/
│   ├── config.ts                 # Application configuration
│   ├── index.ts                  # Application entry point
│   ├── server.ts                 # Express server setup
│   ├── logger.ts                 # Winston logger config
│   ├── utils.ts                  # Utility functions
│   ├── prisma-client.ts          # Prisma instance
│   │
│   ├── routes/                   # API routes
│   │   └── v1/                   # Version 1 API
│   │       ├── index.ts
│   │       └── health/           # Health check endpoint
│   │
│   ├── middleware/               # Express middleware
│   │   ├── authenticate-user.ts  # OAuth2 JWT auth
│   │   ├── error-handler.ts      # Global error handler
│   │   ├── morgan-middleware.ts  # HTTP logging
│   │   └── validate-request.ts   # Request validation
│   │
│   ├── errors/                   # Custom error classes
│   │   ├── CustomError.ts
│   │   ├── AuthenticationError.ts
│   │   └── EntityNotFoundError.ts
│   │
│   ├── data/                     # Data access layer
│   │   ├── repositories/         # Repository pattern
│   │   │   ├── BaseRepository.ts
│   │   │   ├── index.ts
│   │   │   └── repository.ts
│   │   └── request-schemas.ts    # Joi validation schemas
│   │
│   ├── services/                 # Business logic
│   │   └── mailer/               # Email services
│   │       ├── interface.ts
│   │       ├── console-log-mailer/
│   │       └── mailtrap-mailer/
│   │
│   └── tests/                    # Test files
│       ├── add.test.ts
│       ├── utils.test.ts
│       ├── integrationTest.test.ts
│       └── MailtrapMailer.test.ts
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeder
│   └── migrations/               # Migration files
│
├── .env                          # Environment variables (create this)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── .dockerignore                 # Docker ignore rules
├── Dockerfile                    # Production Docker image
├── docker-compose.yaml           # Docker services config
├── tsconfig.json                 # TypeScript config
├── jest.config.mjs               # Jest test config
├── eslint.config.mjs             # ESLint config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 📡 API Documentation

### Health Check Endpoints

#### GET /health
Check if the server is running.

**Response:**
```json
{
  "ok": true,
  "environment": "development"
}
```

#### GET /v1/health
API version 1 health check.

**Response:**
```json
{
  "status": "ok"
}
```

### Authentication

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux
sudo lsof -i :3000
kill -9 <PID>

# Or change PORT in .env file
PORT=3001
```

#### 2. Docker Container Not Starting

**Error:** `Cannot connect to the Docker daemon`

**Solution:**
```bash
# Windows
# Start Docker Desktop application

# Linux
sudo systemctl start docker
sudo systemctl status docker
```

#### 3. Database Connection Failed

**Error:** `Can't reach database server at localhost:33061`

**Solution:**
```bash
# Check if MySQL container is running
docker ps

# Start MySQL container
docker compose up -d db

# Check container logs
docker compose logs db

# Verify DATABASE_URL in .env matches container config
```

#### 4. Prisma Client Not Generated

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
# Generate Prisma Client
npx prisma generate

# Restart development server
npm run dev
```

#### 5. TypeScript Compilation Errors

**Error:** `TS2307: Cannot find module`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Ensure TypeScript is installed
npm install -D typescript
```

#### 6. Permission Denied (Linux)

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended)
sudo docker compose up -d
```

---

## 🛠️ Development Workflow

### 1. Create a New Feature

```bash
# Create a new branch
git checkout -b feature/my-new-feature

# Make changes to code
# ...

# Run tests
npm test

# Run linter
npm run lint

# Commit changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/my-new-feature
```

### 2. Add a New API Endpoint

1. Create route file in `src/routes/v1/`
2. Add validation schema in `src/data/request-schemas.ts`
3. Create service/business logic
4. Add tests in `src/tests/`
5. Update route index file

### 3. Modify Database Schema

```bash
# Edit prisma/schema.prisma
# Add/modify models

# Create migration
npm run migration:create

# Name your migration when prompted
# Example: "add_user_table"

# Apply migration
npm run migrate

# Generate new Prisma Client
npx prisma generate
```

### 4. Code Quality Checks

```bash
# Run linter
npm run lint

# Run tests
npm test

# Format code (if prettier is configured)
npx prettier --write .
```

### 5. Debugging

```bash
# Enable debug mode in .env
APP_DEBUG=true
LOG_LEVEL=debug

# View detailed logs
npm run dev
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d db

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild containers
docker compose up -d --build

# Remove all containers and volumes
docker compose down -v

# Execute command in container
docker compose exec db mysql -u root -p
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong APP_SECRET** - Minimum 32 characters, random
3. **Change default database password** - Update in `docker-compose.yaml` and `.env`
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Use HTTPS in production** - Configure reverse proxy (nginx/Apache)
6. **Implement rate limiting** - Add rate limiter middleware
7. **Validate all inputs** - Use Joi schemas for validation
8. **Enable CORS properly** - Configure allowed origins

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
