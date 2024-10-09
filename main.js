require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());

// Frame-Limit
const requestCounts = {}; // redis alternative
const rateLimitWindowMs = 30 * 1000; // 30 seconds
const maxRequests = 20; // Max requests per IP per windowMs

const rateLimiter = async (req, res, next) => {
  const userId = req.ip;
  const currentTime = Date.now();
  const windowStart = currentTime - rateLimitWindowMs;

  if (!requestCounts[userId]) {
    requestCounts[userId] = { count: 0, startTime: currentTime };
  }
  const requestData = requestCounts[userId];

  try {

    if (requestData.startTime < windowStart) {
      requestData.count = 0;
      requestData.startTime = currentTime;
    }
    else if (requestData.count >= maxRequests) {
      return res.status(429).send('Too many requests, please try again later.');
    }
    requestData.count += 1; // Increment the count
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
  finally { return }
};

// Routes
const router = require('./src/routes')
app.use('/api/v1', rateLimiter, router);

// Landing page
app.get('/', (req, res) => {
  res.send('Welcome to the To Do List API! For further information, please refer to the documentation');
});
app.use((req, res, next) => {
  res.redirect(`${req.protocol}://${req.get('host')}`);
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server