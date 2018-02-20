import {NestFactory} from '@nestjs/core'
import {ApplicationModule} from './app/app.module'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule)
	app.use(bodyParser.json())
	app.use(cors())
	await app.listen(8080)
}
bootstrap();