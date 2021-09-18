import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { createUserInfo, getOneUserInfo } from 'src/business/UserInfoBusiness'
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../utils/auth'

import { middyfy } from '@libs/lambda'

const handleUserLogin: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent | any,
): Promise<APIGatewayProxyResult> => {
  // console.log('HandleUserLogin: ', event)

  const jwtToken = decodeJWTFromAPIGatewayEvent(event)
  const userId = parseUserId(jwtToken)

  const userExists = await getOneUserInfo(userId)

  if (userExists.Count === 1) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(userExists.Items[0]),
    }
  }

  const user = await createUserInfo(userId)
  console.log(user)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(user),
  }
}

export const main = middyfy(handleUserLogin)
