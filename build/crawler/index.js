var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from 'axios';
function formatter(response, result) {
    if (result === void 0) { result = []; }
    var trimmedData = response.data.replace(/(\r\n|\n|\r)/gm, '');
    var regularExpressions = {
        athing: /<tr(.*?)class='athing'(.*?)<\/tr>/g,
        subtext: /<td class=('|")subtext('|")(.*?)<\/td>/g,
        rank: /<span class="rank"(.*?)<\/span>/g,
        author: /<a href="user(.*?)class="hnuser(.*?)<\/a>/,
        site: /<span class="sitestr"(.*?)<\/span>/g,
        title: /class="storylink"(.*?)<\/a>/g,
        link: /<td class="title"><a href="(.*?)>/g,
        score: /<span class="score"(.*?)<\/span>/g,
        age: /<span class="age"(.*?)<\/span>/g,
        comments: /<a href="item(.*?)&nbsp;comments<\/a>/g, //❌
    };
    var generalMatch = {
        athings: trimmedData.match(regularExpressions.athing),
        subtexts: trimmedData.match(regularExpressions.subtext),
    };
    var count = 0;
    var allGeneralMatches = generalMatch.athings.map(function (item) {
        count++;
        return item.concat(generalMatch.subtexts[count]);
    });
    allGeneralMatches.forEach(function (item) {
        var post = {};
        post.rank = item.match(regularExpressions.rank)[0];
        post.title = item.match(regularExpressions.title)[0];
        post.link = item.match(regularExpressions.link)[0];
        post.author = item.match(regularExpressions.author)[0];
        // post.site = item.match(regularExpressions.site)![0];
        post.score = item.match(regularExpressions.score)[0];
        post.age = item.match(regularExpressions.age)[0];
        // post.comments = item.match(regularExpressions.comments)![0];
        result.push(post);
    });
    return result;
}
function crawler(page, mode) {
    if (page === void 0) { page = 1; }
    if (mode === void 0) { mode = 'news?p='; }
    return __awaiter(this, void 0, void 0, function () {
        var host, response, formatted, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    host = 'https://news.ycombinator.com/';
                    return [4 /*yield*/, axios.get(host + mode + page)];
                case 1:
                    response = _a.sent();
                    formatted = formatter(response);
                    return [2 /*return*/, formatted];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, error_1.message];
                case 3: return [2 /*return*/];
            }
        });
    });
}
export default crawler;
