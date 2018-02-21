import {BookParam, instanceOfBookParam, BookResponse} from '../books/interfaces'
import {WorldcatParser} from './parser.worldcat'
import {LibraryParam, 
		instanceOfLibraryParam, 
		LibraryResponse,
		LibrarySearchParam, 
		instanceOfLibrarySearchParam} from '../libraries/interfaces'

//http client
const axios = require('axios')

/**
 * Worldcat API. Performs requests to the worldcat servers to find books and libraries.
 * Leverages parser to do heavy lifting of processing xml responses, html pages
 * This will break if Worldcat changes anything significant in their url structure!
 *
 * This class should handle http exceptions and propgate them up the chain to the service
 */
export class WorldcatAPI {

	//base url for searching for books
	private readonly booksUrl: string = 'http://www.worldcat.org/search'

	//base url for searching for libraries
	private readonly libraryUrl: string = 'http://www.worldcat.org/wcpa/servlet/org.oclc.lac.ui.ajax.ServiceServlet'

	//parser instance that will handle converting and formatting response data
	private readonly parser: WorldcatParser = new WorldcatParser()

	//default query parameters required for books url. should be merged with a search query parameter under the 'q' key
	private readonly defaultBookParams = {
		'fq' : '%20(%28x0%3Abook+x4%3Aprintbook%29)', 	//physical print books only
		'se' : '',
		'sd' : '',
		'dblist': 638,
		'qt' : 'facet_fm_checkbox',
		'refinesearch' : false, 						//matches default worldcat search
		'refreshFormat' : 'undefined',
		'start': 1, 									//start paging
		'q' : 'kw%3A' 									//query string to append to
	}

	//default query parameters required for library url. should be merged with a search query parameter under the 'search' key		
	private readonly defaultLibraryParams = {
		'serviceCommand' : 'librarySearch',
		'search' : '',  								//query string to append to
		'start' : '1',									//start paging
		'count' : '100', 								//results to return. default to 100 to minimize paging calls
		'libType' : 3, 									//public library
		'dofavlib' : false,
		'sort' : 'none' 								//defaults to 'sort by relevance'
	}

	private readonly defaultLibrarySearchParams = {
		'wcoclcnum': '', 								//book_oclc
		'loc': '', 										//zip
		'start_holding': 1, 							//start paging bound
		'serviceCommand': 'holdingsdata'
	}

	/**
	 * Retrieves the Worldcat Book Search response xml and parses it
	 * @param  {BookParam} bookParams The parameters to search against
	 * @return {Book[]}               Returns a list of Book
	 */
	public async getBook(bookParams :BookParam) :Promise<BookResponse> {
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
	 * @param  {LibraryParam}  LibraryParams params to search against
	 * @return {Library[]}           List of libraries found
	 */
	public async getLibraryByName(libParams :LibraryParam) :Promise<LibraryResponse> {
		libParams.isLib = true

		return this.httpCallout(this.libraryUrl, libParams)
			.then(response => {
				return this.parser.parseLibraryResponse(response.data)
			})
			.catch(err => {
				console.log(err)
				return null
			})
	}

	public async getLibraryByBook(searchParams: LibrarySearchParam) :Promise<LibraryResponse> {
		//set param flag
		searchParams.isLibSearch = true

		return this.httpCallout(this.libraryUrl, searchParams)
			.then(response => {
				return this.parser.parseLibrarySearchResponse(response.data)
			})
			.catch(err => {
				//should probably throw something here
				console.log(err)
				return null
			})
	}

	/**
	 * Performs the http request to retrieve the worldcat response as an xml page
	 * @param  {string}             url    Worldcat endpoint to perform a GET request against
	 * @param  {BookParam|LibraryParam} params Parameters to be appended to the base url as a query string
	 * @return {Promise}                   Returns an axios response with an expected XML format in response.data
	 */
	private httpCallout(url: string, typedParams: BookParam|LibraryParam|LibrarySearchParam): Promise<any> {
		//copy params into a sanitized object. set additional parameters based on what type the object is.
		//Since type checking is not available at runtime, we will use object properties and hope we remember
		//to set them before calling this...
		//If the types were classes, we could initialize the appropriate properties to true beforehand
		let params = {}
		if(instanceOfBookParam(typedParams)) {
			Object.assign(params, this.defaultBookParams)
			params['q'] += typedParams.keyword
			params['start'] = typedParams.page ? typedParams.page : this.defaultBookParams['start']
		}
		else if(instanceOfLibraryParam(typedParams)) {
			Object.assign(params, this.defaultLibraryParams)
			params['search'] = typedParams.name
			params['start'] = typedParams.page ? typedParams.page : this.defaultLibraryParams['start']
		}
		else if(instanceOfLibrarySearchParam(typedParams)) {
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

	//empty constructor for init purposes
	constructor() {}
}