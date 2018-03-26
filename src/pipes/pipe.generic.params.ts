import {PipeTransform, Pipe, ArgumentMetadata} from '@nestjs/common'
import {GenericParams} from '../interfaces'
import {BookParam} from '../books/interfaces'

@Pipe()
export class GenericParamsPipe<T extends GenericParams> implements PipeTransform<any> {
	transform(params :T, metadata :ArgumentMetadata) :T {
		const page = parseInt(params.page, 10) || 1
		params.page = page
		return params
	}
}