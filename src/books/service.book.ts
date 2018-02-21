import {BadRequestException, Component} from '@nestjs/common'
import {BookParam, BookResponse} from './interfaces'
import {WorldcatAPI} from '../worldcat'

/**
 * Service that maps a controller request to a provider response.
 */
@Component()
export class BookService {
	private worldcat: WorldcatAPI

	constructor() {
		this.worldcat = new WorldcatAPI()
	}

	/**
	 * Uses the worldcat provider to retrieve a list of books matching the search criteria
	 * @param  {string} params url query string 
	 * @return {Book[]}        List of Books worldcat found
	 */
	async findByKeyword(params: BookParam): Promise<BookResponse> {
		if(params.keyword == null) {
			throw new BadRequestException('Invalid query parameters')
		}
		return await this.worldcat.getBook(params)
	}
}