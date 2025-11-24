import express from 'express';
import cors from 'cors';
import { setupRoutes } from './src/routes';

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for tracker
app.use(express.static('src'));

// Setup routes
setupRoutes(app);

// Start server
app.listen(port, () => {
  console.log(`🚀 Analytics backend server running on port ${port}`);
  console.log(`📊 Metrics API available at: http://localhost:${port}/api/metrics`);
  console.log(`🩺 Health check available at: http://localhost:${port}/api/health`);
});

export default app;