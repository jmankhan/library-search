import {BookParam} from '../books/interface.bookparam'
import {LibParam} from '../libraries/interface.libparam'
import {LibrarySearchParam} from '../libraries/interface.libsearchparam'
import {WorldcatParser} from './parser.worldcat'

import {BookResponse} from '../books/interface.bookresponse'
import {LibraryResponse} from '../libraries/interface.libresponse'

const axios = require('axios')      //http client

/**
 * Worldcat provider. Performs requests to the worldcat servers to find books and libraries.
 * Leverages parser to do heavy lifting of processing xml responses, html pages
 * This will break if Worldcat changes anything significant in their url structure!
 *
 * This class should handle http exceptions and propgate them up the chain to the controller
 */
export class Worldcat {
	//base url for searching for books
	private readonly booksUrl: string = 'http://www.worldcat.org/search'

	//base url for searching for libraries
	private readonly libraryUrl: string = 'http://www.worldcat.org/wcpa/servlet/org.oclc.lac.ui.ajax.ServiceServlet'

	//parser instance that will handle converting and formatting response data
	private readonly parser: WorldcatParser = new WorldcatParser()

	//default query parameters required for books url. should be merged with a search query parameter under the 'q' key
	private readonly defaultBookParams = {
		'fq' : '%20(%28x0%3Abook+x4%3Aprintbook%29)', 	//print books only
		'se' : '',
		'sd' : '',
		'dblist': 638,
		'qt' : 'facet_fm_checkbox',
		'refinesearch' : false, 						//matches default worldcat search
		'refreshFormat' : 'undefined',
		'start': 1, 									//start paging
		'q' : 'kw%3A'
	}

	//default query parameters required for library url. should be merged with a search query parameter under the 'search' key		
	private readonly defaultLibraryParams = {
		'serviceCommand' : 'librarySearch',
		'search' : '',
		'start' : '1',
		'count' : '100', //default to 100 results to minimize paging calls
		'libType' : 3, //public library
		'dofavlib' : false,
		'sort' : 'none' //defaults to 'sort by relevance'
	}

	private readonly defaultLibrarySearchParams = {
		'wcoclcnum': '', 					//book_oclc
		'loc': '', 							//zip
		'start_holding': 1, 				//start paging bound
		'serviceCommand': 'holdingsdata'
	}

	/**
	 * Retrieves the Worldcat Book Search response xml and parses it
	 * @param  {BookParam} bookParams The parameters to search against
	 * @return {Book[]}               Returns a list of Book
	 */
	public async getBook(bookParams: BookParam): BookResponse {
		//set flag on params
		bookParams.isBook = true
		return this.httpCallout(this.booksUrl, bookParams)
			.then(response => {
				return this.parser.parseBookResponse(response.data)
			})
			.catch(err => {
				console.log(err)
 				return null
			})
	}

	/**
	 * Retrieves a list of libraries using the Worldcat Find a Library page 
	 * @param  {LibParam}  libParams params to search against
	 * @return {Library[]}           List of libraries found
	 */
	public async getLibraryByName(libParams: LibParam): LibraryResponse {
		//set flag on params
		libParams.isLib = true

		return this.httpCallout(this.libraryUrl, libParams)
			.then(response => {
				return this.parser.parseLibraryResponse(response.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	public async getLibraryByBook(searchParams: LibrarySearchParam): LibraryResponse {
		//set param flag
		searchParams.isLibSearch = true

		//init return array
		const libraries: Library[] = []

		return this.httpCallout(this.libraryUrl, searchParams)
			.then(response => {
				return this.parser.parseLibrarySearchResponse(response.data)
			})
			.catch(err => {
				console.log(err)
				return libraries
			})
	}

	/**
	 * Performs the http request to retrieve the worldcat response as an xml page
	 * @param  {string}             url    Worldcat endpoint to perform a GET request against
	 * @param  {BookParam|LibParam} params Parameters to be appended to the base url as a query string
	 * @return {Promise}                   Returns an axios response with an expected XML format in response.data
	 */
	private httpCallout(url: string, typedParams: BookParam|LibParam|LibrarySearchParam): Promise {
		//copy params into a sanitized object. set additional parameters based on what type the object is.
		//Since type checking is not available at runtime, we will use object properties and hope we remember
		//to set them before calling this...
		//If the types were classes, we could initialize the appropriate properties to true beforehand
		let params = {}
		if(typedParams.isBook) {
			Object.assign(params, this.defaultBookParams)
			params['q'] += typedParams.keyword
			params['start'] = typedParams.page ? typedParams.page : this.defaultBookParams['start']
		}
		else if(typedParams.isLib) {
			Object.assign(params, this.defaultLibraryParams)
			params['search'] = typedParams.name
			params['start'] = typedParams.page ? typedParams.page : this.defaultLibraryParams['start']
		}
		else if(typedParams.isLibSearch) {
			Object.assign(params, this.defaultLibrarySearchParams)
			params['wcoclcnum'] = typedParams.book_oclc ? typedParams.book_oclc : this.defaultLibrarySearchParams['book_oclc']
			params['loc'] = typedParams.zip ? typedParams.zip : this.defaultLibrarySearchParams['loc']
			params['start_holding'] = typedParams.page ? typedParams.page : this.defaultLibrarySearchParams['start_holding']
		}

		return axios.get(url + this.toQueryString(params))
	}

	/**
	 * Utility method to convert an object map to query paramters. Each paramter should already be encoded if needed
	 * Replaces null or undefined values with a blank string
	 * 
	 * @param  {Object} obj Object map to convert
	 * @return {string}     an encoded query parameter string starting with '?' and delimited by '&'
	 */
	private toQueryString(obj: Object): string {
		return '?' + Object.keys(obj).map(key => {
			return key + '=' + (obj[key] ? obj[key] : '')
		}).join('&')
	}

}