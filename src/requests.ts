import {IsISO8601, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

/**
 * These classes are used to verify data before it can enter the controller
 */
export class MostViewedParams {
  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({required: true})
  date: Date;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required: true})
  timeframe: 'week' | 'month';

  constructor(date, timeframe) {
    this.date = date;
    this.timeframe = timeframe
  }
}

export class MostViewedDayParams {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required: true})
  articleId: string;
  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({required: true})
  date: Date;

  constructor(date, articleId) {
    this.date = date;
    this.articleId = articleId
  }
}

export class ArticleCountParams {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required: true})
  articleId: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required: true})
  timeframe: 'week' | 'month';
  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({required: true})
  date: Date;

  constructor(date, timeframe, articleId) {
    this.date = date;
    this.timeframe = timeframe
    this.articleId = articleId
  }
}
