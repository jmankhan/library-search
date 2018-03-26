import {GenericParams} from '../../interfaces'

export class LibrarySearchParam extends GenericParams {
	constructor(readonly book_oclc :string, readonly zip :number, page? :number) {
		super(page)
	}
}