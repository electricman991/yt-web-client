import { api } from "@/trpc/react";
import { useState } from "react";



export default function Watch() {
    const [extension, setExtension] = useState("");
    const utils = api.useUtils();

    const createSignedUrl = api.generateUploadUrl.uploadVideo.useMutation({
        onSuccess: async () => {
            await utils.generateUploadUrl.invalidate()
        }
    })
    return (
      <div>
        <p>Watch Page</p>
      </div>
    );
  }
  