import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import sequelize from './config/db.js';
import userRoutes from './routes/user.route.js';
import { use } from 'react';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api/dashboard', (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ message: 'Welcome to the dashboard!' });
});

app.use(errorHandler);

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


