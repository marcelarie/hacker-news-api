import { Router } from 'express';
import { getByPage } from '../controllers/hn-controller';

const HackerNewsRouter = Router();

HackerNewsRouter.get('/', getByPage);
HackerNewsRouter.get('/:page', getByPage);

export default HackerNewsRouter;
