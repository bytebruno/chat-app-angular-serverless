import * as AWS from 'aws-sdk';

import { createLogger } from '../utils/logger';
import { deleteConnectionId } from '../business/ConnectionsBusiness';

const logger = createLogger('messages');
export class WebsocketData {
  constructor(
    private readonly apiGateway = createApiGatewayManagementApi(
      process.env.STAGE,
      process.env.API_ID,
    ),
  ) {}

  async sendMessage(connectionId, payload): Promise<any> {
    try {
      await this.apiGateway
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(payload),
        })
        .promise();

      logger.info('message sent ', {
        connectionId: connectionId,
        message: payload.message,
      });
    } catch (err) {
      logger.info('message sent failure ', {
        error: err,
      });

      if (err.statusCode === 410) {
        await deleteConnectionId(connectionId);
      }
    }
  }
}

const createApiGatewayManagementApi = (stage: string, apiId: string) => {
  const connectionParams = {
    apiVersion: '2018-11-29',
    endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`,
  };

  // if (process.env.IS_OFFLINE) {
  console.log('Creating a local createApiGatewayManagementApi instance');
  connectionParams.endpoint = `http://localhost:3001`;
  return new AWS.ApiGatewayManagementApi(connectionParams);
  // }

  return new AWS.ApiGatewayManagementApi(connectionParams);
};
