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
};
