import express from 'express';
import morgan from 'morgan';
import path from 'path';

import Config from '@app/config';
import Logger from '@app/util/Logger';
import ApiRouter from '@app/api';
import { connectToDatabase } from '@app/db';


// Config
const STATIC_ROOT = path.join(__dirname, '../public');

// Create application
const app = express();

// Middleware
// Request logging
app.use(morgan('combined'));
// Serve the frontend
app.use(express.static(STATIC_ROOT));

// Register /api route
app.use('/api', ApiRouter);

// All other requests will be served the frontend
app.get('*', (req, res) => {
  res.sendFile(path.resolve(STATIC_ROOT, 'index.html'));
});

async function main() {
  // Establish connection to database
  await connectToDatabase();

  // Run server
  app.listen(Config.SERVER.PORT, function () {
    Logger.log(`Server listening on port ${Config.SERVER.PORT}`);
  });
}
main();
