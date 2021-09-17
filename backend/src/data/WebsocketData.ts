import * as AWS from 'aws-sdk';

import { deleteConnectionId } from '../business/ConnectionsBusiness';

export class WebsocketData {
  constructor(
    private readonly apiGateway = createApiGatewayManagementApi(
      process.env.STAGE,
      process.env.API_ID,
    ),
  ) {}

  async sendMessage(connectionId, payload): Promise<any> {
    try {
      console.log('Sending message to a connection', connectionId);

      await this.apiGateway
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(payload),
        })
        .promise();
    } catch (e) {
      console.log('Failed to send message', JSON.stringify(e));

      if (e.statusCode === 410) {
        console.log('Stale connection');

        // Todo: RESOLVER DEPENDENCIA DA BUSINESS DEPOIS
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
