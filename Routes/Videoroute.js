const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const videoModel = require("../Model/videoData");

const jwt=require('jsonwebtoken')
function verifytoken(req,res,next){
    let token=req.headers.token;
    try{
    if(!token) throw 'Unauthorized access';
    else{
        let payload=jwt.verify(token,'secretkey');
        if(!payload) throw 'Unauthorized access';
        next()
    }
}  catch(error) {
    console.log(error);

}
}


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Upload video to cloudinary
router.post(
    "/upload",
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),verifytoken,
    async (req, res) => {
      try {
        console.log("Incoming request body:", req.body);
        console.log("Files uploaded:", req.files);
  
        const { title, description, genre, price, uploaderId, director, releaseYear } = req.body; // Extract uploaderId from request
  
        const videoFile = req.files["video"] ? req.files["video"][0] : null;
        const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;
  
        if (!videoFile || !thumbnailFile) {
          return res.status(400).json({ error: "Video and thumbnail files are required." });
        }
  
        // Upload video to Cloudinary
        const videoUploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "video", folder: `videos/${uploaderId}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(videoFile.buffer);
        });
  
        // Upload thumbnail to Cloudinary
        const thumbnailUploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: `thumbnails/${uploaderId}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(thumbnailFile.buffer);
        });
  
        // Save video details to database
        const video = new videoModel({
          title,
          description,
          genre,
          price,
          videoUrl: videoUploadResponse.secure_url,
          thumbnailUrl: thumbnailUploadResponse.secure_url, 
          uploader: uploaderId,
          director: director,
          year: releaseYear
          
        });
  
        await video.save();
  
        res.status(201).json({
          message: "Video and thumbnail uploaded and saved successfully.",
          videoUrl: videoUploadResponse.secure_url,
          thumbnailUrl: thumbnailUploadResponse.secure_url,
        });
      } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Failed to upload and save video and thumbnail" });
      }
    }
);

//retreving videos
router.get("/videos",verifytoken ,async (req, res) => {
    try {
        const videos = await videoModel.find().sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

//retreving a video by id
router.get('/videos/:id', verifytoken,async (req, res) => {
    try {
        const { id } = req.params; // Extract video ID from the request parameters
        const video = await videoModel.findById(id); // Fetch the video using Mongoose

        if (!video) {
            return res.status(404).json({ error: "Video not found" }); // Return 404 if the video doesn't exist
        }

        res.status(200).json(video); // Return the video data
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ error: "Failed to fetch video" }); // Handle errors gracefully
    }
});




module.exports = router;
