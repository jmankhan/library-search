import {Controller, Get, Post, Request, Query, UsePipes} from '@nestjs/common'
import {BookResponse, BookParam} from './interfaces'
import {BookService} from './service.book'
import {GenericParamsPipe} from '../pipes'
import {GenericParams} from '../interfaces'

/**
 * Book Controller that handles an endpoint
 */
@Controller('books')
export class BookController {
	constructor(private readonly service: BookService) {}

	/**
	 * Uses a service to retrieve a List of Book, filtered by a search string
	 *  @param {BookParam} params enforced query string parameters 
	 */
	@Get()
	@UsePipes(new GenericParamsPipe())
	async findByKeyword(@Query() query) :Promise<BookResponse> {
		return await this.service.findByKeyword(query)
	}

	@Get('/test')
	async test(@Request() req) {
		console.log(req.query)
		return {'hue': 'hue'}
	}
}