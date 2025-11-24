#!/bin/bash

# Production build script without Docker

echo "Building production application..."

# Build Analytics Backend
echo "1. Building Analytics Backend..."
cd analytics-backend
npx prisma generate
npm run build
cd ..

# Build Next.js Frontend
echo "2. Building Next.js Frontend..."
npm run build

# Create production start script
cat > start-prod.sh << 'EOF'
#!/bin/bash

echo "Starting production environment..."

# Start Analytics Backend
echo "Starting Analytics Backend on port 3002..."
cd analytics-backend && npm run start &
ANALYTICS_PID=$!
cd ..

# Start Next.js Frontend
echo "Starting Next.js Frontend on port 3000..."
npm start &
FRONTEND_PID=$!

# Function to cleanup
cleanup() {
    echo "Stopping services..."
    kill $ANALYTICS_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "Production environment started!"
echo "Frontend: http://localhost:3000"
echo "Analytics Backend: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all services"

wait
EOF

chmod +x start-prod.sh

echo "Build completed!"
echo "Run './start-prod.sh' to start production environment"