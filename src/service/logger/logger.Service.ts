/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Repository, DataSource } from "typeorm";
import sensitiveValue from "../../common/helper/function/sensitiveValue";
import ApiLogEntity from "../../model/ApiLogEntity";
import censorValue from "../../common/helper/function/censorValue.Function";
import { getDataSource } from "../../middleware/dataSourceManager";
import AsyncStorage from "../../middleware/AsyncStorage.Middleware";

export class Logger {
  private apiLogRepository: Repository<ApiLogEntity> | null = null;

  constructor() {
    const dataSource = getDataSource();
    this.apiLogRepository = dataSource
      ? dataSource.getRepository(ApiLogEntity)
      : null;
  }

  async log(
    method:
      | string
      | "POST"
      | "PUT"
      | "DELETE"
      | "GET"
      | "PATCH "
      | "HEAD"
      | "OPTIONS" = "",
    status: number = 0,
    endpoint: string = "",
    url: string = "",
    header: any = {},
    body: any = {},
    response: any = {}
  ) {
    const now = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Bangkok",
    });
    const endRequest = Date.now();
    if (header.startRequestAt) {
      const requestTime = endRequest - header.startRequestAt;
      header["x-request-time"] = requestTime / 1000;
    }

    const byPassKey = AsyncStorage.getByPassConfig();
    const expandLogObject = AsyncStorage.getExpandObject();
    const byPassHeader = byPassKey?.header?.some((substring: string) =>
      url.includes(substring)
    );
    const byPassBody = byPassKey?.body?.some((substring: string) =>
      url.includes(substring)
    );
    const byPassResponse = byPassKey?.response?.some((substring: string) =>
      url.includes(substring)
    );

    const logInfo = {
      Method: method ?? "",
      Status: status,
      customerUuid: AsyncStorage.getUserID(),
      Endpoint: endpoint,
      Url: url,
      Headers: byPassHeader
        ? "Header too large!"
        : censorValue(
            { ...header, ["x-api-version"]: AsyncStorage.getAPIVersion() },
            sensitiveValue,
            "include"
          ), // Censor sensitive data
      Body: byPassBody
        ? "Body too large!"
        : censorValue(body, sensitiveValue, "include"), // Censor sensitive data
      ResponseBody: byPassResponse
        ? "Response too large!"
        : censorValue(response, sensitiveValue, "include"), // Censor sensitive data
      serviceName: AsyncStorage.getServiceName(),
      requestID: AsyncStorage.getRequestID(),
      timestamp: now,
    };

    try {
      delete logInfo.Headers["x-request-id"];
      delete logInfo.Headers.startRequestAt;
      if (endpoint !== "ConsoleLog") {
        console.log(`
##############################################################################################################################################################
`);
        if (expandLogObject) {
          console.dir(logInfo, { depth: null });
        } else {
          console.log(logInfo);
        }
        console.log(`
##############################################################################################################################################################
`);
      }
      if (this.apiLogRepository) {
        const insertLog = new ApiLogEntity();
        insertLog.method = logInfo.Method;
        insertLog.status = logInfo.Status;
        insertLog.customerUuid = logInfo.customerUuid;
        insertLog.endpoint = logInfo.Endpoint;
        insertLog.source = logInfo.Url;
        insertLog.header = logInfo.Headers;
        insertLog.requestData = JSON.stringify(logInfo.Body);
        insertLog.responseData = JSON.stringify(logInfo.ResponseBody);
        insertLog.requestID = logInfo.requestID;
        insertLog.serviceName = logInfo.serviceName;
        await this.apiLogRepository.save(insertLog);
      }
    } catch (e: any) {
      console.log(
        `Error to insert API log : ${JSON.stringify(logInfo)} with error ${e}`
      );
    }
  }
}

export default Logger;
