/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { container } from 'tsyringe';
import * as https from 'https';
import Logger from '../../../service/logger/logger.Service';
import AsyncStorage from '../../../middleware/AsyncStorage.Middleware';

export async function callAPI(method: any, endpoint: any, URLpath: string, headers: any, requestBody: any) {
	const url = `${endpoint}${URLpath}`;
	const logger = container.resolve(Logger);
	const enableLog = AsyncStorage.getAxiosLogger()
	const httpsAgent = new https.Agent({
		rejectUnauthorized: true,
	});
	const startRequestAt = Date.now()
	headers.startRequestAt = startRequestAt
	try {
		const response = await axios({
			httpsAgent,
			method,
			url,
			headers,
			data: requestBody,
			// params: requestBody,
		});

		if (enableLog) {
			await logger.log(
				method ?? '',
				response?.status ?? 500,
				endpoint ?? '',
				URLpath ?? '',
				headers ?? {},
				requestBody ?? {},
				response.data ?? {},
			);
		}


		return response;
	} catch (error: any) {
		if (enableLog) {
		await logger.log(
			method ?? '',
			error.response?.status ?? 500,
			endpoint ?? '',
			URLpath ?? '',
			headers ?? {},
			requestBody ?? {},
			error.response?.data ?? { error: JSON.stringify(error) } ?? {},
		);
	}
		if (!error.response) {
			return {
				status: 500,
				data: JSON.stringify(error),
			};
		}
		return error.response;
	}
}

export default callAPI