import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/connect.main`,
  events: [
    {
      websocket: {
        route: '$connect',
      },
    },
  ],
};
