require('dotenv').config();
const express = require('express');
const cors = require('cors');
const policyRoutes = require('./routes/policyRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/api/policies', policyRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
