import {BookResponse} from '../books/interface.bookresponse'
import {LibraryResponse} from '../libraries/interface.libresponse'
import {Book} from '../books/interface.book'
import {Library} from '../libraries/interface.library'

const cheerio: CheerioAPI = require('cheerio')

/**
 * Worldcat response parser/processor that will take an xml or html page from Worldcat
 * and convert into an interface compliant structure to return to the provider
 *
 * This class will handle malformed data, formatting, and propogate error logs.
 * It will fail silently (from user's perspective) and gracefully where possible
 */
export class WorldcatParser {

	private options :CheerioOptionsInterface = {
			normalizeWhitespace: true, 
			xmlMode: true
		}

	parseBookResponse(data: string) :BookResponse {
		const books: Book[] = []
		const selectNodeDetails = this.selectNodeDetails
		//load response as a cheerio object
		const $ :CheerioStatic = cheerio.load(data, this.options)

		//parse book xml response
		const content :string				= $('response').find('element').find('content').last()[0].children[0].data
		const booksMarkup :CheerioStatic	= cheerio.load(content)
		const total :string 				= booksMarkup('.resultsinfo').first().find('td').find('strong')[1].children[0].data

		//collect data by css selector. the joys of web scraping. 
		const oclcs :string[]		= selectNodeDetails($, '.oclc_number', content)
		const authors :string[]		= selectNodeDetails($, '.author', content).map( a => {return a.replace('by', '').trim()})
		const titles :string[] 		= selectNodeDetails($, 'a > strong', content)
		const publishers :string[] 	= selectNodeDetails($, '.itemPublisher', content)
		booksMarkup('.details').each((index :number, book :CheerioElement) => {
		

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
		return {
			total: total,
			data: books
		}
	}

	parseLibraryResponse(data: string) :LibraryResponse {
		const libraries: Library[] = []

		//load response data into a cheerio object
		const $ :CheerioSelector = cheerio.load(data, this.options)

		//parse library xml response
		//Each library should be contained in a table row with an id. 
		//This table row is expected to have all available information we need.
		//Many libraries do not have a catalog url, or even a website linked, so they are optional
		const libs :Cheerio = $('tr[id]')
		const total :string	= $('.libsdisplay').find('b').last().text()

		//.each(index, element) is part of the Cheerio API
		libs.each( (i :number, lib :CheerioElement) => {
			const name :string = lib.attribs['id']
			
			//google maps location url. we can parse the lat/lng from it
			const locationUrl :string = cheerio.load(lib)('.lib-map-sm')[0].attribs['href']
			let lat :void|number = null
			let lng :void|number = null
			try {
				//none of the regular expressions I tried worked q_q
				const latlng = locationUrl.split('@')[1].split('&')[0].split(',')
				lat = +latlng[0]
				lng = +latlng[1]
			}
			catch(err) {
				console.log('no latlng in url')
			}

			//contact info is split into many lines with line breaks and weird spacing.
			const contact :string = cheerio.load(lib)('p').get(1).children.map( line => {
				return line.data ? line.data.trim() : ""
			}).join(" ").split("&nbsp;").join()

			const phone :string 	= contact.match(/\(\d{3}\).*\d{3}\-\d{4}/)[0]
			const address :string 	= contact.replace(phone, "")

			//check if a url or catalog url exists before adding it to response
			const urls :Cheerio 		= cheerio.load(lib)('.lib-website')
			const catalogUrls :Cheerio	= cheerio.load(lib)('.lib-catalog')

			const url :void|string 			= urls.length > 0 ? urls[0].attribs['href'] : null
			const catalogUrl :void|string 	= catalogUrls.length > 0 ? catalogUrls[0].attribs['href'] : null

			const response = {
				name: name,
				address: address,
				phone: phone
			}
			if(url)
				response['url'] = url
			if(catalogUrl)
				response['catalogUrl'] = catalogUrl
			if(lat && lng) {
				response['lat'] = lat
				response['lng'] = lng
			}

			libraries.push(response)
		})
		return {
			total: total,
			data: libraries
		}
	}

	parseLibrarySearchResponse(data: string) :LibraryResponse {
		const libraries :Library[] = []
		

		//load response data into a cheerio object
		const $ :CheerioStatic = cheerio.load(data, this.options)

		const names 	:string[] 	= this.selectNodeDetails($, 'a', '.name')
		const addresses :string[] 	= this.selectNodeDetails($, '.geoloc', '.name')
		const total 	:string 	= this.selectNodeDetails($, 'strong', '.libsdisplay')[1]

		//check for any weird errors
		if(names.length !== addresses.length) {
			console.log('library search parsing length mismatch: ')
			console.log(JSON.stringify(names))
			console.log(JSON.stringify(addresses))
		}
		for(var i=0; i<names.length; i++) {
			libraries.push({
				name: names[i],
				address: addresses[i]
			})
		}
		return {
			total: total,
			data: libraries
		}
	}

		/**
	 * Selects a data from within a parent selector of the Worldcat response
	 * To return the desired data, pass its parent Node
	 * @param  {Cheerio} $  		The root node
	 * @param  {string}  selector 	The Cheerio "css-like" selector
	 * @param  {CheerioElement}     parent     The context parent node
	 * @return {string[]|number[]}  Returns a string[] or number[]
	 */
	private selectNodeDetails($ :CheerioSelector, selector :string, parent :string): string[] {
		const accumulator :string[] = []
		$(selector, parent).each((index:number, element:CheerioElement) => {
			accumulator.push(element.children[0].data)
		})
		return accumulator
	}
}