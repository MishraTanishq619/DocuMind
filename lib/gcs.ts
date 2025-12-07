import { Storage } from '@google-cloud/storage';

// Initialize storage with credentials from environment variables
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucketName = process.env.GCP_BUCKET_NAME || 'documind-uploads'; // Fallback or env var
if (!bucketName) {
  throw new Error('GCP_BUCKET_NAME environment variable is not set.');
}
const bucket = storage.bucket(bucketName);

export { storage, bucket, bucketName };
