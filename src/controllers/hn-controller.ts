import { Request, Response } from 'express';
import { checkCachePages } from '../cache';
import crawler from '../crawler';

export async function getByPage(req: Request, res: Response) {
    try {
        let { page } = req.params;
        if (page === undefined) page = '1';
        let numberPages = parseInt(page);

        if (numberPages - checkCachePages() >= 5 || !numberPages)
            return res.status(404).send({
                data: null,
                message:
                    "Can't retrieve more than 4 pages at the same time from Hacker News",
            });

        const response = await crawler(page);

        if (!response) {
            return res
                .status(404)
                .send({ data: null, message: "Can't connect to Hacker News" });
        }

        return res.status(200).send(response);
    } catch ({ name, message }) {
        console.log(name);
        res.status(500).send({ message });
    }
}
