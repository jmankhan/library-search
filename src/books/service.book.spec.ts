import {BadRequestException} from '@nestjs/common'
import {Test} from '@nestjs/testing'
import {BookService} from './service.book'
import {BookParam} from './interfaces'

describe('BookService', () => {
	let service :BookService

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			components: [BookService]
		}).compile()

		service = module.get<BookService>(BookService)
	})

	it('should return an array of Book', async () => {
		const result = ['test']
		const params :BookParam = {
			keyword: 'test'
		}
		jest.spyOn(service, 'findByKeyword').mockImplementation(() => result)

		expect(await service.findByKeyword(params)).toBe(result)
	})

	it('should throw an error on missing parameter', async () => {
		//jest cant expect async function throws, so this is a workaround
		const params :BookParam = {
			keyword: null
		}
		try {
			await service.findByKeyword(params)
		}
		catch (err) {
			expect(err).toBeInstanceOf(BadRequestException)
			return
		}
		expect(true).toBeFalsy()
	})
})