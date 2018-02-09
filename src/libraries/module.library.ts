import {Module} from '@nestjs/common'
import {LibraryController} from './controller.library'
import {LibraryService} from './service.library'

@Module({
	controllers: [LibraryController],
	components: [LibraryService]
})
export class LibraryModule {}