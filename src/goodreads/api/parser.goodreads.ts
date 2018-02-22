import {GoodreadsShelfResponse, Shelf, 
		GoodreadsUser, GoodreadsUserResponse} from '../interfaces'
import {Book} from '../../books/interfaces'

const cheerio: CheerioAPI = require('cheerio')

export class GoodreadsParser {
	private options :CheerioOptionsInterface = {
			normalizeWhitespace: true, 
			xmlMode: true
		}

	parseShelves(data :string) :GoodreadsShelfResponse {
		const shelves :Shelf[] = []

		const $ :CheerioStatic 		= cheerio.load(data, this.options)
		const userShelves :Cheerio 	= $('GoodreadsResponse').find('shelves').find('user_shelf')

		//required
		const ids :Cheerio	 		= userShelves.find('id')

		//may not exist, perform some null checks
		const names :string[] 		 = this.selectIfExists(userShelves.find('name'))
		const totals :string[] 		 = this.selectIfExists(userShelves.find('book_count'))
		const descriptions :string[] = this.selectIfExists(userShelves.find('description'))

		userShelves.each( (i :number, e :CheerioElement) => {
			shelves.push({
				id: ids[i].children[0].data,
				name: names[i],
				total: totals[i],
				description: descriptions[i]
			})
		})

		return {
			total: userShelves.length,
			data: shelves
		}
	}

	parseUser(data :string) :GoodreadsUserResponse {
		const $ :CheerioStatic = cheerio.load(data, this.options)

		const user :Cheerio = $('GoodreadsResponse').find('user')
		const id :string = this.selectIfExists(user.find('id'))[0]
		const name :string = this.selectIfExists(user.find('name'))[0]

		return {
			id: id,
			name: name
		}
	}

	parseBooksOnShelf(data :string) {
		const $ :CheerioStatic = cheerio.load(data, this.options)
		const books :Book[] = []

		const total = $('reviews')[0].attribs['total']
		const goodreadsBooks = $('book')
		const ids :string[] = this.selectIfExists($('book > id'))
		const isbns :string[] = this.selectIfExists($('book > isbn13'))
		const titles :string[] = this.selectIfExists($('book > title_without_series'))

		goodreadsBooks.each( (i :number, e:CheerioElement) => {
			books.push({
				title: titles[i],
				goodreads_id: ids[i],
				isbn: isbns[i],
			})
		})
		//dummy
		return {
			total: +total,
			data: books
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

	/**
	 * Selects the data of a node if it exists, null otherwise.
	 * Note that the Cheerio object has a length property, but is not an array
	 * 
	 * @param  {Cheerio}  nodes Cheerio object representing a virtual DOM node
	 * @return {string[]}       The data contained within the node
	 */
	private selectIfExists(nodes :Cheerio) :string[] {
		const data :string[] = []
		for(var i=0; i<nodes.length; i++) {
			data.push(nodes.get(i).children.length ? nodes[i].children[0].data : null)
		}

		return data
	}
}