import {Controller, Get, Query} from '@nestjs/common'
import {GoodreadsService} from './service.goodreads'
import {GoodreadsShelfParams, GoodreadsShelfResponse, 
		GoodreadsUserParams, GoodreadsUserResponse,
		GoodreadsBookShelfParams, GoodreadsBookShelfResponse} from './interfaces'

@Controller('goodreads')
export class GoodreadsController {
	constructor(private readonly service: GoodreadsService) {}

	@Get('/shelves')
	public async getShelves(@Query() params :GoodreadsShelfParams) :Promise<GoodreadsShelfResponse> {
		return await this.service.getShelves(params)
	}

	@Get('/user')
	public async getUser(@Query() params :GoodreadsUserParams) :Promise<GoodreadsUserResponse> {
		return await this.service.getUser(params)
	}

	@Get('/books')
	public async getBooksOnShelf(@Query() params :GoodreadsBookShelfParams) :Promise<GoodreadsBookShelfResponse> {
		return await this.service.getBooksOnShelf(params)
	}
}