import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/disconnect.main`,
  events: [
    {
      websocket: {
        route: '$disconnect',
      },
    },
  ],
};
