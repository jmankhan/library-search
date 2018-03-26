import {GenericParams} from '../../interfaces'

export class LibraryParam extends GenericParams {
	constructor(readonly name :string, page? :number) {
		super(page)
	}
}