#!/bin/bash

# Start development environment without Docker

echo "Starting development environment..."

# Function to cleanup background processes on exit
cleanup() {
    echo "Stopping services..."
    kill $ANALYTICS_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Setup trap for cleanup
trap cleanup SIGINT SIGTERM

# Start Analytics Backend
echo "Starting Analytics Backend on port 3002..."
cd analytics-backend && npm run dev &
ANALYTICS_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start Next.js Frontend
echo "Starting Next.js Frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo "Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Analytics Backend: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait