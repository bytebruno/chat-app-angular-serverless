import { FileStorageS3Data } from '../data/FileStorageS3Data';

const s3 = new FileStorageS3Data();

export async function getPresignedImageUrl(imageId: string): Promise<string> {
  return s3.getPresignedImageUrl(imageId);
}
