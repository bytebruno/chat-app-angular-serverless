import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';

//const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('connections');

export class ConnectionsData {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly connectionsTable = process.env.CONNECTIONS_TABLE,
  ) {}

  async getAllConnections(): Promise<any> {
    return this.docClient
      .scan({
        TableName: this.connectionsTable,
      })
      .promise();
  }

  async createConnectionId(item: {
    id: string;
    timestamp: string;
  }): Promise<any> {
    this.docClient
      .put({
        TableName: this.connectionsTable,
        Item: item,
      })
      .promise();

    return item;
  }

  async deleteConnectionId(id: string): Promise<void> {
    logger.info('user disconnected', {
      connectionId: id,
    });

    this.docClient.delete(
      {
        TableName: this.connectionsTable,
        Key: { id },
      },
      (err, data) => {
        if (err) {
          logger.error('user disconnection', {
            error: err,
          });
          throw new Error('Error ' + err);
        } else {
          logger.info('user disconnection', {
            data: data,
          });
        }
      },
    );
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
