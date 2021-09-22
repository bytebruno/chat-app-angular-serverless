export interface IMessage {
  name: string | undefined;
  message: string;
  avatarUrl: string;
  isMine?: boolean | undefined;
}
