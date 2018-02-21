import {Controller, Get, Query} from '@nestjs/common'
import {GoodreadsService} from './service.goodreads'
import {GoodreadsShelfParams, GoodreadsShelfResponse} from './interfaces'

@Controller('goodreads')
export class GoodreadsController {
	constructor(private readonly service: GoodreadsService) {}

	@Get('/shelves')
	public async getShelves(@Query() params :GoodreadsShelfParams) :Promise<GoodreadsShelfResponse> {
		return this.service.getShelves(params)
	}
}