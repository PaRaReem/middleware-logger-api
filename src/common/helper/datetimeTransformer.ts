/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { ValueTransformer } from 'typeorm';

export const datetimeTransformer: ValueTransformer = {
	from: (value: any) => (value instanceof Date ? value : new Date(value)),
	to: (value: any) => (value instanceof Date ? value.toISOString() : value),
};

export default datetimeTransformer;
