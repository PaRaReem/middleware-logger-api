import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import datetimeTransformer from '../common/helper/datetimeTransformer';

@Entity({
	name: 'backup_query_logs',
})
export class BackupQueryLogEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	public id: number;

	@Column({ name: 'request_id', nullable: true })
	public requestID: string;

	@Column({ name: 'customer_uuid', nullable: true })
	public customerUuid: string;

	@Column({ name: 'type', nullable: false })
	public type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | '';

	@Column({ name: 'table_name', nullable: true })
	public tableName: string;

	@Column({ name: 'script', nullable: true })
	public script: string;

	@Column({ name: 'rollback_data', nullable: true })
	public rollbackData: string;

	@Column({ name: 'rollback_script', nullable: true })
	public rollbackScript: string;

	@CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamp with time zone', transformer: datetimeTransformer })
	public createdAt: string;

	@UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone', transformer: datetimeTransformer })
	public updatedAt: string;
}

export default BackupQueryLogEntity;
