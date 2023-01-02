import { UserEntity } from '@entities';
import { AwsS3Service } from '@modules/aws-s3';
import { FileUpload } from 'graphql-upload';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(dataSource: DataSource, private awsS3Service: AwsS3Service) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    const { entity } = event;
    const { url } = await this.awsS3Service.uploadGqlFile(entity.photo as FileUpload);
    entity.photo = url;
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    const { entity } = event;

    if (entity.photo) {
      const { url } = await this.awsS3Service.uploadGqlFile(entity.photo as FileUpload);
      entity.photo = url;
    }
  }
}
