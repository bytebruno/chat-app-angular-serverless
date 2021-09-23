import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/sendMessage.main`,
  environment: {
    STAGE: '${self:provider.stage}',
    API_ID: { Ref: 'WebsocketsApi' },
  },
  events: [
    {
      websocket: {
        route: 'sendMessage',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Scan'],
      Resource:
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}',
    },
    {
      Effect: 'Allow',
      Action: ['execute-api:Invoke', 'execute-api:ManageConnections'],
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:aws:execute-api:${self:provider.region}:',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'WebsocketsApi' },
            '/${self:provider.stage}/*',
          ],
        ],
      },
    },
  ],
};
