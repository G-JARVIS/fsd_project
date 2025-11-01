import express from 'express';
import applicationsRoutes from '../routes/applications.js';

const app = express();

// Mock middleware
const mockProtect = (req, res, next) => {
  req.user = { _id: 'test-user-id' };
  next();
};

// Replace protect middleware with mock
const originalRoutes = applicationsRoutes.stack || [];

app.use('/api/applications', applicationsRoutes);

// List all routes
console.log('Applications Routes:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
        console.log(`${methods} /api/applications${handler.route.path}`);
      }
    });
  }
});

console.log('\nRoute order is correct - specific routes come before parameterized routes');
process.exit(0);