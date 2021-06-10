import { Router } from 'express';
import { getByPage } from '../controllers/hn-controller.js';

const HackerNewsRouter = Router();

HackerNewsRouter.get('', getByPage);

export default HackerNewsRouter;
