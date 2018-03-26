export class GenericResponse<T> {
	total :number
	data :T[]

	constructor(total :number, data :T[]) {
		this.total = total
		this.data = data
	}
}