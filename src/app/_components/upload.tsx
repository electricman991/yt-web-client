"use client";

import { api } from "@/trpc/react";
import styles from "./upload.module.css";

export default function Upload() {
  const utils = api.useUtils();

  const pubSubMessage = api.videoUpload.uploadSuccess.useMutation();

  const createSignedUrl = api.videoUpload.uploadVideo.useMutation({
    onError: async (error) => {
      alert(`Failed to create upload url: ${error.message}`);
    },
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) {
      throw Error("No file selected");
    }
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      const { url, filename } = await createSignedUrl.mutateAsync({
        fileExtension: file.name.split(".").pop()!,
      });

      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      if (response.ok) {
        await pubSubMessage.mutateAsync({ filename: filename });
        alert(
          `File uploaded successfully. Server responded with: ${JSON.stringify(
            response
          )}`
        );
      }
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    <>
      <input
        id="upload"
        className={styles.uploadInput}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <label htmlFor="upload" className={styles.uploadButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </label>
    </>
  );
}
