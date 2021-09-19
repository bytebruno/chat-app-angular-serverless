import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/updateUserInfo.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user',
        authorizer: 'auth',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Update'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USER_INFO_TABLE}',
    },
  ],
}
