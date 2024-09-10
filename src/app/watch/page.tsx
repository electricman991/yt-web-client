"use client";
import { useSearchParams } from "next/navigation";
import CommentForm from "../_components/comments";
import CommentsList from "../_components/commentList";

export default function Watch() {
  const videoPrefix =
    "https://yt-processed-videos.sfo3.cdn.digitaloceanspaces.com/";
  const videoSrc = useSearchParams().get("v");

  const videoId = videoSrc?.split("-").slice(1, -1).join("-")!;

  return (
    // Center video in div
    <div className="flex flex-col">
      <div>
      <h1 className="text-center mb-8 text-xl"> Video Player </h1>
      <video
        className="mx-auto"
        width={1000}
        height={450}
        controls
        src={`${videoPrefix}${videoSrc}`}
      />
      </div>

      {/* Create a comment section beneath the video*/}
      <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold mb-2">Comments</h1>
      <CommentForm videoId={videoId}/>
      <CommentsList />
    </div>
    </div>
  );
}