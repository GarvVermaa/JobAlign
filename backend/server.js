import express from 'express';
import cors from 'cors';
import analysisRouter from './routes/analysis.js'

const app=express();

app.use(cors({
  origin: [
    "https://garvvermaa.github.io",
    "http://localhost:3000",
    "http://localhost:5500"
  ]
}))

app.use(express.json());
app.use(express.static('../frontend')); 

app.use('/api/analysis',analysisRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'node-backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
  console.log(`Serving frontend from http://localhost:${PORT}`);
  console.log(` API available at http://localhost:${PORT}/api`);
});
