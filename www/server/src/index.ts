import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import { connectToDatabase } from '@common/db';
import Logger from '@common/util/Logger';

import Config from '@app/config';
import ApiRouter from '@app/api';


// Config
const STATIC_ROOT = path.join(__dirname, '../public');

// Create application
const app = express();

// Middleware
// Request logging
app.use(morgan('combined'));
// Serve the frontend
app.use(express.static(STATIC_ROOT));

// Development-only middleware
if (process.env.NODE_ENV === 'development') {
  // Allow all origins in CORS
  app.use(cors());
}

// Register /api route
app.use('/api', ApiRouter);

// All other requests will be served the frontend
app.get('*', (req, res) => {
  res.sendFile(path.resolve(STATIC_ROOT, 'index.html'));
});

async function main() {
  // Establish connection to database
  await connectToDatabase(Config.DB);

  // Run server
  app.listen(Config.SERVER.PORT, function () {
    Logger.log(`Server listening on port ${Config.SERVER.PORT}`);
  });
}
main();
