import Logger from "../../../service/logger/logger.Service";
import { container } from "tsyringe";

export const fetchAPI = async(url: string, options: any)  => {
    try {
        const logger = container.resolve(Logger);
        const startRequestAt = Date.now();
        const response = await fetch(url, options);
        const responseData = response.clone()
        const saveRes = await responseData.text(); 
        await logger.log(
            options.method,
            response.status,
            '',
            url,
            { ...options.headers, startRequestAt },
            options.body,
            saveRes,
        );
        return response;
    } catch (err:any) {
        return err.response;
    }
}
export default fetchAPI