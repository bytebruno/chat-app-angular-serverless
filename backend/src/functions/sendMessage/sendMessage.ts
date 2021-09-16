import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const docClient = new AWS.DynamoDB.DocumentClient({endpoint: 'http://localhost:15002'});

const connectionsTable = process.env.CONNECTIONS_TABLE;
const stage = process.env.STAGE;
const apiId = process.env.API_ID;

const connectionParams = {
  apiVersion: '2018-11-29',
  //endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`,
  endpoint: `http://localhost:3001`,
};

const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams);

const sendMessage: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {

    const connections = await docClient
      .scan({
        TableName: connectionsTable,
      })
      .promise();

    const body = JSON.parse(event.body)

    const payload = {
      message: body.message
    };

    for (const connection of connections.Items) {
      const connectionId = connection.id;
      await sendMessageToClient(connectionId, payload);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: '',
    };
  }


const sendMessageToClient = async (connectionId, payload) => {
  try {
    console.log('Sending message to a connection', connectionId);

    await apiGateway
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      })
      .promise();
  } catch (e) {
    console.log('Failed to send message', JSON.stringify(e));

    if (e.statusCode === 410) {
      console.log('Stale connection');

      await docClient
        .delete({
          TableName: connectionsTable,
          Key: {
            id: connectionId,
          },
        })
        .promise();
    }
  }
};

export const main = sendMessage;
