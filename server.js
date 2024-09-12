
import express from 'express';
import cors from 'cors';
import dotenv  from 'dotenv';


dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello World! Meet Bettering :)))');
});
app.listen(port, () => {
  console.log(`Server up and running on http://localhost:${port}`);
});

