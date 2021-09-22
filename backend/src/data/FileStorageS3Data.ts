import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

export class FileStorageS3Data {
  constructor(
    private readonly bucketName = process.env.AVATAR_IMAGE_S3_BUCKET,
    private readonly urlExpiration = process.env.S3_URL_EXPIRATION,
    private readonly s3 = createS3Client(),
  ) {}

  async getPresignedImageUrl(imageId: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration,
    });
  }
}

const createS3Client = () => {
  if (process.env.IS_OFFLINE) {
    console.log('Creating userInfo local DynamoDB instance');
    return new AWS.S3({
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint('http://localhost:4569'),
    });
  }

  const XAWS = AWSXRay.captureAWS(AWS);
  return new XAWS.S3({
    signatureVersion: 'v4',
  });
};
