import {Controller, Get, Post, Body, Query} from '@nestjs/common'
import {BookResponse, BookParam} from './interfaces'
import {BookService} from './service.book'

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
	async findByKeyword(@Query() params: BookParam): Promise<BookResponse> {
		return await this.service.findByKeyword(params)
	}
}