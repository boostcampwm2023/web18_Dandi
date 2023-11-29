export const objectStorageConfig = {
  endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
  region: process.env.OBJECT_STORAGE_REGION,
  credentials: {
    accessKeyId: process.env.NCP_ACCESS_KEY_ID,
    secretAccessKey: process.env.NCP_SECRET_KEY,
  },
};
