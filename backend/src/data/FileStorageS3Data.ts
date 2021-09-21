import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

//const XAWS = AWSXRay.captureAWS(AWS);

export class FileStorageS3Data {
  constructor(
    private readonly bucketName = process.env.AVATAR_IMAGE_S3_BUCKET,
    private readonly urlExpiration = process.env.S3_URL_EXPIRATION,
    private readonly s3 = new AWS.S3({
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint('http://localhost:4569'),
    }),
  ) {}

  async getPresignedImageUrl(imageId: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration,
    });
  }
}
