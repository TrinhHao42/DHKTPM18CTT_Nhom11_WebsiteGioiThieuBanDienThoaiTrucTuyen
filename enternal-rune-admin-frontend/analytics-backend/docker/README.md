# Docker Commands Cheat Sheet - Analytics Backend

## Quick Setup

### 1. Setup everything automatically (Windows)
```bash
./setup-docker.bat
```

### 2. Setup everything automatically (Linux/Mac)
```bash
chmod +x setup-docker.sh
./setup-docker.sh
```

## Manual Setup

### 1. Start all services
```bash
docker-compose up -d
```

### 2. Stop all services
```bash
docker-compose down
```

### 3. View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f redis
```

### 4. Access services

#### PostgreSQL Database
```bash
# Connect via psql
docker exec -it analytics-postgres psql -U analytics_user -d analytics

# Or use connection string:
postgresql://analytics_user:analytics_password@localhost:5432/analytics
```

#### pgAdmin (Database Management)
- URL: http://localhost:8080
- Email: admin@analytics.local
- Password: admin123

#### Redis
```bash
# Connect to Redis CLI
docker exec -it analytics-redis redis-cli
```

## Database Operations

### 1. Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm analytics_postgres_data

# Start services again
docker-compose up -d

# Wait for database to be ready, then run migrations
npm run generate
npm run migrate
```

### 2. Backup Database
```bash
# Create backup
docker exec analytics-postgres pg_dump -U analytics_user analytics > backup.sql

# Restore backup
docker exec -i analytics-postgres psql -U analytics_user -d analytics < backup.sql
```

### 3. Check Database Status
```bash
# Check if database is ready
docker exec analytics-postgres pg_isready -U analytics_user -d analytics

# View database info
docker exec analytics-postgres psql -U analytics_user -d analytics -c "\l"
```

## Development Workflow

### 1. Start development environment
```bash
# Start Docker services
docker-compose up -d

# Start API server in development mode
npm run dev
```

### 2. Database migrations
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Or use migrations
npx prisma migrate dev
```

### 3. View database in Prisma Studio
```bash
npx prisma studio
```

## Production Deployment

### 1. Build and run with Docker Compose
```bash
# Create production docker-compose file
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://analytics_user:analytics_password@postgres:5432/analytics
      - NODE_ENV=production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15-alpine
    # ... (same as development)
```

### 2. Build and push Docker image
```bash
# Build image
docker build -t analytics-backend:latest .

# Tag for registry
docker tag analytics-backend:latest your-registry/analytics-backend:latest

# Push to registry
docker push your-registry/analytics-backend:latest
```

## Troubleshooting

### 1. Port conflicts
If ports 5432, 6379, or 8080 are already in use, modify docker-compose.yml:
```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Use different port
```

### 2. Permission issues (Linux/Mac)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x setup-docker.sh
```

### 3. Database connection issues
```bash
# Check if containers are running
docker ps

# Check container logs
docker-compose logs postgres

# Test database connection
docker exec analytics-postgres pg_isready -U analytics_user -d analytics
```

### 4. Clean up everything
```bash
# Stop and remove all containers
docker-compose down -v

# Remove all images
docker rmi $(docker images -q analytics*)

# Remove all volumes
docker volume prune
```

## Environment Variables

Create `.env` file with these variables:
```env
DATABASE_URL="postgresql://analytics_user:analytics_password@localhost:5432/analytics"
NODE_ENV="development"
PORT="3001"
REDIS_URL="redis://localhost:6379"
```

For Docker deployment, use container names:
```env
DATABASE_URL="postgresql://analytics_user:analytics_password@postgres:5432/analytics"
REDIS_URL="redis://redis:6379"
```