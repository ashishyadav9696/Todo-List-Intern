const mongoose = require('mongoose');
const pc = require('picocolors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_db');
    console.log(pc.cyan(`⚡ [database] MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(pc.red(`❌ [database] Error connecting to MongoDB: ${error.message}`));
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
