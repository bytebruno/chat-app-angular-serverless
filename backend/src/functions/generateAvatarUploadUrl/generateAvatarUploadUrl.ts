import 'source-map-support/register';

import * as uuid from 'uuid';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { decodeJWTFromAPIGatewayEvent, parseUserId } from '../../utils/auth';

import { createLogger } from '../../utils/logger';
import { getPresignedImageUrl } from '../../business/FileStorageS3Business';
import { middyfy } from '@libs/lambda';
import { updateUserInfoAvatarUrl } from 'src/business/UserInfoBusiness';

const logger = createLogger('chat');

export const generateAvatarUploadUrl = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  const jwtToken = decodeJWTFromAPIGatewayEvent(event);
  const userId = parseUserId(jwtToken);

  const imageId = uuid.v4();

  const signedUrl: string = await getPresignedImageUrl(imageId);

  await updateUserInfoAvatarUrl(userId, imageId);

  logger.info('chat AVATAR URL CREATED', {
    userId: userId,
    imageId: imageId,
    date: new Date().toISOString,
  });

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ uploadUrl: signedUrl }),
  };
};

export const main = middyfy(generateAvatarUploadUrl);
