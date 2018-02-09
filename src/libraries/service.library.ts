import {Component} from '@nestjs/common'
import {Library} from './interface.library'
import {Worldcat} from '../worldcat'

/**
 * Service that maps a controller request to a provider response
 */
@Component()
export class LibraryService {
	private worldcat: Worldcat

	constructor() {
		this.worldcat = new Worldcat()
	}

	/**
	 * Uses the worldcat provider to find a list of Libraries by searching their name
	 * @param  {string}    params Query string parameters from controller
	 * @return {Library[]}        List of Library found by provider
	 */
	async findByName(params: string): Library[] {
		return await this.worldcat.getLibraryByName(params)
	}
}