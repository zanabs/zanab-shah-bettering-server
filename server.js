import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mapRoutes from './src/routes/mapRoutes.js'; 
import aiRoutes from './src/routes/aiRoutes.js'; 
import twilioRoutes from './src/routes/twilioRoutes.js';  

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173' 
}));
app.use(express.json());


app.use('/', mapRoutes);
app.use('/ai/', aiRoutes);
app.use('/twi/', twilioRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


