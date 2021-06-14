import { Request, Response } from 'express';
import crawler from '../crawler';

export async function getByPage(req: Request, res: Response) {
    try {
        const page = res.locals.page;
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
