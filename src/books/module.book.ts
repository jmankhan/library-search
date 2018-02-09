import {Module} from '@nestjs/common'
import {BookController} from './controller.book'
import {BookService} from './service.book'

@Module({
	controllers: [BookController],
	components: [BookService]
})
export class BookModule {}