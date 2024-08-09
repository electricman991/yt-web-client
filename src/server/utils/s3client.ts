import { S3 } from "@aws-sdk/client-s3";
import { env } from "@/env";

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: env.SPACES_URL,
  region: "us-east-1",
  credentials: {
    accessKeyId: env.SPACES_KEY,
    secretAccessKey: env.SPACES_SECRET,
  },
});

export { s3Client };