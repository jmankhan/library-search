import { Logger, Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import chalk from 'chalk'

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('Request')

	public resolve() {
		return (req, res, next) => {
			this.logger.log(
	        	`[${chalk.white(req.method)}] ${chalk.cyan(res.statusCode.toString())} ` +
	        	`${chalk.white('|')} ${chalk.cyan(req.httpVersion)} ${chalk.white('|')} ${chalk.cyan(req.ip)} ` +
	        	`[${chalk.white('route:', req.path)}]`
	        );
	        next()
		}
	}
}