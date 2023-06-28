import {Controller, Get, HttpException, HttpStatus, Param, UsePipes} from '@nestjs/common';
import {AppService} from './app.service';
import {ApiCreatedResponse, ApiTags} from '@nestjs/swagger';
import {ArticleCountParams, MostViewedDayParams, MostViewedParams} from "./requests";
import {MostViewedDayResponse, MostViewedResponse, ViewCountResponse} from "./responses";

/**
 * Endpoint params will be validated by the framework decorators found in requests.ts
 */
@Controller()
@ApiTags('wiki')
export class AppController {
  constructor(private readonly appService: AppService) {}

  TIMEFRAMES = ['week', 'month'];
  TIMEFRAME_ERROR = 'Time is required and must be "week" or "month"'
  DATE_ERROR = 'Time must not be in the future'

  isTimeInFuture = (date: Date): boolean => {
    return new Date(date).getTime() > new Date().getTime()
  }

  /**
   * This endpoint will return the most viewed articles for a timeframe that is given by the user.
   * @param params
   */
  @Get('most-viewed/:timeframe/:date')
  @ApiCreatedResponse({ type: MostViewedResponse })
  @UsePipes(MostViewedParams)
  async getMostViewed(@Param() params: MostViewedParams): Promise<any> {
    if (!this.TIMEFRAMES.includes(params.timeframe)) {
      throw new HttpException(this.TIMEFRAME_ERROR, HttpStatus.BAD_REQUEST);
    } else if (this.isTimeInFuture(params.date)) {
      throw new HttpException(this.DATE_ERROR, HttpStatus.BAD_REQUEST);
    } else {
      const articleCounts = await this.appService.getMostViewed(params);
      return new MostViewedResponse(articleCounts);
    }
  }

  /**
   * This endpoint will return the view count for an article for a timeframe that is given by the user.
   * @param params
   */
  @Get('view-count/:timeframe/:date/:articleId')
  @ApiCreatedResponse({ type: ViewCountResponse })
  @UsePipes(ArticleCountParams)
  async getArticleViewCount(@Param() params: ArticleCountParams): Promise<any> {
    if (!this.TIMEFRAMES.includes(params.timeframe)) {
      throw new HttpException(this.TIMEFRAME_ERROR, HttpStatus.BAD_REQUEST);
    } else if (this.isTimeInFuture(params.date)) {
      throw new HttpException(this.DATE_ERROR, HttpStatus.BAD_REQUEST);
    } else {
      const articleCount = await this.appService.getArticleViewCount(params);
      return new ViewCountResponse(articleCount);
    }
  }

  /**
   * Get the highest view count day in a month for a specific article
   * @param params
   */
  @Get('most-viewed-day/:date/:articleId/')
  @ApiCreatedResponse({ type: MostViewedDayResponse })
  @UsePipes(MostViewedDayParams)
  async getDateWithMostViews(
    @Param() params: MostViewedDayParams
  ): Promise<any> {
    const mostViewedData = await this.appService.getArticleMostViewedDay(params);
    return new MostViewedDayResponse(mostViewedData.highCount, mostViewedData.highCountDate)
  }
}
