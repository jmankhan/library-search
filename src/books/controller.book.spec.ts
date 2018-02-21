import {Test} from '@nestjs/testing'
import {BookController} from './controller.book'
import {BookService} from './service.book'
import {BookParam} from './interfaces'

describe('BookController', () => {
	let controller :BookController
	let service :BookService

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [BookController],
			components: [BookService]
		}).compile()

		controller = module.get<BookController>(BookController)		
		service = module.get<BookService>(BookService)
	})

	describe('findByKeyword', () => {
		it('should return an array of books', async () => {
			const result = ['test']
			const params :BookParam = {
				keyword: 'test'
			}

			jest.spyOn(service, 'findByKeyword').mockImplementation(params => result)

			expect(await controller.findByKeyword(params)).toBe(result)
		})
	})
})