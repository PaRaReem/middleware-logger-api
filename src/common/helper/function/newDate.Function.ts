export const getNewDate = (): string => new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
export default getNewDate;
