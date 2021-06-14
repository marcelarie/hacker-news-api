import { NextFunction, Request, Response } from 'express';
import { checkCachePages } from '../cache';

export async function pageRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { page } = req.params;
        if (page === undefined) page = '1';
        let numberPages = parseInt(page);

        const callLimit = 4;
        if (!numberPages) {
            return res.status(400).send({
                data: null,
                message: `Please use a number to request the pages from Hacker News.`,
                example: 'http://localhost:8080/2',
            });
        }
        if (numberPages - checkCachePages() > callLimit)
            return res.status(429).send({
                data: null,
                message: `Can't retrieve more than ${callLimit} pages at the same time from Hacker News`,
            });
        res.locals.page = page;
        next();
    } catch (error) {
        next(error);
    }
}
