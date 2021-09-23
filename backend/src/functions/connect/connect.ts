import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { createConnectionId } from 'src/business/ConnectionsBusiness';
import { middyfy } from '@libs/lambda';

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

  await createConnectionId(item);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: '',
  };
};

export const main = middyfy(connect);
