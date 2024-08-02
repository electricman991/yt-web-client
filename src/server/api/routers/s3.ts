import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
// import { posts } from "@/server/db/schema";
import { S3, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateSignedUrl } from "../../utils/generateSignedUrl";

export const s3Router = createTRPCRouter({
  // genertateSignedUrl: protectedProcedure
  //   .input(z.object({
  //       fileExtension: z.string()
  //     }))
  //   .query(async ({ ctx, input }) => {
  //       const { fileExtension } = input;
  //       const userId = ctx.session.user.id
  //       const values = await generateSignedUrl(fileExtension, userId)
  //       return { signedUrl: values.signedUrl, filename: values.filename}
  //     }),

    uploadVideo: protectedProcedure
      .input(z.object({
          file: z.unknown()
        }))
      .mutation(async ({ ctx, input }) => {
          const { file } = input;
          const typedfile = file as File
          const res = await generateSignedUrl(typedfile.name.split('.').pop()!, ctx.session.user.id)

          const uploadResult = await fetch(res.signedUrl, {
            method: 'PUT',
            body: typedfile,
            headers: {
              'Content-Type': typedfile.type
            }
          }
          )

          if (!uploadResult.ok) {
            throw new Error("Failed to upload file");
          }

          return uploadResult

      })


});
