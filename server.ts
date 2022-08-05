import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Logger } from "./src/utils/Logger";
dotenv.config();

const app: Application = express();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Logger.getHttpLoggerInstance());

app.listen(PORT, (): void => {
   console.log(`Server running at 'http://${HOST}:${PORT} 🚀'`);
})