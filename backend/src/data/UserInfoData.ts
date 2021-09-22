import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IUserInfo } from 'src/models/iUserInfo';
import { createLogger } from '../utils/logger';

const logger = createLogger('userInfo');
export class UserInfoData {
  constructor(
    private readonly userInfoTable = process.env.USER_INFO_TABLE,
    private readonly bucketName = process.env.AVATAR_IMAGE_S3_BUCKET,
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly avatarUrl: string = createAvatarUrl(bucketName),
  ) {}

  async getOneUserInfo(userId: string): Promise<any> {
    return this.docClient
      .query({
        TableName: this.userInfoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise();
  }

  async createUserInfo(userId: string): Promise<any> {
    const user = { userId };
    this.docClient
      .put({
        TableName: this.userInfoTable,
        Item: user,
      })
      .promise();

    return user;
  }

  async updateUserInfo(userInfo: IUserInfo): Promise<any> {
    await this.docClient
      .update({
        TableName: this.userInfoTable,
        Key: {
          userId: userInfo.userId,
        },
        UpdateExpression: 'set #name = :n',
        ExpressionAttributeValues: {
          ':n': userInfo.name,
        },
        ExpressionAttributeNames: {
          '#name': 'name',
        },
      })
      .promise();

    return this.getOneUserInfo(userInfo.userId);
  }

  async updateUserInfoAvatarUrl(userId: string, imageId: string): Promise<any> {
    this.docClient
      .update({
        TableName: this.userInfoTable,
        Key: {
          userId: userId,
        },
        UpdateExpression: 'set #avatarUrl = :avatarUrl',
        ExpressionAttributeValues: {
          ':avatarUrl': `${this.avatarUrl}/${imageId}`,
        },
        ExpressionAttributeNames: {
          '#avatarUrl': 'avatarUrl',
        },
      })
      .promise();
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    console.log('Creating userInfo local DynamoDB instance');
    return new AWS.DynamoDB.DocumentClient({
      endpoint: 'http://localhost:15002',
    });
  }

  const XAWS = AWSXRay.captureAWS(AWS);
  return new XAWS.DynamoDB.DocumentClient();
};

const createAvatarUrl = (bucketName: string) => {
  if (process.env.IS_OFFLINE) return `http://localhost:4569/${bucketName}`;
  return `https://${bucketName}.s3.amazonaws.com`;
};
