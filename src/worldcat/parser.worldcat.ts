import {BookResponse} from '../books/interface.bookresponse'
import {LibraryResponse} from '../libraries/interface.libresponse'
import {Book} from '../books/interface.book'
const cheerio: Cheerio = require('cheerio')

/**
 * Worldcat response parser/processor that will take an xml or html page from Worldcat
 * and convert into an interface compliant structure to return to the provider
 *
 * This class will handle malformed data, formatting, and propogate error logs to dev.
 * It will fail silently (from user's perspective) and gracefully where possible
 */
export class WorldcatParser {

	parseBookResponse(data: string): BookResponse {
		const books: Book[] = []
		const selectNodeDetails = this.selectNodeDetails
		//load response as a cheerio object
		const $ = cheerio.load(data, {
				normalizeWhitespace: true, 
				xmlMode: true, 
				encoding: 'UTF-8', 
				xml: true
		})

		//parse book xml response
		const content = $('response').find('element').find('content').last()[0].children[0].data
		const booksMarkup = cheerio.load('<DOCTYPE html> <html><body>' + content  + '</body></html>')
		const total = booksMarkup('.resultsinfo').first().find('td').find('strong')[1].children[0].data

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
		return {
			total: total,
			data: books
		}
	}

	parseLibraryResponse(data: string): LibraryResponse {
		const libraries: Library[] = []

		//load response data into a cheerio object
		const $ = cheerio.load(data, {
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
		const total:number = $('.libsdisplay').find('b').last().text()

		//.each(index, element) is part of the Cheerio API
		libs.each( (i, lib) => {
			const name:string = lib.attribs['id']
			
			//google maps location url. we can parse the lat/lng from it
			const locationUrl:string = cheerio.load(lib)('.lib-map-sm')[0].attribs['href']
			let lat = null
			let lng = null
			try {
				const latlng = locationUrl.split('@')[1].split('&')[0].split(',')
				lat = latlng[0]
				lng = latlng[1]
			}
			catch(err) {
				console.log('no latlng in url')
			}

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
				phone: phone,
				lat: lat,
				lng: lng
			}
			if(url)
				response['url'] = url
			if(catalogUrl)
				response['catalogUrl'] = catalogUrl

			libraries.push(response)
		})
		return {
			total: total,
			data: libraries
		}
	}

	parseLibrarySearchResponse(data: string): LibrarySearchResponse {
		const libraries :Library[] = []
		const options :CheerioOptionsInterface = {
			normalizeWhitespace: true, 
			xmlMode: true
		}

		//load response data into a cheerio object
		const $ :CheerioAPI = cheerio.load(data, options)

		const names 	:string[] 	= this.selectNodeDetails($, 'a', '.name')
		const addresses :string[] 	= this.selectNodeDetails($, '.geoloc', '.name')
		const total 	:string 	= this.selectNodeDetails($, 'strong', $('.libsdisplay'))[1]

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
		$(selector, parent).each((index:number, n:CheerioElement) => {
			accumulator.push(n.children[0].data)
		})
		return accumulator
	}
}