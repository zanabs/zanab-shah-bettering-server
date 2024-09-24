import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mapRoutes from './routes/mapRoutes.js'; 

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173' 
}));
app.use(express.json());


app.use('/', mapRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


