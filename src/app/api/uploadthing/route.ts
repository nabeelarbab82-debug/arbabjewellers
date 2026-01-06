import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// This is your file router for the frontend
export const ourFileRouter = {
  productImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export the Next.js route handlers
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
