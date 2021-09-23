import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/updateUserInfo.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user',
        authorizer: 'auth',
        cors: true,
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:UpdateItem', 'dynamodb:Query'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USER_INFO_TABLE}',
    },
  ],
};
