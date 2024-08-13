"use client";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

export default function Watch() {
  const videoPrefix =
    "https://yt-processed-videos.sfo3.cdn.digitaloceanspaces.com/";
  const videoSrc = useSearchParams().get("v");

  return (
    <div>
      <h1>Watch Page</h1>
      {<video controls src={videoPrefix + videoSrc} />}
    </div>
  );
}