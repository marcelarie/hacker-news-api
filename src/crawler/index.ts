import axios from 'axios';

async function crawler(page = 1, mode = 'news?p') {
    try {
        const host = 'https://news.ycombinator.com/';
        const response = await axios.get(host + mode + page);
        // const regexUrl = RegExp((http|ftp|https)://([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?)

        const formatted = response.data.match(/<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g);

        return formatted;
    } catch (error) {
        return error.message;
    }
}

export default crawler;
