# Docker Database Setup Guide

This guide helps you set up PostgreSQL database using Docker for your Enternal Rune Admin Frontend.

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js and npm installed

## Quick Start

### 1. Start PostgreSQL Database
```bash
# Start only the PostgreSQL database
npm run db:up

# Or start all services
docker-compose up -d postgres
```

### 2. Run Database Migrations
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```

## Available Docker Commands

### Database Management
```bash
# Start PostgreSQL database only
npm run db:up

# Stop PostgreSQL database
npm run db:down

# View database logs
npm run db:logs

# Complete database setup (start + migrate + seed)
npm run db:setup
```

### Full Docker Compose Commands
```bash
# Start all services in foreground
npm run docker:up

# Start all services in background
npm run docker:up:detached

# Stop all services
npm run docker:down

# View all logs
npm run docker:logs

# Clean up everything (containers, volumes, etc.)
npm run docker:clean
```

## Database Configuration

### Environment Variables
The application uses these environment variables for database connection:

```env
# For local Docker development
DATABASE_URL="postgresql://analytics_user:analytics_password@localhost:5432/analytics"

# For Docker containers communication
# DATABASE_URL="postgresql://analytics_user:analytics_password@postgres:5432/analytics"
```

### Default Credentials
- **Database**: analytics
- **Username**: analytics_user
- **Password**: analytics_password
- **Port**: 5432

### pgAdmin (Optional)
To start pgAdmin for database management:
```bash
docker-compose --profile admin up -d
```
- **URL**: http://localhost:8080
- **Email**: admin@admin.com
- **Password**: admin

## Troubleshooting

### Common Issues

1. **Port 5432 already in use**
   ```bash
   # Check what's using port 5432
   netstat -an | find "5432"
   
   # Stop local PostgreSQL service
   net stop postgresql-x64-15  # Windows
   sudo service postgresql stop  # Linux/Mac
   ```

2. **Database connection error**
   ```bash
   # Check if database is running
   docker-compose ps postgres
   
   # Check database logs
   npm run db:logs
   ```

3. **Migration errors**
   ```bash
   # Reset database and start fresh
   npm run prisma:reset
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Health Check
The PostgreSQL container includes a health check. You can verify it's running:
```bash
docker-compose ps postgres
```

### Data Persistence
Database data is stored in a Docker volume called `postgres_data`. To completely remove all data:
```bash
npm run docker:clean
```

## Development Workflow

1. **First time setup**:
   ```bash
   npm install
   npm run db:setup
   npm run dev
   ```

2. **Daily development**:
   ```bash
   npm run db:up    # Start database
   npm run dev      # Start Next.js app
   ```

3. **When done**:
   ```bash
   npm run db:down  # Stop database
   ```

## Analytics Data

The database will be seeded with analytics data for website ID: `cmic2k2820000ml8mu0miqhlm`

You can view this data through:
- **Analytics Dashboard**: http://localhost:3001
- **Prisma Studio**: `npm run prisma:studio`
- **pgAdmin**: http://localhost:8080 (if started with --profile admin)