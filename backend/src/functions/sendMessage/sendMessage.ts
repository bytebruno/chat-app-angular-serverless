import 'source-map-support/register';

import * as AWS from 'aws-sdk';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { getAllConnections } from '../../business/ConnectionsBusiness';
import { sendMessageToClient } from '../../business/MessagesBusiness';

const sendMessage: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body);

  if (body.message === '')
    return {
      statusCode: 400,
      body: 'Message is empty',
    };

  const payload = {
    message: body.message,
  };

  const connections = await getAllConnections();

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
};

export const main = sendMessage;
