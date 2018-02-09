import {Module, NestModule} from '@nestjs/common'
import {BookModule} from './books/module.book'
import {LibraryModule} from './libraries/module.library'

@Module({
	imports: [BookModule, LibraryModule]
})
export class ApplicationModule { }