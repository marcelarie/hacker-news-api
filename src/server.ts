import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { HackerNewsRouter } from './routes';
import { cleanCache } from './cache';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.get('/favicon.ico', (req, res) => res.status(204)); // Temporal fix favicon call

app.use('/', HackerNewsRouter);

cleanCache()

export default app;
