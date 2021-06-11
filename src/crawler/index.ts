import axios, { AxiosResponse } from 'axios';

interface RegExpInterface {
    [key: string]: RegExp[];
}
interface MatchListInterface {
    [key: string]: string[];
}
type PostType = {
    [key: string]: string;
};

function formatter(response: AxiosResponse, result: Object[] = []) {
    const trimmedData = response.data.replace(/(\r\n|\n|\r)/gm, '');
    const regularExpressions = {
        athing: /<tr(.*?)class='athing'(.*?)<\/tr>/g,
        subtext: /<td class=('|")subtext('|")(.*?)<\/td>/g,
        rank: /<span class="rank"(.*?)<\/span>/g,
        author: /<a href="user(.*?)class="hnuser(.*?)<\/a>/,
        site: /<span class="sitestr"(.*?)<\/span>/g,
        link: /<a(.*?) class="storylink"(.*?)<\/a>/g,
        score: /<span(.*?)class="score"(.*?)<\/span>/g,
        age: /<span class="age"(.*?)<\/span>/g,
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
        // ranks: array.match(regularExpressions.rank),
        const author = item.match(regularExpressions.author)![0];
        post.author = author;
        console.log(author);
        // sites: array.match(regularExpressions.site),
        // links: array.match(regularExpressions.link),
        // scores: array.match(regularExpressions.score),
        // ages: array.match(regularExpressions.age),
        result.push(post);
    });
    //     generalMatch.athings.forEach((item: string) => {
    //         const post: PostType = {};
    //         const separatedIetem = item.split('"');
    //         console.log(separatedIetem);
    //         post.title = separatedIetem[4].slice(1, -4);
    //         post.link = separatedIetem[1];
    //         item.match(regularExpressions.link);
    //     });
    //
    //     return result;

    // console.log(generalMatch.athings.length);
    // console.log(generalMatch.subtexts.length);
    // console.log(matchList.ranks.length);
    // const authors = matchList(generalMatch);
    // console.log(authors);
    // console.log(matchList.sites.length);
    // console.log(matchList.links.length);
    // console.log(matchList.scores.length);
    // console.log(matchList.ages.length);

    return result;
}
async function crawler(page = 1, mode = 'news?p') {
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
