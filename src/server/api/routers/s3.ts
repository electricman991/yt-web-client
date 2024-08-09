import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
// import { posts } from "@/server/db/schema";
import { s3Client } from "@/server/utils/s3client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PubSub } from "@google-cloud/pubsub";
import { env } from "@/env";

export const s3Router = createTRPCRouter({
  uploadSuccess: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const pubSubClient = new PubSub({
        projectId: env.GOOGLE_PROJECT_ID,
        keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      async function publishMessage() {
        // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
        const dataBuffer = Buffer.from(
          JSON.stringify({ name: input.filename })
        );

        try {
          const messageId = await pubSubClient
            .topic(env.PUBSUB_TOPIC)
            .publishMessage({ data: dataBuffer });
          console.log(`Message ${messageId} published.`);
        } catch (error) {
          console.error(
            `Received error while publishing: ${(error as Error).message}`
          );
          process.exitCode = 1;
        }
      }

      await publishMessage();
    }),

  uploadVideo: protectedProcedure
    .input(
      z.object({
        fileExtension: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const filename = `${ctx.session.user.id}-${Date.now()}.${
        input.fileExtension
      }`;

      const command = new PutObjectCommand({
        Bucket: env.RAW_VIDEO_BUCKET_NAME,
        Key: filename,
        ContentType: "video/*",
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 15,
      });
      return { url: presignedUrl, filename };
    }),
});
