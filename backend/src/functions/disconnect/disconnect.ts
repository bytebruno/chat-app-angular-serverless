import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { middyfy } from '@libs/lambda';

const docClient = new AWS.DynamoDB.DocumentClient({endpoint:'http://localhost:8000'});

const connectionsTable = process.env.CONNECTIONS_TABLE;

const disconnect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('Websocket disconnect: ', event);

  const connectionId = event.requestContext.connectionId;
  const key = {
    id: connectionId,
  };

  await docClient
    .delete({
      TableName: connectionsTable,
      Key: key,
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: '',
  };
};

export const main = middyfy(disconnect);
