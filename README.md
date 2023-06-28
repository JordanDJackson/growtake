
## Description
This is a project to act as a wrapper over the wikipedia page count api
It exposes 3 endpoints that can be used to retrieve information about either
a particular article on Wikipedia or Top article for a specific timeframe

Here are some quick descriptions of the endpoints:

1. Get most viewed articles
    This endpoint will return the most viewed articles for a timeframe that is given by the user.
    It accepts two parameters `date` and `timeframe` which are both mandatory. The date is where
    the user wants to start their window to look for articles. Date is expected in the format
    "2021/12/31". Timeframe can either be "week" or "month" or the request will not be processed.
    Note: Month will get 30 days ahead.

2. Get view count for a specific article
    This endpoint will return the view count for a article for a timeframe that is given by the user.
    It accepts the same two parameters `date` and `timeframe` in addition to an `articleId`. All of
    these are necessary as well. The date and timeframe are expected as above

3. Get highest view count day in a month for a specific article
    This endpoint will return the view count for the day with the highest count for a specific month
    It accepts the same two parameters `date` and `articleId`. Both are mandatory.
    The date here is signifies the month you wanted to inspect October then use "2022/10/31" or "2022/10/01".
    The Day is not used here.

## Running the app

```bash
$ yarn
$ yarn run start
```

After starting the app you can visit `http://localhost:3000/api#/wiki` to interact with the endpoints via Swagger.
Which has documentation to make interacting with the endpoints easier.

## Test

```bash
# unit tests
$ yarn run test



