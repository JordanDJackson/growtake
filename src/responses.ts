import {ApiProperty} from "@nestjs/swagger";

type ArticleCountTuple = [string, number];

export class MostViewedResponse {
  @ApiProperty()
  mostViewedIds: ArticleCountTuple[];

  constructor(articleCounts: ArticleCountTuple[]) {
    this.mostViewedIds = articleCounts;
  }
}

export class ViewCountResponse {
  @ApiProperty()
  viewCount: number;

  constructor(viewCount: number) {
    this.viewCount = viewCount;
  }
}

export class MostViewedDayResponse {
  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  date: string;

  constructor(viewCount: number, date: string) {
    this.viewCount = viewCount;
    this.date = date;
  }
}
