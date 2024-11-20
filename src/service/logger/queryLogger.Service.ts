/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Repository } from "typeorm";
import { getDataSource } from "../../middleware/dataSourceManager";
import AsyncStorage from "../../middleware/AsyncStorage.Middleware";
import BackupQueryLogEntity from "../../model/BackupQueryLogEntity";
import formatQuery from "../../common/helper/function/formatQuery";

export class QueryLog {
  private backupQueryLogRepository: Repository<BackupQueryLogEntity> | null =
    null;

  constructor() {
    const dataSource = getDataSource();
    this.backupQueryLogRepository = dataSource ? dataSource.getRepository(BackupQueryLogEntity) : null;
  }

  async manualQueryLog(
    type: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "",
    tableName: string,
    script: any,
    rollbackData: any,
    rollbackScript:any,
    customerUUID?:any
  ) {
    if (this.backupQueryLogRepository) {
      try {
        const insertLog = new BackupQueryLogEntity();
        insertLog.requestID = AsyncStorage?.getRequestID() ?? "";
        insertLog.customerUuid = customerUUID ?? AsyncStorage?.getUserID() ?? "";
        insertLog.type = type ?? "";
        insertLog.tableName = tableName ?? "";
        insertLog.script = script ?? "";
        insertLog.rollbackData = rollbackData ?? "";
        insertLog.rollbackScript = rollbackScript ?? "";

        await this.backupQueryLogRepository.save(insertLog);
      } catch (e: any) {
        console.log(`Error QueryLog > manualQueryLog : ${e.message}`);
      }
    }
  }

  async deleteWithBackup(queryBuilder: any, repository: any, customerUUID?:any) {
    if (this.backupQueryLogRepository) {
      try {
        const backup = await queryBuilder.getMany();
        if (backup.length > 0) {
          const insertLog = new BackupQueryLogEntity();
          insertLog.requestID = AsyncStorage?.getRequestID() ?? "";
          insertLog.customerUuid = customerUUID ?? AsyncStorage?.getUserID() ?? "";
          insertLog.type = "DELETE";
          insertLog.tableName = repository?.metadata?.tableName ?? "";
  
          insertLog.rollbackData = JSON.stringify(backup, null, 2) ?? "";
          const deleteData = queryBuilder.delete();
  
          insertLog.script =
            formatQuery(deleteData.getQueryAndParameters()) ?? "";
          const deleteResult = await deleteData.execute();
  
          const insertQuery = repository
            .createQueryBuilder()
            .insert()
            .into(repository.metadata.tableName)
            .values(backup);
          insertLog.rollbackScript =
            formatQuery(insertQuery.getQueryAndParameters()) ?? "";
          await this.backupQueryLogRepository.save(insertLog);
        }
      } catch (e: any) {
        console.log(`Error QueryLog > deleteWithBackup : ${e.message}`);
      }
    }
  }
}

export default QueryLog;

//** */ example

// constructor(
//     private queryLog: QueryLog,
//     @inject(DependencyProvider.API_LOG_REPOSITORY) private apiLogRepository: Repository<ApiLogEntity>,
// ) {}

// const queryBuilder = this.apiLogRepository.createQueryBuilder()
// .where("id < :id", { id: 1 })
// await this.queryLog.deleteWithBackup(queryBuilder, this.apiLogRepository)
