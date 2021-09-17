import { WebsocketData } from 'src/data/WebsocketData';

const websocketData = new WebsocketData();

export const sendMessageToClient = async (
  connectionId: string,
  payload: any,
): Promise<any> => {
  return websocketData.sendMessage(connectionId, payload);
};
