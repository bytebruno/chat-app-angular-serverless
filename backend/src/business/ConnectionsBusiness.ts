import { ConnectionsData } from '../data/ConnectionsData';

const connectionsData = new ConnectionsData();

export const getAllConnections = async () => {
  return connectionsData.getAllConnections();
};

export const createConnectionId = async (item: {
  id: string;
  timestamp: string | any;
}): Promise<any> => {
  return connectionsData.createConnectionId(item);
};

export const deleteConnectionId = async (id: string): Promise<void> => {
  connectionsData.deleteConnectionId(id);
};
