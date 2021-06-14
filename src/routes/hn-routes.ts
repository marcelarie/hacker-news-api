import { Router } from 'express';
import { getByPage } from '../controllers/hn-controller';
import { pageRequestHandler } from '../middlewares/page-request-handler';

const HackerNewsRouter = Router();

HackerNewsRouter.get('/', getByPage);
HackerNewsRouter.get('/:page', pageRequestHandler,getByPage);

export default HackerNewsRouter;
