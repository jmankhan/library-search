import {Controller, Get, Post, Body, Query} from '@nestjs/common'
import {Book} from './interface.book'
import {BookService} from './service.book'

/**
 * Book Controller that handles an endpoint
 * @param {[type]} 'books' endpoint name
 */
@Controller('books')
export class BookController {
	constructor(private readonly service: BookService) {}

	/**
	 * Uses a service to retrieve a List of Book, filtered by a search string
	 * @param  {params}          params Query string parameters
	 * @return {Promise<Book[]>}        Returns a Promise resolved by the service
	 */
	@Get()
	async findByTitle(@Query() params: string): Promise<Book[]> {
		return await this.service.findByTitle(params)
	}
}