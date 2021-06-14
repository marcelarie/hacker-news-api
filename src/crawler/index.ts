import axios from 'axios';
import {
    cache,
    checkCachePages,
    extractFromCache,
    saveOnCache,
} from '../cache';

type PostType = {
    [key: string]: string;
};

type RegexOnjectType = {
    [key: string]: RegExp;
};

function cleanResult(post: PostType, key: string) {
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
}

function postsGeneretor(data: string[], pages = '1', result: Object[] = []) {
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
        comments: /([0-9]+)&nbsp;comment./, // ✅
    };

    // Create two arrays of the 2 main containers from the html data
    const generalMatch = {
        athings: trimmedData.match(/<tr(.*?)class='athing'(.*?)<\/tr>/g)!,
        subtexts: trimmedData.match(/<td class=('|")subtext('|")(.*?)<\/td>/g)!,
    };

    // New array with the content of each post from both athings ans subtexts
    const allGeneralMatches = generalMatch.subtexts.map(
        (item: string, index: number) =>
            item.concat(generalMatch.athings[index])
    );

    if (checkCachePages() && checkCachePages() < parseInt(pages)) {
        result = extractFromCache(checkCachePages());
    }

    // Generate a object, for each match, with the keys from the
    // regularExpressions to push it in the result array
    allGeneralMatches.forEach((item: string) => {
        const post: PostType = {};
        for (const regex in regularExpressions) {
            const currentRegex = regularExpressions[regex];
            post[regex] = regexMatcher(item, currentRegex, regex);
            cleanResult(post, regex);
        }
        result.push(post);
    });

    if (checkCachePages() < parseInt(pages)) {
        saveOnCache(result, parseInt(pages));
    }

    return result;
}

// Generate one data from multiple calls to Hacker News
async function crawlerMultiCall(page: string, mode: string) {
    const host = 'https://news.ycombinator.com/';

    const urls = [];
    let numberPages = parseInt(page);
    for (let index = 0 + checkCachePages(); index < numberPages; index++) {
        urls.push(host + mode + (index + 1));
    }
    console.log('Retrieving data from ' + urls);

    if (urls.length > 0) {
        try {
            const responses = urls.map(async url => {
                const response = await axios.get(url);
                return response.data;
            });

            const data: string[] = await axios.all(responses);
            return data;
        } catch (error) {
            return error.message;
        }
    } else {
        return false;
    }
}

async function crawler(page = '1', mode = 'news?p=') {
    try {
        const data = await crawlerMultiCall(page, mode);

        if (!data) {
            return extractFromCache(parseInt(page));
        }

        const posts = postsGeneretor(data, page);

        return posts;
    } catch (error) {
        return error.message;
    }
}

export default crawler;
