import 'source-map-support/register';

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
  console.log(event.body);

  if (body.message === '' || body.name === '')
    return {
      statusCode: 400,
      body: 'Message or name is empty',
    };

  const payload = {
    name: body.name,
    message: body.message,
    avatarUrl: body.avatarUrl,
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
      'Access-Control-Allow-Credentials': true,
    },
    body: '',
  };
};

export const main = sendMessage;
