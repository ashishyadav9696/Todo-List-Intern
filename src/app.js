const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { protect } = require('./middleware/authMiddleware');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Standard Industry Morgan Logger
app.use(morgan('dev'));

// 3. Serve Frontend Static Site (HTML + CSS + JS) from /src/public
app.use(express.static(path.join(__dirname, 'public')));

// 4. API Health Status Endpoint
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 5. Register Auth routes (public)
app.use('/api/auth', authRoutes);

// 6. Register Todo routes (protected with JWT)
app.use('/api/todos', protect, todoRoutes);

// 7. Global Catch-all error middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
