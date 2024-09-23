# Video Upload Service

This is an application that allows video file uploading and viewing of videos. This is a project to help showcase a fullstack application using NextJS with 
Golang handling the backend of processing the videos. See this [repo](https://github.com/electricman991/video-processing-service) for a full look at the video processing service.

## Using Google Pub/Sub for sending notifications of a video upload

When a user uploads a video a notification is sent to the backend processing service. Once the video has been processed it will then be viewable by the user. 

# Frontend Client

The web client allows for users to view and upload video files. The home page pulls 10 videos from the database so a better version could use pagination or 
allow for a better algorithim when selecting what videos to show.

# Backend Function Calls

The first function calls when a file is uploaded to the Object Storage location. It then sends a pub/sub message so that the video can be processed by the video-processing-service. The code can be found in src/server/api/routers/video.ts

The second call named **uploadVideo** creates a presigned url for uplaoding to object storage. 

The third function queries the database and will get 10 videos from the database.

# Watch Page

Once a video is click it will go to a watch page where the video will be downloaded and playable by the user. 