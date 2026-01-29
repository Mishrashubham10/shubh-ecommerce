import "./config/env.js";

import app from './app.js';
import connectDB from './config/db.js';

// CONNECT TO MONGODB FIRST
connectDB();

const PORT = process.env.PORT || 5000;

// START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});