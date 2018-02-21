import {Component} from '@nestjs/common'
import {LibraryParam, LibrarySearchParam, LibraryResponse} from './interfaces'
import {WorldcatAPI} from '../worldcat'

/**
 * Service that maps a controller request to a provider response
 */
@Component()
export class LibraryService {
	private worldcat: WorldcatAPI

	constructor() {
		this.worldcat = new WorldcatAPI()
	}

	/**
	 * Uses the worldcat provider to find a list of Libraries by searching their name
	 * @param  {string}    params Query string parameters from controller
	 * @return {Library[]}        List of Library found by provider
	 */
	async findByName(params :LibraryParam) :Promise<LibraryResponse> {
		return await this.worldcat.getLibraryByName(params)
	}

	async findByBook(params: LibrarySearchParam) :Promise<LibraryResponse> {
		return await this.worldcat.getLibraryByBook(params)
	}
}