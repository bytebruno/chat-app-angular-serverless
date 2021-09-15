import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { middyfy } from '@libs/lambda';

const docClient = new AWS.DynamoDB.DocumentClient({endpoint: 'http://localhost:8000'});

const connectionsTable = process.env.CONNECTIONS_TABLE;

const connect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('Websocket connect: ', event);

  const connectionId = event.requestContext.connectionId;
  const timestamp = new Date().toISOString;

  const item = {
    id: connectionId,
    timestamp,
  };

  await docClient
    .put({
      TableName: connectionsTable,
      Item: item,
    })
    .promise();

    debugger

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
};

export const main = middyfy(connect);
