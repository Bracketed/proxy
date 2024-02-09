import express, { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';

const server = express();

const CorsOptions: cors.CorsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
};

dotenv.config();

if (!process.env.EXPRESS_PORT) {
	console.error(
		'[ DiscordProxy ] Express Server: Missing ENV: EXPRESS_PORT - The proxy cannot start without it!'
	);
	process.exit();
}

server.set('trust proxy', true);
server.use(express.json());
server.use(compression());
server.use(cors(CorsOptions));

server.use((Request: Request, _Response: Response, next: NextFunction) => {
	console.log(
		`[ DiscordProxy ] Express Server: New ${Request.method} request from: ${Request.ip} at ${Request.url}`
	);
	next();
});

server.all('*/:id/:token', async (request: Request, response: Response) => {
	if (request.params) {
		if (request.params['id'] && request.params['token']) {
			console.log(request.params['id'], request.params['token']);
			const WebhookPost = await axios
				.post(
					`https://discord.com/api/webhooks/${request.params['id']}/${request.params['token']}`,
					request.body,
					{
						headers: {
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
							'Accept-Language': 'en-GB',
							Referer: 'https://www.bracketed.co.uk',
							'Sec-Fetch-Site': 'same-origin',
							'Sec-Fetch-Mode': 'cors',
							'Sec-Fetch-Dest': 'empty',
							'Accept-Encoding': 'gzip, deflate, br',
							Connection: 'keep-alive',
							'Content-Type': 'application/json',
						},
					}
				)
				.then(() => true)
				.catch(() => false);

			if (WebhookPost) return response.status(201).json('WEBHOOK SENT');
			return response.status(500).json('WEBHOOK ERROR ON SEND');
		} else {
			let MISSING_PARAMS: string = '';

			if (!request.params['id']) {
				MISSING_PARAMS = 'Webhook ID';
			} else if (!request.params['token']) {
				MISSING_PARAMS = 'Webhook Token';
			} else {
				MISSING_PARAMS = 'Webhook ID and Token';
			}

			return response.status(422).json(`MISSING PARAMETERS: ${MISSING_PARAMS}`);
		}
	} else {
		return response
			.status(200)
			.send('<h1><font size="300">Bracketed Proxy - Root</font></h1><p>cheesn\'t</p>');
	}
});

console.clear();
console.log(`[ DiscordProxy ] Express Server: Now listening on port: ${process.env.EXPRESS_PORT}`);
server.listen(process.env.EXPRESS_PORT);
