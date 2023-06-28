import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HttpService} from "@nestjs/axios";
import {ArticleCountParams, MostViewedDayParams, MostViewedParams} from "./requests";
import {MostViewedDayResponse, MostViewedResponse, ViewCountResponse} from "./responses";

const MOCK_MOST_VIEWED_RESPONSE: any = {
  "mostViewedIds": [
    [
      "Main_Page",
      38790571
    ],
    [
      "Special:Search",
      10065055
    ],
    [
      "Squid_Game",
      3648021
    ],
  ]
}

const MOCK_ARTICLE_VIEW_COUNT_RESPONSE: any = {
  "viewCount": 150061
}

const MOCK_MOST_VIEWED_DAY_RESPONSE: any = {
  "viewCount": 21160,
  "date": "2021100700"
}

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
      appService = new AppService(new HttpService())
      appController = new AppController(appService)
    });

    describe('Wikipedia API wrapper', () => {
      it('should return articles as an array of tuples for top view count', async () => {
        jest.spyOn(appService, 'getMostViewed').mockImplementation(() => MOCK_MOST_VIEWED_RESPONSE.mostViewedIds);
        expect(await appController.getMostViewed(
          new MostViewedParams(
            "2021/10/10", "week"
          )
        )).toStrictEqual(new MostViewedResponse(MOCK_MOST_VIEWED_RESPONSE.mostViewedIds));
      });

      it('should return a message if timeframe is incorrect for top view count', async () => {
        jest.spyOn(appService, 'getMostViewed').mockImplementation(() => MOCK_MOST_VIEWED_RESPONSE);
        expect(await appController.getMostViewed(
          new MostViewedParams(
            "2021/10/10", "day"
          )
        )).toBe("Time is required and must be \"week\" or \"month\"");
      });

      it('should return view count for an article', async () => {
        jest.spyOn(appService, 'getMostViewed').mockImplementation(() => MOCK_ARTICLE_VIEW_COUNT_RESPONSE);
        expect(await appController.getArticleViewCount(
          new ArticleCountParams(
            "2021/10/10", "week", "Albert_Einstein"
          )
        )).toStrictEqual(new ViewCountResponse(MOCK_ARTICLE_VIEW_COUNT_RESPONSE.viewCount));
      });

      it('should return a message if timeframe is incorrect for article view count', async () => {
        jest.spyOn(appService, 'getMostViewed').mockImplementation(() => MOCK_MOST_VIEWED_RESPONSE);
        expect(await appController.getArticleViewCount(
          new ArticleCountParams(
            "2021/10/10", "day", "Albert_Einstein"
          )
        )).toBe("Time is required and must be \"week\" or \"month\"");
      });

      it('should return view count and the date with that high count', async () => {
        jest.spyOn(appService, 'getMostViewed').mockImplementation(() => MOCK_MOST_VIEWED_DAY_RESPONSE);
        expect(await appController.getDateWithMostViews(
          new MostViewedDayParams(
            "2021/10/10", "Albert_Einstein"
          )
        )).toStrictEqual(new MostViewedDayResponse(MOCK_MOST_VIEWED_DAY_RESPONSE.viewCount, MOCK_MOST_VIEWED_DAY_RESPONSE.date));
      });
    });
  }
)
;
