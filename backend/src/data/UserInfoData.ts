import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IUserInfo } from 'src/models/iUserInfo';
import { createLogger } from '../utils/logger';

//const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('userInfo');

export class UserInfoData {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly userInfoTable = process.env.USER_INFO_TABLE,
    private readonly bucketName = process.env.AVATAR_IMAGE_S3_BUCKET,
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
          //':avatarUrl': `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
          ':avatarUrl': `http://localhost:4569/${this.bucketName}/${imageId}`, // remove comments to test locally
        },
        ExpressionAttributeNames: {
          '#avatarUrl': 'avatarUrl',
        },
      })
      .promise();
  }
}

function createDynamoDBClient() {
  // if (process.env.IS_OFFLINE) {
  //   console.log('Creating a local DynamoDB instance');
  //   return new XAWS.DynamoDB.DocumentClient({
  //     region: 'localhost',
  //     endpoint: 'http://localhost:15002',
  //   });
  // }

  return new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:15002',
  });
}
