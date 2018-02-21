import {Controller, Get, Body, Query, BadRequestException} from '@nestjs/common'
import {LibraryService} from './service.library'
import {Library, 
		LibraryParam, 
		instanceOfLibraryParam, 
		LibrarySearchParam, 
		instanceOfLibrarySearchParam,
		LibraryResponse} from './interfaces'

/**
 * Library controller that handles the endpoint
 * @param {[type]} 'library' endpoint name
 */
@Controller('library')
export class LibraryController {
	constructor(private readonly service :LibraryService) {}
	
	/**
	 * Uses the Library service to find a list of Library.
	 * @param  {params}             params Query string params
	 * @return {Promise<Library[]>}        Returns a Promise from the service that may be rejected
	 */
	@Get()
	async find(@Query() params :LibraryParam|LibrarySearchParam) :Promise<LibraryResponse> {
		if(instanceOfLibraryParam(params))
			return await this.service.findByName(params)
		else if(instanceOfLibrarySearchParam(params))
			return await this.service.findByBook(params)
		else
			throw new BadRequestException('Malformed query parameters')
	}
}