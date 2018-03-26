import {GenericParams} from '../../interfaces'

export class BookParam extends GenericParams {
	constructor(readonly keyword :string, page? :number) {
		super(page)
	}
}