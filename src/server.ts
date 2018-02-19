import {NestFactory} from '@nestjs/core'
import {ApplicationModule} from './app.module'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as dotenv from 'dotenv'

async function bootstrap() {
	if(process.env.NODE_ENV !== 'production') {
		dotenv.config()
		console.log(process.env.DBURL)
	}

	const app = await NestFactory.create(ApplicationModule)
	app.use(bodyParser.json())
	app.use(cors())
	await app.listen(8080)
}
bootstrap();