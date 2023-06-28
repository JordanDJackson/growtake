import {Controller, Get, Param, UsePipes} from '@nestjs/common';
import {AppService} from './app.service';
import {ApiCreatedResponse, ApiTags} from '@nestjs/swagger';
import {ArticleCountParams, MostViewedDayParams, MostViewedParams} from "./requests";
import {MostViewedDayResponse, MostViewedResponse, ViewCountResponse} from "./responses";

@Controller()
@ApiTags('wiki')
export class AppController {
  constructor(private readonly appService: AppService) {}

  TIMEFRAMES = ['week', 'month'];

  /**
   * This endpoint will return the most viewed articles for a timeframe that is given by the user.
   * @param params
   */
  @Get('most-viewed/:timeframe/:date')
  @ApiCreatedResponse({ type: MostViewedResponse })
  @UsePipes(MostViewedParams)
  async getMostViewed(@Param() params: MostViewedParams): Promise<any> {
    if (!this.TIMEFRAMES.includes(params.timeframe)) {
      return 'Time is required and must be "week" or "month"';
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
      return 'Time is required and must be "week" or "month"';
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
