const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use('/', urlRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection failed:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
