import { ListBucketsCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { appConfig } from '@configs/app.config';
import { Global, Logger, Module } from '@nestjs/common';

import { AwsS3Service } from './aws-s3.service';

@Global()
@Module({})
export class AwsS3Module {
  static async forRoot(configuration: S3ClientConfig) {
    const s3Client = new S3Client(configuration);

    // Test Connection
    if (appConfig.isProductionEnv) {
      await s3Client.send(new ListBucketsCommand({}));
      new Logger(AwsS3Module.name).log('S3 Connected');
    }

    return {
      module: AwsS3Module,
      providers: [
        {
          provide: AwsS3Service,
          useValue: new AwsS3Service(s3Client),
        },
      ],
      exports: [AwsS3Service],
    };
  }
}
