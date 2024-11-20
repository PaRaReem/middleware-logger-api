import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import datetimeTransformer from '../common/helper/datetimeTransformer';

@Entity({
	name: 'api_logs',
})
export class ApiLogEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	public id: number;

	@Column({ name: 'source', nullable: true })
	public source: string;

	@Column({ name: 'method', nullable: true })
	public method: string;

	@Column({ name: 'status', nullable: true })
	public status: number;

	@Column({ name: 'customer_uuid', nullable: true })
	public customerUuid: string;

	@Column({ name: 'header', nullable: true })
	public header: string;

	@Column({ name: 'service_name', nullable: true })
	public serviceName: string;

	@Column({ name: 'request_id', nullable: true })
	public requestID: string;

	@Column({ name: 'endpoint', nullable: true })
	public endpoint: string;

	@Column({ name: 'request_data', nullable: false })
	public requestData: string;

	@Column({ name: 'response_data', nullable: false })
	public responseData: string;

	@CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamp with time zone', transformer: datetimeTransformer })
	public createdAt: string;

	@UpdateDateColumn({ name: 'updated_at', nullable: true, type: 'timestamp with time zone', transformer: datetimeTransformer })
	public updatedAt: string;
}

export default ApiLogEntity;
