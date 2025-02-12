const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const viewerModel = require("../Model/usersData");
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

//retreving all viewers for admin
router.get('/viewers', verifytoken,async (req, res) => {     
    try {
        const viewers = await viewerModel.find({ role: 'user' });
        if (!viewers) {
            return res.status(404).json({ message: 'Uploaders not found' });
        }
        res.status(200).json(viewers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//retreiving videos by genre for viewer
router.get("/videos/:genre", verifytoken,async (req, res) => {
    try {
        const { genre } = req.params; 
        const videos = await videoModel.find({ genre: genre }); 
        res.status(200).json(videos); 
    } catch (error) {
        console.error("Error fetching videos by genre:", error);
        res.status(500).json({ error: "Failed to fetch videos by genre" });
    }
});

//retreving video by name while searching
router.get("/videos/name/:name", verifytoken,async (req, res) => {
    try {
        const { name } = req.params; 
        const videos = await videoModel.find({ title: { $regex: name, $options: 'i' } }); 
        if (!videos.length) {
            return res.status(404).json({ message: 'No videos found with that name' });
        }
        res.status(200).json(videos); 
    } catch (error) {
        console.error("Error fetching videos by name:", error);
        res.status(500).json({ error: "Failed to fetch videos by name" });
    }
});

module.exports = router;
