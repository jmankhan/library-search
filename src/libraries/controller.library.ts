import {Controller, Get, Body, Query, UsePipes, BadRequestException} from '@nestjs/common'
import {GenericResponse} from '../interfaces'
import {GenericParamsPipe} from '../pipes'
import {LibraryService} from './service.library'
import {Library, 
		LibraryParam, 
		LibrarySearchParam} from './interfaces'

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
	@UsePipes(new GenericParamsPipe())
	async find(@Query() query :LibraryParam) :Promise<GenericResponse<Library>> {
		return await this.service.findByName(query)
	}

	@Get()
	@UsePipes(new GenericParamsPipe())
	async search(@Query(new GenericParamsPipe()) query :LibrarySearchParam) :Promise<GenericResponse<Library>> {
		return await this.service.findByBook(query)
	}
}