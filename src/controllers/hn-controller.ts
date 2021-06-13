import { Request, Response } from 'express';
import crawler from '../crawler';

export async function getByPage(req: Request, res: Response) {
    try {
        let { page } = req.params;
        if (page === undefined) page = '1';
        let numberPages = parseInt(page);
        if (numberPages >= 5 || !numberPages)
            return res.status(404).send({
                data: null,
                message: "Can't find this page at Hacker News",
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
