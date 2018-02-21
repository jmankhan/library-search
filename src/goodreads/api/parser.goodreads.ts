import {GoodreadsShelfResponse, Shelf} from '../interfaces'

const cheerio: CheerioAPI = require('cheerio')

export class GoodreadsParser {
	private options :CheerioOptionsInterface = {
			normalizeWhitespace: true, 
			xmlMode: true
		}

	parseShelves(data :string) :GoodreadsShelfResponse {
		const shelves :Shelf[] = []

		const $ = cheerio.load(data, this.options)
		
		const userShelves :CheerioElement = $('GoodreadsResponse').find('shelves').find('user_shelf')
		//required
		const ids :string[] 		 = userShelves.find('id')

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

	parseUser(data :string) {}
	parseBooksOnShelf(data :string) {}


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

	private selectIfExists(nodes :Cheerio[]) :string[] {
		const data :string[] = []
		for(var i=0; i<nodes.length; i++) {
			data.push(nodes[i].children.length ? nodes[i].children[0].data : null)
		}

		return data
	}
}