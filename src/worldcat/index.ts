import {BookParam} from './interface.bookparam'
import {LibParam} from './interface.libparam'
import {Book} from '../books/interface.book'
import {Library} from '../libraries/interface.library'

const axios = require('axios')      //http client
const cheerio = require('cheerio')  //html/xml parser

/**
 * Worldcat provider. Performs requests to the worldcat servers to find books and libraries.
 * Requries heavy parsing of xml responses, html pages, and relies on up to date endpoint information.
 * This will break if Worldcat changes anything significant in their url structure!
 */
export class Worldcat {
	//base url for searching for books
	private readonly booksUrl: string = 'http://www.worldcat.org/search'

	//base url for searching for libraries
	private readonly libraryUrl: string = 'http://www.worldcat.org/wcpa/servlet/org.oclc.lac.ui.ajax.ServiceServlet'

	//default query parameters required for books url. should be merged with a search query parameter under the 'q' key
	private readonly defaultBookParams: WorldcatParams = {
		'fq' : '%20(%28x0%3Abook+x4%3Aprintbook%29)',
		'se' : '',
		'sd' : '',
		'dblist': 638,
		'qt' : 'facet_fm_checkbox',
		'refinesearch' : true,
		'refreshFormat' : 'undefined',
		'q' : 'kw%3A'
	}

	//default query parameters required for library url. should be merged with a search query parameter under the 'search' key		
	private readonly defaultLibraryParams: WorldcatParams = {
		'serviceCommand' : 'librarySearch',
		'search' : '',
		'start' : '1',
		'count' : 'none',
		'libType' : 3, //public library
		'dofavlib' : false,
		'sort' : 'none' //defaults to 'sort by relevance'
	}
	
	/**
	 * Finds a list of books using the Worldcat Search page
	 * @param  {BookParam} bookParams The parameters to search against
	 * @return {Book[]}               Returns a list of Books @see 'src/books/interface.book.ts'
	 */
	public async getBook(bookParams: BookParam): Book[] {
		//set flag on params
		bookParams.isBook = true
		
		//Book[] to return
		const books: Book[] = []

		//save function ref so it easier to access later
		const selectNodeDetails = this.selectNodeDetails 

		return this.httpCallout(this.booksUrl, bookParams)
			.then(response => {
				//load response as a cheerio object
				const $ = cheerio.load(response.data, {
						normalizeWhitespace: true, 
						xmlMode: true, 
						encoding: 'UTF-8', 
						xml: true
				})

				//parse book xml response
				const content = $('response').find('element').find('content').last()[0].children[0].data
				const booksMarkup = cheerio.load('<DOCTYPE html> <html><body>' + content  + '</body></html>')
				booksMarkup('.details').each((index, book) => {
				
					//collect data by css selector. the joys of web scraping. 
					const oclcs = selectNodeDetails($, '.oclc_number', book)
					const authors = selectNodeDetails($, '.author', book).map( a => {return a.replace('by', '').trim()})
					const titles = selectNodeDetails($, $('a', book).find('strong'), book)
					const publishers = selectNodeDetails($, '.itemPublisher', book)

					//add response to return object
					for(let i=0; i<oclcs.length; i++) {
						books.push({
							title: titles[i],
							oclc: oclcs[i],
							author: authors[i],
							publisher: publishers[i]
						})
					}
				})
				return books
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
	public async getLibraryByName(libParams: LibParam): Library[] {
		//set flag on params
		libParams.isLib = true

		//return object
		const libraries : Library[] = []

		return this.httpCallout(this.libraryUrl, libParams)
			.then(response => {
				//load response data into a cheerio object
				const $ = cheerio.load(response.data, {
						normalizeWhitespace: true, 
						xmlMode: true, 
						encoding: 'UTF-8', 
						xml: true
				})

				//parse library xml response
				//Each library should be contained in a table row with an id. 
				//This table row is expected to have all available information we need.
				//Many libraries do not have a catalog url, or even a website linked, so they are optional
				const libs = $('tr[id]')

				//.each(index, element) is part of the Cheerio API
				libs.each( (i, lib) => {
					const name:string = lib.attribs['id']

					//contact info is split into many lines with line breaks and weird spacing.
					const contact:string[] = cheerio.load(lib)('p')[1].children.map( line => {
						return line.data ? line.data.trim() : ""
					}).join(" ").split("&nbsp;").join()
					const phone:string = contact.match(/\(\d{3}\).*\d{3}\-\d{4}/)
					const address:string = contact.replace(phone, "")

					//check if a url or catalog url exists before adding it to response
					const urls = cheerio.load(lib)('.lib-website')
					const catalogUrls = cheerio.load(lib)('.lib-catalog')

					const url:string = urls.length > 0 ? urls[0].attribs['href'] : null
					const catalogUrl:string = catalogUrls.length > 0 ? catalogUrls[0].attribs['href'] : null

					const response = {
						name: name,
						address: address,
						phone: phone
					}
					if(url)
						response['url'] = url
					if(catalogUrl)
						response['catalogUrl'] = catalogUrl

					libraries.push(response)
				})
				return libraries
			})
			.catch(err => {
				console.log(err)
			})
	}
	/**
	 * Performs the http request to retrieve the worldcat response as an xml page
	 * @param  {string}             url    Worldcat endpoint to perform a GET request against
	 * @param  {BookParam|LibParam} params Parameters to be appended to the base url as a query string
	 * @return {Promise}                   Returns an axios response with an expected XML format in response.data
	 */
	private httpCallout(url: string, typedParams: BookParam|LibParam): Promise {
		//copy params into a sanitized object. set additional parameters based on what type the object is.
		//Since type checking is not available at runtime, we will use object properties and hope we remember
		//to set them before calling this...
		//If the types were classes, we could initialize the appropriate properties to true beforehand
		let params = {}
		if(typedParams.isBook) {
			Object.assign(params, this.defaultBookParams)
			params['q'] += Object.keys(typedParams).map(key => {
				return typedParams[key] ? typedParams[key] : ''
			})
		}
		else if(typedParams.isLib) {
			Object.assign(params, this.defaultLibraryParams)
			params['search'] = typedParams.name
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

	/**
	 * Selects a data from within a parent selector of the Worldcat response
	 * To return the desired data, pass its parent Node
	 * @param  {Cheerio} $        	The root node
	 * @param  {string}  selector 	The Cheerio "css-like" selector
	 * @param  {any}     parent     The context parent node
	 * @return {string[]|number[]}  Returns a string[] or number[]
	 */
	private selectNodeDetails($: Cheerio, selector: string, parent: any): string[]|number[] {
		const accumulator = []
		$(selector, parent).each((index, n) => {
			accumulator.push(n.children[0].data)
		})
		return accumulator
	}
}