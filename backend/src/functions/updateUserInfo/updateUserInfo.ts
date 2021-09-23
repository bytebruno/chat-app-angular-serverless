import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { middyfy } from '@libs/lambda';
import { updateUserInfo as updateUser } from 'src/business/UserInfoBusiness';

const updateUserInfo: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent | any,
): Promise<APIGatewayProxyResult> => {
  if (event.body.userId === '') {
    return {
      statusCode: 400,
      body: 'userInfo is empty',
    };
  }

  const users = await updateUser(event.body);
  console.log(users.Items[0]);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(users.Items[0]),
  };
};

export const main = middyfy(updateUserInfo);
