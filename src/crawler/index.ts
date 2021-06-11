import axios, { AxiosResponse } from 'axios';

interface RegExpInterface {
    [key: string]: RegExp;
}
type PostType = {
    [key: string]: string;
};

function formatter(
    response: AxiosResponse,
    regex: RegExpInterface,
    result: Object[] = []
) {
    const post: PostType = {};
    for (const expression in regex) {
        const matches = response.data.match(regex[expression]);

        matches.forEach((itemMatch: string) => {
            if (expression === 'link') {
                console.log(itemMatch);
                const separatedIetem = itemMatch.split('"');
                post.title = separatedIetem[4].slice(1, -4);
                post[expression] = separatedIetem[1];
            }
        });
        result.push(post);
    }
    return result;
}
async function crawler(page = 1, mode = 'news?p') {
    try {
        const host = 'https://news.ycombinator.com/';
        const response = await axios.get(host + mode + page);

        const regularExpressions = {
            link: /<a[\s]+([^>]+)class="storylink">((?:.(?!\<\/a\>))*.)<\/a>/g,
            score: /<span class="score"(.*?)<\/span>/g,
            user: /<a[\s]+([^>]+)class="hnuser">((?:.(?!\<\/a\>))*.)<\/a>/g,
            age: /<span class="age"(.*?)<\/span>/g,
        };

        const formatted = formatter(response, regularExpressions);

        // while (formatted !== null) {
        //     console.log(formatted[2]);
        // }

        return formatted;
    } catch (error) {
        return error.message;
    }
}

export default crawler;
