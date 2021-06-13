import axios, { AxiosResponse } from 'axios';

type PostType = {
    [key: string]: string;
};

type RegexOnjectType = {
    [key: string]: RegExp;
};

// TODO: Modularize this function
function formatter(data: string[], result: Object[] = []) {
    const trimmedData = data.join('').replace(/(\r\n|\n|\r)/gm, '');

    const regexMatcher = (item: string, regex: RegExp, type = 'Type') => {
        return regex.test(item)
            ? item.match(regex)![1]
            : `${type.toUpperCase()} NOT FOUND (\´･_･\`)`;
    };

    const regularExpressions: RegexOnjectType = {
        rank: /<span class="rank"(.*?)<\/span>/, //✅
        author: /<a href="user(.*?)class="hnuser(.*?)<\/a>/,
        site: /<span class="sitestr"(.*?)<\/span>/, // ✅
        title: /class="storylink"(.*?)<\/a>/, //✅
        link: /<td class="title"><a href="(.*?)>/, //✅
        score: /<span class="score"(.*?)<\/span>/, //✅
        age: /<span class="age"(.*?)<\/span>/, //✅
        comments: /([0-9]|[1-9][0-9]|[1-9][0-9][0-9])&nbsp;comments/, // TODO: Fix this
    };
    const generalMatch = {
        athings: trimmedData.match(/<tr(.*?)class='athing'(.*?)<\/tr>/g)!,
        subtexts: trimmedData.match(/<td class=('|")subtext('|")(.*?)<\/td>/g)!,
    };

    const allGeneralMatches = generalMatch.subtexts.map(
        (item: string, index: number) =>
            item.concat(generalMatch.athings[index])
    );

    const cleanResult = (post: PostType, key: string) => {
        if (post[key].includes('NOT FOUND (´･_･`)')) return post[key];
        switch (key) {
            case 'rank':
                post[key] = post[key].slice(1, -1);
                break;
            case 'author':
                post[key] = post[key].slice(4, -2);
                break;
            case 'site':
            case 'title':
                post[key] = post[key].slice(1);
                break;
            case 'link':
                post[key] = post[key].split('"')[0];
                break;
            case 'score':
                post[key] = post[key].split('>')[1];
                break;
            case 'age':
                post[key] = post[key].split('>')[2].slice(0, -3);
                break;
            default:
                break;
        }
    };

    allGeneralMatches.forEach((item: string) => {
        const post: PostType = {};
        for (const regex in regularExpressions) {
            const currentRegex = regularExpressions[regex];
            post[regex] = regexMatcher(item, currentRegex, regex);
            cleanResult(post, regex);
        }
        result.push(post);
    });

    return result;
}

async function crawler(page = '1', mode = 'news?p=') {
    try {
        const host = 'https://news.ycombinator.com/';

        const urls = [];
        let numberPages = parseInt(page);
        if (numberPages >= 5)
            throw new Error("Can't find this page at Hacker News");

        for (let index = 0; index < numberPages; index++) {
            urls.push(host + mode + (index + 1));
        }

        const responses = urls.map(async url => {
            const response = await axios.get(url);
            return response.data;
        });

        const data: string[] = await Promise.all(responses);

        const formatted = formatter(data);

        return formatted;
    } catch (error) {
        return error.message;
    }
}

export default crawler;
