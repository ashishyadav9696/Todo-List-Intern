require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db.js');
const pc = require('picocolors');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then boot server
const startServer = async () => {
  // Connect database
  await connectDB();

  // Start listening
  const server = app.listen(PORT, () => {
    console.log(pc.green(`🚀 [server] Server is active and operational`));
    console.log(pc.yellow(`🔗 [server] Local Address: http://localhost:${PORT}`));
    console.log(pc.cyan(`📡 [server] Mode: ${process.env.NODE_ENV || 'development'}`));
  });

  // Handle Unhandled Promise Rejections (e.g. database connection drop)
  process.on('unhandledRejection', (err) => {
    console.error(pc.red(`🔥 [server] Unhandled Promise Rejection: ${err.message}`));
    console.log(pc.yellow(`⚠️ [server] Gracefully shutting down due to error...`));
    server.close(() => process.exit(1));
  });
};

startServer();
