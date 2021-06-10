import { Request, Response } from 'express';
import crawler from '../crawler/index.js';

export async function getByPage(req: Request, res: Response) {
    try {
        const response = await crawler();

        if (!response) {
            return res.status(404).send({ data: null, message: response });
        }
        console.log(response);

        return res.status(200).send(response);
    } catch ({ message }) {
        res.status(500).send({ message });
    }
}
