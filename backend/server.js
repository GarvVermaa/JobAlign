import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import analysisRouter from './routes/analysis.js'
import userRouter from './routes/user.js'



const app=express();

//connect to mongoDB
connectDB(); 

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend')); 

app.use('/api/analysis',analysisRouter);
app.use('/api/user',userRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'node-backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
  console.log(`Serving frontend from http://localhost:${PORT}`);
  console.log(` API available at http://localhost:${PORT}/api`);
});