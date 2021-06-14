type CacheType = {
    data: Object[];
    pages: number;
};

const cache: CacheType = {
    data: [],
    pages: 0,
};

function saveOnCache(data: Object[], pages: number) {
    cache.data = data;
    cache.pages = pages;
}

function extractFromCache(pages: number) {
    return cache.data.slice(0, 30 * pages);
}

function checkCachePages() {
    return cache.pages;
}

export { cache, saveOnCache, extractFromCache, checkCachePages };
