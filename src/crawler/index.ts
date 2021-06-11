import axios, { AxiosResponse } from 'axios';

type PostType = {
    [key: string]: string;
};

function formatter(response: AxiosResponse, result: Object[] = []) {
    const trimmedData = response.data.replace(/(\r\n|\n|\r)/gm, '');
    const regularExpressions = {
        athing: /<tr(.*?)class='athing'(.*?)<\/tr>/g,
        subtext: /<td class=('|")subtext('|")(.*?)<\/td>/g,
        rank: /<span class="rank"(.*?)<\/span>/g, //✅
        author: /<a href="user(.*?)class="hnuser(.*?)<\/a>/,
        site: /<span class="sitestr"(.*?)<\/span>/g, // ❌
        title: /class="storylink"(.*?)<\/a>/g, //✅
        link: /<td class="title"><a href="(.*?)>/g, //✅
        score: /<span class="score"(.*?)<\/span>/g, //✅
        age: /<span class="age"(.*?)<\/span>/g, //✅
        comments: /<a href="item(.*?)&nbsp;comments<\/a>/g, //❌
    };
    const generalMatch = {
        athings: trimmedData.match(regularExpressions.athing),
        subtexts: trimmedData.match(regularExpressions.subtext),
    };

    let count = 0;
    const allGeneralMatches = generalMatch.athings.map((item: string) => {
        count++;
        return item.concat(generalMatch.subtexts[count]);
    });

    allGeneralMatches.forEach((item: string) => {
        const post: PostType = {};
        post.rank = item.match(regularExpressions.rank)![0];
        post.title = item.match(regularExpressions.title)![0];
        post.link = item.match(regularExpressions.link)![0];
        post.author = item.match(regularExpressions.author)![0];
        // post.site = item.match(regularExpressions.site)![0];
        post.score = item.match(regularExpressions.score)![0];
        post.age = item.match(regularExpressions.age)![0];
        // post.comments = item.match(regularExpressions.comments)![0];
        result.push(post);
    });

    return result;
}
async function crawler(page = 1, mode = 'news?p=') {
    try {
        const host = 'https://news.ycombinator.com/';
        const response = await axios.get(host + mode + page);

        const formatted = formatter(response);

        return formatted;
    } catch (error) {
        return error.message;
    }
}

export default crawler;
