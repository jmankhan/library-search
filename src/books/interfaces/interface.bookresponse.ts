import {Book} from './interface.book'

export interface BookResponse {
	total: number,
	data: Book[]
}