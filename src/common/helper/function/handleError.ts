/* eslint-disable import/no-named-as-default */
// ใช้สำหรับ custom error ใน trycatch
export const handleError = (err: any, customErrors: any[]) => {
    if (!customErrors.some(errorType => err instanceof errorType)) {
        if (err instanceof Error) {
          throw new Error(err.message);
        } else {
          throw new Error('An unknown error occurred');
        }
      }
      throw err;
}; 
export default handleError;
