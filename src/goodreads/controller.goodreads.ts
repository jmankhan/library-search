import {Controller, Get, Query} from '@nestjs/common'
import {GoodreadsService} from './service.goodreads'
import {GoodreadsShelfParams} from './interfaces'

@Controller('goodreads')
export class GoodreadsController {
	constructor(private readonly service: GoodreadsService) {}

	@Get('/shelves')
	public async getUserShelves(@Query() params :GoodreadsShelfParams)  {
		return '{status: 200}'
	}
}