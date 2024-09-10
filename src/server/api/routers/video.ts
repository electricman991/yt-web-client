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
import { comments, videos, users } from "@/server/db/schema";

export const videoRouter = createTRPCRouter({
  uploadSuccess: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const pubSubClient = new PubSub({
        projectId: env.GOOGLE_PROJECT_ID,
        credentials: {client_email: env.GOOGLE_CLIENT_EMAIL, private_key: env.GOOGLE_PRIVATE_KEY}
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

  getVideos: publicProcedure 
    .query(
       async ({ ctx }) => {
        const videos = await ctx.db.query.videos.findMany({
          limit: 10
        })

        return videos ?? null
      }
    ),

  setComment: protectedProcedure
  .input(
    z.object({
      videoId: z.string(),
      commentText: z.string()
    })
  )
  .mutation(async ({ ctx, input }) => {
     const video = await ctx.db.select().from(videos)

     const videoid = video[0]?.id!

     const user = await ctx.db.select().from(users)

     const userId = user[0]?.id!
     const username = user[0]?.name!
     await ctx.db.insert(comments).values({username: username, videoId: videoid, userId: userId, content: input.commentText})
  }),

  getComments: publicProcedure
    .query(async ({ ctx }) => {
      const comments_query = await ctx.db.query.comments.findMany()
      return comments_query ?? null
      })
});
