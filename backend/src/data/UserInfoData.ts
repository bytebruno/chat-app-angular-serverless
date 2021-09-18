import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

//const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('userInfo')

export class UserInfoData {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly userInfoTable = process.env.USER_INFO_TABLE,
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
      .promise()
  }

  async createUserInfo(userId: string): Promise<any> {
    const user = { userId }
    this.docClient
      .put({
        TableName: this.userInfoTable,
        Item: user,
      })
      .promise()

    return user
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
  })
}
