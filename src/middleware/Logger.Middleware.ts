/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import Logger from '../service/logger/logger.Service';
import { AsyncStorage } from './AsyncStorage.Middleware';
import generateRequestID from '../common/helper/function/generateRequest.Function';
import censorUrlParams from '../common/helper/function/censorUrlParams';
import 'source-map-support/register';

export type loggerConfig = {
	callAPILogger?:boolean;
	apiVersion?:string;
	byPass?: {
		header?:any;
		body?:any;
		response?:any;
	};
	expandLogObject?:boolean;
}

@injectable()
export class LoggerMiddleware {
	constructor(
		@inject(Logger) private logger: Logger
	) {}

	log(req: Request, res: any, next: NextFunction, serviceName:string = '', config:loggerConfig = {}): void {
		const requestID = generateRequestID()
		AsyncStorage.run(() => {
		if (req.url !== '/' && !(req.url.includes('/v1/log'))) {
			const startRequest = Date.now()
			const requestid = req?.headers?.['x-amzn-trace-id'] ?? req?.headers?.['x-amzn-requestid'] ?? req?.headers?.['x-request-id'] ?? requestID;
			const userid = req.headers?.userid?.toString() && req.headers?.userid?.toString() !== '-' ? req.headers?.userid?.toString() : null;
			AsyncStorage.setRequestID(requestid);
			AsyncStorage.setUserID(userid);
			AsyncStorage.setAPIVersion(config.apiVersion ?? '');
			AsyncStorage.setServiceName(serviceName);
			AsyncStorage.setAxiosLogger(config.callAPILogger ?? true);
			AsyncStorage.setExpandObject(config.expandLogObject ?? false);
			req.headers['x-request-id'] = requestid;
			res.setHeader('x-request-id', requestid);
			res.setHeader('x-user-id', userid);
			const originalSend = res.send;
			const DBLog = this.logger;
			const reqBody = req.method === 'GET' ? req.query : req?.body;
			const url = req.url ?? req?.originalUrl ?? '';
			const splitParams = url.split('?');
			res.send = async function log(this: Response, body: any) {
				originalSend.call(this, body);
				try {
					let parsedBody;
					const contentType = res.get('Content-Type')?.toLowerCase();
					if (contentType?.includes('application/json')) {
						parsedBody = JSON.parse(body);
					} else {
						parsedBody = body;
					}
					await DBLog.log(
						req.method ?? '', // METHOD
						res.statusCode ?? null, // STATUS
						'', // ENDPOINT
						splitParams[0], // URL
						{...req.headers,
							startRequestAt: startRequest
						}, // HEADER
						reqBody, // REQ BODY
						parsedBody, // RESPONSE
					);
					const consoleLog = AsyncStorage.getConsoleLog()
					if (consoleLog.length > 0) {
						await DBLog.log(
							'GET', // METHOD
							200, // STATUS
							'ConsoleLog',
							'',
							'',
							'',
							JSON.stringify(consoleLog),
						);
					}
				} catch (error) {
					console.error(`Error in LoggerMiddleware : ${error}`);
				}
			} as any;
		}
		next();
	});
	}
	logRedirect(req: Request, res: any, next: NextFunction,  serviceName:string = '', config:loggerConfig = {}): void {
		const requestID = generateRequestID()
		AsyncStorage.run(() => {

		if (req.url !== '/') {
			const requestid = req?.headers?.['x-amzn-trace-id'] ?? req?.headers?.['x-amzn-requestid'] ?? req?.headers?.['x-request-id'] ?? requestID;
			const userid = req.headers?.userid?.toString() && req.headers?.userid?.toString() !== '-' ? req.headers?.userid?.toString() : null;
			AsyncStorage.setRequestID(requestid);
			AsyncStorage.setUserID(userid);
			AsyncStorage.setServiceName(serviceName);
			AsyncStorage.setAxiosLogger(config.callAPILogger ?? true);
			req.headers['x-request-id'] = requestid;
			res.setHeader('x-request-id', requestid);
			res.setHeader('x-user-id', userid);
			const reqBody = req.method === 'GET' ? req.query : req?.body;
			const url = req.url ?? req?.originalUrl ?? '';
			const splitParams = url.split('?');
			let redirectUrl = '';
			res.on('finish', async () => {
				if (res.statusCode >= 300 && res.statusCode < 400) {
					redirectUrl = res.get('Location') ? censorUrlParams(res.get('Location'), [], 'match') : '';
				} 
				try {
					await this.logger.log(
						req.method ?? '', // METHOD
						res.statusCode ?? null, // STATUS
						'', // ENDPOINT
						splitParams[0], // PARAM
						req.headers, // HEADER
						reqBody, // REQ BODY
						redirectUrl, // RESPONSE
					);
				} catch (error) {
					console.error(`Error in LoggerMiddleware : ${error}`);
				}
			});
		}
		next();
	})
	}
}
export default LoggerMiddleware;
