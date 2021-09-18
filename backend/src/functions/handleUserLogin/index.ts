import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/handleUserLogin.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'user',
        authorizer: 'auth',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Put', 'dynamodb:Query'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USER_INFO_TABLE}',
    },
  ],
}
