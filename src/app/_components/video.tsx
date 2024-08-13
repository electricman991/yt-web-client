"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import Image from "next/image";

export default function video() {
  const [videos] = api.video.getVideos.useSuspenseQuery();
  return (
    <div>
      {videos.map((video) => (
        <Link key={video.id} href={`/watch?v=${video.filename}`}>
          <Image
            src={"/thumbnail.png"}
            alt="video"
            width={120}
            height={80}
            className="m-2.5"
          />
        </Link>
      ))}
    </div>
  );
}
