import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {catchError, firstValueFrom} from 'rxjs';
import {AxiosError} from 'axios';
import {addDays, endOfMonth, format, startOfMonth} from 'date-fns';
import {ArticleCountParams, MostViewedDayParams, MostViewedParams} from "./requests";

interface MostViewedCount {
  [articleId: string]: number;
}

@Injectable()
export class AppService {
  TOP_ARTICLE_URL =
    'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/';
  ARTICLE_VIEWS_URL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/'

  constructor(private readonly httpService: HttpService) {
  }

  /**
   * This is an expensive calculation, so it would be better to have a daily job
   * that can collect these values and persist them somewhere instead of calculating
   * here every time. Once caught up it would only have to do one day every run.
   * @param params
   */
  async getMostViewed(params: MostViewedParams): Promise<any> {
    const results: MostViewedCount = {};
    const maxDay = params.timeframe == 'week' ? 7 : 30;
    for (let searchDayOffset = 0; searchDayOffset < maxDay; searchDayOffset++) {
      const date: Date = new Date(params.date);
      const dayToSearch = addDays(date, searchDayOffset);
      const formatted = format(dayToSearch, 'MM/dd/yyyy');
      const [month, day, year] = formatted.split('/');
      const requestUrl = `${this.TOP_ARTICLE_URL}${year}/${month}/${day}`;
      const wikiData = await this.getWikipediaData(requestUrl);
      console.log(JSON.stringify(wikiData, null, 2))
      wikiData.items[0].articles.map((article) => {
        if (article.article in results) {
          results[article.article] = results[article.article] + article.views;
        } else {
          results[article.article] = article.views;
        }
      });
    }

    const entries = Object.entries(results);
    return entries.sort(([keyA, a], [keyB, b]) => {
      if (typeof keyA === 'number' && typeof keyB === 'number') {
        return b - a;
      } else if (typeof keyA === 'number') {
        return -1;
      } else if (typeof keyB === 'number') {
        return 1;
      } else {
        return b - a;
      }
    });
  }

  async getArticleViewCount(articleCountParams: ArticleCountParams): Promise<any> {
    const dateOffset = articleCountParams.timeframe == 'week' ? 7 : 30;
    const firstDay: Date = new Date(articleCountParams.date);
    const lastDay: Date = addDays(firstDay, dateOffset);
    const firstFormatted = format(firstDay, 'MM/dd/yyyy');
    const lastFormatted = format(lastDay, 'MM/dd/yyyy');
    const [firstMonth, firstDate, firstYear] = firstFormatted.split('/');
    const [lastMonth, lastDate, lastYear] = lastFormatted.split('/');
    const requestUrl = `${this.ARTICLE_VIEWS_URL}${articleCountParams.articleId}/daily/${firstYear}${firstMonth}${firstDate}/${lastYear}${lastMonth}${lastDate}`;
    const wikiData = await this.getWikipediaData(requestUrl);
    let viewCount = 0
    for (let viewDay of wikiData.items) {
      viewCount += viewDay.views
    }
    return viewCount
  }

  async getArticleMostViewedDay(mostViewedDayParams: MostViewedDayParams): Promise<any> {
    const date: Date = new Date(mostViewedDayParams.date);
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const firstFormatted = format(monthStart, 'MM/dd/yyyy');
    const lastFormatted = format(monthEnd, 'MM/dd/yyyy');
    const [firstMonth, firstDate, firstYear] = firstFormatted.split('/');
    const [lastMonth, lastDate, lastYear] = lastFormatted.split('/');
    const requestUrl = `${this.ARTICLE_VIEWS_URL}${mostViewedDayParams.articleId}/daily/${firstYear}${firstMonth}${firstDate}/${lastYear}${lastMonth}${lastDate}`;
    const wikiData = await this.getWikipediaData(requestUrl);
    let highCount = 0
    let highCountDate = ""
    for (let viewDay of wikiData.items) {
      if(viewDay.views > highCount) {
        highCount = viewDay.views
        highCountDate = viewDay.timestamp
      }
    }
    return {highCount, highCountDate}
  }
  getWikipediaData = async (wikipediaUrl: string) => {
    const {data} = await firstValueFrom(
      this.httpService.get(wikipediaUrl).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
        }),
      ),
    );

    return data;
  };
}
