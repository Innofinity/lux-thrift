const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Basic route
app.get('/', (req, res) => {
    res.send('LuxThrift API is running...');
});

// Routes
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/crm', require('./routes/crmRoutes'));

// Existing Routes (Future implementation)
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/upload', require('./routes/uploadRoutes'));
// app.use('/api/payment', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
