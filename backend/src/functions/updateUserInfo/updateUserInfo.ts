import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda'

import { middyfy } from '@libs/lambda'
import { updateUserInfo as updateUser } from 'src/business/UserInfoBusiness'

const updateUserInfo: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent | any,
): Promise<APIGatewayProxyResult> => {
  if (event.body.userId === '') {
    return {
      statusCode: 400,
      body: 'userInfo is empty',
    }
  }

  const user = await updateUser(event.body)
  console.log(user)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(user),
  }
}

export const main = middyfy(updateUserInfo)
