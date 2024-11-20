/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { v4 as uuidv4 } from 'uuid';

export const generateRequestID = () => uuidv4();

export default generateRequestID;
