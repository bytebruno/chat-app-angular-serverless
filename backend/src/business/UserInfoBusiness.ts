import { UserInfoData } from 'src/data/UserInfoData';

const userInfoData = new UserInfoData();

export const getOneUserInfo = async (userId: string): Promise<any> => {
  return userInfoData.getOneUserInfo(userId);
};

export const createUserInfo = async (userId: string): Promise<any> => {
  return userInfoData.createUserInfo(userId);
};

export const updateUserInfo = async (userInfo: any): Promise<any> => {
  return userInfoData.updateUserInfo(userInfo);
};

export const updateUserInfoAvatarUrl = async (
  userId: string,
  imageId: string,
): Promise<any> => {
  return userInfoData.updateUserInfoAvatarUrl(userId, imageId);
};
