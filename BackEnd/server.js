import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser()); 

app.get('/api', (req, res) => {
  res.send('API is running successfully.');
});



app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

const intialization = async() => {
    try {
      await connectDB()
      app.listen(PORT ,  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
    } catch(err){
      console.log( "Error is " + err)
    }
}

intialization();