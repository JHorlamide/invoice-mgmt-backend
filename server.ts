import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {

})