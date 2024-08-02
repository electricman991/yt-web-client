import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client } from './s3client'

export async function generateSignedUrl(fileExtension: string, id: string) {
    const rawVideoBucketName = "yt-raw-videos";
    const filename = `${id}-${Date.now()}.${fileExtension}`
    try {
      const command = new GetObjectCommand({
        Bucket: rawVideoBucketName,
        Key: filename,
      });
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 15 * 60,
      });
      return { signedUrl, filename };
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
}