import {Component} from '@nestjs/common'
import {BookResponse} from './interface.bookresponse'
import {Worldcat} from '../worldcat'

/**
 * Service that maps a controller request to a provider response.
 * Currently uses the Worldcat provider
 */
@Component()
export class BookService {
	private worldcat: Worldcat

	constructor() {
		this.worldcat = new Worldcat()
	}

	/**
	 * Uses the worldcat provider to retrieve a list of books matching the search criteria
	 * @param  {string} params url query string 
	 * @return {Book[]}        List of Books worldcat found
	 */
	async findByTitle(params: string): BookResponse {
		return await this.worldcat.getBook(params)
	}
}