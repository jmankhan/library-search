import {Module, NestModule} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {BookModule} from './books/module.book'
import {LibraryModule} from './libraries/module.library'
import {GoodreadsModule} from './goodreads/module.goodreads'
import {AuthModule} from './auth/module.auth'

@Module({
	imports: [BookModule, 
				LibraryModule, 
				GoodreadsModule, 
				AuthModule, 
				MongooseModule.forRoot(process.env.DB_URL)]
})
export class ApplicationModule { }