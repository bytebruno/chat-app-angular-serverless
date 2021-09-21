import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/generateAvatarUploadUrl.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'user/avatar',
        authorizer: 'auth',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:GetObject'],
      Resource:
        'arn:aws:s3:::${self:provider.environment.AVATAR_IMAGE_S3_BUCKET}/*',
    },
    {
      Effect: 'Allow',
      Action: ['dynamodb:Update'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USER_INFO_TABLE}',
    },
  ],
};
