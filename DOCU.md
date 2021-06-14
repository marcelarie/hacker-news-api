## Documentation

### Cache

The API uses a custom cache in memory that clears every 5 minutes. If the user
haves done a call of `3` pages, and then asks for `4`, the API will use that 
cache to only search for the page number `4`.

### Endpoints

**HOST** `http://localhost:8080/`

1.1 **Root call**

The root of the API returns the first page of Hacker News, that will be the top
30 news in that instant, in a array of objects.

`GET` to `http://localhost:8080/`

```json
[
    {
        "rank": "1",
        "author": "kregasaurusrex",
        "site": "youtube.com",
        "title": "Doom Running on an IKEA Lamp [video]",
        "link": "https://www.youtube.com/watch?v=7ybybf4tJWw",
        "score": "534 points",
        "age": "8 hours ago",
        "comments": "134"
    },
    {
        "rank": "2",
        "author": "lukastyrychtr",
        "site": "jakobmeier.ch",
        "title": "Untapped potential in Rust's type system",
        "link": "https://www.jakobmeier.ch/blogging/Untapped-Rust.html",
        "score": "61 points",
        "age": "3 hours ago",
        "comments": "134"
    },
    ... total of 30
]
```

1.1 **Get multiple pages**

If we pass a number to the enpoint, for example `3`, the API will return the
first 3 pages of Hacker News. That will be `90` news in order.

`GET` to `http://localhost:8080/3`

```json
[
    {
        "rank": "1",
        "author": "kregasaurusrex",
        "site": "youtube.com",
        "title": "Doom Running on an IKEA Lamp [video]",
        "link": "https://www.youtube.com/watch?v=7ybybf4tJWw",
        "score": "534 points",
        "age": "8 hours ago",
        "comments": "134"
    },
    ...total of 90
]
```

Right now the API can only make 4 calls at a time so if we don't have anything on
cache and we try to ask for more than `4` pages like so:

`GET` to `http://localhost:8080/5`

The API will respond with a message.

```json
{
    "data": null,
    "message": "Can't retrieve more than 4 pages at the same time from Hacker News"
}
```

This is something temporal and is in the list of prioritis, for the moment the
work around will be do first a call of 4 pages and then a call of the other 4
like this:

`GET` to `http://localhost:8080/4` & `GET` to `http://localhost:8080/8`
